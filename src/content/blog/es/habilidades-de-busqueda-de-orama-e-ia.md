---
title: 'Búsqueda de producto con IA en eCommerce: Orama y OpenAI'
date: 2025-05-19
dateModified: 2026-10-22
excerpt: 'Cómo la búsqueda híbrida con Orama y embeddings de OpenAI cambió el descubrimiento de producto en una tienda de pádel: indexado, fallbacks y mejoras de CRO.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'en/search-capabilities-and-ai'
tags: ['ecommerce', 'search', 'ai']
---

## El reto: UX que convierte en un eCommerce de nicho

Nuestro cliente gestiona una tienda online de camisetas personalizadas de pádel. Su objetivo era:

- Búsquedas más rápidas y relevantes
- Personalizar la experiencia en los resultados vacíos
- Preparar la integración futura de un chatbot con IA

No se trataba solo de mejorar la búsqueda: era cuestión de hacer que una UX inteligente formara parte de la optimización de la tasa de conversión (CRO).

## La tecnología: Orama.search + OpenAI + Sanity

Elegimos Orama.search por su:

- Arquitectura ligera y velocidad
- Soporte nativo para búsqueda vectorial (con embeddings de OpenAI)
- API pensada para desarrolladores (actualizable por REST, CLI o SDKs)

Nos permitió ir más allá de la búsqueda tradicional e implementar lógica tipo answer engine, automatizaciones y resultados personalizados, todo manteniendo una estructura 100% headless.

## Actualización dinámica de productos (Sanity + cron + GROQ)

En lugar de sincronizar manualmente los productos con la base de datos vectorial, automatizamos el proceso con un cron job y una consulta GROQ a Sanity CMS.

```ts
// /api/update-orama-db.ts

const manager = new CloudManager({
	api_key: process.env.ORAMA_PRIVATE_API_KEY!,
});
const indexManager = manager.index('xxxxxxxxxxxxxxxxx'); // sustituye por el id de tu índice

export const GET = async () => {
	try {
		const products = await sanityClientRead.fetch(
			GET_ORAMA_PRODUCTS_FOR_UPDATING, // Consulta GROQ de Sanity
		);

		await indexManager.update(products);
		await indexManager.deploy();

		return NextResponse.json('OK', { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: 'An error occurred', details: error }, { status: 500 });
	}
};
```

_Extra: la plataforma también puede alimentar el índice desde un CSV o un scraping puntual._

---

## La página de búsqueda: UX y relevancia

Aquí un ejemplo de cómo usamos Orama para ofrecer una búsqueda inteligente con alternativas:

```ts
const { search } = await searchParams; // Next.js 15 searchParams

const oramaResponse = await oramaClient.search({
	term: search as string,
	mode: 'hybrid',
});

if (!oramaResponse) {
	log.error('Products not found', { oramaResponse });
}
```

_Bonus: Esta misma idea se usa en la pagina personalizada de 404 para buscar productos relacionados_

---

Además, aprovechamos el historial de navegación y los productos en la wishlist para:

- Priorizar productos vistos recientemente
- Insertar llamadas a la acción inteligentes dentro de los resultados
- Sugerir packs relevantes para impulsar compras rápidas

## Técnicas de CRO implementadas

Al combinar búsqueda potenciada por IA con UX inteligente, conseguimos:

- **Páginas de 404 y de búsqueda vacía personalizadas** que sugieren productos reales en vez de un callejón sin salida
- **Carruseles inteligentes basados en la wishlist** en fichas de producto y carrito
- **Corrección de errores de escritura en slugs de producto**, para que un typo lleve al producto correcto y no a un 404
- **Reordenamiento de resultados** según comportamiento previo, no solo coincidencia de texto

> Estas micro-mejoras redujeron la tasa de rebote y empujaron más sesiones hacia el flujo de compra.

## Qué medimos

El trabajo de búsqueda es fácil de discutir y difícil de demostrar, así que seguimos cuatro números antes y después:

- **Tasa de salida en búsqueda**: sesiones que abandonan desde la página de resultados sin ver un producto.
- **Tasa de cero resultados**: consultas sin resultados, agrupadas por término para detectar huecos de catálogo o sinónimos.
- **Clic de búsqueda a producto**: con qué frecuencia una lista de resultados produce una visita a ficha de producto.
- **Conversión de sesiones con búsqueda** frente a la media del sitio.

La lista de cero resultados fue el informe más útil. La mitad de las consultas eran plurales, typos o sinónimos que el índice no conocía: un problema de datos, no del motor. Arreglar el índice rindió más que cambiar de motor.

Más sobre la tienda: [8 consejos para optimizar tu eCommerce](/es/blog/8-tips-para-optimizar-ecommerce/).

---

## ¿Por qué Orama y no Meilisearch, Typesense o Algolia?

- Es open source, ligera y **económica**
- Soporte nativo para **búsqueda vectorial y embeddings de OpenAI**
- REST, CLI y SDKs integrados para automatizar flujos
- Diseñada para developers con configuración instantánea en local

Nos dio flexibilidad **potenciada por IA sin los dolores de cabeza de los precios SaaS**.

---

## ¿Qué viene después? Integración con un chatbot

La siguiente fase del proyecto será conectar Orama con OpenAI para crear un asistente virtual dentro del sitio. Este:

- Guiará a los usuarios por chat hacia los productos más adecuados
- Consultará datos en tiempo real del índice de búsqueda
- Responderá preguntas sobre la wishlist o productos concretos

Con el motor de respuestas y los embeddings ya en marcha, será una evolución natural.

---

## ¿Quieres construir algo así?

Ayudo a marcas de eCommerce a implementar UX inteligentes con stacks modernos: desde buscadores y chatbots hasta CRO y arquitecturas headless.

[Cuéntame](/es/about/) | [Mis Proyectos](/es/projects/)
