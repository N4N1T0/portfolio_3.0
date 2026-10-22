---
title: 'Technical SEO Checklist for a New Website'
date: 2023-07-20
dateModified: 2026-10-22
excerpt: 'A practical technical SEO checklist for a new site: crawlability, information architecture, internal links, metadata and the audits that catch regressions.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'es/optimizacion-seo'
tags: ['seo', 'technical']
---

Most technical SEO work happens before the first page is published: the URL map, the crawl rules and the internal link structure are cheap to define in week one and expensive to repair in month six. This is the checklist I run on a new site, in the order I run it.

It assumes a statically generated or server-rendered site, which is what I usually ship, but the principles apply to any stack.

## 1. Decide crawlability before content

Three files control whether a crawler sees the site at all, and they are the first thing I check on an inherited project. The [Google Search Essentials](https://developers.google.com/search/docs/essentials) are the short version of the rules behind them:

- **`robots.txt`** allows the whole site and points to the sitemap. It is not a security tool: anything you disallow is still linkable and indexable if other pages link to it.
- **The sitemap** lists every canonical URL and nothing else. Staging, thank-you pages and filtered listing pages do not belong there.
- **`noindex`** is the correct tool for pages that must exist but must not rank, such as internal search results or account pages.

Then verify canonicals. Every page should declare one absolute canonical URL, with the same trailing-slash rule the server enforces. A site that answers on both `/blog` and `/blog/` splits its own signals.

## 2. Write the URL map first

A URL is a public contract. Changing it later costs a redirect and, for a while, rankings.

- Keep slugs short, lowercase and stable: `/blog/redsys-nextjs-15/`, not `/blog/2026/03/how-to-integrate-the-payment-gateway/`.
- One page, one intent. If two URLs target the same query, merge them and redirect.
- Localise with a path prefix (`/en/`, `/es/`), never with a parameter or a cookie.
- When a file name is the slug, as in this site's content collections, treat it as immutable: rename it and you break an indexed URL.

## 3. Make the document outline readable

Search engines parse headings to understand what a page covers. My rules:

- One `h1` per page, matching the page intent rather than the brand slogan.
- `h2` for the sections of the answer, `h3` only inside a section.
- No heading level chosen for its font size. Styling belongs in CSS.
- No keyword stuffing in headings: "Redsys with Next.js 15, part 2" is a heading; "redsys nextjs payments redsys gateway" is noise.

The same applies to the body. A page that answers a question in the first two paragraphs earns the rest of the click; a page that warms up for 400 words does not.

## 4. Internal links are the lever you control

Internal linking is the only ranking input you own outright. Two checks matter:

1. **No orphans.** Every page must be reachable from another page by a followed link, not only from the sitemap.
2. **Depth under three clicks.** If a post is four clicks from the home page, it will be crawled less often and rank worse than an equivalent page closer in.

Anchor text should describe the destination. "Read the technical SEO checklist" beats "click here". I keep the related-entry block at the bottom of every post for this reason: it is a structural link, not a decoration.

## 5. Metadata that earns the click

- **Title:** 50 to 60 characters is the usual visible range. Front-load the specific term; put the brand at the end, and drop it if space runs out.
- **Meta description:** 140 to 155 characters. It does not affect ranking directly, but it decides the click when the title is ambiguous.
- **One description per page.** Duplicated descriptions across a catalogue are a symptom of a template problem, not a copy problem.

Images need the same treatment: descriptive `alt` text, explicit `width` and `height`, and a modern format. This site serves WebP at a fixed quality and never a raw PNG.

## 6. Treat performance as crawl and ranking budget

Core Web Vitals are [field metrics measured on real sessions](https://web.dev/articles/vitals) and influence ranking less than relevance, but a slow page loses the visitor before any of that matters. The parts I check on every launch:

- **LCP** under 2.5 seconds on a mid-range phone: the hero image is usually the culprit.
- **CLS** under 0.1: reserve space for images, embeds and fonts.
- **INP** under 200 milliseconds: long tasks from third-party scripts are the usual cause.

Static rendering removes most of this work. That is the main reason I use Astro for content sites: [Astro 5 ships less JavaScript by default](/en/blog/astro-the-future-of-web-development/), and less JavaScript is a measurable SEO advantage. If you want the implementation details, I wrote about [responsive design and Core Web Vitals](/en/blog/responsive-design-guide/) separately.

## 7. Add structured data that matches the page

Schema is not a ranking factor by itself. It helps a search engine understand the entity, and it occasionally earns a richer result. I add only what the page actually contains:

- `BlogPosting` with `datePublished`, `dateModified`, author and image for articles.
- `BreadcrumbList` for navigation context.
- `Person` and `WebSite` at the site level.

Skip `FAQPage`: Google retired FAQ rich results for all sites in May 2026, and marking up questions nobody asked is a liability rather than a feature.

## 8. Audit what regresses

SEO on a static site breaks silently. Three habits keep it honest:

- Diff the generated sitemap after every deploy: removed URLs are either intentional or a bug.
- Check Search Console weekly for crawl errors and pages that dropped out of the index.
- Add the technical checks to CI: missing titles, missing descriptions and duplicate canonicals should fail the build, not wait for a report.

## The checklist

1. `robots.txt` allows the site and points to the sitemap.
2. Sitemap contains canonical URLs only.
3. One absolute canonical per page, consistent trailing slash.
4. Slugs short, stable and one per intent.
5. One `h1`, logical `h2`/`h3` outline.
6. Every page reachable in under three clicks.
7. Titles 50 to 60 characters, descriptions 140 to 155.
8. Images with `alt`, dimensions and a modern format.
9. LCP under 2.5 s, CLS under 0.1, INP under 200 ms.
10. Structured data that matches visible content.
11. Sitemap diff and Search Console review after each deploy.

Nothing on that list is exotic. The reason sites fail it is that nobody owns the check between launches. For an eCommerce catalogue, the same discipline applies one level deeper: [product pages carry most of the technical risk](/en/blog/8-tips-to-optimize-your-ecommerce/) because they multiply everything by the number of SKUs.
