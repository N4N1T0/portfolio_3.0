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

## Deploy

Vercel, with the `@astrojs/vercel` adapter and `vercel.json` (the root redirects to `/en/`, the
security headers and the immutable cache for `/_astro/*`). The build is static, so the adapter only
serves the output and the redirects.

```bash
vercel link
vercel --prod
```

## SEO

The blog is a static Astro build served from Vercel, and the whole pass is about what a crawler
receives:

- Every post ships `BlogPosting` and `BreadcrumbList` JSON-LD, with `dateModified` when the entry
  changed, absolute breadcrumb URLs and a real `x-default`.
- Hreflang is derived from `counterpartId`, so the pair of translations points at each other even
  when the file names differ.
- The schema requires `tags` and caps `excerpt` at 160 characters, which keeps the meta description
  inside the length Google actually renders.
- The related block is built from tags, with the newest posts as filler when a tag is alone.
- Three slugs with typos were renamed and covered by `308` redirects in `vercel.json`, with and
  without the trailing slash. Vercel's `permanent: true` returns `308`, which Google treats as
  permanent.
- Thin 2023–2024 posts were rewritten and now cite primary sources (Google Search Essentials,
  web.dev, MDN, W3C, the Scrum Guide, Baymard, the Astro docs).

## IndexNow

`scripts/indexnow.mjs` submits the generated sitemap to
[IndexNow](https://www.indexnow.org/) (Bing, Yandex, Seznam, Naver) at the end of every production
build, so the notification travels with the deploy instead of depending on a CI run:

```json
"buildCommand": "pnpm run build && node scripts/indexnow.mjs"
```

The key is hosted at `/59f7c7ccca1744c980a0a1638d246e89.txt`. Preview deploys are skipped through
`VERCEL_ENV`, and a failed ping logs a warning without failing the build. To run it by hand:

```bash
INDEXNOW_FORCE=1 node scripts/indexnow.mjs
```

Google ignores IndexNow; its channel is Search Console, and new posts still need "Request
indexing" there.

## Next steps

- Request indexing in Search Console for the six URLs that were crawled but not indexed, and only
  the ones that include `/blog/` in the path.
- Watch the "Crawled, currently not indexed" bucket for two to four weeks after the rewrites.
- Cross-post three more articles to dev.to with a canonical back to the site: Astro 5 and SEO, Claude
  Code with any model through OpenRouter, and the rate limiter postmortem (one per week, tracked in
  the vault).
- Revisit the remaining 2023–2024 posts that were not rewritten, and decide whether the migrated
  posts keep their original date or take the republishing date.
