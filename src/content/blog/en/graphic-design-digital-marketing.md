---
title: 'Graphic Design for Digital Marketing: What Matters'
date: 2023-08-17
dateModified: 2026-10-22
excerpt: 'Visual identity, formats per channel and image weight: the graphic design decisions that affect attention, trust and page speed.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'es/diseño-marketing-digital'
tags: ['design', 'marketing']
---

Most graphic design advice for marketing stops at "use consistent colours and high-quality images". That is true and nearly useless, because it does not tell you which decisions change a number. After enough campaign pages and product launches, I have narrowed it to four: consistency under pressure, format per channel, image weight, and whether the design survives being read.

## Consistency is a system, not a mood board

A brand guide that lives in a PDF nobody opens does not survive a deadline. What survives is a small set of tokens the team actually uses:

- Two type sizes for headings and one for body, with defined line heights.
- A colour palette with roles: background, text, accent, feedback. Not "blue 300" but "link".
- One spacing scale, so a section has the same rhythm on every page.
- One image treatment: crop ratio, corner radius, overlay. The same product photo should not appear square on one page and circular on another.

The test is friction. If a developer needs to invent a colour to build a new section, the system is incomplete. Design tokens in code are the version of the brand guide that gets used, because the path of least resistance is the one that ships.

## Use the formats the channel actually rewards

The same message needs different artefacts per channel, and reusing one image everywhere is the most common way a campaign looks amateur:

- **Vertical 9:16** for stories and reels. Text-safe zones matter: the platform UI covers the top and bottom.
- **1:1 or 4:5** for feed. 4:5 occupies more vertical space on a phone, which is usually worth the crop.
- **16:9** for video thumbnails and hero slots on desktop.
- **Open Graph 1200×630** for link previews. Forget this one and every share of your page looks broken.

Baking text into an image is a separate decision. It guarantees the layout, and it also means the text is invisible to screen readers and untranslatable. For anything that carries meaning, set it as text over a background image. For short campaign slogans, an image is acceptable if you add the same words to the page and the post copy.

## Image weight is a design decision

A hero image exported at 4000 px wide is not a better image. It is a slower page, and the person who chose it made a design decision with a performance cost.

The working rules I use:

- Export at the largest size the layout displays, then generate smaller variants. Never upscale.
- WebP at quality 80 to 85 is the baseline for photography. Screenshots and UI mockups compress better as WebP or PNG depending on flat colour.
- Keep a hero under roughly 200 KB if it must load first. Below the fold, lazy-load it.
- Always set `width` and `height`. An image without dimensions is a layout shift waiting to happen.

This is where graphic design and engineering stop being separate jobs. A beautiful hero that delays LCP by a second loses more than it gains, which is the same argument I make in [responsive design and Core Web Vitals](/en/blog/responsive-design-guide/) and the reason this site ships WebP only.

## Design for scanning, not for admiration

Marketing pages are read in a hurry. The design has to make the message findable:

- **One idea per screen.** If a section says three things, it says nothing.
- **Contrast that passes.** Body text at 4.5:1 against its background is a WCAG requirement, not a stylistic preference.
- **Hierarchy before decoration.** Size, weight and space do more work than shadows and gradients.
- **Real content in the mockup.** Lorem ipsum hides the failure mode: a heading that wraps to four lines in German or a product name that breaks the grid.

I review a layout by squinting at it. If the hierarchy disappears when the details blur, the hierarchy was never there.

## Alt text is part of the design brief

Every image that carries information needs a description, and the designer is the person who knows what the image is for. `alt="product photo"` is noise; `alt="waterproof jacket folded, side view"` is information. Decorative images get an empty `alt`, which is different from a missing one. The W3C [image alt tutorial](https://www.w3.org/WAI/tutorials/images/) covers the cases that are not obvious.

This matters twice: for screen reader users, and for image search. The rest of the on-page side is in the [technical SEO checklist](/en/blog/seo-optimization/).

## What I would cut

Three things consistently cost more than they return:

1. **Stock photos of people pointing at laptops.** They signal "we had no image" and add weight.
2. **Carousels.** They hide content behind interaction and are almost never used past the first slide.
3. **Text baked into a hero graphic.** It cannot be translated, indexed or read aloud.

Design that converts is usually quieter than design that wins awards, and it is always cheaper to maintain. The message itself is a separate discipline: [brand narrative for websites](/en/blog/narrative-strategies/) covers how to decide what the design is saying.
