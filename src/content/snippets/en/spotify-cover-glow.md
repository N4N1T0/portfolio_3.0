---
title: 'Spotify-style cover glow'
excerpt: 'The blurred halo behind an album cover, in pure CSS and with no colour extraction'
preview: 'cover-glow'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: es/resplandor-de-portada-estilo-spotify
---

Music players put a soft halo behind the album cover, tinted with the colours of the artwork. The usual assumption is that it needs JavaScript: load the image into a canvas, read the pixels, average them and paint a gradient.

It does not. **One pseudo-element and `background: inherit` do the whole thing**, and the halo follows whatever cover you set.

---

## 1. The expensive way we are avoiding

The canvas route looks like this:

```js
const ctx = canvas.getContext('2d');
ctx.drawImage(cover, 0, 0, w, h);
const px = ctx.getImageData(0, 0, w, h);
// average the pixels, pick a dominant colour, write it to a CSS variable
```

It works, but it costs you:

- a canvas and an extra decode of the image
- a CORS-clean image, or `getImageData` throws on a tainted canvas
- a paint that happens **after** the image loads, so the halo pops in late
- code to re-run on every cover change

---

## 2. The trick: `background: inherit`

A pseudo-element can inherit its parent's `background` shorthand, image included. Blur it, saturate it, scale it past the edges, and push it behind the parent:

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

That is the entire effect. Line by line:

- `background: inherit` copies the parent's artwork, so the halo is the cover itself
- `filter: blur()` dissolves it into colour
- `saturate()` pushes the colour back up, because blurring averages pixels towards grey
- `scale` grows the blurred copy so it spills out from behind the sharp cover
- `z-index: -1` paints it **behind** the parent's own background

Change the `src` of the cover and the halo changes with it. No listener, no re-measure, no JavaScript at all.

---

## 3. Tuning the three numbers

Only three values matter, and they move together:

| Value        | Effect                            | Sane range  |
| :----------- | :-------------------------------- | :---------- |
| `blur()`     | how soft the halo is              | 24px – 60px |
| `saturate()` | how much colour survives the blur | 1.4 – 2.2   |
| `scale`      | how far it spills out             | 1.05 – 1.25 |

More blur needs more saturation. A large blur with `saturate(1)` reads as grey smudge, not as colour.

---

## 4. The two gotchas with `z-index: -1`

This is where the effect usually breaks.

**An ancestor with a background hides the halo.** A negative `z-index` sends the pseudo-element behind its parent's background _and_ behind every ancestor that does not create a stacking context. The first ancestor with a background paints over it.

The fix is a wrapper that creates a stacking context, so the halo cannot sink any further:

```css
.cover-stage {
	isolation: isolate;
}
```

Put the wrapper around the cover, never on the cover itself: a stacking context **on** `.cover` would paint the pseudo-element on top of the artwork instead of behind it, and you would see a blurred smudge over a sharp image.

**`overflow: hidden` clips it.** The halo lives outside the parent's box, which is the whole point of `scale`. Any ancestor clipping overflow cuts it off. Give that ancestor padding instead of a clip.

---

## 5. Accessibility and performance

The halo is decoration. A `::before` with empty `content` is already invisible to assistive technology, so there is nothing to announce and nothing to label.

On performance:

- `filter: blur()` is composited, but a large radius is not free — keep it on one small element, never on a list of fifty covers at once
- it costs **zero** image decodes: the pseudo-element reuses the same decoded bitmap as the parent
- no layout is triggered; `scale` and `filter` stay off the layout path
- nothing runs on the main thread after the image lands

Compared to the canvas version it is cheaper on every axis, and it ships in two declarations.

---

## 6. Final result

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

Works on any image you throw at it, including a CSS gradient — the demo above uses one.

---

✅ **Simple rule:**
Before you reach for a canvas to read colours out of an image, check whether **the image can just blur itself**.
