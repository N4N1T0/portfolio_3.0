---
title: 'Block cursor without a glyph'
excerpt: 'A terminal cursor drawn in CSS, so it never depends on the font covering the block characters'
preview: 'terminal-caret'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: es/cursor-en-bloque-sin-glifo
---

A terminal cursor is usually a character (`█`, `▊`) or the browser caret. Both have a problem: the
first depends on the font shipping the glyph, the second cannot be styled consistently.

The fix is to draw it: an empty element with a background color and a fixed size in `em`, so it
always matches the current font size.

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

Two details that matter:

- **`steps(1, end)`** instead of a smooth fade: the cursor should snap, not glow.
- **`vertical-align: text-bottom`** keeps the block sitting on the baseline of the line it belongs to.

For a real `<input>` the browser owns the caret, so the same look comes from the modern
`caret-shape` property:

```css
@utility caret-block {
	caret-color: var(--color-accent);
	caret-shape: block;
}
```

Browsers that do not support `caret-shape` keep the native caret, which is a perfectly good
fallback.
