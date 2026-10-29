---
title: 'The price odometer'
excerpt: 'Sliding digit columns with one custom property per column'
preview: 'price-odometer'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: es/odometro-de-precio
---

Switching a pricing toggle from monthly to yearly makes the numbers roll up
like an odometer. No library, no per-digit JavaScript, no canvas — one CSS
animation and three numbers handed over by script.

---

## 1. The markup

```html
<div class="odometer">
	<div class="digit" style="--d: 4">
		<span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span
		><span>6</span><span>7</span><span>8</span><span>9</span><span>0</span>
	</div>
	<div class="digit" style="--d: 5">
		<span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span
		><span>6</span><span>7</span><span>8</span><span>9</span><span>0</span>
	</div>
</div>
```

Each `.digit` is a stack of 0 through 9 and back to 0 inside a
`1lh`-high, `overflow: hidden` window. `--d` picks which row is visible.

---

## 2. The CSS

```css
.odometer {
	font-family: var(--font-mono);
	font-size: 1.75rem;
	font-variant-numeric: tabular-nums;
	color: var(--color-phosphor-bright);
}

.digit {
	height: 1lh;
	overflow: hidden;
}

.digit span {
	display: block;
	width: 1ch;
	translate: 0 calc(var(--d) * -1lh);
	transition: translate 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
```

`tabular-nums` keeps every digit the same width, so the columns don't wiggle
side to side as they roll.

`width: 1ch` on each `span` makes one row exactly one digit tall, and
`calc(var(--d) * -1lh)` slides the stack by that many line heights. `--d: 0`
shows the first `0`; `--d: 5` slides past six rows and shows `5`.

---

## 3. Why the stack starts and ends with 0

```html
<span>0</span>…<span>9</span><span>0</span>
```

The duplicate `0` is the loop seal. When `--d` goes from `9` back to `0`,
the translate jumps from `-9lh` to `0`, which looks like a single instant
jump instead of a roll. Because the top row is `0` and the bottom row is also
`0`, the eye reads it as a continuous cylinder instead of a reset.

---

## 4. What the script actually does

It sets three numbers. Everything else is CSS:

```js
planToggle.addEventListener('change', () => {
	const yearly = planToggle.checked;
	tens.style.setProperty('--d', yearly ? '4' : '5');
	ones.style.setProperty('--d', yearly ? '0' : '5');
});
```

Monthly `$54`, yearly `$40`. Two custom properties, one transition, eight
spans total.

`forwards` isn't needed here because `translate` lands on its final value and
stays — there's no "return trip" to worry about, unlike the card shine or the
like confetti.

---

## 5. Reduced motion

`translate` is composited, so the roll is cheap, but it's still motion the
user didn't ask for:

```js
const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
if (calm.matches) return;
```

Checked before setting `--d`: the price still updates, it just snaps instead
of rolling. The counter is real text, so screen readers read the number no
matter what.

---

✅ **Simple rule:**
A number that changes by sliding is **one custom property per column**; the
animation never touches JavaScript.
