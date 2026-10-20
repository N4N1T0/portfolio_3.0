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

| Command                    | Action                              |
| :------------------------- | :---------------------------------- |
| `npm run dev`              | Dev server at `localhost:4321`      |
| `npm run build`            | Production build to `./dist/`       |
| `npm run preview`          | Preview the production build        |
| `npm run check`            | types + astro check + lint + format |
| `npm run check:types`      | `tsc --noEmit`                      |
| `npm run check:astro`      | `astro check`                       |
| `npm run check:lint`       | `eslint .`                          |
| `npm run check:lint:fix`   | `eslint . --fix`                    |
| `npm run check:format`     | `prettier --check .`                |
| `npm run check:format:fix` | `prettier --write .`                |
| `npm run check:dead-code`  | `fallow dead-code`                  |
| `npm run check:dupes`      | `fallow dupes`                      |
| `npm run check:health`     | `fallow health`                     |
| `npm run check:all`        | Every check plus the fallow reports |
| `npm run hooks:install`    | Install the lefthook git hooks      |

## Git hooks

`lefthook.yml` defines the hooks, installed with `npm run hooks:install` (also runs on `npm install`).

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
│   ├── components/       # Preact islands (.tsx)
│   ├── layouts/Layout.astro   # html shell + global.css
│   ├── pages/                 # routes
│   └── styles/global.css      # @import "tailwindcss"
├── .fallowrc.json
├── eslint.config.js
├── lefthook.yml
└── opencode.json              # ponytail plugin
```

## Agents

Ponytail skills live in `.agents/skills` and `.opencode/skills`; `opencode.json` loads the
`@dietrichgebert/ponytail` plugin so the ruleset applies on every turn.
