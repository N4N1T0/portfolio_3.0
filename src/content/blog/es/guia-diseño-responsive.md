---
title: 'Diseño responsive y Core Web Vitals: guía práctica'
date: 2023-06-19
dateModified: 2026-10-22
excerpt: 'El diseño responsive es un presupuesto de rendimiento, no una lista de breakpoints: layout mobile-first, estrategia de imágenes y cómo mueve LCP y CLS.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'en/responsive-design-guide'
tags: ['design', 'performance', 'seo']
---

El diseño responsive se enseña como una lista de breakpoints. Esa idea produce sitios que se reordenan bien y siguen sintiéndose rotos: imágenes que saltan al cargar, texto que obliga a hacer zoom, un menú que tapa la página. La definición útil es más estricta. Un sitio responsive mantiene su layout, sus imágenes y su interacción en cualquier ancho que reporte un dispositivo real, sin pagarlo en rendimiento.

Esa definición tiene consecuencias, y casi todas se pueden medir.

## Empieza en 320 píxeles, no en 1440

Casi todas las revisiones de diseño ocurren en una pantalla grande, así que el caso más pequeño se diseña al final y se prueba menos. Yo lo hago al revés:

- Diseño primero el layout estrecho, a 320 px. Es casi el suelo del parque actual de dispositivos.
- Añado complejidad a medida que el ancho lo permite, un breakpoint cada vez.
- Pongo los breakpoints donde se rompe el contenido, no donde un catálogo dice que está un dispositivo.

Ese último punto es el que sobrevive a los rediseños. Un iPhone 12 y un Galaxy S21 no necesitan layouts distintos; una navegación que ya no cabe a 900 px, sí.

## Mide las tres métricas que importan

Los [Core Web Vitals](https://web.dev/articles/vitals) son métricas de campo, medidas en sesiones reales. Tres números describen casi todos los fallos de responsive:

| Métrica | Bien            | Qué la rompe en móvil                                                   |
| ------- | --------------- | ----------------------------------------------------------------------- |
| LCP     | menos de 2,5 s  | imagen principal, fuentes web, contenido renderizado en cliente         |
| CLS     | menos de 0,1    | imágenes sin dimensiones, banners tardíos, barras de cookies inyectadas |
| INP     | menos de 200 ms | tareas largas de JavaScript, scripts de terceros, hidratación           |

Un layout responsive que sirve una imagen principal de 2 MB a un móvil con 4G falla LCP por limpio que sea el CSS. Layout y peso son el mismo problema.

## Las imágenes se llevan casi todo el presupuesto

Las imágenes son la petición más grande en la mayoría de páginas de contenido. El orden de operaciones es:

1. Formato moderno. WebP es la base práctica; AVIF pesa menos pero tarda más en codificar.
2. Varios anchos y que el navegador elija con `srcset` y `sizes`.
3. `width` y `height` en cada imagen, o una proporción en CSS. Es el arreglo de CLS más barato que existe.
4. `loading="lazy"` solo por debajo del pliegue. Cargar la imagen principal en diferido retrasa LCP a propósito.

```html
<img
	src="/hero-800.webp"
	srcset="/hero-480.webp 480w, /hero-800.webp 800w, /hero-1600.webp 1600w"
	sizes="(min-width: 768px) 50vw, 100vw"
	width="1600"
	height="900"
	alt="Resumen del checkout en un móvil"
/>
```

En este sitio cada imagen se convierte una vez a WebP con calidad 85. El build no emite PNG, porque una captura de 3 MB de una interfaz no compensa la fidelidad.

## Tipografía y áreas táctiles

Dos detalles separan una página que funciona en un móvil de una que solo encaja:

- **Texto de cuerpo a 16 px o más.** Menos que eso dispara el zoom en iOS, y el zoom rompe la suposición de viewport sobre la que se diseñó el layout.
- **Objetivos táctiles de al menos 44 por 44 px.** Una fila de botones de 24 px es inusable con el pulgar aunque en la captura quede ordenada.

La longitud de línea también cuenta. Un párrafo de 110 caracteres en escritorio se lee mal; limita la medida a 65 o 75 caracteres y deja la columna estrecha en anchos grandes.

## Container queries y cuándo son la herramienta equivocada

Las media queries miden el viewport. Eso es correcto para una página y equivocado para un componente dentro de un panel redimensionable. Si construyes un preview o un dashboard donde una tarjeta puede ser estrecha mientras la ventana es ancha, las media queries te mienten y el componente desborda en un contenedor con espacio de sobra.

Las [container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) resuelven ese caso. No sustituyen a las media queries: un layout de página sigue respondiendo al viewport. Aprendí la distinción a la mala mientras [escribía cada componente dos veces](/es/blog/escribir-cada-componente-dos-veces/) para un registro con preview redimensionable. La lección generaliza: elige la query según lo que de verdad limita al componente.

## Prueba los estados que nadie diseña

Una revisión responsive que solo carga el estado por defecto se pierde los fallos que la gente encuentra:

- Nombres de producto largos y precios de seis cifras.
- Resultados de búsqueda vacíos y estados de error.
- El menú móvil abierto con la página desplazada.
- Navegación con teclado y anillos de foco visibles.
- Zoom al 200%, que es un requisito de accesibilidad, no una preferencia.

Nada de esto necesita un laboratorio de dispositivos. Necesita diez minutos con el navegador a 320 px y la red limitada a "Slow 4G".

## La checklist

1. Layout construido desde 320 px, breakpoints según el contenido.
2. LCP por debajo de 2,5 s en un móvil de gama media.
3. CLS por debajo de 0,1: dimensiones en cada imagen y embed.
4. INP por debajo de 200 ms: sin tareas largas en la primera interacción.
5. `srcset` y `sizes` en imágenes responsive, formato moderno.
6. Texto de cuerpo a 16 px mínimo, objetivos táctiles de 44 px.
7. Container queries solo donde decide el contenedor, no el viewport.
8. Estados vacíos, de error y con zoom revisados en un viewport real.

El diseño responsive no es una fase del proyecto. Es una restricción sobre cada decisión, y las restricciones que más importan son las que se pueden medir. El resto del lado técnico, desde el rastreo hasta los datos estructurados, está en la [checklist de SEO técnico](/es/blog/optimizacion-seo/).
