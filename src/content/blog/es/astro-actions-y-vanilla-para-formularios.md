---
title: 'Astro Actions y JavaScript Vanilla para Formularios'
date: 2025-08-20
excerpt: 'Aprende a construir formularios de contacto potentes usando la API de Astro Actions con validación del lado del servidor y JavaScript vanilla para una experiencia de usuario fluida.'
author: 'Adrian "Nano" Alvarez'
image: '@/assets/blog/Forms & Actions.webp'
imageAlt: 'Ilustración de Astro Actions y Formularios'
counterpartId: 'es/astro-actions-y-vanilla-para-formularios'
---

Una de las características que más he estado disfrutando en Astro últimamente es la API de Actions. Te permite manejar lógica del servidor (como envíos de formularios) sin necesidad de crear un backend completo o recurrir a un framework pesado.

Así es como la usé para construir un formulario de contacto que:

- Valida la entrada en el servidor con astro:schema (impulsado por zod)
- Añade validación extra del cliente + HTML para una UX más fluida
- Actualiza la UI con JavaScript vanilla usando un componente Alert de Starwind UI

---

## 🗂️ Frontmatter vs Scripts del Cliente en Astro

El frontmatter (`--- ... ---`) en un archivo Astro siempre es del lado del servidor. No puedes tocar el DOM ahí. Pero dentro del componente Astro, puedes añadir una etiqueta `<script>`, y funciona como un script clásico del navegador — con acceso completo al DOM e importaciones de módulos si es necesario.

Ese es el truco: Las Actions se ejecutan del lado del servidor, pero puedes conectar las respuestas con scripts del lado del cliente.

## Ejemplo: Formulario de Contacto en Astro

```astro
// frontmatter: solo del lado del servidor import {buttonVariants} from
'@/components/starwind/button' import {(Alert, AlertTitle, AlertDescription)} from
'@/components/starwind/alert' ---
<section>
	<!-- Formulario de Contacto -->
	<div class="max-w-xl mx-auto p-6 bg-gray-50 rounded-xl shadow">
		<h3 class="mb-4 text-2xl font-bold">Contáctanos</h3>

		<Alert id="form-status" class="mb-4 hidden" variant="success">
			<AlertTitle>Estado</AlertTitle>
			<AlertDescription>Esperando...</AlertDescription>
		</Alert>

		<form id="contact-form" method="POST" class="space-y-4">
			<input id="name" name="name" type="text" required placeholder="Tu nombre" />
			<input id="email" name="email" type="email" required placeholder="Tu email" />
			<textarea id="message" name="message" required placeholder="Tu mensaje"></textarea>

			<button type="submit" class={buttonVariants({ size: 'lg' })}>
				Enviar
			</button>
		</form>
	</div>
</section>
<script>
	import { actions } from 'astro:actions';

	const form = document.querySelector('#contact-form');
	const status = document.querySelector('#form-status');

	form?.addEventListener('submit', async (event) => {
		event.preventDefault();
		const formData = new FormData(form);
		const { error, data } = await actions.contact(formData);

		if (error) {
			status.classList.remove('hidden');
			status.querySelector('h5').textContent = 'Error';
			status.querySelector('div').textContent = error.message;
			return;
		}

		if (data) {
			status.classList.remove('hidden');
			status.querySelector('h5').textContent = 'Mensaje enviado ✅';
			status.querySelector('div').textContent = '¡Gracias! Nos pondremos en contacto pronto.';
			form.reset();
		}
	});
</script>
```

## 1️⃣ Frontmatter (Solo del Lado del Servidor)

```astro
import {buttonVariants} from '@/components/starwind/button' import{' '}
{(Alert, AlertTitle, AlertDescription)} from '@/components/starwind/alert' ---
```

Este bloque (`--- ... ---`) se ejecuta solo en el servidor en Astro.
Puedes importar componentes, utilidades o datos aquí — pero no puedes tocar el DOM.

## 2️⃣ El Marcado (HTML + Componentes)

```astro
<section>
	<!-- Formulario de Contacto -->
	<div class="max-w-xl mx-auto p-6 bg-gray-50 rounded-xl shadow">
		<h3 class="mb-4 text-2xl font-bold">Contáctanos</h3>

		<Alert id="form-status" class="mb-4 hidden" variant="success">
			<AlertTitle>Estado</AlertTitle>
			<AlertDescription>Esperando...</AlertDescription>
		</Alert>

		<form id="contact-form" method="POST" class="space-y-4">
			<input id="name" name="name" type="text" required placeholder="Tu nombre" />
			<input id="email" name="email" type="email" required placeholder="Tu email" />
			<textarea id="message" name="message" required placeholder="Tu mensaje"></textarea>

			<button type="submit" class={buttonVariants({ size: 'lg' })}>
				Enviar
			</button>
		</form>
	</div>
</section>
```

- Campos de formulario estándar: nombre, email, mensaje.
- Cada campo usa la validación incorporada de HTML (`required`, `type="email"`).
- El botón está estilizado con `buttonVariants` de Starwind UI.
- El componente Alert está oculto por defecto (`hidden`).
- Más tarde, cuando se envía el formulario, esto se actualiza dinámicamente con mensajes de éxito o error.

## 3️⃣ Script del Cliente (Manipulación del DOM)

```javascript
<script>
  import { actions } from 'astro:actions'

  const form = document.querySelector('#contact-form')
  const status = document.querySelector('#form-status')

  form?.addEventListener('submit', async (event) => {
    event.preventDefault()
    const formData = new FormData(form)
    const { error, data } = await actions.contact(formData)

    if (error) {
      status.classList.remove('hidden')
      status.querySelector('h5').textContent = 'Error'
      status.querySelector('div').textContent = error.message
      return
    }

    if (data) {
      status.classList.remove('hidden')
      status.querySelector('h5').textContent = 'Mensaje enviado ✅'
      status.querySelector('div').textContent = '¡Gracias! Nos pondremos en contacto pronto.'
      form.reset()
    }
  })
</script>
```

Este `<script>` se ejecuta en el navegador, no en el servidor.

- Astro lo trata como un script JS clásico, pero aún puedes importar módulos (actions).
- Aquí, obtenemos referencias al formulario y a la alerta de estado oculta.
- Previene el envío predeterminado del formulario (recarga de página).
- Convierte el formulario en FormData.
- Llama a la action de contacto del lado del servidor definida en Astro.
- Si hay un error de validación o del servidor, muestra la Alert con el mensaje de error.
- Si la action tiene éxito, la alerta se actualiza con un mensaje de éxito.
- Finalmente, el formulario se limpia (`form.reset()`).

## ⚠️ No Olvides SSR

Si quieres que las Actions funcionen, la página debe ser renderizada del lado del servidor (SSR). En Astro, puedes deshabilitar el pre-renderizado así:

```astro
// en la parte superior de tu página Astro export const prerender = false
```

Si estás desplegando en Vercel, Netlify o Node, tu adaptador manejará el resto.

---

## ✅ Por Qué Me Gusta Este Enfoque

- **Ligero** → Casi cero JS enviado, excepto un pequeño script para actualizaciones del DOM.
- **Seguro** → Validación fuerte con zod en el servidor + verificaciones extra en el cliente.
- **Flexible** → Funciona con la filosofía de Astro pero no fuerza un framework completo.
- **Moderno + Vieja Escuela** → Actions del servidor + DOM vanilla = lo mejor de ambos mundos.

---

## Conclusión

Las Astro Actions proporcionan un equilibrio perfecto entre funcionalidad moderna del lado del servidor e interacciones ligeras del lado del cliente. Al combinar validación del lado del servidor con JavaScript vanilla, puedes crear formularios robustos y eficientes sin la sobrecarga de frameworks pesados.

Este enfoque es particularmente poderoso para formularios de contacto, suscripciones a newsletters y otras interacciones simples donde quieres los beneficios del procesamiento del lado del servidor sin sacrificar la experiencia del usuario.
