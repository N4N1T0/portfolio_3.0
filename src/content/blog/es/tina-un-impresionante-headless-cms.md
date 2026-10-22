---
title: 'TinaCMS: un CMS headless con control de versiones en Git'
date: 2025-01-25
dateModified: 2026-10-22
excerpt: 'TinaCMS guarda el contenido como Markdown y JSON en Git, con edición en vivo encima. Cómo funciona, cuándo encaja y qué implica montarlo de verdad.'
author: 'Adrián'
counterpartId: 'en/tina-an-awesome-headless-cms'
tags: ['cms', 'tina', 'headless']
---

Casi todos los CMS headless se llevan tu contenido a su base de datos. TinaCMS hace lo contrario: el contenido sigue siendo Markdown y JSON en tu repositorio, y Tina añade una interfaz de edición encima de esos archivos. Para un desarrollador eso significa que el modelo de contenido pasa por revisión de código, el historial es `git log` y no hay exportación si algún día te vas.

Ese intercambio es excelente para algunos proyectos y equivocado para otros. Esto es lo que implica el montaje y dónde deja de ser buena idea.

## El modelo: archivos en Git, interfaz encima

Tina tiene tres piezas:

- **Un esquema** definido en `tina/config.ts`, con colecciones y campos.
- **Una interfaz de administración** servida en `/admin`, generada desde ese esquema.
- **Un adaptador** que lee y escribe los archivos. En desarrollo local escribe en tu copia de trabajo. Para editores, lo habitual es Tina Cloud, que hace commit a una rama y abre un pull request.

El frontend sigue leyendo archivos planos en el build, igual que antes de que existiera Tina. Esa es la parte que conviene entender: Tina es una capa de edición, no una dependencia en tiempo de ejecución del sitio público.

## El montaje

La instalación actual empieza por la CLI, no por paquetes instalados a mano:

```sh
npx @tinacms/cli@latest init
```

El comando añade `tinacms` y `@tinacms/cli`, crea `tina/config.ts`, registra la ruta `/admin` y un paso de build. Una colección mínima queda así:

```ts
import { defineConfig } from 'tinacms';

export default defineConfig({
	branch: process.env.GITHUB_BRANCH ?? 'main',
	clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
	token: process.env.TINA_TOKEN,
	build: {
		outputFolder: 'admin',
		publicFolder: 'public',
	},
	schema: {
		collections: [
			{
				name: 'post',
				label: 'Posts',
				path: 'content/posts',
				format: 'md',
				fields: [
					{ type: 'string', name: 'title', label: 'Título', isTitle: true, required: true },
					{ type: 'datetime', name: 'date', label: 'Fecha', required: true },
					{ type: 'rich-text', name: 'body', label: 'Cuerpo', isBody: true },
				],
			},
		],
	},
});
```

Después arrancas el servidor de desarrollo y abres `/admin`. En local, guardar escribe el archivo Markdown en tu copia de trabajo al momento.

## La edición en vivo tiene un coste real

La función que todo el mundo recuerda es la edición visual: el panel al lado de la página renderizada y una cabecera que abre su campo al hacer clic. Es genuinamente útil en páginas de marketing, donde quien edita piensa en secciones y no en campos.

Es menos útil de lo que parece para contenido con estructura. Un artículo con bloques de código, tablas y componentes anidados se edita más rápido en un editor con soporte de Markdown que en una vista previa al lado. Y la edición visual obliga a envolver componentes para que Tina los mapee a campos, lo que añade código al frontend que no tiene nada que ver con el trabajo del sitio.

## Cuándo encaja

- Contenido que vive junto al código y pasa por el mismo proceso de revisión.
- Un equipo pequeño donde desarrollo y edición están en el mismo repositorio.
- Sitios que deben seguir funcionando sin un servicio de CMS: los archivos son la fuente de verdad, así que un build desde un clon está completo.
- Documentación y páginas de marketing dentro de un Next.js o Astro existente.

## Cuándo no

- **Un equipo editorial grande.** Quien no es técnico necesita cuentas, roles y una administración alojada. Eso implica Tina Cloud o autohospedar el backend, y en ese punto ya estás pagando y operando un CMS.
- **Miles de documentos.** Un repositorio Git no es un motor de consultas. Cada cambio de contenido es un commit y un rebuild, y el tiempo de build crece con el contenido.
- **Flujos con publicación programada y aprobaciones.** Algo se puede montar, pero no es el centro de gravedad del producto.

La regla que uso: si el contenido está más cerca del código que de una redacción, Tina encaja. Si un equipo de diez personas publica a diario, usa un CMS con base de datos y deja el repositorio para el código.

## Avisos prácticos

- Cada guardado es un commit. Sin disciplina, el historial se convierte en ruido: mensajes claros o una rama por cambio.
- El esquema es TypeScript, así que cambiar el esquema es cambiar código. Es bueno para la coherencia y molesto cuando alguien quiere un campo nuevo en mitad de una campaña.
- Los archivos multimedia pueden vivir en el repositorio o en un almacenamiento externo. Con más de un puñado de imágenes, usa almacenamiento externo: Git no está hecho para binarios.
- Mantén `tina-lock.json` en el control de versiones. Fija el esquema contra el que se construyó la administración.

## ¿Merece la pena?

Si la alternativa es "el cliente manda los cambios por correo al desarrollador", Tina elimina un cuello de botella real sin añadir un servicio al camino crítico del sitio. Si la alternativa es un CMS maduro con roles, programación y flujo editorial, Tina es un paso atrás para quien más lo usa.

Para sitios con mucho contenido y un framework moderno, el mismo razonamiento sobre salida estática y rendimiento está en [Astro 5 y Core Web Vitals](/es/blog/astro-el-futuro-del-desarrollo-web/). Y cuando el contenido es un catálogo de producto en lugar de artículos, las restricciones son otras: [importar productos a Sanity](/es/blog/como-extraer-productos-para-un-ecommerce-con-sanity-cms-y-cheerio/) cubre ese caso.
