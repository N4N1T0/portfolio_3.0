---
title: 'Grano sobre el gradiente'
excerpt: 'Por qué un gradiente CSS hace bandas, y el ruido SVG en línea que las quita'
preview: 'gradient-grain'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: en/gradient-grain
---

Un gradiente CSS parece barato por un motivo que no tiene nada que ver con los colores: es demasiado perfecto. El cine tiene grano, la impresión tiene trama, una foto tiene ruido de sensor. Un gradiente no tiene nada, y en una transición ancha y lenta esa pureza sale a la superficie como **banding**: franjas visibles donde el color debería ser continuo.

El arreglo es una capa de ruido encima, a baja opacidad, que genera el propio navegador desde un SVG en línea.

---

## 1. Por qué están las bandas

Una pantalla te da 8 bits por canal: 256 pasos. Extiende un gradiente de `#0a1020` a `#1d4ed8` a lo largo de 1200 píxeles y el canal azul tiene que cubrir unos 160 pasos en 1200 píxeles: unos 7 píxeles de color idéntico por paso. Siete píxeles son suficientes para que el ojo pille el borde, y las bandas de Mach (cómo la visión exagera los bordes) lo empeoran.

No es un fallo del navegador y ninguna sintaxis de gradiente lo arregla. El espacio de color sencillamente no tiene un valor entre esos dos pasos.

Lo que sí lo arregla es el **dithering**: esparcir un poco de ruido para que la frontera entre dos pasos sea una mezcla de ambos en vez de una línea limpia. Las imprentas llevan un siglo haciéndolo.

---

## 2. El ruido, en una declaración

`feTurbulence` es un filtro SVG que genera ruido Perlin. Pintado sobre un rect y usado como imagen de fondo, nunca toca la red:

```css
.hero::after {
	content: '';
	position: absolute;
	inset: 0;
	pointer-events: none;
	opacity: 0.15;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

Ni archivo de imagen, ni petición, ni decodificado: el navegador ejecuta el filtro y cachea el resultado.

---

## 3. Los tres mandos de `feTurbulence`

| Atributo        | Qué hace                             | Rango útil     |
| :-------------- | :----------------------------------- | :------------- |
| `type`          | el carácter del ruido                | `fractalNoise` |
| `baseFrequency` | tamaño del grano: más alto, más fino | 0.6 – 1.2      |
| `numOctaves`    | capas de detalle                     | 2 – 4          |

`type="fractalNoise"` es el que quieres. El otro valor, `turbulence`, da el ruido humeante y nuboso que se usa para fuego y agua; se apelmaza, y los grumos se leen como suciedad sobre un gradiente. `fractalNoise` es parejo, como el grano de película.

`baseFrequency` va en unidades por píxel, así que `0.8` da un grano de poco más de un píxel. Por debajo de `0.4` el ruido se convierte en manchas visibles; por encima de `1.5` desaparece en la rejilla de píxeles y solo te cuesta tiempo de render.

`numOctaves` añade capas más finas sobre la base. Cada octava es otra pasada del filtro, así que `3` es el techo práctico: `6` se ve casi igual y tarda varias veces más.

`stitchTiles="stitch"` solo importa si la capa se repite en mosaico: hace que los bordes casen en vez de mostrar costuras.

---

## 4. Escapar el data URI

El SVG va dentro de un `url()` de CSS, así que hay dos caracteres que tienes que codificar o la declaración se rompe:

- `#` pasa a `%23`, o `url(#n)` corta la URI en el fragmento
- `%` pasa a `%25`, así que `100%` se escribe `100%25`

Las comillas son la otra trampa: comillas simples dentro del SVG y dobles alrededor del `url("…")`. Y **no** lo pases a base64. Base64 alarga la cadena un tercio, mata el gzip, y la versión en texto plano es la que todavía puedes leer y tocar dentro de seis meses.

---

## 5. Opacidad, y cuándo mezclar

El rango útil está entre el **10% y el 20%**. Por debajo del 8% el dithering es demasiado débil para romper las bandas; por encima del 25% la superficie deja de parecer un gradiente con grano y empieza a parecer un gradiente sucio.

Una opacidad plana aplica el mismo grano a las zonas claras y a las oscuras. El grano real es más fuerte en los medios tonos, y `mix-blend-mode` se acerca más a eso:

```css
.hero::after {
	mix-blend-mode: overlay;
	opacity: 0.35;
}
```

`overlay` deja que el ruido siga la luminancia de lo que hay debajo, así que se apaga en las partes más oscuras y más claras. Necesita más opacidad para leerse, y necesita que el padre no cree un contexto de apilamiento incómodo. `soft-light` es la versión suave de la misma idea.

Sobre un fondo oscuro, la `opacity` plana suele bastar, y además es más barata.

---

## 6. Lo que cuesta

El filtro se rasteriza una vez y después es un bitmap cacheado, así que el scroll sale gratis. Dos cosas no salen gratis:

- una capa de ruido a pantalla completa en un móvil es una textura grande que generar en el primer pintado: déjala en el elemento que la necesita, no en el `body`
- animar `baseFrequency` (el efecto de «grano vivo») vuelve a ejecutar el filtro en cada frame y te deja en framerates de un dígito

`pointer-events: none` no es opcional: la capa cubre el elemento con `inset: 0` y si no se tragaría todos los clicks de debajo.

---

## 7. Resultado final

```css
.hero {
	position: relative;
	background: linear-gradient(135deg, #0a1020, #1d4ed8 55%, #4d9dff);
}

.hero::after {
	content: '';
	position: absolute;
	inset: 0;
	pointer-events: none;
	opacity: 0.15;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

Los dos cuadros de arriba son el mismo gradiente. El de la derecha lleva la capa al `0.14`; las bandas del izquierdo son justo lo que a tu ojo ya le parecía barato.

---

✅ **Regla simple:**
El banding es un problema de **profundidad de color**, y el ruido es la respuesta de hace cien años. Con un quince por ciento sobra.
