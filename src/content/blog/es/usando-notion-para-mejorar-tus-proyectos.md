---
title: 'Usar Notion para gestionar proyectos web freelance'
date: 2025-01-10
dateModified: 2026-10-22
excerpt: 'El montaje de Notion que uso como desarrollador freelance: una base de datos por proyecto, embudo de clientes y plantillas que acortan propuestas y entregas.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'en/using-notion-to-improve-your-projects'
tags: ['notion', 'process']
---

Un desarrollador freelance no necesita una herramienta de gestión de proyectos. Necesita tres cosas en el mismo sitio: qué se acordó, qué toca ahora y qué tiene que decidir el cliente. Notion hace las tres suficientemente bien y no cuesta nada empezar, y por eso lo he mantenido durante años.

Este es el montaje real, no una lista de funciones de Notion.

## Una base de datos, no una página por proyecto

El núcleo es una única base de datos llamada Proyectos, con una página por proyecto de cliente. Cada página tiene las mismas propiedades:

- **Estado:** contacto, propuesta, activo, en pausa, entregado.
- **Cliente:** una relación con la base de datos Clientes.
- **Fecha límite:** una fecha única, no un rango. Un rango esconde los retrasos.
- **Presupuesto y horas:** dos números, para ver la rentabilidad sin una hoja de cálculo aparte.
- **Siguiente acción:** una frase. Si está vacía, el proyecto no se está trabajando.

Una página por proyecto dentro de una base de datos gana a una carpeta por proyecto porque la base de datos responde preguntas: qué está activo, qué va tarde, qué cliente ha consumido más horas. Una carpeta no.

## La página de proyecto tiene cuatro secciones

Cada proyecto sigue la misma plantilla, y es lo bastante corta como para que de verdad la rellene:

1. **Alcance.** Qué incluye, en palabras del cliente, y qué no incluye explícitamente. Es la sección que evita discusiones en el mes dos.
2. **Registro de decisiones.** Una lista con fecha y responsable: "2026-03-04, el cliente aprueba quitar el blog de la fase 1". Se busca y se defiende.
3. **Tareas.** Una vista de la base de datos filtrada por este proyecto. Estado, responsable, fecha.
4. **Entrega.** Política de credenciales, pasos de despliegue, dónde vive el DNS y qué hacer cuando algo se rompe.

El alcance importa más que la herramienta. Un alcance claro es la diferencia entre un cambio de alcance y un favor, y vive junto al trabajo, no en un correo que nadie encuentra.

## Los clientes son un embudo, no una agenda

La segunda base de datos es Clientes, con las etapas que de verdad tengo: conversación, propuesta enviada, ganado, activo, pasado. Cada fila enlaza sus proyectos y guarda la fecha del último contacto.

Dos reglas la mantienen útil:

- **La siguiente acción siempre está escrita.** "Enviar propuesta" sin fecha es un deseo. "Enviar propuesta, jueves" es un plan.
- **Cada llamada genera una nota.** Tres líneas: qué se decidió, qué está bloqueado, qué pasa después. Las notas van a la página del cliente, no a mi cabeza.

Cuando termina un proyecto, la fila del cliente se queda. De ahí sale el trabajo siguiente, y es el marketing más barato que tiene un freelance.

## Lo que deliberadamente no guardo en Notion

- **Código e issues.** Viven en el repositorio. Duplicarlos crea dos fuentes de verdad.
- **Facturas.** Las lleva la herramienta de contabilidad. Notion guarda la referencia, no el documento.
- **Control de tiempo al minuto.** Apunto horas por día y proyecto. Más granularidad es un pasatiempo, no un sistema de gestión.

Para proyectos en equipo con un cliente que necesita ver avance cada dos semanas, Notion solo no basta: [Scrum para proyectos web](/es/blog/gestion-en-scrum/) cubre las ceremonias y los roles que hacen útil una review.

## Una plantilla solo vale si es corta

Publiqué la plantilla que uso. Tiene la base de datos de proyectos, el embudo de clientes y las dos plantillas de página de arriba, y nada más. Cada sección que añadí con los años y nunca abrí desapareció en la siguiente limpieza.

[Abrir la plantilla](https://www.notion.so/New-Project-17b38ce933b980f2b957de5e7a88c05e?pvs=4). Duplícala en tu espacio y borra lo que no vayas a usar. Un sistema que mantienes por mantenerlo es peor que un cuaderno.

## Empieza con un proyecto

El fallo típico de las herramientas de productividad es pasar un fin de semana diseñando el sistema en lugar de trabajar. La versión que se queda es más pequeña:

1. Crea la base de datos Proyectos con cinco propiedades: estado, cliente, fecha límite, siguiente acción, presupuesto.
2. Añade el proyecto en el que trabajas hoy.
3. Escribe el alcance en palabras del cliente.
4. Añade la siguiente acción.

Todo lo demás puede esperar a la primera vez que no puedas responder una pregunta sin ello. Cuando un proyecto sale, la sección de entrega merece escribirse antes que la factura: es también la lista para [la pasada de SEO técnico](/es/blog/optimizacion-seo/) previa al lanzamiento.
