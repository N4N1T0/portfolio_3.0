---
title: 'Checklist de SEO técnico para un sitio web nuevo'
date: 2023-07-20
dateModified: 2026-10-22
excerpt: 'Checklist de SEO técnico para un sitio nuevo: rastreo, arquitectura de la información, enlaces internos, metadatos y las auditorías que detectan regresiones.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'en/seo-optimization'
tags: ['seo', 'technical']
---

Casi todo el SEO técnico se decide antes de publicar la primera página. El mapa de URLs, las reglas de rastreo y la estructura de enlaces internos son baratos en la semana uno y caros en el mes seis. Esta es la lista que reviso en un sitio nuevo, en el orden en que la reviso.

Doy por hecho un sitio estático o renderizado en servidor, que es lo que suelo entregar, pero los principios valen para cualquier stack.

## 1. Rastreo antes que contenido

Tres archivos deciden si un buscador ve el sitio. Son lo primero que reviso cuando heredo un proyecto; las [Google Search Essentials](https://developers.google.com/search/docs/essentials) resumen las reglas que hay detrás:

- **`robots.txt`** permite todo el sitio y apunta al sitemap. No es una herramienta de seguridad: lo que bloqueas sigue siendo enlazable e indexable si otras páginas lo enlazan.
- **El sitemap** lista solo URLs canónicas. Staging, páginas de agradecimiento y listados filtrados no van ahí.
- **`noindex`** es la herramienta correcta para páginas que deben existir pero no posicionar, como resultados de búsqueda interna o áreas de cuenta.

Después verifica los canónicos. Cada página declara una URL canónica absoluta, con la misma regla de barra final que aplica el servidor. Un sitio que responde en `/blog` y `/blog/` divide sus propias señales.

## 2. El mapa de URLs va primero

Una URL es un contrato público. Cambiarla después cuesta una redirección y, durante un tiempo, posiciones.

- Slugs cortos, en minúsculas y estables: `/es/blog/redsys-nextjs-15/`, no `/es/blog/2026/03/como-integrar-la-pasarela-de-pago/`.
- Una página, una intención. Si dos URLs atacan la misma búsqueda, se fusionan y se redirige.
- Los idiomas se separan con prefijo de ruta (`/en/`, `/es/`), nunca con un parámetro ni una cookie.
- Cuando el nombre del archivo es el slug, como en las colecciones de contenido de este sitio, se trata como inmutable: renombrarlo rompe una URL indexada.

## 3. Un esquema de encabezados legible

Los buscadores usan los encabezados para entender de qué va la página. Mis reglas:

- Un solo `h1`, alineado con la intención de la página, no con el eslogan de marca.
- `h2` para las secciones de la respuesta, `h3` solo dentro de una sección.
- Ningún nivel elegido por su tamaño de fuente. El estilo va en CSS.
- Nada de acumular palabras clave en los encabezados: "Redsys con Next.js 15, parte 2" es un encabezado; "redsys nextjs pagos pasarela redsys" es ruido.

Lo mismo vale para el cuerpo. Una página que responde en los dos primeros párrafos se gana el resto de la visita; una que calienta durante 400 palabras, no.

## 4. Los enlaces internos son la palanca que controlas

El enlazado interno es la única señal de posicionamiento que depende solo de ti. Dos comprobaciones:

1. **Sin huérfanas.** Cada página debe ser alcanzable desde otra mediante un enlace seguido, no solo desde el sitemap.
2. **Profundidad menor a tres clics.** Un artículo a cuatro clics de la portada se rastrea menos y compite peor que uno equivalente más cerca.

El texto del enlace describe el destino. "Lee la checklist de SEO técnico" funciona; "haz clic aquí", no. Por eso mantengo un bloque de entradas relacionadas al final de cada post: es un enlace estructural, no decoración.

## 5. Metadatos que ganan el clic

- **Título:** entre 50 y 60 caracteres es el rango visible habitual. El término específico va delante; la marca al final, y se quita si no cabe.
- **Meta description:** entre 140 y 155 caracteres. No influye directamente en el ranking, pero decide el clic cuando el título es ambiguo.
- **Una descripción por página.** Repetir la misma en todo un catálogo es un síntoma de plantilla, no de copy.

Las imágenes necesitan lo mismo: `alt` descriptivo, `width` y `height` explícitos y formato moderno. Este sitio sirve WebP con calidad fija y nunca un PNG en bruto.

## 6. El rendimiento es presupuesto de rastreo y de ranking

Core Web Vitals son [métricas de campo medidas en sesiones reales](https://web.dev/articles/vitals) y pesan menos que la relevancia, pero una página lenta pierde al visitante antes de que eso importe. Lo que reviso en cada lanzamiento:

- **LCP** por debajo de 2,5 segundos en un móvil de gama media: casi siempre el culpable es la imagen principal.
- **CLS** por debajo de 0,1: reserva espacio para imágenes, embeds y fuentes.
- **INP** por debajo de 200 milisegundos: las tareas largas de scripts de terceros son la causa habitual.

El renderizado estático elimina buena parte de ese trabajo. Es la razón principal por la que uso Astro para sitios de contenido: [Astro 5 envía menos JavaScript por defecto](/es/blog/astro-el-futuro-del-desarrollo-web/), y menos JavaScript es una ventaja medible. Si quieres el detalle de implementación, escribí aparte sobre [diseño responsive y Core Web Vitals](/es/blog/guia-diseño-responsive/).

## 7. Datos estructurados que coinciden con la página

El schema no es un factor de ranking por sí solo. Ayuda a entender la entidad y, de vez en cuando, gana un resultado enriquecido. Añado solo lo que la página contiene de verdad:

- `BlogPosting` con `datePublished`, `dateModified`, autor e imagen en artículos.
- `BreadcrumbList` para el contexto de navegación.
- `Person` y `WebSite` a nivel de sitio.

Nada de `FAQPage`: Google retiró los resultados enriquecidos de FAQ para todos los sitios en mayo de 2026, y marcar preguntas que nadie hizo es un riesgo, no una función.

## 8. Auditar lo que se rompe

El SEO de un sitio estático se degrada en silencio. Tres hábitos lo mantienen honesto:

- Comparar el sitemap generado después de cada despliegue: una URL que desaparece es intencionada o es un bug.
- Revisar Search Console cada semana: errores de rastreo y páginas que salen del índice.
- Meter las comprobaciones en CI: títulos ausentes, descripciones ausentes y canónicos duplicados deben romper el build, no esperar a un informe.

## La checklist

1. `robots.txt` permite el sitio y apunta al sitemap.
2. El sitemap contiene solo URLs canónicas.
3. Un canónico absoluto por página y barra final coherente.
4. Slugs cortos, estables y uno por intención.
5. Un `h1` y un esquema lógico de `h2`/`h3`.
6. Cada página alcanzable en menos de tres clics.
7. Títulos de 50 a 60 caracteres, descripciones de 140 a 155.
8. Imágenes con `alt`, dimensiones y formato moderno.
9. LCP por debajo de 2,5 s, CLS por debajo de 0,1, INP por debajo de 200 ms.
10. Datos estructurados que coinciden con el contenido visible.
11. Diff del sitemap y revisión de Search Console tras cada despliegue.

Nada de esa lista es exótico. Los sitios fallan porque nadie es dueño de la comprobación entre lanzamientos. En un catálogo eCommerce la disciplina se aplica un nivel más abajo: [las páginas de producto concentran casi todo el riesgo técnico](/es/blog/8-tips-para-optimizar-ecommerce/) porque multiplican cada decisión por el número de referencias.
