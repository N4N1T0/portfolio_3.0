# portfolio_3.0

Astro + Tailwind + TypeScript boilerplate with Preact islands, anime.js animations, ESLint (astro
plugin), Prettier, fallow and lefthook git hooks.

## Stack

- **Astro 7** + **Tailwind 4** (`@tailwindcss/vite`, styles in `src/styles/global.css`)
- **Preact 11** via `@astrojs/preact`, for interactive islands only
- **anime.js 4** for animations (v4 named exports: `animate`, `stagger`, `createTimeline`)
- **TypeScript** strict (`astro/tsconfigs/strict`)
- **ESLint 10** flat config with `eslint-plugin-astro` + `typescript-eslint`
- **Prettier 3** with `prettier-plugin-astro` and `prettier-plugin-tailwindcss`
- **fallow** for dead code, duplication and health
- **lefthook** for git hooks (pre-commit, pre-push)

## Commands

| Command                     | Action                              |
| :-------------------------- | :---------------------------------- |
| `pnpm run dev`              | Dev server at `localhost:4321`      |
| `pnpm run build`            | Production build to `./dist/`       |
| `pnpm run preview`          | Preview the production build        |
| `pnpm run check`            | types + astro check + lint + format |
| `pnpm run check:types`      | `tsc --noEmit`                      |
| `pnpm run check:astro`      | `astro check`                       |
| `pnpm run check:lint`       | `eslint .`                          |
| `pnpm run check:lint:fix`   | `eslint . --fix`                    |
| `pnpm run check:format`     | `prettier --check .`                |
| `pnpm run check:format:fix` | `prettier --write .`                |
| `pnpm run check:dead`       | `fallow dead-code`                  |
| `pnpm run check:dupes`      | `fallow dupes`                      |
| `pnpm run check:health`     | `fallow health`                     |
| `pnpm run check:all`        | Every check plus the fallow reports |
| `pnpm run hooks:install`    | Install the lefthook git hooks      |

## Git hooks

`lefthook.yml` defines the hooks, installed with `pnpm run hooks:install` (also runs on `pnpm install`).

- **pre-commit**: Prettier and ESLint over the staged files, fixes are staged back.
- **pre-push**: `check:types` (`tsc --noEmit`) and `check:astro` (`astro check`).

## Paths

`tsconfig.json` maps the `@/` alias to `src/`, Astro and `tsc` pick it up automatically:

```ts
import Layout from '@/layouts/Layout.astro';
import '@/styles/global.css';
```

ESLint blocks deep relative imports (`../../...`) with `no-restricted-imports`, so one `../` hop is the
maximum allowed.

## Layout

```text
/
├── src/
│   ├── assets/                # blog and project images
│   ├── components/            # terminal island (.tsx) + collection views (.astro)
│   ├── content/               # blog, projects and snippets, one folder per locale
│   ├── data/                  # profile, copy and the migrated site data
│   ├── layouts/               # TerminalLayout.astro (html shell, SEO head, top bar)
│   ├── lib/content.ts         # collection queries by locale
│   ├── pages/                 # en/ and es/ routes
│   └── styles/global.css      # tailwind import, tokens, CRT utilities
├── .fallowrc.json
├── DESIGN.md                  # the design system
├── eslint.config.js
├── lefthook.yml
└── opencode.json              # ponytail plugin
```

## Pages

| Route                            | Content                                                                       |
| :------------------------------- | :---------------------------------------------------------------------------- |
| `/en/`, `/es/`                   | the terminal home: boot loader, typewriter, command list                      |
| `/en/about/`, `/es/about/`       | profile, experience log, stack, certifications, contribution heatmap          |
| `/en/projects/`, `/es/projects/` | 6 case studies, newest first                                                  |
| `/en/projects/[id]/`             | one case study: excerpt, screenshots, challenge, solution, stack, testimonial |
| `/en/blog/`, `/es/blog/`         | 19 posts, newest first                                                        |
| `/en/blog/[id]/`                 | one post, rendered as terminal output                                         |
| `/en/snippets/`, `/es/snippets/` | small components, with a live preview                                         |

The URLs are the ones the previous site already served, so the indexed pages keep their address.
The file name of a content entry is its slug: renaming a file breaks a URL, add a redirect instead.

## Agents

Ponytail skills and the page skills (`impeccable`, `design-taste-frontend`, `seo`) live in
`.agents/skills`; `opencode.json` loads the `@dietrichgebert/ponytail` plugin so the ruleset applies
on every turn.

[`AGENTS.md`](AGENTS.md) is the source of truth for agents working on this repo: Tailwind first,
`check:dead` + `check:dupes` at the end of every task, and the `impeccable`,
`design-taste-frontend` and `seo` skills required for every new page.
