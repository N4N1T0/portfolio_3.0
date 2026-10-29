---
title: 'The like button confetti'
excerpt: 'Eight particles, one keyframe, three random custom properties'
preview: 'like-confetti'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: es/confetti-del-boton-de-like
---

Press the like button on YouTube and a handful of particles burst upwards, each one drifting, spinning and fading on its own schedule. It looks like a particle system. It is one `@keyframes` block and three custom properties.

The idea worth stealing: **the randomness lives in JavaScript, but only as three numbers. The animation never leaves CSS.**

---

## 1. The whole thing

```css
.like {
	position: relative;
}

.spark {
	position: absolute;
	top: 0;
	left: 50%;
	pointer-events: none;
	animation: float var(--d) ease-out forwards;
}

@keyframes float {
	0% {
		opacity: 0;
	}

	15% {
		opacity: 1;
	}

	100% {
		opacity: 0;
		transform: translate(var(--x), -150px) rotate(var(--r));
	}
}
```

```js
like.addEventListener('click', () => {
	for (let i = 0; i < 8; i += 1) {
		const spark = document.createElement('span');
		spark.className = 'spark';
		spark.textContent = '♪';
		spark.setAttribute('aria-hidden', 'true');
		spark.style.setProperty('--x', `${Math.random() * 160 - 80}px`);
		spark.style.setProperty('--r', `${Math.random() * 180 - 90}deg`);
		spark.style.setProperty('--d', `${0.6 + Math.random() * 0.6}s`);
		spark.addEventListener('animationend', () => spark.remove());
		like.append(spark);
	}
});
```

---

## 2. One curve, eight particles

Every particle runs the same keyframes. What makes them look independent is three values set per element:

| Property | Range           | What it changes            |
| :------- | :-------------- | :------------------------- |
| `--x`    | −80px to 80px   | how far it drifts sideways |
| `--r`    | −90deg to 90deg | how much it tumbles        |
| `--d`    | 0.6s to 1.2s    | how long it lives          |

`--d` is the one doing the heavy lifting. Identical durations make eight particles arrive and vanish as one block, which reads as a single animated sprite. Spread the duration and the group dissolves instead of blinking out.

Centering `--x` on zero (`Math.random() * 160 - 80`, not `Math.random() * 80`) is what makes the burst symmetric. Half the particles drift left, half right.

---

## 3. Why the fade-in is at 15%

```css
0% {
	opacity: 0;
}
15% {
	opacity: 1;
}
100% {
	opacity: 0;
}
```

A particle that fades in across the full first half of its life reads as slow and soft; the burst should feel like an impact. Fifteen percent is roughly 100ms on a 0.7s particle: fast enough to feel instant, slow enough that it does not strobe.

The long fall from `1` to `0` across the remaining 85% is what reads as the particle drifting away. `ease-out` on the whole animation puts most of the movement in the first third, so it leaps and then floats.

---

## 4. `forwards` and the cleanup

`animation-fill-mode: forwards` holds the final frame, so the particle stays at `opacity: 0` instead of snapping back to its starting state for one frame before you remove it.

Then you have to actually remove it. Eight particles per click, on a button somebody taps twenty times, is 160 orphaned elements with a finished animation attached:

```js
spark.addEventListener('animationend', () => spark.remove());
```

`animationend` fires when the animation genuinely finishes, which a `setTimeout(remove, 700)` only approximates: the timeout does not know about a backgrounded tab, a throttled timer or a user who changed the duration through a custom property. The event does.

`pointer-events: none` matters more than it looks. The particles are absolutely positioned over the button, and a particle under the cursor steals the next click — the second tap on a double-tap goes nowhere.

---

## 5. The part that is usually skipped

The burst is decoration. The _information_ is that the count went up, and that has to arrive without the animation:

```html
<button class="like">++</button> <output aria-live="polite">1,206</output>
```

The particles get `aria-hidden="true"`: eight spans appearing and disappearing in the accessibility tree is noise, not feedback. The `aria-live` region on the count is the real announcement.

And the burst should not happen at all for someone who asked for less motion:

```js
const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
if (calm.matches) return;
```

Checked in the script rather than in CSS, because the cheapest animation is the one you never create. The count still updates, which was the point.

---

## 6. How many is too many

Eight to twelve is the range. More particles do not read as more celebration, they read as lag: each one is an element, a style recalculation and a composited layer.

If you need a hundred, you are not writing this snippet any more — that is a canvas. The advantage of this version is that it costs nothing until the click, and nothing again a second later.

---

✅ **Simple rule:**
Keep the **animation** in CSS and let JavaScript hand it **three numbers**. That is the whole difference between a particle system and a loop that creates elements.
