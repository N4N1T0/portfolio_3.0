---
title: 'El orbe de voz con IA'
excerpt: 'Dos gradientes cónicos, un desenfoque y un círculo: el avatar que brilla'
preview: 'voice-orb'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: en/ai-voice-orb
---

Todos los asistentes llevan el mismo avatar: una esfera pequeña e iridiscente que se arremolina mientras escucha. Parece un shader de WebGL o un Lottie. Son dos gradientes cónicos girando dentro de un círculo recortado, bajo un desenfoque.

---

## 1. Todo el efecto

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

## 2. Por qué el primer color se repite al final

```css
conic-gradient(from 0deg, #22d3ee, #4d9dff, #a855f7, #22d3ee)
```

Un gradiente cónico barre de 0° a 360°, y los 360° están justo al lado de los 0°. Si la última parada no es del mismo color que la primera, hay una costura dura en esa línea: una grieta visible en la esfera. Repetir el color de apertura cierra el bucle.

El desenfoque tapa muchas cosas, pero esta no: una costura entre morado y cian sobrevive a un blur de 12px como una línea brillante que gira con el gradiente, y el ojo se engancha a ella.

---

## 3. Por qué dos capas

Un gradiente cónico se lee como exactamente lo que es: una rueda de color girando. El ojo sigue una única velocidad de rotación y el conjunto se aplana.

Dos gradientes a velocidades distintas y en sentidos opuestos no vuelven a alinearse igual. La interferencia entre ambos es lo que se lee como líquido. Tres reglas lo hacen funcionar:

- **duraciones distintas**, y que no sean múltiplos: `9s` y `5.8s` tardan mucho en repetir la misma disposición; `9s` y `4.5s` se resincronizan cada nueve segundos y el bucle se hace visible
- **sentidos opuestos** (`animation-direction: reverse`), para que los colores se crucen en vez de viajar juntos
- **la segunda capa con menos opacidad** (`0.6`), para que una lleve la voz cantante y la otra tiña. Dos capas a plena potencia solo se pelean

Sobre un fondo oscuro, `mix-blend-mode: screen` en la segunda capa gana a la opacidad plana: screen suma luz en vez de promediar dos colores hasta convertirlos en barro, y el orbe se lee como iluminado en vez de pintado. La demo de arriba lo usa, y por eso se ve más brillante que el código del apartado 1.

---

## 4. El desenfoque y el inset negativo

`filter: blur()` es lo que convierte dos gradientes de bordes duros en algo que parece iluminado por dentro. Sin él ves las líneas del cono; con él ves color.

Un desenfoque toma píxeles de fuera de la caja del elemento, y fuera de la caja no hay nada, así que los bordes se desvanecen a transparente. Eso es justo lo que no quieres cuando la forma **es** el borde. `inset: -25%` hace cada capa un 50% más ancha que el orbe, así que el borde desvanecido del blur cae fuera del recorte y nunca se ve.

`overflow: hidden` con `border-radius: 50%` hace el recorte. `isolation: isolate` mantiene los pseudo-elementos y su opacidad dentro de su propio contexto de apilamiento, para que un modo de mezcla o un z-index negativo de otra parte de la página no pueda meterse.

---

## 5. El estado es un número, no otra animación

Un asistente tiene estados: en reposo, escuchando, pensando. El instinto es un segundo bloque de `@keyframes` por estado. La animación es la misma; solo cambian sus parámetros:

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

Más rápido y más nítido se lee como atención. La `transition` del `filter` suaviza el cambio de estado; la velocidad sí salta, y no pasa nada porque la rotación es continua y el ojo no pilla el frame exacto.

Un atributo lo gobierna todo, y es el atributo que tu aplicación ya tiene.

---

## 6. La parte que se salta todo el mundo

Un orbe que gira para siempre es movimiento que el usuario no pidió, en el rabillo del ojo, durante todo el tiempo que la página esté abierta. Aquí `prefers-reduced-motion` no es un detalle:

```css
@media (prefers-reduced-motion: reduce) {
	.orb::before,
	.orb::after {
		animation: none;
	}
}
```

Parado sigue siendo una esfera iridiscente suave: los gradientes no necesitan la rotación para verse bien.

El orbe además es decoración: no dice nada que un lector de pantalla necesite. Márcalo con `aria-hidden="true"` y pon el estado real en texto al lado, donde la tecnología de asistencia pueda leerlo.

Sobre el coste: dos capas desenfocadas se componen en GPU, así que el giro es barato, pero `filter: blur()` sobre un elemento grande no lo es. Mantén el orbe pequeño. Un avatar de 4rem sale gratis; la versión de 40rem del mismo código pone a soplar el ventilador de un portátil.

---

✅ **Regla simple:**
Un gradiente girando es una **rueda de color**. Dos, a velocidades que nunca se resincronizan, es un **líquido**.
