---
title: 'The AI voice orb'
excerpt: 'Two conic gradients, a blur and a circle: the glowing assistant avatar'
preview: 'voice-orb'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: es/orbe-de-voz-con-ia
---

Every assistant ships the same avatar: a small iridescent sphere that swirls while it listens. It looks like a WebGL shader or a Lottie file. It is two conic gradients spinning inside a clipped circle, under a blur.

---

## 1. The whole thing

```css
.orb {
	position: relative;
	width: 4rem;
	aspect-ratio: 1;
	overflow: hidden;
	border-radius: 50%;
	isolation: isolate;
}

.orb::before,
.orb::after {
	content: '';
	position: absolute;
	inset: -25%;
	filter: blur(12px);
	animation: orb-spin 9s linear infinite;
}

.orb::before {
	background: conic-gradient(from 0deg, #22d3ee, #4d9dff, #a855f7, #22d3ee);
}

.orb::after {
	background: conic-gradient(from 90deg, #6366f1, #06b6d4, #c084fc, #6366f1);
	opacity: 0.6;
	animation-duration: 5.8s;
	animation-direction: reverse;
}

@keyframes orb-spin {
	to {
		rotate: 1turn;
	}
}
```

---

## 2. Why the first colour is repeated at the end

```css
conic-gradient(from 0deg, #22d3ee, #4d9dff, #a855f7, #22d3ee)
```

A conic gradient sweeps from 0° to 360°, and 360° sits right next to 0°. If the last stop is not the same colour as the first, there is a hard seam on that line — a visible crack in the sphere. Repeating the opening colour closes the loop.

The blur hides a lot, but not this: a seam between purple and cyan survives a 12px blur as a bright line that rotates with the gradient, and the eye locks onto it.

---

## 3. Why two layers

One conic gradient reads as exactly what it is: a colour wheel, spinning. The eye tracks a single rotation speed and the whole thing goes flat.

Two gradients at different speeds, in opposite directions, never line up the same way twice. The interference between them is what reads as liquid. Three rules make it work:

- **different durations**, and not multiples of each other: `9s` and `5.8s` take a long time to repeat the same arrangement; `9s` and `4.5s` resync every nine seconds and the loop becomes visible
- **opposite directions** (`animation-direction: reverse`), so the colours cross instead of travelling together
- **the second layer at a lower opacity** (`0.6`), so one of them leads and the other tints. Two layers at full strength just fight

On a dark background, `mix-blend-mode: screen` on the second layer beats plain opacity: screen adds light instead of averaging two colours into mud, and the orb reads as lit rather than painted. The demo above uses it, which is why it looks brighter than the code in section 1.

---

## 4. The blur and the negative inset

`filter: blur()` is what turns two hard-edged gradients into something that looks lit from inside. Without it you see the cone lines; with it you see colour.

A blur samples pixels from outside the element's box, and outside the box there is nothing, so the edges fade to transparent. That is exactly what you do not want when the shape **is** the edge. `inset: -25%` makes each layer 50% wider than the orb, so the faded border of the blur falls outside the clip and never shows.

`overflow: hidden` with `border-radius: 50%` does the clipping. `isolation: isolate` keeps the pseudo-elements and their opacity contained in their own stacking context, so a blend mode or a negative z-index elsewhere on the page cannot reach into them.

---

## 5. State is a number, not another animation

An assistant has states: idle, listening, thinking. The instinct is a second set of `@keyframes` per state. The animation is the same one; only its parameters change:

```css
.orb {
	--orb-speed: 9s;
	--orb-blur: 12px;
}

.orb[data-state='listening'] {
	--orb-speed: 3s;
	--orb-blur: 8px;
}

.orb::before,
.orb::after {
	filter: blur(var(--orb-blur));
	animation: orb-spin var(--orb-speed) linear infinite;
	transition: filter 400ms ease;
}
```

Faster and sharper reads as attention. The `transition` on `filter` smooths the change of state; the speed itself jumps, which is fine because the rotation is continuous and the eye does not catch the exact frame.

One attribute drives everything, and it is the attribute your app already has.

---

## 6. The part people skip

An orb that spins forever is motion the user never asked for, in the corner of their eye, for as long as the page is open. `prefers-reduced-motion` is not a nicety here:

```css
@media (prefers-reduced-motion: reduce) {
	.orb::before,
	.orb::after {
		animation: none;
	}
}
```

Stopped, it is still a soft iridescent sphere — the gradients do not need the rotation to look good.

The orb is also decoration: it says nothing a screen reader needs. Mark it `aria-hidden="true"` and put the real state in text next to it, where assistive technology can read it.

On cost: two blurred layers are composited, so the spin is cheap, but `filter: blur()` on a large element is not. Keep the orb small. A 4rem avatar is free; a 40rem hero version of the same code will make a laptop fan spin.

---

✅ **Simple rule:**
One spinning gradient is a **colour wheel**. Two, at speeds that never resync, is a **liquid**.
