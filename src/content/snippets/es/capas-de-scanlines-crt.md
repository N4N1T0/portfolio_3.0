---
title: 'Capas de scanlines CRT'
excerpt: 'Dos overlays fijos que convierten cualquier página en una pantalla de fósforo, sin tocar el layout'
preview: 'scanline-overlay'
icon: 'block'
isNew: true
comingSoon: false
counterpartId: en/scanline-overlay
---

El aspecto CRT son dos capas por encima de la página: los **scanlines** y la **viñeta**. Ambas son
fijas, ambas ignoran el puntero y ninguna mueve nada del layout.

```css
@utility crt-scanlines {
	background-image: repeating-linear-gradient(
		to bottom,
		rgb(0 0 0 / 0.28) 0 1px,
		transparent 1px 3px
	);
}

@utility crt-vignette {
	background-image: radial-gradient(ellipse at center, transparent 42%, rgb(0 0 0 / 0.63) 100%);
}
```

Y en el layout:

```astro
<div
	class="crt-scanlines pointer-events-none fixed inset-0 z-30 opacity-30"
	aria-hidden="true"
></div>
<div class="crt-vignette pointer-events-none fixed inset-0 z-30" aria-hidden="true"></div>
```

Tres reglas lo mantienen barato:

- **`pointer-events-none`**: la capa nunca puede comerse un click.
- **`aria-hidden`**: es decoración, no contenido.
- **solo `background-image`**: nada de `box-shadow` ni `filter` sobre la página, así que el
  compositor solo tiene que pintar dos capas.

El paso de los scanlines es el dial: `1px 3px` es un raster visible, `1px 4px` es más discreto.
Mantén el periodo por encima del device pixel ratio o las líneas producen muaré en pantallas de alta
densidad.
