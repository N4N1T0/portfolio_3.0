---
title: 'De tres apps a un monorepo'
date: 2026-11-16
excerpt: 'Tienda, panel de administración y API en un mismo workspace de pnpm y Turborepo. Qué ganó la estructura y qué no resolvió.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'en/from-three-apps-to-one-monorepo'
tags: ['monorepo', 'turborepo', 'pnpm', 'cloudflare', 'arquitectura']
---

Epicstock es un marketplace de fotos de stock donde los compradores licencian las fotos directamente a los fotógrafos que las tomaron. Un cliente pidió una tienda al estilo de Unsplash o Alamy para vender productos digitales, con un panel de administración para controlar parte del negocio. Meter el panel dentro del proyecto de la tienda era el atajo obvio, y el equivocado. Este post cuenta cómo el trabajo se dividió en tres piezas dentro de un repositorio, qué aportó y qué no resolvió.

## Por qué tres piezas y un solo repositorio

La tienda es pública y el admin no. Mezclarlos en un mismo proyecto y un mismo dominio hacía que cada función del admin fuera un riesgo para la tienda, y cada cambio en la tienda un riesgo para el admin. El panel necesitaba su propio dominio.

La API también debía ser independiente, y lo bastante potente para llevar todas las transacciones: pedidos, pagos, descargas y pagos a fotógrafos. Las dos interfaces la llaman, así que no podía pertenecer a ninguna de las dos.

Por eso el trabajo se dividió en tienda (`apps/web`), admin (`apps/admin`) y API (`apps/api`). Se quedaron en un solo repositorio porque comparten mucho: componentes de UI, lógica de negocio y referencias de dominio, como los tipos de licencia, los nombres de tienda y los estados de las fotos. Con repositorios separados, ese código se copiaría o habría que publicarlo como paquetes, y las copias acabarían divergiendo.

## Un workspace, tres despliegues

El `pnpm-workspace.yaml` de la raíz declara dos globs:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Cada app es una carpeta dentro de `apps/`:

- `apps/web` es la tienda, con Next.js 15 y App Router.
- `apps/admin` es el panel de curación, sobre la misma base.
- `apps/api` es un worker de Hono en Cloudflare, con D1 a través de Drizzle.

Turborepo reparte cada comando entre todos los workspaces. `pnpm build` construye el repositorio entero, y `--filter` limita un comando a un solo paquete cuando solo cambió uno. Cada app conserva su propio `wrangler.toml` y se despliega en Cloudflare por separado, así que el monorepo no junta los tres entornos de ejecución en uno.

## Qué guardan los paquetes compartidos

Cuatro paquetes sostienen el contrato entre las apps:

- `packages/types` tiene los tipos de TypeScript compartidos. El README lo llama el contrato entre apps.
- `packages/validators` tiene los esquemas de Zod que usan tanto la API como los formularios.
- `packages/api-client` construye un cliente tipado con `hono/client`, tipado a partir del `ApiType` que exporta la API.
- `packages/ui` es la librería de componentes de shadcn/ui. La tienda y el admin importan de ahí.

El cliente tipado importa sobre todo donde sustituye a las cadenas sueltas. Algunas llamadas del admin a la API seguían siendo cadenas.

## El bug que un solo repositorio no evitó

En una prueba de humo del panel de administración, el 7 de septiembre de 2026, guardar la tarifa de un fotógrafo devolvía un 404. El diálogo llamaba a `fetch("/api/admin/photographers/:id/fee-amount")` con una ruta relativa. La app de admin no tiene carpeta `app/api` ni reescrituras, así que la petición iba al origen del propio admin y nunca llegaba al worker. Otras dos llamadas del admin tenían el mismo problema: pagar un payout y activar la autenticación de dos factores.

La solución envió las tres llamadas por el cliente tipado, con las credenciales incluidas. Ahora una ruta mal escrita es un error de tipos, y `pnpm check:types` lo marca antes de que el código se ejecute.

El bug existía dentro del monorepo. Tener las apps en un mismo sitio no lo evitó. Lo evitó compartir el cliente.

## La cookie de sesión que compartían dos apps

Las cookies pertenecen al host que las creó. La tienda y el admin llaman a la misma API, así que en desarrollo local ambas apuntaban a `localhost:8787`, y el navegador guardaba las dos sesiones bajo el mismo host. Probar a la vez un comprador y un administrador significaba compartir una sola sesión.

La solución está en la configuración de desarrollo. La tienda corre en `localhost:3000`, el admin en `127.0.0.1:3001`, y cada una llama a la API por su propio nombre de loopback. Dos nombres dan dos hosts de cookie distintos, y el README mantiene la tabla.

## Lo que el monorepo no resolvió

Los despliegues siguen siendo manuales. `pnpm deploy:manual` despliega primero la web, luego la API y por último el admin. CI no lo ejecuta. Las migraciones de base de datos son ficheros SQL escritos a mano y se aplican a mano, y una migración tiene que estar aplicada antes que el código que la necesita.

Un paquete compartido también significa que un cambio puede llegar a tres apps. Ese es el sentido de la estructura, y también su riesgo. Lo que lo detecta son `pnpm check:types` en todos los workspaces, el linter y los informes de código muerto y duplicado. Funcionan porque alguien los ejecuta.

## Lo que mantendría

Mantendría los tipos compartidos, los validadores y el cliente tipado. Convirtieron un 404 en tiempo de ejecución en un error de tipos, que es la forma más barata de encontrar un bug.

El repositorio pone las tres apps en un mismo sitio, donde se ve cómo cambian juntas. Por sí solo no hace seguro un cambio. Lo hacen los tipos, las comprobaciones y el orden de despliegue.

Un bug real dentro de ese mismo monorepo: [El rate limiter era la caída](/es/blog/el-rate-limiter-era-la-caida/).

La estructura de tipos compartidos, validadores y cliente tipado es la misma que uso en [The Forge](/es/projects/the-forge/), mi boilerplate de workspaces con Next.js 15 y Appwrite.
