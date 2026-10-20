---
version: 1
slug: "en-index"
primary_target: "en/index"
related_targets: []
---

# Terminal home

## Scope

Route `/en/` and its `/es/` twin. One screen, the whole portfolio. Visitor mode: Experience (the
work leads) with a Persuade spine (who is this, can I reach them).

## Audience and job

Recruiters first: in the first seconds they must get role, evidence and a contact path. Then
clients, then peers. Everything is reachable from the same screen.

## Proof and content

Real content only, from `src/data/profile.ts` and `src/data/copy.ts`: name, role, one-line pitch,
current employer, location, contact and social links, and links to the case studies, writing and
snippets published in portfolio_2.0. No invented metrics, clients or testimonials.

## Constraints

- Static output, no server runtime, one CDN round trip.
- English default, Spanish twin, both indexable with reciprocal hreflang.
- The text must exist in the HTML for crawlers and for visitors without JavaScript.
- `prefers-reduced-motion` shows the finished screen immediately.
- Tailwind utilities carry the styling; `<style>` and the CSS layer only carry the CRT material
  (scanlines, vignette, caret) that has no utility.

## Direction contract

**THESIS**: The portfolio is a machine you boot, not a page you scroll: a CRT terminal that posts
its BIOS, types the operator's identity, and then waits for a command. It refuses the category
default of a hero headline over a row of cards.

**OWN-WORLD**: Amber phosphor on a warm near-black ground (#0a0805 / #ffb000), Geist Mono for the
terminal body and Geist Pixel for the chrome, hairline #2a2214 rules, square window buttons, a
single bright amber for state and one dim amber for everything else. Scanlines and a radial
vignette sit over the whole viewport. No radius, no gradients, no glass, no shadow as decoration.

**STORY**: A visitor arrives, the machine boots, the terminal types who the operator is and where
they work, and a command list appears: projects, blog, snippets, github, linkedin, devto, email.
Nothing about the portfolio is a picture of a terminal: the screen is the navigation.

**FIRST VIEWPORT**: A top bar with the pixel monogram, the build label and a live 24h clock. Below
it, one bordered terminal window: three square buttons and `adrian@portfolio:~` in the title bar,
then the typed identity lines, then the command list, then a prompt with a blinking caret. The
window is the only object on the screen.

**FORM**: Terminal session, code-led build. The direction came from the owner, not from the roll:
the owner pinned a single-screen terminal with a retro loader and a typewriter, and the roll's
teletext direction was translated into it (numbered pages became numbered commands, the key
palette became the command list, the index page became the command list).

**FINISH**: unreviewed and undocumented is unfinished; this build ends with the finish review, the
verdict, DESIGN.md, and every shipping raster carrying its provenance
