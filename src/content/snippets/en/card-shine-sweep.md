---
title: 'The premium card shine'
excerpt: 'A band of light sweeping across a card, in one pseudo-element and one gradient'
preview: 'card-shine'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: es/barrido-de-luz-en-tarjeta
---

The metallic sweep on a premium card — a thin band of light that crosses the surface on hover — looks like a video, a sprite sheet or a shader. It is one pseudo-element with one gradient.

---

## 1. The whole effect

```css
.card {
	position: relative;
	overflow: hidden;
}

.card::after {
	content: '';
	position: absolute;
	inset: 0;
	pointer-events: none;
	background: linear-gradient(115deg, #0000 40%, #ffffff40 50%, #0000 60%);
	translate: -100% 0;
}

.card:hover::after {
	translate: 100% 0;
	transition: translate 800ms ease;
}
```

Six declarations. Everything else is tuning.

---

## 2. Reading the gradient

```css
linear-gradient(115deg, #0000 40%, #ffffff40 50%, #0000 60%)
```

The band is **mostly nothing**:

- `#0000` — transparent, from the start to 40%
- `#ffffff40` — white at 25% alpha, at exactly 50%
- `#0000` — transparent again from 60% on

So 80% of the layer is invisible and the light lives in a 20% strip. Narrow the strip (`45%` / `50%` / `55%`) and the sweep reads as a hard glint; widen it (`30%` / `50%` / `70%`) and it reads as a soft wash.

`115deg` tilts it. A vertical band (`90deg`) looks like a scanline; the tilt is what makes it read as a reflection, because real light hits a card at an angle.

**Why `#0000` and not `transparent`.** They are the same colour today, but the four-digit hex says what you mean: `transparent` is `rgb(0 0 0 / 0)`, pure black with no alpha, and in the days before premultiplied interpolation a gradient from white to `transparent` faded through grey. Modern browsers interpolate in premultiplied space and the grey is gone, but `#0000` next to `#ffffff40` also keeps the stop list readable: same notation, same length, one glance.

---

## 3. Why `translate` and not `background-position`

Both move the band. Only one is free.

| Property              | What the browser does                     |
| :-------------------- | :---------------------------------------- |
| `background-position` | repaints the element every frame          |
| `translate`           | moves an existing layer on the compositor |

`translate` as its own property (not inside `transform`) also leaves `transform` free for a `rotate` or a `scale` on hover, with no `transform: translateX(...) rotate(...)` string to keep in sync.

The band starts at `translate: -100% 0`, fully parked to the left of the card, and travels to `+100%`, fully parked to the right. It is never half-visible at rest.

---

## 4. The three things that break it

**No `overflow: hidden`.** The band is parked _outside_ the card; without the clip you see a white diagonal floating next to it. The clip is not decoration, it is the effect.

**The return trip.** Put the `transition` on `.card::after` and the band crawls back across the card when the pointer leaves, which looks like an accident. Put it on `.card:hover::after` instead: the hover state animates, the rest state has no transition, and the band snaps back to its parking spot invisibly.

**The pseudo-element eats clicks.** It covers the whole card with `inset: 0`, so a link or a button underneath stops responding. `pointer-events: none` hands the clicks back.

---

## 5. Making it real

Hover is not the only trigger, and a decoration should never be mandatory:

```css
.card:hover::after,
.card:focus-visible::after {
	translate: 100% 0;
	transition: translate 800ms ease;
}

@media (prefers-reduced-motion: reduce) {
	.card:hover::after,
	.card:focus-visible::after {
		transition: none;
	}
}
```

`:focus-visible` gives it to keyboard users. The reduced-motion block removes the travel for anyone who asked for less movement — the card still works, it just does not shine.

On a touch screen there is no hover at all, so treat the sweep as a bonus on pointer devices rather than as the thing that tells the user the card is interactive.

---

## 6. Final result

```css
.card {
	position: relative;
	overflow: hidden;
	border-radius: 0.75rem;
}

.card::after {
	content: '';
	position: absolute;
	inset: 0;
	pointer-events: none;
	background: linear-gradient(115deg, #0000 40%, #ffffff40 50%, #0000 60%);
	translate: -100% 0;
}

.card:hover::after,
.card:focus-visible::after {
	translate: 100% 0;
	transition: translate 800ms ease;
}
```

The demo above uses a lower alpha (`#ffffff26`) because the site runs on a dark blue ground; on a near-black card, `40` is the right amount.

---

✅ **Simple rule:**
A sweep is **a mostly transparent gradient that moves**. Keep the movement on the compositor and the transition on the hover state, not on the element.
