---
title: 'The split button, with no JavaScript'
excerpt: 'Native popover and anchor positioning: a menu tethered to its button, and a chevron that knows'
preview: 'split-button'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: es/boton-partido-con-anclaje
---

The split button in Google Docs: **Save** on the left, a chevron on the right that drops a menu right under the pair and flips 180° while it is open.

That used to be a component: a state hook, a click-outside listener, an `Esc` handler, a focus trap and Floating UI to keep the menu glued to the button through a scroll. All of it is now platform.

---

## 1. The markup

```html
<div class="split">
	<button>Save</button>
	<button popovertarget="menu" class="chev">⌄</button>
</div>

<ul id="menu" popover>
	…
</ul>
```

`popovertarget` is the entire wiring. No `onClick`, no `useState`, no `ref`.

---

## 2. The CSS

```css
.split {
	anchor-name: --split;
}

.menu {
	position: absolute;
	position-anchor: --split;
	inset: auto;
	top: anchor(bottom);
	left: anchor(left);
	min-width: anchor-size(width);
	margin: 0.25rem 0 0;
}

.split:has(+ :popover-open) .chev {
	rotate: 180deg;
}
```

Three properties do the positioning:

- **`anchor-name`** names the anchor. It goes on the element you are measuring against — here the wrapper, so the menu lines up with the whole pair and not with one of the two buttons.
- **`position-anchor`** points the menu at that name.
- **`anchor()`** reads one edge of the anchor. `top: anchor(bottom)` means "my top edge sits at the anchor's bottom edge".

`anchor-size(width)` is the bonus: the menu inherits the button's width as a minimum, so it never ends up narrower than its trigger.

---

## 3. `inset: auto` is not optional

A popover lives in the top layer, and the browser's own stylesheet gives it:

```css
[popover] {
	inset: 0;
	margin: auto;
}
```

which centres it on the screen. That is the right default for a dialog and the wrong one for a menu. `inset: auto` clears all four edges first; then `top` and `left` set the two you actually want. Skip it and the menu floats in the middle of the viewport while your `anchor()` values quietly lose to the UA rule.

---

## 4. The chevron, and why the `+` matters

```css
.split:has(+ :popover-open) .chev {
	rotate: 180deg;
}
```

Read it right to left: _the `.chev` inside a `.split` that is immediately followed by an open popover_.

`:popover-open` is the state the browser maintains, so nothing has to be kept in sync. The `+` is doing real work: the popover is a **sibling** of the button, not a child — it has to be, because the top layer takes it out of the normal flow anyway. `:has(:popover-open)` without the combinator would look for an open popover _inside_ the split button and never match.

Put `transition: rotate 200ms ease` on the chevron and the flip animates in both directions for free.

---

## 5. Staying on screen

Near the bottom edge of the viewport, a menu anchored to `anchor(bottom)` would hang off the screen. One declaration fixes it:

```css
.menu {
	position-try-fallbacks: flip-block;
}
```

The browser tries the preferred position first, and if the menu does not fit it flips to the other side of the anchor. That is the single feature that justified a whole positioning library.

---

## 6. What the native popover hands you

Everything that used to be the boring half of the component:

- **light dismiss** — a click outside closes it
- **`Esc`** closes it
- **the top layer** — no `z-index` arms race with a sticky header
- **focus** moves into the popover and comes back to the trigger on close
- **one at a time** — opening another `popover="auto"` closes this one

None of it is code you maintain.

---

## 7. Support, and the fallback

Anchor positioning is **Baseline since January 2026**: Chrome and Edge 125 (May 2024), Safari 26 (September 2025), Firefox 147 (January 2026). The popover API has been Baseline since 2025.

Older browsers still need a plan, because the failure is not subtle — the menu lands centred in the viewport:

```css
@supports not (anchor-name: --x) {
	.menu {
		position: absolute;
		inset: auto;
		top: 100%;
		left: 0;
	}
}
```

The popover still opens and closes; it just sits under the button by ordinary means. For the few engines without the popover API either, the `<details>` version degrades further but keeps working.

---

✅ **Simple rule:**
`anchor-name` on what you measure, `position-anchor` on what you move, and `inset: auto` **before** either of them.
