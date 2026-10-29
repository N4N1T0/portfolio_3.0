---
title: 'The parent reacts to its child with :focus-within'
excerpt: 'Highlight a whole field, reveal a toolbar or expand a search box without a single focus handler'
preview: 'focus-within'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: es/estado-del-padre-con-focus-within
---

Highlighting the whole field when its input is focused is one of those things that usually arrives with state: a `useState`, an `onFocus`, an `onBlur`, a class toggled by hand.

CSS already does it. **`:focus-within` matches an element when the element itself or any of its descendants has focus**, and it has been in every browser since 2017.

---

## 1. What we are replacing

The React version of a highlighted field:

```jsx
const [focused, setFocused] = useState(false);

<div className={focused ? 'field field--focused' : 'field'}>
	<label htmlFor="email">Email</label>
	<input id="email" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
</div>;
```

Three pieces of API, one re-render per focus change, and a bug waiting in the `onBlur`: click a button inside the field and the blur fires before the click lands.

---

## 2. The CSS version

```css
.field:focus-within {
	border-color: var(--brand);
	box-shadow: var(--ring);
}
```

That is the whole thing. No state, no re-render, no handler to clean up. It follows the keyboard too, because it reacts to real focus and not to a mouse event.

---

## 3. Revealing content, not just a border

The useful version is not the border — it is showing something that was not there. A search box that opens its filters when you focus the input:

```css
.search .filters {
	display: grid;
	grid-template-rows: 0fr;
	opacity: 0;
	transition:
		grid-template-rows 200ms ease,
		opacity 200ms ease;
}

.search:focus-within .filters {
	grid-template-rows: 1fr;
	opacity: 1;
}
```

`grid-template-rows: 0fr -> 1fr` is the trick that animates a height nobody measured. The child needs `overflow: hidden` for the collapsed state to actually clip:

```css
.search .filters > * {
	overflow: hidden;
}
```

`height: auto` is not animatable, and `max-height` makes you guess a number that is wrong on the day the content grows. The `fr` version animates the real height.

A comment box revealing its toolbar is the same rule with a different child:

```css
.compose:focus-within .actions {
	max-height: 60px;
	opacity: 1;
}
```

---

## 4. The part that bites

**`:focus-within` fires for _any_ focusable descendant.** That is the feature, and also the trap: if the revealed area contains a button, focusing that button keeps the parent matched, so the panel does not collapse while you are using it. Exactly what you want for a toolbar.

It is not what you want when the descendant is unrelated. Scope it:

```css
/* only the text field, not the close button next to it */
.field:has(> input:focus) {
	border-color: var(--brand);
}
```

**A hidden element is still focusable.** The collapsed panel above is clipped, not removed, so a `Tab` can land inside something the eye cannot see. If the state is closed for real, close it for real:

```css
.search .filters {
	visibility: hidden;
}

.search:focus-within .filters {
	visibility: visible;
}
```

`visibility` is animatable in the sense that matters: it waits for the transition to end before hiding.

**`:focus-within` is not `:focus-visible`.** A mouse click inside the field matches it, so the whole box lights up on click, not only on keyboard navigation. For a field that is usually right; for a focus ring, use `:focus-visible` instead.

---

## 5. In Tailwind

The variant ships with the framework, so the demo above is one class:

```html
<div class="border focus-within:border-accent focus-within:ring-2">
	<input class="focus:outline-none" />
</div>
```

The `focus:outline-none` on the input matters: the ring now belongs to the parent, and two rings on top of each other read as a mistake.

---

## 6. Final result

```css
.field {
	border: 1px solid var(--edge);
	transition:
		border-color 160ms ease,
		box-shadow 160ms ease;
}

.field:focus-within {
	border-color: var(--brand);
	box-shadow: 0 0 0 2px color-mix(in srgb, var(--brand) 35%, transparent);
}

.field .hint {
	display: grid;
	grid-template-rows: 0fr;
	opacity: 0;
	transition:
		grid-template-rows 200ms ease,
		opacity 200ms ease;
}

.field .hint > * {
	overflow: hidden;
}

.field:focus-within .hint {
	grid-template-rows: 1fr;
	opacity: 1;
}
```

---

✅ **Simple rule:**
If the state only exists while something is focused, **the state is not state**. It is a selector.
