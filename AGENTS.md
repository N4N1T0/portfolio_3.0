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
| Node       | >= 22.22 | pnpm as package manager                                                                                |

## Commands

```bash
pnpm run dev              # dev server on localhost:4321
pnpm run build            # static build to dist/
pnpm run preview          # serve the built site
pnpm run check            # types + astro check + lint + format
pnpm run check:types      # tsc --noEmit
pnpm run check:astro      # astro check (.astro and .tsx diagnostics)
pnpm run check:lint       # eslint .
pnpm run check:lint:fix   # eslint . --fix
pnpm run check:format     # prettier --check .
pnpm run check:format:fix # prettier --write .
pnpm run check:dead       # fallow dead-code
pnpm run check:dupes      # fallow dupes
pnpm run check:health     # fallow health
pnpm run check:all        # all of the above
pnpm run hooks:install    # install lefthook git hooks
```

Every verification script is prefixed with `check:`. `dev`, `build`, `preview` and `astro` keep their
plain names.

## Git hooks

`lefthook.yml`, installed by `pnpm run hooks:install` and by the `prepare` script on `pnpm install`.

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
- The identity lines are a **script**, not a list of strings: `src/data/copy.ts` holds
  `LineScript[]` (`type`, `erase`, `wait` ops) and `src/lib/terminal-typing.ts` plays it, so the
  terminal can write a word, erase it and write another one. The html still ships the finished
  text for crawlers, and the engine empties every line before it starts typing.
- Keep the html shell in `src/layouts/TerminalLayout.astro`; pages compose it.
- The terminal boots **once per session**: `src/lib/session.ts` keeps the `terminal:booted` flag in
  `sessionStorage`, the layout marks `<html data-booted>` before the first paint, and the island
  skips the whole sequence when the flag is set. The home then renders ready, with no loader and no
  typewriter.
- The prompt completes like an AI IDE: `src/lib/terminal-suggest.ts` offers the rest of the
  command as ghost text and `Tab` accepts it. Enter always runs the command.
- The prompt is **global** and lives in the fixed footer: the shell is the site, so every page is
  navigated by typing. It answers `help`, `ls`, `history`, `pwd`, `clear`, `cd ~` and `cd -` (the
  previous page), and the up and down arrows walk the session history, like bash.
- The pages are not links in the chrome: `ctrl-b` opens the help dialog with the pages, the
  commands and the language. A footer full of links would make the site look like a normal
  website, and it is not one.
- Collection views live in `src/components/collection`; each section has an index component and a
  detail component, and the route files under `src/pages/{en,es}` stay thin.
- Prettier owns formatting: tabs, single quotes, print width 100. Do not hand-format, run
  `pnpm run check:format:fix`.

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
pnpm run check:dead   # unused files, exports, dependencies
pnpm run check:dupes  # copy-paste and structural duplication
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
│   ├── assets/            # blog, project and profile images (webp/jpg, 9MB)
│   ├── components/        # terminal island (.tsx) + collection views (.astro)
│   ├── content/           # content collections, one folder per locale
│   │   ├── blog/{en,es}   # 19 posts, markdown
│   │   ├── projects/{en,es} # 6 case studies, json
│   │   └── snippets/{en,es} # 1 snippet, markdown
│   ├── data/              # profile, copy and the migrated site data
│   ├── layouts/           # TerminalLayout.astro (html shell, SEO head, top bar)
│   ├── lib/content.ts     # collection queries by locale
│   ├── pages/             # en/ and es/ routes
│   ├── styles/global.css  # tailwind import, tokens, CRT utilities
│   └── utils/
├── .fallowrc.json         # fallow config
├── DESIGN.md              # the design system, written from the build
├── eslint.config.js
├── lefthook.yml
├── opencode.json          # ponytail plugin
└── tsconfig.json
```

## Content

- Collections are defined in `src/content.config.ts`; every entry lives under a locale folder
  (`en/`, `es/`) and the locale prefix is part of the id.
- **The file name is the URL.** `src/content/blog/en/8-tips-to-optimize-your-ecommerce.md` serves
  `/en/blog/8-tips-to-optimize-your-ecommerce/`. Renaming a file breaks an indexed URL: add a
  redirect instead, and keep the `counterpartId` in the frontmatter pointing at the other language.
- The content was migrated from portfolio_2.0 unchanged. Do not rewrite the copy in the markdown;
  the new site's own strings live in `src/data/copy.ts`.
- `src/data/profile.ts` holds the facts about the owner (name, email, socials) and
  `src/data/copy.ts` holds every visible string in both languages. Change the data, not the markup.
- `src/data/site-data.ts` is the migrated portfolio_2.0 data: the about copy, the experience log,
  the tech stack, the certifications and the GitHub contribution history. It is upstream data with
  its original shape (arrays of `{ en, es }` objects): read it, do not restructure it, and keep the
  import of the profile image as the only Astro asset import.
- Images are webp. The source files were converted once; do not add new PNGs, convert them with
  sharp at quality 85 instead.
- The OG images are rendered at build time by `src/lib/og.ts`: it expands the Geist woff2 subsets to
  ttf (resvg cannot read woff2) and renders the SVG with the site's own typefaces. The layout
  points to `/og.png` for English and `/og-es.png` for Spanish.

## Quality gates

Run `pnpm run check:all` before opening a PR and `pnpm run check` before every commit.
`pnpm run check:dead` and `pnpm run check:dupes` close every task, with no open findings: an unused
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
