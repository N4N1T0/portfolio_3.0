---
title: 'Extraer productos a Sanity CMS con Cheerio y cron'
date: 2025-03-06
dateModified: 2026-10-22
excerpt: 'Pasar un catálogo de WordPress a Sanity CMS: scrapear fichas con Cheerio, validar y enriquecer los datos y mantener la sincronización con cron.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'en/automate-product-imports-ecommerce-sanity-cheerio'
tags: ['ecommerce', 'sanity', 'scraping', 'automation']
---

## Introducción

Construir **sitios web de comercio electrónico** siempre ha sido un desafío emocionante para mí, especialmente en proyectos de alto impacto como la venta de cosméticos de una marca reconocida. Recientemente me encargaron una tienda en línea para un cliente distribuidor oficial de una marca de cosméticos. El proyecto parecía sencillo al principio, pero **había un giro inesperado**: necesitaba automatizar la importación de productos directamente en **Sanity CMS** desde un sitio externo basado en **WordPress**.

Habiendo trabajado en muchos sitios de e-commerce, siempre he abrazado nuevos desafíos, pero este era único. Con un sitio fuente construido en WordPress y una **API pública** disponible, vi una oportunidad para crear un proceso de automatización que ahorraría mucho tiempo y esfuerzo al cliente. En esta publicación, te explicaré cómo abordé esta tarea, las herramientas que utilicé y cómo construí un sistema automatizado de importación de productos eficiente, escalable y de bajo mantenimiento.

## Extrayendo los datos

Para comenzar, necesitaba recopilar toda la información de los productos desde el sitio fuente. Como estaba basado en WordPress y tenía una API pública expuesta (atención a esto), podía obtener los nombres y enlaces de los productos. A primera vista, parecía una tarea fácil: simplemente podría usar un bucle con parámetros de búsqueda como `per_page` y `page` para paginar a través de todas las listas de productos.

```javascript
const API_URL = 'https://example.com/wp-json/wp/v2/products';

async function fetchAllProductLinks() {
	let allProductDetails = [];
	let page = 1;
	let products = [];

	try {
		do {
			const response = await fetch(`${API_URL}?per_page=20&page=${page}`);
			products = response.data;
			allProductDetails = allProductDetails.concat(
				products.map((product) => ({
					link: product.link,
					name: product.name,
				})),
			);
			page++;
		} while (products.length > 0);

		return allProductDetails;
	} catch (error) {
		console.error('Error obteniendo enlaces y nombres de productos:', error);
	}
}
```

Con este código, pude recopilar fácilmente todos los enlaces de productos. Pero el verdadero trabajo comenzó cuando necesite extraer información detallada de cada página de producto individual. Aquí es donde **Cheerio** entró en juego.

Cheerio es una biblioteca rápida y liviana que imita jQuery, lo que la hace perfecta para extraer contenido HTML de una página. La usé para cargar cada página de producto y extraer detalles clave, como el nombre del producto, descripción, imágenes y más.

```javascript
const cheerio = require('cheerio');

async function scrapeProductDetails(url) {
	try {
		const { data } = await fetch(`https://your-proxy.example.com/` + url);
		const $ = cheerio.load(data);

		const productName = $('h1').text();
		const productDescription = $('meta[name="description"]').attr('content');
		const productImage = $('img.product-image').attr('src');

		return { productName, productDescription, productImage };
	} catch (error) {
		console.error('Error extrayendo detalles del producto:', error);
	}
}
```

En este punto tenía la mayor parte de los detalles, pero me encontré con **errores de CORS** al ejecutar el mismo código dentro de Sanity Studio, que corre en el navegador. CORS es una política del navegador: un proceso de Node que hace la misma petición no se ve afectado. En su momento pasé esas llamadas por un proxy público `cors-anywhere`. Hoy no lo usaría: es un tercero que ve todas las peticiones y no es fiable. Monta tu propio proxy o deja el scraping en el proceso de ingesta y haz que el Studio dispare ese proceso en lugar de ir al sitio origen.

## Validación y enriquecimiento

Faltaba una pieza crucial: **el precio**. El cliente me proporcionó un PDF con los precios de distribuidor, así que necesitaba cruzar esa información con los datos extraídos.

Aquí recurrí a **ChatGPT** para ayudarme a extraer los detalles necesarios del PDF. Con un poco de **ingeniería de prompts** (pronto escribiré un artículo sobre esto), pude crear un proceso que extraía automáticamente los nombres de los productos, códigos de referencia y precios del PDF.

## Integración con Sanity CMS

Con los datos validados y enriquecidos, era el momento de cargarlos en **Sanity CMS**. Utilicé el método `.createIfNotExists()` del cliente de Sanity para crear registros de productos sólo si no existían previamente. Esto me ayudó a evitar duplicados y asegurarme de que siempre trabajaba con la información más actualizada.

```javascript
const sanityClient = require('@sanity/client');

const client = sanityClient({
	projectId: 'your-project-id',
	dataset: 'production',
	token: 'your-token',
	useCdn: true,
});

async function createProductInSanity(product) {
	try {
		await client.createIfNotExists({
			name: product.name,
			productDescription: product.description,
			productImage: product.image,
		});
	} catch (error) {
		console.error('Error creando producto en Sanity:', error);
	}
}
```

Para evitar sobrecargar el servidor con demasiadas solicitudes, utilicé **p-limit**, una pequeña biblioteca que limita el número de promesas concurrentes, asegurando que no alcanzara los límites de peticiones.

```javascript
const pLimit = require('p-limit');
const limit = pLimit(5);

const productPromises = products.map((product) => limit(() => createProductInSanity(product)));

await Promise.all(productPromises);
```

## Acciones en Sanity Studio

Para que el cliente pudiera gestionar el catálogo sin tocar código, añadí una acción de documento que relanza el scraping desde la propia ficha del producto:

```javascript
export function findInfo(context) {
	const client = context.getClient({ apiVersion: '2022-11-29' });

	const asyncFindInfo = (props) => {
		const { published, draft } = props;
		const slug = draft ? draft.slug : published ? published.slug : null;

		return {
			label: 'Buscar información',
			onHandle: async () => {
				try {
					if (!slug) {
						toast.error('El producto necesita un slug');
						return;
					}

					const product = await fetch(
						`https://your-proxy.example.com/https://source-store.example.com/${slug.current}/`,
					);

					await createProductInSanity(product);
				} catch (error) {
					toast.error('Error en el proceso de scraping');
				}
			},
		};
	};

	return asyncFindInfo;
}
```

Y se registra en la configuración del Studio:

```javascript
export default defineConfig({
	document: {
		actions: (prev, context) =>
			context.schemaType === 'product' ? [...prev, findInfo(context)] : prev,
	},
});
```

## Automatización

Para asegurarme de que el catálogo estuviera siempre actualizado, configuré un **cron job** que se ejecuta diariamente a las 00:01, cuando el servidor está ocioso.

```javascript
const cron = require('node-cron');
cron.schedule('0 1 * * *', async () => {
	console.log('Ejecutando proceso de actualización de productos...');
});
```

También añadí **notificaciones por correo** con Resend para avisar al cliente cada vez que entraban productos nuevos, sin que tuviera que revisar el catálogo a mano.

## Conclusión

Este proyecto demostró cómo la automatización y las integraciones inteligentes pueden mejorar la gestión de productos en e-commerce. Al combinar Cheerio para el scraping, Sanity CMS para la gestión de contenido y un proxy propio para las llamadas desde el navegador, el catálogo se mantiene actualizado sin intervención manual.

El siguiente paso natural fue llevar esos productos a Google: [automatizar el feed de Merchant Center con Node.js](/es/blog/automatiza-tu-feed-google-merchant-nodejs/) usa la misma fuente de datos. Y una vez que el catálogo está limpio, lo que decide la venta es la ficha: [ocho ajustes en la página de producto](/es/blog/8-tips-para-optimizar-ecommerce/).
