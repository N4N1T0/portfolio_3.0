---
title: 'El confetti del botón de like'
excerpt: 'Ocho partículas, un keyframe y tres custom properties al azar'
preview: 'like-confetti'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: en/like-button-confetti
---

Pulsas el botón de me gusta en YouTube y salen disparadas un puñado de partículas, cada una con su desvío, su giro y su propio ritmo. Parece un sistema de partículas. Es un bloque de `@keyframes` y tres custom properties.

La idea que merece la pena robar: **el azar vive en JavaScript, pero solo como tres números. La animación no sale nunca de CSS.**

---

## 1. Todo el efecto

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

## 2. Una curva, ocho partículas

Todas las partículas corren los mismos keyframes. Lo que las hace parecer independientes son tres valores puestos por elemento:

| Propiedad | Rango          | Qué cambia               |
| :-------- | :------------- | :----------------------- |
| `--x`     | −80px a 80px   | cuánto se desvía de lado |
| `--r`     | −90deg a 90deg | cuánto da vueltas        |
| `--d`     | 0.6s a 1.2s    | cuánto vive              |

`--d` es la que hace el trabajo pesado. Con duraciones idénticas, las ocho partículas llegan y desaparecen como un bloque, y eso se lee como un único sprite animado. Reparte la duración y el grupo se disuelve en vez de apagarse de golpe.

Centrar `--x` en cero (`Math.random() * 160 - 80`, no `Math.random() * 80`) es lo que hace simétrico el estallido. La mitad se va a la izquierda y la mitad a la derecha.

---

## 3. Por qué el fundido de entrada está al 15%

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

Una partícula que aparece a lo largo de la primera mitad de su vida se lee lenta y blanda; el estallido tiene que sentirse como un impacto. El quince por ciento son unos 100ms en una partícula de 0.7s: rápido para que parezca instantáneo, lento para que no parpadee.

La caída larga de `1` a `0` durante el 85% restante es lo que se lee como la partícula alejándose. El `ease-out` de toda la animación mete casi todo el movimiento en el primer tercio, así que salta y luego flota.

---

## 4. `forwards` y la limpieza

`animation-fill-mode: forwards` mantiene el último frame, así que la partícula se queda en `opacity: 0` en vez de volver un frame a su estado inicial justo antes de que la elimines.

Y hay que eliminarla de verdad. Ocho partículas por click, en un botón que alguien pulsa veinte veces, son 160 elementos huérfanos con una animación terminada colgando:

```js
spark.addEventListener('animationend', () => spark.remove());
```

`animationend` se dispara cuando la animación termina de verdad, cosa que un `setTimeout(remove, 700)` solo aproxima: el timeout no sabe nada de una pestaña en segundo plano, de un temporizador estrangulado ni de un usuario que cambió la duración desde una custom property. El evento sí.

`pointer-events: none` importa más de lo que parece. Las partículas están posicionadas encima del botón, y una partícula bajo el cursor se come el siguiente click: el segundo toque de un doble toque no llega a ninguna parte.

---

## 5. La parte que se suele saltar

El estallido es decoración. La _información_ es que el contador subió, y eso tiene que llegar sin la animación:

```html
<button class="like">++</button> <output aria-live="polite">1.206</output>
```

Las partículas llevan `aria-hidden="true"`: ocho spans apareciendo y desapareciendo en el árbol de accesibilidad son ruido, no feedback. La región `aria-live` del contador es el anuncio real.

Y el estallido no debería ni ocurrir para quien pidió menos movimiento:

```js
const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
if (calm.matches) return;
```

Comprobado en el script y no en CSS, porque la animación más barata es la que nunca creas. El contador sigue subiendo, que era de lo que se trataba.

---

## 6. Cuántas son demasiadas

Entre ocho y doce es el rango. Más partículas no se leen como más celebración, se leen como lag: cada una es un elemento, un recálculo de estilos y una capa que componer.

Si necesitas cien, ya no estás escribiendo este snippet: eso es un canvas. La ventaja de esta versión es que no cuesta nada hasta el click, y vuelve a no costar nada un segundo después.

---

✅ **Regla simple:**
Deja la **animación** en CSS y que JavaScript le pase **tres números**. Esa es toda la diferencia entre un sistema de partículas y un bucle que crea elementos.
