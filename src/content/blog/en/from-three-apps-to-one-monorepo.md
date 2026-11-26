---
title: 'From three apps to one monorepo'
date: 2026-11-16
excerpt: 'A storefront, an admin panel and an API in one pnpm and Turborepo workspace. What the layout gained, and what it did not fix.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'es/de-tres-apps-a-un-monorepo'
tags: ['monorepo', 'turborepo', 'pnpm', 'cloudflare', 'architecture']
---

Epicstock is a photo stock marketplace where buyers license photos straight from the photographers who took them. A client asked for a storefront in the style of Unsplash or Alamy, selling digital products, with an admin panel to run part of the business. Putting the panel inside the storefront project was the obvious shortcut, and the wrong one. This post explains how the work split into three pieces in one repository, what that bought, and what it did not fix.

## Why three pieces, and why one repository

The storefront is public and the admin is not. Mixing them in one project and one domain made every admin feature a risk for the shop, and every shop change a risk for the admin. The panel needed its own domain.

The API had to be separate too, and strong enough to carry every transaction: orders, payments, downloads and photographer payouts. Both frontends call it, so it could not belong to either one.

The work therefore split into a storefront (`apps/web`), an admin (`apps/admin`) and an API (`apps/api`). They stayed in one repository because they share a lot: UI components, business logic and domain references such as licence types, store names and photo statuses. With separate repositories, that code would be copied or published as packages, and the copies would drift apart.

## One workspace, three deployables

The root `pnpm-workspace.yaml` declares two globs:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Each app is a folder under `apps/`:

- `apps/web` is the storefront, Next.js 15 with the App Router.
- `apps/admin` is the curation panel, built on the same stack.
- `apps/api` is a Hono worker on Cloudflare, with D1 through Drizzle.

Turborepo fans out every command to all the workspaces. `pnpm build` builds the whole repository, and `--filter` scopes a command to one package when only one changed. Each app still owns its own `wrangler.toml` and deploys to Cloudflare on its own, so the monorepo does not merge the three runtimes into one.

## What the shared packages hold

Four packages carry the contract between the apps:

- `packages/types` holds the shared TypeScript types. The README calls it the contract between apps.
- `packages/validators` holds the Zod schemas that both the API and the forms use.
- `packages/api-client` builds a typed client with `hono/client`, typed from the `ApiType` that the API exports.
- `packages/ui` is the shadcn/ui component library. The storefront and the admin both import from it.

The typed client matters most where it replaces plain strings. Some admin calls to the API were still plain strings.

## The bug that one repository did not prevent

In a smoke test of the admin panel on 2026-09-07, saving a photographer's fee amount returned a 404. The dialog called `fetch("/api/admin/photographers/:id/fee-amount")` with a relative path. The admin app has no `app/api` folder and no rewrites, so the request went to the admin's own origin and never reached the worker. Two other admin calls had the same problem: paying a payout and enabling two-factor authentication.

The fix sent all three through the typed client, with credentials included. Now a wrong route is a type error, and `pnpm check:types` reports it before the code runs.

The bug existed inside the monorepo. Putting the apps in one place did not prevent it. Sharing the client did.

## The session cookie two apps shared

Cookies belong to the host that set them. Both the storefront and the admin call the API, so in local development both were calling `localhost:8787`, and the browser filed both sessions under one host. Testing a buyer and an admin at the same time meant they shared one session.

The fix is in the dev setup. The storefront runs on `localhost:3000`, the admin runs on `127.0.0.1:3001`, and each one calls the API on its own loopback name. Two names give two cookie hosts, and the README keeps the table.

## What the monorepo did not solve

Deploys are still manual. `pnpm deploy:manual` deploys the web app, then the API, then the admin. CI does not run it. Database migrations are hand-written SQL files, applied by hand, and a migration has to land before the code that depends on it.

A shared package also means one change can reach three apps. That is the point of the layout, and it is also the risk. The checks that catch it are `pnpm check:types` across every workspace, the linter, and the dead-code and duplication reports. They run because someone runs them.

## What I would keep

I would keep the shared types, the validators and the typed client. They turned a runtime 404 into a type error, and that is the cheapest kind of bug to find.

The repository puts the three apps where you can see them change together. It does not make a change safe on its own. The types, the checks and the deploy order do that.

A real bug inside that same monorepo: [The Rate Limiter Was the Outage](/en/blog/the-rate-limiter-was-the-outage/).

The shared types, validators and typed client structure is the same I use in [The Forge](/en/projects/the-forge/), my workspace boilerplate with Next.js 15 and Appwrite.
