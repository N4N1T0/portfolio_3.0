---
title: 'El odómetro de precio'
excerpt: 'Columnas de dígitos que deslizan con una custom property por columna'
preview: 'price-odometer'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: en/price-odometer
---

Cambiar el toggle de precios de mensual a anual hace que los números suban
como un odómetro. Sin librería, sin JavaScript por dígito, sin canvas: una
animación CSS y tres números que pasa el script.

---

## 1. El marcado

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

Cada `.digit` es una pila de 0 a 9 y otro 0 dentro de una ventana de
`1lh` de alto con `overflow: hidden`. `--d` elige qué fila se ve.

---

## 2. El CSS

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

`tabular-nums` hace que todos los dígitos tengan el mismo ancho, así que las
columnas no se mueven de lado mientras giran.

`width: 1ch` en cada `span` hace que una fila mida exactamente un dígito de
alto, y `calc(var(--d) * -1lh)` desliza la pila tantas alturas de línea.
`--d: 0` muestra el primer `0`; `--d: 5` pasa seis filas y muestra `5`.

---

## 3. Por qué la pila empieza y termina con 0

```html
<span>0</span>…<span>9</span><span>0</span>
```

El `0` duplicado es el cierre del bucle. Cuando `--d` pasa de `9` a `0`, el
translate salta de `-9lh` a `0`, que se leería como un salto instantáneo
en vez de un rollo. Como la fila de arriba es `0` y la de abajo también es
`0`, el ojo lee un cilindro continuo en vez de un reinicio.

---

## 4. Lo que hace el script de verdad

Pone tres números. Todo lo demás es CSS:

```js
planToggle.addEventListener('change', () => {
	const yearly = planToggle.checked;
	tens.style.setProperty('--d', yearly ? '4' : '5');
	ones.style.setProperty('--d', yearly ? '0' : '5');
});
```

Mensual `$54`, anual `$40`. Dos custom properties, una transición, ocho
spans en total.

`forwards` no hace falta aquí porque `translate` se queda en su valor final
y no hay "viaje de vuelta" que gestionar, como sí pasa en el brillo de la
tarjeta o en el confetti del like.

---

## 5. Movimiento reducido

`translate` se compone en GPU, así que el rollo es barato, pero sigue siendo
movimiento que el usuario no pidió:

```js
const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
if (calm.matches) return;
```

Se comprueba antes de poner `--d`: el precio sigue actualizándose, solo que
choca en vez de rodar. El contador es texto real, así que los lectores de
pantalla leen el número pase lo que pase.

---

✅ **Regla simple:**
Un número que cambia deslizando es **una custom property por columna**;
la animación nunca toca JavaScript.
