---
title: 'El padre reacciona a su hijo con :focus-within'
excerpt: 'Resaltar un campo entero, revelar una barra de acciones o abrir un buscador sin un solo handler de foco'
preview: 'focus-within'
icon: 'code'
isNew: true
comingSoon: false
counterpartId: en/focus-within-parent-state
---

Resaltar el campo entero cuando su input recibe el foco es de esas cosas que suelen llegar con estado: un `useState`, un `onFocus`, un `onBlur` y una clase que se cambia a mano.

CSS ya lo hace. **`:focus-within` casa con un elemento cuando él mismo o cualquiera de sus descendientes tiene el foco**, y está en todos los navegadores desde 2017.

---

## 1. Lo que estamos sustituyendo

La versión en React de un campo resaltado:

```jsx
const [focused, setFocused] = useState(false);

<div className={focused ? 'field field--focused' : 'field'}>
	<label htmlFor="email">Email</label>
	<input id="email" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
</div>;
```

Tres piezas de API, un re-render por cada cambio de foco y un bug esperando en el `onBlur`: pulsa un botón dentro del campo y el blur se dispara antes de que llegue el click.

---

## 2. La versión en CSS

```css
.field:focus-within {
	border-color: var(--brand);
	box-shadow: var(--ring);
}
```

Eso es todo. Sin estado, sin re-render, sin handler que limpiar. Y sigue al teclado, porque reacciona al foco real y no a un evento de ratón.

---

## 3. Revelar contenido, no solo un borde

Lo útil no es el borde: es mostrar algo que no estaba. Un buscador que abre sus filtros al enfocar el input:

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

`grid-template-rows: 0fr -> 1fr` es el truco que anima una altura que nadie midió. El hijo necesita `overflow: hidden` para que el estado cerrado recorte de verdad:

```css
.search .filters > * {
	overflow: hidden;
}
```

`height: auto` no es animable, y `max-height` te obliga a adivinar un número que estará mal el día que el contenido crezca. La versión con `fr` anima la altura real.

Una caja de comentario que revela su barra de acciones es la misma regla con otro hijo:

```css
.compose:focus-within .actions {
	max-height: 60px;
	opacity: 1;
}
```

---

## 4. Lo que muerde

**`:focus-within` se dispara con _cualquier_ descendiente enfocable.** Esa es la gracia, y también la trampa: si el área revelada tiene un botón, enfocar ese botón mantiene al padre casando, así que el panel no se cierra mientras lo usas. Justo lo que quieres para una barra de acciones.

No es lo que quieres cuando el descendiente no viene a cuento. Acótalo:

```css
/* solo el campo de texto, no el botón de cerrar que tiene al lado */
.field:has(> input:focus) {
	border-color: var(--brand);
}
```

**Un elemento oculto sigue siendo enfocable.** El panel cerrado de arriba está recortado, no eliminado, así que un `Tab` puede aterrizar dentro de algo que el ojo no ve. Si el estado es cerrado de verdad, ciérralo de verdad:

```css
.search .filters {
	visibility: hidden;
}

.search:focus-within .filters {
	visibility: visible;
}
```

`visibility` es animable en el sentido que importa: espera a que termine la transición antes de ocultar.

**`:focus-within` no es `:focus-visible`.** Un click con el ratón dentro del campo también casa, así que la caja entera se enciende al hacer click, no solo al navegar con teclado. Para un campo eso suele estar bien; para un anillo de foco, usa `:focus-visible`.

---

## 5. En Tailwind

La variante viene con el framework, así que la demo de arriba es una clase:

```html
<div class="border focus-within:border-accent focus-within:ring-2">
	<input class="focus:outline-none" />
</div>
```

El `focus:outline-none` del input importa: el anillo ahora es del padre, y dos anillos superpuestos se leen como un error.

---

## 6. Resultado final

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

✅ **Regla simple:**
Si el estado solo existe mientras algo tiene el foco, **no es estado**. Es un selector.
