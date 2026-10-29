---
title: 'El botón partido, sin JavaScript'
excerpt: 'Popover nativo y anchor positioning: un menú atado a su botón y un chevron que se entera'
preview: 'split-button'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: en/split-button-anchor
---

El botón partido de Google Docs: **Guardar** a la izquierda, un chevron a la derecha que despliega un menú justo debajo del conjunto y gira 180° mientras está abierto.

Eso antes era un componente: un hook de estado, un listener de click fuera, un manejador de `Esc`, una trampa de foco y Floating UI para mantener el menú pegado al botón durante un scroll. Todo eso ya es plataforma.

---

## 1. El marcado

```html
<div class="split">
	<button>Guardar</button>
	<button popovertarget="menu" class="chev">⌄</button>
</div>

<ul id="menu" popover>
	…
</ul>
```

`popovertarget` es todo el cableado. Ni `onClick`, ni `useState`, ni `ref`.

---

## 2. El CSS

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

Tres propiedades hacen la colocación:

- **`anchor-name`** bautiza el ancla. Va en el elemento contra el que mides: aquí el contenedor, para que el menú se alinee con el conjunto y no con uno de los dos botones.
- **`position-anchor`** apunta el menú a ese nombre.
- **`anchor()`** lee un borde del ancla. `top: anchor(bottom)` significa «mi borde superior va en el borde inferior del ancla».

`anchor-size(width)` es el regalo: el menú hereda el ancho del botón como mínimo, así que nunca acaba más estrecho que su disparador.

---

## 3. `inset: auto` no es opcional

Un popover vive en la capa superior, y la hoja de estilos del navegador le da:

```css
[popover] {
	inset: 0;
	margin: auto;
}
```

que lo centra en la pantalla. Es el valor por defecto correcto para un diálogo y el equivocado para un menú. `inset: auto` limpia los cuatro bordes primero; luego `top` y `left` fijan los dos que de verdad quieres. Sáltatelo y el menú flota en mitad del viewport mientras tus valores de `anchor()` pierden en silencio contra la regla del navegador.

---

## 4. El chevron, y por qué importa el `+`

```css
.split:has(+ :popover-open) .chev {
	rotate: 180deg;
}
```

Léelo de derecha a izquierda: _el `.chev` dentro de un `.split` al que le sigue inmediatamente un popover abierto_.

`:popover-open` es el estado que mantiene el navegador, así que no hay nada que sincronizar. El `+` está trabajando de verdad: el popover es **hermano** del botón, no hijo, y tiene que serlo porque la capa superior lo saca del flujo normal de todas formas. Un `:has(:popover-open)` sin el combinador buscaría un popover abierto _dentro_ del botón partido y no casaría nunca.

Pon `transition: rotate 200ms ease` en el chevron y el giro se anima en los dos sentidos gratis.

---

## 5. No salirse de la pantalla

Cerca del borde inferior del viewport, un menú anclado a `anchor(bottom)` se saldría. Una declaración lo arregla:

```css
.menu {
	position-try-fallbacks: flip-block;
}
```

El navegador prueba primero la posición preferida y, si el menú no cabe, lo voltea al otro lado del ancla. Esa es la única función que justificaba una librería de posicionamiento entera.

---

## 6. Lo que te regala el popover nativo

Todo lo que antes era la mitad aburrida del componente:

- **cierre al hacer click fuera**
- **`Esc`** lo cierra
- **la capa superior**: ni una carrera de `z-index` con una cabecera fija
- **el foco** entra en el popover y vuelve al disparador al cerrar
- **uno cada vez**: abrir otro `popover="auto"` cierra este

Nada de eso es código que mantengas.

---

## 7. Soporte, y el fallback

El anchor positioning es **Baseline desde enero de 2026**: Chrome y Edge 125 (mayo de 2024), Safari 26 (septiembre de 2025) y Firefox 147 (enero de 2026). La API de popover es Baseline desde 2025.

Los navegadores viejos siguen necesitando un plan, porque el fallo no es sutil: el menú aterriza centrado en el viewport.

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

El popover sigue abriendo y cerrando; simplemente se coloca bajo el botón por medios normales. Para los pocos motores que tampoco tienen la API de popover, la versión con `<details>` degrada más pero sigue funcionando.

---

✅ **Regla simple:**
`anchor-name` en lo que mides, `position-anchor` en lo que mueves, y `inset: auto` **antes** que cualquiera de los dos.
