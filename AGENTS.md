# AGENTS.md

Technical reference for `portfolio_3.0`. Read it before touching the repo.

## Project

Portfolio site, static output (Astro `build` -> `dist/`). Spanish UI copy, English code.

## Stack

| Piece      | Version  | Notes                                                                                                  |
| :--------- | :------- | :----------------------------------------------------------------------------------------------------- |
| Astro      | 7.4      | static site, `src/pages` = routes                                                                      |
| TypeScript | 5.9      | `astro/tsconfigs/strict`, `jsx: react-jsx`, `jsxImportSource: preact`                                  |
| Preact     | 11       | via `@astrojs/preact`; islands only                                                                    |
| Tailwind   | 4.3      | `@tailwindcss/vite`, no `tailwind.config.js`, entry `src/styles/global.css`                            |
| anime.js   | 4.5      | v4 API: named exports (`animate`, `stagger`, `createTimeline`, `utils`), no default export             |
| ESLint     | 10       | flat config `eslint.config.js`: `eslint-plugin-astro` + `typescript-eslint` + `eslint-config-prettier` |
| Prettier   | 3.9      | `prettier-plugin-astro` + `prettier-plugin-tailwindcss` (sorts classes)                                |
| fallow     | 3.34     | dead code, duplication, health; config `.fallowrc.json`                                                |
| lefthook   | 2.2      | git hooks, config `lefthook.yml`                                                                       |
| Node       | >= 22.22 | npm as package manager                                                                                 |

## Commands

```bash
npm run dev              # dev server on localhost:4321
npm run build            # static build to dist/
npm run preview          # serve the built site
npm run check            # types + astro check + lint + format
npm run check:types      # tsc --noEmit
npm run check:astro      # astro check (.astro and .tsx diagnostics)
npm run check:lint       # eslint .
npm run check:lint:fix   # eslint . --fix
npm run check:format     # prettier --check .
npm run check:format:fix # prettier --write .
npm run check:dead       # fallow dead-code
npm run check:dupes      # fallow dupes
npm run check:health     # fallow health
npm run check:all        # all of the above
npm run hooks:install    # install lefthook git hooks
```

Every verification script is prefixed with `check:`. `dev`, `build`, `preview` and `astro` keep their
plain names.

## Git hooks

`lefthook.yml`, installed by `npm run hooks:install` and by the `prepare` script on `npm install`.

- **pre-commit**: `prettier --write` and `eslint --fix` over the staged files, fixes are staged back.
- **pre-push**: `check:types` then `check:astro`.

Never bypass the hooks with `--no-verify`; fix the reported problem instead.

## Paths

`tsconfig.json` maps `@/*` -> `src/*`. Astro, Vite and `tsc` resolve it without extra config.

```ts
import Layout from '@/layouts/Layout.astro';
import { formatDate } from '@/utils/format';
```

ESLint (`no-restricted-imports`) blocks relative imports deeper than one hop: `../../x` and
`../dir/../../x` are errors, `../x` is the maximum allowed.

## Conventions

- Static markup goes in `.astro` files. Reach for Preact (`.tsx`) only when a component needs
  browser state, events or animation, and always mount it with a `client:*` directive
  (`client:load` for above-the-fold, `client:visible` for the rest).
- Preact components live in `src/components` and use `preact/hooks`; no React APIs.
- anime.js runs inside Preact effects or client scripts, never in `.astro` frontmatter.
  Import from `'animejs'` (`import { animate, stagger } from 'animejs'`).
- Keep the html shell in `src/layouts/Layout.astro`; pages compose it.
- Prettier owns formatting: tabs, single quotes, print width 100. Do not hand-format, run
  `npm run check:format:fix`.

## Styles

Tailwind is the default and the only styling tool for layout, spacing, color, typography and
responsive behaviour. Write utility classes in the markup, reuse the scale of the design system
(`max-w-3xl`, `text-neutral-600`, `dark:` variants, gap and spacing tokens), and let
`prettier-plugin-tailwindcss` sort the classes.

Native Astro `<style>` blocks are the exception, only for:

- styles that must be scoped to a component and cannot be expressed as utilities
  (`is:global` is not a reason to use it, only true component scoping)
- `@keyframes` and complex pseudo-element states that Tailwind has no utility for
- styling a third-party widget from the outside (`@apply` inside a `<style>` block)
- print styles or a one-off reset for that page only

If a rule needs a `<style>` block, it needs a reason: the class it replaces must be impossible or
ugly in Tailwind. Everything else goes in the markup.

## End of every task

Always finish a task with:

```bash
npm run check:dead   # unused files, exports, dependencies
npm run check:dupes  # copy-paste and structural duplication
```

Both must stay clean. A finding is either fixed (delete, reuse, or extract to a shared module) or
explicitly justified in `.fallowrc.json`. Do not finish a task with open dead code or duplicated
blocks.

## Skills

For every new page, load and apply these skills before writing markup:

- `impeccable` — UX, hierarchy, accessibility, states, responsive behaviour
- `design-taste-frontend` — visual direction, no templated look, spacing and type rhythm
- `seo` — metadata, structured data, headings, performance and indexability

They are vendored in `.agents/skills/`, the path every agent harness (OpenCode, Claude Code, Codex)
discovers automatically. Do not edit them here: they are upstream copies, update them from their
source.

Not vendored on purpose: the `seo` Python environment (`.venv`) and the Playwright browsers
(`ms-playwright`), and the `impeccable` engine binary (`scripts/bin/`), all downloaded on first run.
The user-level copies in `~/.claude/skills` have the full runtime.

## Layout

```text
/
├── src/
│   ├── components/      # Preact islands (.tsx)
│   ├── layouts/         # Layout.astro (html shell + global.css)
│   ├── pages/           # routes (.astro)
│   ├── styles/          # global.css (@import "tailwindcss")
│   └── utils/           # shared helpers
├── .fallowrc.json       # fallow config
├── eslint.config.js
├── lefthook.yml
├── opencode.json        # ponytail plugin
└── tsconfig.json
```

## Quality gates

Run `npm run check:all` before opening a PR and `npm run check` before every commit.
`npm run check:dead` and `npm run check:dupes` close every task, with no open findings: an unused
file, export or dependency is a finding to fix or an explicit entry in `.fallowrc.json`.

## Agent tooling

- Ponytail skills and the page skills (`impeccable`, `design-taste-frontend`, `seo`) live in
  `.agents/skills/`; `opencode.json` loads the `@dietrichgebert/ponytail` plugin, so the ruleset
  applies every turn.
- Dev server: `astro dev --background`, then `astro dev stop`, `astro dev status`, `astro dev logs`.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
