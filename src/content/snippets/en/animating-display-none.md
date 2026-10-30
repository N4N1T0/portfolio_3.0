---
title: 'Animating out of display: none'
excerpt: 'A floating menu that fades in and out, with @starting-style and allow-discrete'
preview: 'fab-menu'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: es/animar-desde-display-none
---

A floating action button opens three actions, staggered, and closes them the same way. The animation is the easy part. The hard part is that a closed menu is `display: none`, and `display` was never animatable: the element pops in, and on the way out it vanishes before the fade can run.

Two additions to CSS fix exactly that, and both are Baseline since 2025.

---

## 1. The problem, precisely

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

Opening: the element goes from not rendered to rendered. There is no previous state to interpolate from, so the browser skips the transition and paints it at `opacity: 1`. It pops.

Closing: `display: none` applies immediately, the element is gone on the next frame, and the 300ms fade never gets to run.

The usual workarounds are a `setTimeout` to delay the `display`, a `visibility`/`height: 0` hack that leaves the element in the layout, or an animation library. None of them are needed any more.

---

## 2. `allow-discrete`: the exit

`display` is a discrete property: it jumps, it does not interpolate. `transition-behavior: allow-discrete` keeps the jump but **moves it to the end** of the transition:

```css
.menu {
	transition:
		opacity 300ms,
		display 300ms allow-discrete;
}
```

Now `display: none` waits for the 300ms to finish. The fade runs, then the element leaves the layout. Written in the shorthand, `allow-discrete` goes after the duration, on the `display` line only.

The same applies to `overlay`, the property that keeps a popover or a dialog in the top layer — animate a native popover out and you need both:

```css
transition:
	opacity 300ms,
	display 300ms allow-discrete,
	overlay 300ms allow-discrete;
```

---

## 3. `@starting-style`: the entrance

The exit now works, the entrance still pops. `@starting-style` gives the browser the state the element starts **from**, the frame it becomes rendered:

```css
@starting-style {
	.menu.is-open {
		opacity: 0;
		translate: 0 16px;
		scale: 0.9;
	}
}
```

Read it as "before this element existed on screen, it looked like this". The browser takes those values as the before-change style and interpolates to the real ones.

Two rules that are easy to get wrong:

- the selector inside `@starting-style` must match the **open** state, not the closed one. It is the starting point of the element that is appearing, not the resting style of the element that is hidden.
- specificity still applies. `@starting-style` adds no weight of its own, so a starting rule has to be at least as specific as the rule it starts from.

---

## 4. The stagger

Three items that arrive together look like one block. One custom property per row and one `calc` turn it into a sequence:

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

60ms is the sweet spot: enough to read as a sequence, short enough that the last item does not feel late. Above ~100ms per step the menu starts to feel slow; below ~30ms the stagger stops being visible.

Counting from the button outwards (the closest item first) reads as the menu growing out of the button. Counting the other way reads as a list falling in.

---

## 5. Who toggles it

The CSS above only needs an attribute to react to. Three ways to flip it, in order of how little you write:

- **Native popover.** `popovertarget="menu"` on the button and `popover` on the menu: no script at all, and `Esc` plus click-outside come for free. Placement needs one extra step — a popover lives in the top layer, so it is positioned against the viewport until CSS anchor positioning pins it to its button, which has been Baseline since January 2026.
- **`<details>`.** Semantics and keyboard behaviour for free, styling fights you.
- **One attribute.** `aria-expanded` on the button, `:has()` in the selector, four lines of script. That is what the demo above does:

```css
.stage:has(#toggle[aria-expanded='true']) .menu {
	display: flex;
}
```

The script sets one attribute. Every state, every transition and the stagger stay in CSS, and the attribute is the same one a screen reader reads.

---

## 6. Final result

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

On a browser without `@starting-style`, the menu appears with no entrance animation. It still opens, it still closes, nothing is broken: the degradation is the old behaviour, which is the right thing to fall back to.

---

✅ **Simple rule:**
`allow-discrete` buys you the **exit**, `@starting-style` buys you the **entrance**. Neither replaces the other, and you almost always need both.
