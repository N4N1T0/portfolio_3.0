---
title: 'Qué cambia Astro de verdad para el SEO'
date: 2024-12-27
dateModified: 2026-10-22
excerpt: 'Astro no posiciona por sí solo. HTML estático, islas opcionales y una capa de contenido tipada son lo que recibe el crawler. Dónde gana y dónde no.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'en/astro-the-future-of-web-development'
tags: ['astro', 'performance', 'seo']
---

## Qué cambia Astro de verdad

Astro no es un rediseño de la web, y esa es la idea. Tres cambios cerraron los huecos que empujaban a un equipo de vuelta a un framework completo: contenido desde cualquier sitio, renderizado en servidor por componente y variables de entorno tipadas. Llegaron en Astro 5 y siguen definiendo el framework.

### Content Layer

Antes del Content Layer, una colección tenía que ser Markdown local o un CMS consultado a mano. Astro introdujo los [loaders](https://docs.astro.build/en/guides/content-collections/), así que una colección puede leer del sistema de ficheros, de una API de CMS o de una base de datos y seguir exponiendo la misma API `getCollection()`:

```ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		excerpt: z.string().max(160),
	}),
});
```

La ganancia práctica es la validación. El esquema se ejecuta en el build, así que un título que falta o una fecha escrita como texto rompen la compilación en lugar de la página. La API del Content Layer es además la base de lo que llegó después, incluida la capa global de contenido y las colecciones en vivo.

### Server islands

Astro siempre ha renderizado páginas estáticas e hidratado solo las islas interactivas. Las server islands llevan la idea al servidor: un componente se puede renderizar bajo demanda, después del shell estático, y enviarse en streaming dentro de la página.

Encaja en un caso concreto y frecuente: un precio, un contador de stock o un bloque de "sesión iniciada como" que debe estar fresco, dentro de una página que por lo demás se puede cachear. El shell estático llega al navegador de inmediato y el fragmento dinámico se rellena después.

No sustituye al SSR de página completa. Un panel donde cada bloque depende de la sesión sigue siendo una aplicación renderizada en servidor; envolver cada bloque en una server island solo añade latencia.

### `astro:env`

Las variables de entorno pasaron de `import.meta.env` repartido por el código, sin validación, a un esquema declarado:

```ts
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
	env: {
		schema: {
			PUBLIC_SITE_URL: envField.string({ context: 'client', access: 'public' }),
			REDSYS_SECRET: envField.string({ context: 'server', access: 'secret' }),
		},
	},
});
```

Importar un secreto en código de cliente ahora falla en el build, que es justo el error que antes llegaba a producción.

## La pregunta del SEO

Astro no posiciona mejor por ser Astro. Posiciona por lo que entrega al crawler: HTML completo, ningún framework bloqueando el render y páginas pequeñas. Las ventajas son concretas:

- **El contenido está en el HTML.** Una página estática llega con todo el texto. Googlebot ejecuta JavaScript, pero lo hace con presupuesto; una página que no necesita ejecución se indexa antes y con menos sorpresas.
- **El JavaScript es opcional.** Un post con una isla interactiva envía la isla, no la aplicación entera. Menos script significa mejor Interaction to Next Paint, que es un Core Web Vital.
- **El HTML es la fuente.** No hay desajustes de hidratación ni un `<div id="root">` vacío esperando un bundle.

Lo que Astro no arregla solo: imágenes sin dimensiones, fuentes que bloquean el primer pintado o una página cuyo contenido no responde a nada. Eso son problemas de contenido y de Core Web Vitals, no de framework. La parte on-page la cubro en [optimización SEO](/es/blog/optimizacion-seo/).

## Cuándo una SPA sigue siendo la decisión correcta

El enfoque estático encaja mal cuando la página es la aplicación. Si toda la pantalla depende del usuario conectado, se actualiza cada pocos segundos y no tiene nada útil que pre-renderizar, el shell estático es sobre todo un estado de carga. Una aplicación renderizada en cliente detrás de autenticación es más simple de razonar.

Astro cubre ese caso con SSR y server islands, pero es un punto intermedio. Elígelo cuando la página tenga un núcleo público y cacheable y un borde dinámico pequeño. Elige una SPA cuando casi cada píxel es dinámico.

## Actualizar desde Astro 4

Si vienes de Astro 4, los errores son bastante honestos y cada uno apunta a un cambio real:

1. **Las colecciones pasan a loaders.** Las entradas con `type: 'content'` se sustituyen por loaders `glob()` o `file()`, y `entry.slug` pasa a ser `entry.id`. Las plantillas que usaban `slug` hay que tocarlas.
2. **`entry.render()` desaparece.** Se renderiza con `render(entry)` importado de `astro:content`, que además devuelve `Content` y `headings` para el layout.
3. **Los modos de salida se simplifican.** `hybrid` desaparece; la salida estática con `prerender = false` por ruta cubre el mismo caso.
4. **`astro:env` necesita esquema.** Las variables existentes siguen funcionando con `import.meta.env`, pero la API tipada exige declararlas.

Ninguno es cosmético: cada uno sustituye un comportamiento implícito por uno explícito, y por eso la migración suele dejar una capa de contenido más limpia.

## Cómo lo uso aquí

Este sitio es un build estático de Astro: colecciones para posts y proyectos, islas de Preact solo donde hay estado y un prompt de terminal que es el único componente pesado en cliente. El resultado es un build que genera HTML plano por ruta y envía script para una isla, no para el sitio.

Si estás comparando Astro con una SPA para un producto con mucho contenido, [cuéntame el proyecto](/es/about/) y te digo qué partes deben quedarse estáticas. Si tus formularios necesitan trabajo en servidor, [Astro Actions con formularios vanilla](/es/blog/astro-actions-y-vanilla-para-formularios/) cubre el patrón sin framework de cliente.
