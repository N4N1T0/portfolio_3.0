---
title: 'Responsive Design and Core Web Vitals: A Field Guide'
date: 2023-06-19
dateModified: 2026-10-22
excerpt: 'Responsive design is a performance budget, not a breakpoint list: mobile-first layout, image strategy and how it moves LCP and CLS.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'es/guia-diseño-responsive'
tags: ['design', 'performance', 'seo']
---

Responsive design is usually taught as a list of breakpoints. That framing produces sites that reflow correctly and still feel broken: images that jump as they load, text that needs pinch-zoom, a menu that covers the page. The useful definition is stricter. A responsive site is one that keeps its layout, its images and its interaction working across every width a real device reports, without paying for it in performance.

That definition has consequences, and most of them are measurable.

## Start at 320 pixels, not at 1440

Most design reviews happen on a large screen, so the smallest case gets designed last and tested least. I start the other way around:

- Design the narrow layout first, at 320 px. That is close to the floor of the current device range.
- Add complexity as width allows, one breakpoint at a time.
- Set breakpoints where the content breaks, not where a device catalogue says a device is.

That last point is the one that survives redesigns. The iPhone 12 and a Galaxy S21 do not need separate layouts; a navigation that no longer fits at 900 px does.

## Measure the three vitals that matter

Google's [Core Web Vitals](https://web.dev/articles/vitals) are field metrics, measured on real sessions. Three numbers describe almost all responsive failures:

| Metric | Good         | What breaks it on mobile                                              |
| ------ | ------------ | --------------------------------------------------------------------- |
| LCP    | under 2.5 s  | hero images, web fonts, client-rendered above-the-fold content        |
| CLS    | under 0.1    | images without dimensions, late-loading banners, injected cookie bars |
| INP    | under 200 ms | long JavaScript tasks, heavy third-party scripts, hydration           |

A responsive layout that loads a 2 MB hero image to a phone on a 4G connection fails LCP regardless of how clean the CSS is. Layout and weight are the same problem.

## Images carry most of the budget

Images are the largest request on most content pages, so the order of operations is:

1. Serve a modern format. WebP is the practical baseline; AVIF is smaller but slower to encode.
2. Generate several widths and let the browser choose with `srcset` and `sizes`.
3. Set `width` and `height` on every image, or an aspect ratio in CSS. This is the cheapest CLS fix that exists.
4. Lazy-load below-the-fold images only. Lazy-loading the hero delays LCP by design.

```html
<img
	src="/hero-800.webp"
	srcset="/hero-480.webp 480w, /hero-800.webp 800w, /hero-1600.webp 1600w"
	sizes="(min-width: 768px) 50vw, 100vw"
	width="1600"
	height="900"
	alt="Checkout summary on a phone"
/>
```

On this site every image is converted once to WebP at quality 85. The build does not emit PNGs, because a 3 MB screenshot of a UI is not worth the fidelity.

## Typography and touch targets

Two details separate a page that works on a phone from one that merely fits:

- **Body text at 16 px or more.** Anything smaller triggers zoom on iOS, and zoom breaks the viewport assumption the layout was designed around.
- **Touch targets of at least 44 by 44 px.** A row of 24 px icon buttons is unusable with a thumb even when it looks tidy in a screenshot.

Line length matters too. A paragraph that spans 110 characters on a desktop is hard to read; cap the measure around 65 to 75 characters and let the column stay narrow at large widths.

## Container queries, and when they are the wrong tool

Media queries measure the viewport. That is correct for a page and wrong for a component inside a resizable panel. If you build a preview or a dashboard where a card can be narrow while the window is wide, media queries will lie to you, and the component will overflow in a container that has plenty of room.

[Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) fix that case. They do not replace media queries: a page-level layout still responds to the viewport. I learned the distinction the hard way while [writing every component twice](/en/blog/writing-every-component-twice/) for a registry with a resizable preview, and the lesson generalises: choose the query by what actually constrains the component.

## Test the states nobody designs

A responsive review that only loads the default state misses the failures users hit:

- Long product names and prices with six digits.
- Empty search results and error states.
- The mobile menu open while the page is scrolled.
- Keyboard navigation and visible focus rings.
- Zoom at 200%, which is an accessibility requirement, not a preference.

None of these need a device farm. They need ten minutes with the browser at 320 px and the network throttled to "Slow 4G".

## The checklist

1. Layout authored from 320 px up, breakpoints set by content.
2. LCP under 2.5 s on a mid-range phone.
3. CLS under 0.1: dimensions on every image and embed.
4. INP under 200 ms: no long tasks on first interaction.
5. `srcset` and `sizes` on responsive images, modern format.
6. Body text at 16 px minimum, touch targets at 44 px.
7. Container queries only where the container, not the viewport, decides.
8. Empty, error and zoomed states reviewed on a real viewport.

Responsive design is not a phase of the project. It is a constraint on every decision, and the constraints that matter most are the ones you can measure. The rest of the technical side, from crawlability to structured data, is in the [technical SEO checklist](/en/blog/seo-optimization/).
