---
title: 'Búsqueda e IA: El Dúo Imbatible para Aumentar Ingresos en eCommerce'
date: 2025-05-19
excerpt: 'Descubre cómo integrar Orama.search con embeddings de OpenAI transformó la experiencia de búsqueda y la conversión'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'en/search-capabilities-and-ai'
---

## 🧩 El Reto: UX que Convierte en un eCommerce de Nicho

- Nuestro cliente gestiona una tienda online de camisetas personalizadas de pádel. Su objetivo era:
- Búsquedas más rápidas y relevantes
- Personalizar la experiencia en los resultados vacíos
- Preparar la integración futura de un chatbot con IA

No se trataba solo de mejorar la búsqueda: era cuestión de hacer que una UX inteligente formara parte de la optimización de la tasa de conversión (CRO).

## 🚀 La Tecnología: Orama.search + OpenAI + Sanity

Elegimos Orama.search por su:

- Arquitectura ligera y velocidad
- Soporte nativo para búsqueda vectorial (con embeddings de OpenAI)
- API pensada para desarrolladores (actualizable por REST, CLI o SDKs)

Nos permitió ir más allá de la búsqueda tradicional e implementar lógica tipo answer engine, automatizaciones y resultados personalizados, todo manteniendo una estructura 100% headless.

## 🔄 Actualización Dinámica de Productos (Sanity + Cron + GROQ)

En lugar de sincronizar manualmente los productos con la base de datos vectorial, automatizamos el proceso con un cron job y una consulta GROQ a Sanity CMS.

```ts
// /api/update-orama-db.ts

const manager = new CloudManager({
	api_key: process.env.ORAMA_PRIVATE_API_KEY!,
});
const indexManager = manager.index('xxxxxxxxxxxxxxxxx'); // Remplace con tu ID de índice

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

💡 _Bonus: La plataforma puede obtener information a través de un csv o un web scrapping._

---

## 🔍 La Página de Búsqueda: UX Inteligente y Relevancia

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

💡 _Bonus: Esta misma idea se usa en la pagina personalizada de 404 para buscar productos relacionados_

---

Además, aprovechamos el historial de navegación y los productos en la wishlist para:

- Priorizar productos vistos recientemente
- Insertar llamadas a la acción inteligentes dentro de los resultados
- Sugerir packs relevantes para impulsar compras rápidas

## 🎯 Técnicas de CRO Implementadas

Al combinar búsqueda potenciada por IA con UX inteligente, conseguimos:

✅ **Páginas de búsqueda vacías personalizadas**
✅ **Carruseles inteligentes basados en la wishlist**
✅ **Gestión de errores de escritura en los slugs de producto**
✅ **Reordenamiento de resultados según comportamiento del usuario**

> Estas micro-mejoras redujeron la tasa de rebote y empujaron más sesiones hacia el flujo de compra.

---

## 🧠 ¿Por Qué Elegimos Orama en Lugar de Meilisearch, Typesense o Algolia?

- Es open source, ligera y **económica**
- Soporte nativo para **búsqueda vectorial y embeddings de OpenAI**
- REST, CLI y SDKs integrados para automatizar flujos
- Diseñada para developers con configuración instantánea en local

Nos dio flexibilidad **potenciada por IA sin los dolores de cabeza de los precios SaaS**.

---

## 🔮 ¿Qué Viene Después? Integración con Chatbot de IA

La siguiente fase del proyecto será conectar Orama con OpenAI para crear un asistente virtual dentro del sitio. Este:

- Guiará a los usuarios por chat hacia los productos más adecuados
- Consultará datos en tiempo real del índice de búsqueda
- Responderá preguntas sobre la wishlist o productos concretos

Con el motor de respuestas y los embeddings ya en marcha, será una evolución natural.

---

## 💼 ¿Quieres Construir Algo Así?

Ayudo a marcas de eCommerce a implementar UX inteligentes con stacks modernos: desde buscadores y chatbots hasta CRO y arquitecturas headless.

👉 [Cuéntame](https://www.adrian-alvarez.dev/en/contact) | [Mis Proyectos](https://www.adrian-alvarez.dev/en/projects)
