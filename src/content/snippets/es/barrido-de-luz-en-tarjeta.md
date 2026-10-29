---
title: 'El brillo de las tarjetas premium'
excerpt: 'Una banda de luz que cruza una tarjeta, con un pseudo-elemento y un gradiente'
preview: 'card-shine'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: en/card-shine-sweep
---

El barrido metálico de una tarjeta premium —esa banda fina de luz que cruza la superficie al pasar el ratón— parece un vídeo, un sprite o un shader. Es un pseudo-elemento con un gradiente.

---

## 1. El efecto entero

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

Seis declaraciones. Lo demás es afinar.

---

## 2. Leer el gradiente

```css
linear-gradient(115deg, #0000 40%, #ffffff40 50%, #0000 60%)
```

La banda es **casi todo nada**:

- `#0000` — transparente, desde el inicio hasta el 40%
- `#ffffff40` — blanco al 25% de alfa, exactamente en el 50%
- `#0000` — transparente otra vez a partir del 60%

Así que el 80% de la capa es invisible y la luz vive en una franja del 20%. Estrecha la franja (`45%` / `50%` / `55%`) y el barrido se lee como un destello seco; ensánchala (`30%` / `50%` / `70%`) y se lee como un lavado suave.

`115deg` la inclina. Una banda vertical (`90deg`) parece una scanline; la inclinación es lo que la hace leer como un reflejo, porque la luz real llega a una tarjeta en ángulo.

**Por qué `#0000` y no `transparent`.** Hoy son el mismo color, pero el hex de cuatro dígitos dice lo que quieres decir: `transparent` es `rgb(0 0 0 / 0)`, negro puro sin alfa, y antes de la interpolación premultiplicada un gradiente de blanco a `transparent` pasaba por gris. Los navegadores modernos interpolan en espacio premultiplicado y el gris desapareció, pero `#0000` junto a `#ffffff40` además mantiene legible la lista de paradas: misma notación, misma longitud, un vistazo.

---

## 3. Por qué `translate` y no `background-position`

Las dos mueven la banda. Solo una sale gratis.

| Propiedad             | Qué hace el navegador                        |
| :-------------------- | :------------------------------------------- |
| `background-position` | repinta el elemento en cada frame            |
| `translate`           | mueve una capa ya existente en el compositor |

`translate` como propiedad suelta (no dentro de `transform`) además deja `transform` libre para un `rotate` o un `scale` en hover, sin un `transform: translateX(...) rotate(...)` que mantener sincronizado.

La banda arranca en `translate: -100% 0`, aparcada del todo a la izquierda de la tarjeta, y viaja a `+100%`, aparcada del todo a la derecha. Nunca se queda a medio ver en reposo.

---

## 4. Las tres cosas que lo rompen

**Sin `overflow: hidden`.** La banda está aparcada _fuera_ de la tarjeta; sin el recorte ves una diagonal blanca flotando al lado. El recorte no es decoración, es el efecto.

**El viaje de vuelta.** Si pones la `transition` en `.card::after`, la banda vuelve cruzando la tarjeta cuando el puntero se va, y parece un error. Ponla en `.card:hover::after`: el estado de hover anima, el de reposo no tiene transición, y la banda vuelve de golpe a su sitio sin que se vea.

**El pseudo-elemento se come los clicks.** Cubre la tarjeta entera con `inset: 0`, así que un enlace o un botón debajo dejan de responder. `pointer-events: none` devuelve los clicks.

---

## 5. Hacerlo de verdad

El hover no es el único disparador, y una decoración nunca debería ser obligatoria:

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

`:focus-visible` se lo da a quien navega con teclado. El bloque de movimiento reducido quita el viaje para quien pidió menos movimiento: la tarjeta sigue funcionando, solo que no brilla.

En una pantalla táctil no hay hover, así que trata el barrido como un extra en dispositivos con puntero, no como la señal de que la tarjeta es interactiva.

---

## 6. Resultado final

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

La demo de arriba usa un alfa más bajo (`#ffffff26`) porque el sitio va sobre un azul casi negro; en una tarjeta negra, `40` es la cantidad correcta.

---

✅ **Regla simple:**
Un barrido es **un gradiente casi transparente que se mueve**. Deja el movimiento en el compositor y la transición en el estado de hover, no en el elemento.
