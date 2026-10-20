---
title: 'Cursor en bloque sin glifo'
excerpt: 'Un cursor de terminal dibujado con CSS, para no depender de que la fuente traiga los caracteres de bloque'
preview: 'terminal-caret'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: en/terminal-caret
---

Un cursor de terminal suele ser un carácter (`█`, `▊`) o el caret del navegador. Los dos tienen un
problema: el primero depende de que la fuente incluya el glifo, el segundo no se puede estilar de
forma consistente.

La solución es dibujarlo: un elemento vacío con color de fondo y tamaño fijo en `em`, para que
siempre acompañe al tamaño de la fuente actual.

```css
@utility terminal-cursor {
	display: inline-block;
	width: 0.62em;
	height: 1.05em;
	margin-left: 0.08em;
	vertical-align: text-bottom;
	background-color: var(--color-accent);
	animation: caret-blink 1.05s steps(1, end) infinite;
}

@keyframes caret-blink {
	0%,
	49% {
		opacity: 1;
	}

	50%,
	100% {
		opacity: 0;
	}
}
```

Dos detalles que importan:

- **`steps(1, end)`** en lugar de un fade suave: el cursor tiene que parpadear, no brillar.
- **`vertical-align: text-bottom`** deja el bloque apoyado en la línea a la que pertenece.

En un `<input>` real el caret es del navegador, así que el mismo aspecto se consigue con la
propiedad moderna `caret-shape`:

```css
@utility caret-block {
	caret-color: var(--color-accent);
	caret-shape: block;
}
```

Los navegadores que no soportan `caret-shape` mantienen el caret nativo, que es un fallback
perfectamente válido.
