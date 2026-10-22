---
title: 'Scrum para proyectos web: sprints, roles y estimación'
date: 2023-09-15
dateModified: 2026-10-22
excerpt: 'Cómo funciona Scrum en un proyecto web de cliente: duración del sprint, historias de usuario, story points, los dos roles que importan y dónde suele romperse.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'en/scrum-project-management'
tags: ['process', 'scrum']
---

Scrum está escrito para equipos de producto con un backlog permanente. Un proyecto web de cliente es otra cosa: tiene fecha, un alcance que alguien firmó y un interesado que no está en la sala todos los días. Muchos equipos adoptan las ceremonias y se saltan lo que hace que funcione en ese contexto, y luego concluyen que Scrum es burocracia.

Llevo años gestionando proyectos pequeños de cliente así. Esta es la versión que sobrevive al contacto con un contrato real.

## Duración del sprint: dos semanas, casi siempre

Sprints de una semana funcionan en un producto maduro con un product owner disponible. En un proyecto de cliente suelen ser demasiado cortos para producir algo que un interesado no técnico pueda evaluar, así que la review degenera en reunión de estado.

Dos semanas dan para una rebanada vertical: una página que se ve, un paso de checkout que se completa, un formulario que guarda datos. Eso importa más que la velocidad. Si la demo del final del sprint no es algo que el cliente pueda clicar, el sprint produjo tareas y no valor.

Sprints de cuatro semanas esconden problemas demasiado tiempo. Cuando llega la review, una suposición equivocada ya está incrustada en un mes de trabajo.

## Historias de usuario con condición de aceptación

Una historia no es una tarea con una persona ficticia delante. La forma útil es:

> Como cliente recurrente, puedo pagar con una tarjeta guardada para no volver a introducir los datos.
> Terminado cuando: la tarjeta guardada aparece en el checkout, el pago funciona en el entorno de pruebas y el pedido aparece en el panel.

La cláusula "terminado cuando" es lo que hace la historia estimable y comprobable. Sin ella, "pago con tarjeta guardada" puede ser un mockup o una integración real, y la estimación no significa nada hasta que alguien adivina cuál.

El trabajo técnico vive en el mismo backlog y el cliente lo ve: migraciones, eventos de analítica, el banner de cookies que nadie quiere planificar. Esconderlo produce un sprint que parece en plazo mientras la fecha de lanzamiento se mueve en silencio.

## Story points, con honestidad

Los story points estiman complejidad, no tiempo. Es la teoría y es correcta, pero el valor práctico es otro: permiten comparar dos historias sin discutir horas.

Lo que no hacen es decirle a un cliente cuándo estará listo. Para eso hace falta un segundo número: puntos completados por sprint de media. Con tres sprints de historial, el rango del siguiente es defendible. Antes de eso, cualquier fecha es una corazonada con hoja de cálculo.

Dos reglas mantienen la estimación honesta:

- Se estima en equipo. La estimación de un solo desarrollador es una preferencia.
- Se parte cualquier historia por encima de la más grande ya completada. Si no se puede partir, es un spike: investigación con límite de tiempo, no entrega.

## Los dos roles que importan

Scrum define tres roles, y la [Scrum Guide](https://scrumguides.org/scrum-guide.html) es lo bastante corta para leerla una vez al año. En un proyecto de cliente, dos deciden si el proceso funciona:

- **Product owner:** una persona con autoridad para decidir prioridad y aceptar trabajo. Si el cliente manda tres interesados con opiniones distintas y sin desempate, cada review es una negociación y el backlog se convierte en carta a los Reyes.
- **Scrum master:** quien quita bloqueos y protege el sprint. En un equipo pequeño suele ser la misma persona que el tech lead, lo que en teoría es un conflicto de interés y en la práctica es inevitable. Funciona mientras los bloqueos se escriban y se revisen, no se gestionen de memoria.

El equipo de desarrollo es todo el que hace el trabajo. No separo diseño y desarrollo en ceremonias distintas: una historia que necesita ambos es una historia.

## Dónde se rompe

Cuatro fallos explican casi todas las decepciones:

1. **No hay product owner con autoridad.** Las prioridades cambian cada semana y nada se acepta.
2. **El sprint se convierte en fecha de entrega.** Los interesados tratan la review como un compromiso y el equipo deja de estimar con honestidad.
3. **No hay definición de terminado.** "Hecho" significa cosas distintas para diseño, desarrollo y cliente, así que nada termina nunca.
4. **Retrospectivas sin acción.** El equipo lista los mismos tres problemas cada dos semanas y no cambia nada.

El último es el más barato de arreglar: una acción por retrospectiva, asignada a una persona, revisada en la siguiente. Si un equipo no sostiene eso, ningún marco lo va a salvar.

## Qué compra

El beneficio no es velocidad. Es un bucle de feedback más corto entre lo que el cliente imaginó y lo que el sitio hace. Una demo cada dos semanas detecta la suposición equivocada cuando todavía es barata, y el backlog absorbe el cambio sin renegociar el contrato entero.

Para un freelance en solitario, la versión ligera es más simple que Scrum: un tablero, una revisión semanal y un alcance escrito por fase. Describí ese montaje en [usar Notion para gestionar proyectos web freelance](/es/blog/usando-notion-para-mejorar-tus-proyectos/). Usa Scrum cuando hay equipo y un interesado que necesita ver avance; no lo uses para parecer ágil en una propuesta.
