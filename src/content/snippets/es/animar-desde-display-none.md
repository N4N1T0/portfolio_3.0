---
title: 'Animar desde display: none'
excerpt: 'Un menú flotante que entra y sale con transición, con @starting-style y allow-discrete'
preview: 'fab-menu'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: en/animating-display-none
---

Un botón flotante abre tres acciones, escalonadas, y las cierra igual. La animación es lo fácil. Lo difícil es que un menú cerrado está en `display: none`, y `display` nunca fue animable: el elemento aparece de golpe, y al salir desaparece antes de que el fundido pueda correr.

Dos añadidos de CSS arreglan justo eso, y los dos son Baseline desde 2025.

---

## 1. El problema, exacto

```css
.menu {
	display: none;
	opacity: 0;
	transition: opacity 300ms;
}

.menu.is-open {
	display: flex;
	opacity: 1;
}
```

Al abrir: el elemento pasa de no renderizado a renderizado. No hay estado anterior desde el que interpolar, así que el navegador se salta la transición y lo pinta con `opacity: 1`. Aparece de golpe.

Al cerrar: `display: none` se aplica de inmediato, el elemento ya no está en el siguiente frame, y los 300ms de fundido no llegan a correr.

Los apaños de siempre son un `setTimeout` para retrasar el `display`, un truco con `visibility` o `height: 0` que deja el elemento en el layout, o una librería de animación. Ninguno hace falta ya.

---

## 2. `allow-discrete`: la salida

`display` es una propiedad discreta: salta, no interpola. `transition-behavior: allow-discrete` mantiene el salto pero **lo mueve al final** de la transición:

```css
.menu {
	transition:
		opacity 300ms,
		display 300ms allow-discrete;
}
```

Ahora `display: none` espera a que terminen los 300ms. El fundido corre y después el elemento sale del layout. En la forma abreviada, `allow-discrete` va después de la duración, y solo en la línea de `display`.

Lo mismo vale para `overlay`, la propiedad que mantiene un popover o un dialog en la capa superior: animar la salida de un popover nativo necesita las dos:

```css
transition:
	opacity 300ms,
	display 300ms allow-discrete,
	overlay 300ms allow-discrete;
```

---

## 3. `@starting-style`: la entrada

La salida ya va, la entrada sigue apareciendo de golpe. `@starting-style` le da al navegador el estado **desde** el que arranca el elemento, el frame en que pasa a estar renderizado:

```css
@starting-style {
	.menu.is-open {
		opacity: 0;
		translate: 0 16px;
		scale: 0.9;
	}
}
```

Léelo como «antes de que este elemento existiera en pantalla, se veía así». El navegador toma esos valores como estilo previo e interpola hasta los reales.

Dos reglas fáciles de equivocar:

- el selector dentro de `@starting-style` tiene que casar con el estado **abierto**, no con el cerrado. Es el punto de partida del elemento que aparece, no el estilo en reposo del que está oculto.
- la especificidad sigue contando. `@starting-style` no aporta peso propio, así que la regla de arranque debe ser al menos tan específica como la regla desde la que arranca.

---

## 4. El escalonado

Tres elementos que llegan a la vez parecen un bloque. Una custom property por fila y un `calc` los convierten en secuencia:

```html
<li style="--i: 0">…</li>
<li style="--i: 1">…</li>
<li style="--i: 2">…</li>
```

```css
.row {
	transition-delay: calc(var(--i) * 60ms);
}
```

60ms es el punto dulce: suficiente para leerse como secuencia, corto para que el último no llegue tarde. Por encima de ~100ms por paso el menú se siente lento; por debajo de ~30ms el escalonado deja de verse.

Contar desde el botón hacia fuera (primero el más cercano) se lee como un menú que crece desde el botón. Al revés se lee como una lista que cae.

---

## 5. Quién lo abre

El CSS de arriba solo necesita un atributo al que reaccionar. Tres formas de cambiarlo, de menos a más código:

- **Popover nativo.** `popovertarget="menu"` en el botón y `popover` en el menú: cero script, y el `Esc` y el click fuera vienen de serie. La pega es la colocación: un popover vive en la capa superior, así que se posiciona contra el viewport y hace falta anchor positioning de CSS para anclarlo a su botón.
- **`<details>`.** Semántica y teclado gratis, el estilado se pelea contigo.
- **Un atributo.** `aria-expanded` en el botón, `:has()` en el selector y cuatro líneas de script. Es lo que hace la demo de arriba:

```css
.stage:has(#toggle[aria-expanded='true']) .menu {
	display: flex;
}
```

El script cambia un atributo. Todos los estados, todas las transiciones y el escalonado se quedan en CSS, y el atributo es el mismo que lee un lector de pantalla.

---

## 6. Resultado final

```css
.menu {
	position: absolute;
	display: none;
	transition: display 400ms allow-discrete;
}

.stage:has(#toggle[aria-expanded='true']) .menu {
	display: flex;
}

.row {
	opacity: 0;
	translate: 0 0.75rem;
	scale: 0.9;
	transition:
		opacity 200ms ease,
		translate 200ms ease,
		scale 200ms ease;
	transition-delay: calc(var(--i) * 60ms);
}

.stage:has(#toggle[aria-expanded='true']) .row {
	opacity: 1;
	translate: 0 0;
	scale: 1;
}

@starting-style {
	.stage:has(#toggle[aria-expanded='true']) .row {
		opacity: 0;
		translate: 0 0.75rem;
		scale: 0.9;
	}
}
```

En un navegador sin `@starting-style`, el menú aparece sin animación de entrada. Sigue abriendo, sigue cerrando, no se rompe nada: la degradación es el comportamiento de siempre, que es justo a lo que hay que caer.

---

✅ **Regla simple:**
`allow-discrete` te compra la **salida**, `@starting-style` te compra la **entrada**. Ninguna sustituye a la otra, y casi siempre necesitas las dos.
