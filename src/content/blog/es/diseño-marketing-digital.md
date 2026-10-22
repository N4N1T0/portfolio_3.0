---
title: 'Diseño gráfico para marketing digital: qué importa de verdad'
date: 2023-08-17
dateModified: 2026-10-22
excerpt: 'Identidad visual, formatos por canal y peso de las imágenes: las decisiones de diseño gráfico que afectan a la atención, la confianza y la velocidad.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'en/graphic-design-digital-marketing'
tags: ['design', 'marketing']
---

Casi todo el consejo de diseño gráfico para marketing se queda en "usa colores coherentes e imágenes de calidad". Es verdad y es casi inútil, porque no dice qué decisión mueve un número. Después de suficientes landing pages y lanzamientos, lo he reducido a cuatro: coherencia bajo presión, formato por canal, peso de la imagen y si el diseño sobrevive a ser leído.

## La coherencia es un sistema, no un mood board

Una guía de marca que vive en un PDF que nadie abre no sobrevive a una fecha límite. Lo que sobrevive es un conjunto pequeño de tokens que el equipo usa de verdad:

- Dos tamaños de titular y uno de cuerpo, con alturas de línea definidas.
- Una paleta con roles: fondo, texto, acento, feedback. No "azul 300", sino "enlace".
- Una escala de espaciado, para que cada sección tenga el mismo ritmo en todas las páginas.
- Un tratamiento de imagen: proporción de recorte, radio de esquina, overlay. La misma foto de producto no puede ser cuadrada en una página y circular en otra.

La prueba es la fricción. Si un desarrollador necesita inventarse un color para construir una sección nueva, el sistema está incompleto. Los design tokens en código son la versión de la guía de marca que se usa, porque el camino de menor resistencia es el que llega a producción.

## Usa el formato que el canal premia

El mismo mensaje necesita piezas distintas por canal, y reciclar una sola imagen en todos lados es la forma más común de que una campaña parezca amateur:

- **Vertical 9:16** para stories y reels. Importan las zonas seguras: la interfaz de la plataforma tapa arriba y abajo.
- **1:1 o 4:5** para feed. 4:5 ocupa más alto en un móvil, y casi siempre compensa el recorte.
- **16:9** para miniaturas de vídeo y huecos de héroe en escritorio.
- **Open Graph 1200×630** para previews de enlace. Si lo olvidas, cada vez que alguien comparte tu página se ve rota.

Meter texto dentro de la imagen es una decisión aparte. Garantiza el layout y también significa que el texto es invisible para lectores de pantalla y no se puede traducir. Para cualquier cosa que lleve significado, compón el texto sobre la imagen. Para un eslogan corto de campaña, la imagen vale si las mismas palabras están en la página y en el copy del post.

## El peso de la imagen es una decisión de diseño

Una imagen principal exportada a 4000 px no es mejor imagen. Es una página más lenta, y quien la eligió tomó una decisión de diseño con un coste de rendimiento.

Las reglas que uso:

- Exporta al tamaño máximo que muestra el layout y genera variantes menores. Nunca reescales hacia arriba.
- WebP con calidad 80 a 85 es la base para fotografía. Las capturas e interfaces comprimen mejor en WebP o PNG según la cantidad de color plano.
- Mantén la imagen principal por debajo de unos 200 KB si carga primero. Por debajo del pliegue, en diferido.
- Define siempre `width` y `height`. Una imagen sin dimensiones es un layout shift esperando a pasar.

Aquí es donde diseño gráfico e ingeniería dejan de ser trabajos separados. Una imagen principal preciosa que retrasa el LCP un segundo pierde más de lo que gana: el mismo argumento que desarrollo en [diseño responsive y Core Web Vitals](/es/blog/guia-diseño-responsive/) y la razón por la que este sitio solo sirve WebP.

## Diseña para escanear, no para admirar

Las páginas de marketing se leen con prisa. El diseño tiene que hacer encontrable el mensaje:

- **Una idea por pantalla.** Si una sección dice tres cosas, no dice ninguna.
- **Contraste que cumple.** Texto de cuerpo a 4,5:1 sobre su fondo es un requisito WCAG, no una preferencia estética.
- **Jerarquía antes que decoración.** Tamaño, peso y espacio hacen más trabajo que sombras y degradados.
- **Contenido real en el mockup.** El lorem ipsum esconde el fallo: un titular que ocupa cuatro líneas en alemán o un nombre de producto que rompe la rejilla.

Reviso un layout entornando los ojos. Si la jerarquía desaparece cuando se difuminan los detalles, nunca hubo jerarquía.

## El alt text forma parte del brief

Toda imagen que lleva información necesita una descripción, y quien la conoce es la persona que la diseñó. `alt="foto de producto"` es ruido; `alt="chaqueta impermeable doblada, vista lateral"` es información. Las imágenes decorativas llevan `alt` vacío, que no es lo mismo que no llevarlo. El [tutorial de imágenes de la W3C](https://www.w3.org/WAI/tutorials/images/) cubre los casos que no son obvios.

Importa dos veces: para quien usa lector de pantalla y para la búsqueda de imágenes. El resto del trabajo on-page está en la [checklist de SEO técnico](/es/blog/optimizacion-seo/).

## Qué quitaría

Tres cosas cuestan más de lo que devuelven:

1. **Fotos de stock de gente señalando un portátil.** Dicen "no teníamos imagen" y suman peso.
2. **Carruseles.** Esconden contenido detrás de una interacción y casi nadie pasa de la primera diapositiva.
3. **Texto incrustado en un héroe gráfico.** No se traduce, no se indexa y no se lee en voz alta.

El diseño que convierte suele ser más silencioso que el que gana premios, y siempre es más barato de mantener. El mensaje es otra disciplina: [narrativa de marca para webs](/es/blog/estrategias-narrativas/) cubre cómo decidir qué está diciendo el diseño.
