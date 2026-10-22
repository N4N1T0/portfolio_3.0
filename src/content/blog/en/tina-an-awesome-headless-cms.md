---
title: 'TinaCMS: A Headless CMS with Git Version Control'
date: 2025-01-25
dateModified: 2026-10-22
excerpt: 'TinaCMS stores content as Markdown and JSON in Git, with live editing on top. How it works, when it fits and what the setup actually involves.'
author: 'Adrián'
counterpartId: 'es/tina-un-impresionante-headless-cms'
tags: ['cms', 'tina', 'headless']
---

Most headless CMS products move your content into their database. TinaCMS takes the opposite route: the content stays as Markdown and JSON in your repository, and Tina adds an editing interface on top of those files. For a developer, that means the content model is code review, the history is `git log`, and there is no export step if you ever leave.

That trade is excellent for some projects and wrong for others. This is what the setup actually involves and where it stops being a good idea.

## The model: files in Git, UI on top

Tina has three pieces:

- **A schema** defined in `tina/config.ts`, with collections and fields.
- **An admin UI** served at `/admin`, generated from that schema.
- **An adapter** that reads and writes the files. In local development it writes to your working copy. For editors, the usual setup is Tina Cloud, which commits changes to a branch and opens a pull request.

The frontend keeps reading plain files at build time, exactly as it did before Tina existed. That is the part worth understanding: Tina is an editing layer, not a runtime dependency of the public site.

## Setting it up

The current setup starts with the CLI, not with hand-installed packages:

```sh
npx @tinacms/cli@latest init
```

The command adds `tinacms` and `@tinacms/cli`, creates `tina/config.ts`, adds the `/admin` route and a build step. A minimal collection looks like this:

```ts
import { defineConfig } from 'tinacms';

export default defineConfig({
	branch: process.env.GITHUB_BRANCH ?? 'main',
	clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
	token: process.env.TINA_TOKEN,
	build: {
		outputFolder: 'admin',
		publicFolder: 'public',
	},
	schema: {
		collections: [
			{
				name: 'post',
				label: 'Posts',
				path: 'content/posts',
				format: 'md',
				fields: [
					{ type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
					{ type: 'datetime', name: 'date', label: 'Date', required: true },
					{ type: 'rich-text', name: 'body', label: 'Body', isBody: true },
				],
			},
		],
	},
});
```

Then run the dev server and open `/admin`. Locally, saving writes the Markdown file in your working copy immediately.

## Live editing has a real cost

The feature people remember is visual editing: the admin panel sits next to the rendered page, and clicking a headline opens its field. It is genuinely useful for marketing pages, where the person editing thinks in sections rather than in fields.

It is less useful than it looks for content with structure. A post with code blocks, tables and nested components is faster to edit in an editor with Markdown support than in a side-by-side preview. And visual editing requires wrapping components so Tina can map them to fields, which adds code to the frontend that has nothing to do with the site's job.

## When it fits

- Content that belongs next to the code, under the same review process.
- A small team where developers and editors are in the same repository.
- Sites that must keep working without a CMS service: the files are the source of truth, so a build from a clone is complete.
- Documentation and marketing pages on an existing Next.js or Astro site.

## When it does not

- **A large editorial team.** Non-technical editors need accounts, roles and a hosted admin. That means Tina Cloud or self-hosting the backend, and at that point you are paying and operating a CMS anyway.
- **Thousands of documents.** A Git repository is not a query engine. Every content change becomes a commit and a rebuild, and the build time grows with the content.
- **Publishing workflows with scheduled releases and approvals.** Some of it is possible, but it is not the product's centre of gravity.

The decision rule I use: if the content is closer to code than to a newsroom, Tina is a good fit. If a content team of ten publishes daily, use a database-backed CMS and keep the repository for code.

## Practical caveats

- Every save is a commit. Without discipline, the history turns into noise; use clear commit messages from the editor or a branch per change.
- The schema is TypeScript, so a schema change is a code change. That is good for consistency and annoying when an editor wants a new field during a campaign.
- Media files can live in the repository or in an external store. For more than a handful of images, use external storage: Git is not built for binary files.
- Keep the generated `tina-lock.json` in version control. It pins the schema the admin was built against.

## Is it worth it?

If the alternative is "the client emails changes to the developer", Tina removes a real bottleneck without adding a service to the critical path of the site. If the alternative is a mature CMS with roles, scheduling and an editorial workflow, Tina is a step backwards for the people who use it most.

For content-heavy sites built with a modern framework, the same reasoning about static output and performance applies as in [Astro 5 and Core Web Vitals](/en/blog/astro-the-future-of-web-development/). And when the content is a product catalogue rather than articles, the constraints are different: [importing products into Sanity](/en/blog/automate-product-imports-ecommerce-sanity-cheerio/) covers that case.
