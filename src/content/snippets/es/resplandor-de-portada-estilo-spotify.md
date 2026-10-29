---
title: 'Resplandor de portada estilo Spotify'
excerpt: 'El halo difuminado detrás de una carátula, en CSS puro y sin extraer colores'
preview: 'cover-glow'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: en/spotify-cover-glow
---

Los reproductores de música ponen un halo suave detrás de la carátula, teñido con los colores de la propia imagen. Lo primero que se asume es que hace falta JavaScript: cargar la imagen en un canvas, leer los píxeles, promediarlos y pintar un degradado.

No hace falta. **Un pseudo-elemento y `background: inherit` resuelven todo**, y el halo sigue a la portada que pongas.

---

## 1. La vía cara que vamos a evitar

El camino del canvas es este:

```js
const ctx = canvas.getContext('2d');
ctx.drawImage(cover, 0, 0, w, h);
const px = ctx.getImageData(0, 0, w, h);
// promediar los píxeles, elegir un color dominante y escribirlo en una variable CSS
```

Funciona, pero te cuesta:

- un canvas y una decodificación extra de la imagen
- una imagen limpia de CORS, o `getImageData` lanza error con el canvas contaminado
- un pintado que ocurre **después** de cargar la imagen, así que el halo aparece tarde
- código que hay que volver a ejecutar en cada cambio de portada

---

## 2. El truco: `background: inherit`

Un pseudo-elemento puede heredar el atajo `background` del padre, imagen incluida. Lo difuminas, lo saturas, lo escalas más allá del borde y lo mandas detrás del padre:

```css
.cover {
	background: url(art.jpg) center / cover;
	position: relative;
}

.cover::before {
	content: '';
	position: absolute;
	inset: 0;
	z-index: -1;
	border-radius: inherit;
	background: inherit;
	filter: blur(40px) saturate(1.8);
	scale: 1.1;
}
```

Ese es el efecto completo. Línea a línea:

- `background: inherit` copia la imagen del padre, así que el halo es la propia portada
- `filter: blur()` la disuelve en color
- `saturate()` devuelve el color, porque difuminar promedia los píxeles hacia el gris
- `scale` agranda la copia difuminada para que asome por detrás de la portada nítida
- `z-index: -1` la pinta **detrás** del fondo del propio padre

Cambias el `src` de la portada y el halo cambia con ella. Sin listener, sin volver a medir, sin nada de JavaScript.

---

## 3. Ajustar los tres números

Solo importan tres valores, y se mueven juntos:

| Valor        | Efecto                               | Rango razonable |
| :----------- | :----------------------------------- | :-------------- |
| `blur()`     | cómo de suave es el halo             | 24px – 60px     |
| `saturate()` | cuánto color sobrevive al difuminado | 1.4 – 2.2       |
| `scale`      | cuánto asoma por fuera               | 1.05 – 1.25     |

Más difuminado pide más saturación. Un blur grande con `saturate(1)` se lee como un borrón gris, no como color.

---

## 4. Las dos trampas de `z-index: -1`

Aquí es donde el efecto suele romperse.

**Un ancestro con fondo tapa el halo.** Un `z-index` negativo manda el pseudo-elemento detrás del fondo de su padre _y_ detrás de todo ancestro que no cree un contexto de apilamiento. El primer ancestro con fondo lo pinta por encima.

La solución es un contenedor que cree un contexto de apilamiento, para que el halo no pueda hundirse más:

```css
.cover-stage {
	isolation: isolate;
}
```

Pon el contenedor alrededor de la portada, nunca sobre la portada: un contexto de apilamiento **en** `.cover` pintaría el pseudo-elemento encima de la imagen en lugar de detrás, y verías un borrón difuminado sobre una imagen nítida.

**`overflow: hidden` lo recorta.** El halo vive fuera de la caja del padre, que es justo el sentido de `scale`. Cualquier ancestro que recorte el desbordamiento lo corta. Dale padding a ese ancestro en vez de un recorte.

---

## 5. Accesibilidad y rendimiento

El halo es decoración. Un `::before` con `content` vacío ya es invisible para las tecnologías de asistencia, así que no hay nada que anunciar ni que etiquetar.

Sobre rendimiento:

- `filter: blur()` va compuesto en GPU, pero un radio grande no es gratis: mantenlo en un elemento pequeño, nunca sobre una lista de cincuenta portadas a la vez
- cuesta **cero** decodificaciones de imagen: el pseudo-elemento reutiliza el mismo bitmap ya decodificado del padre
- no dispara layout; `scale` y `filter` se quedan fuera de la ruta de layout
- no se ejecuta nada en el hilo principal después de que llegue la imagen

Comparado con la versión de canvas sale más barato en todos los ejes, y cabe en dos declaraciones.

---

## 6. Resultado final

```css
.cover-stage {
	isolation: isolate;
}

.cover {
	position: relative;
	background: url(art.jpg) center / cover;
	border-radius: 0.5rem;
}

.cover::before {
	content: '';
	position: absolute;
	inset: 0;
	z-index: -1;
	border-radius: inherit;
	background: inherit;
	filter: blur(40px) saturate(1.8);
	scale: 1.1;
}
```

Funciona con cualquier imagen que le eches, incluido un degradado CSS: la demo de arriba usa uno.

---

✅ **Regla simple:**
Antes de tirar de canvas para leer los colores de una imagen, mira si **la imagen puede difuminarse a sí misma**.
