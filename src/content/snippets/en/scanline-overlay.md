---
title: 'CRT scanline overlay'
excerpt: 'Two fixed overlays that turn any page into a phosphor screen, without touching the layout'
preview: 'scanline-overlay'
icon: 'block'
isNew: true
comingSoon: false
counterpartId: es/capas-de-scanlines-crt
---

A CRT look is two overlays on top of the page: the **scanlines** and the **vignette**. Both are
fixed, both ignore the pointer, and neither moves anything in the layout.

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

And in the layout:

```astro
<div
	class="crt-scanlines pointer-events-none fixed inset-0 z-30 opacity-30"
	aria-hidden="true"
></div>
<div class="crt-vignette pointer-events-none fixed inset-0 z-30" aria-hidden="true"></div>
```

Three rules keep it cheap:

- **`pointer-events-none`**: the overlay must never eat a click.
- **`aria-hidden`**: it is decoration, not content.
- **only `background-image`**: no `box-shadow` and no `filter` on the page, so the compositor only
  has to paint two layers.

The scanline pitch is the dial: `1px 3px` is a visible raster, `1px 4px` is subtler. Keep the
period above the device pixel ratio or the lines moiré on high density screens.
