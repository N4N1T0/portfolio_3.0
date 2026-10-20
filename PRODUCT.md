# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: technical recruiters and tech leads scanning fast. Secondary: potential clients or
employers looking for services, outcomes and a clear contact path. Tertiary: peers and developers
who want to read the projects, the code and the design judgement.

The first viewport serves the recruiter. A visitor who is not a recruiter still finds their path
deeper down; nobody is asked to read in detail.

## Product Purpose

A personal portfolio site: one surface that shows who the owner is, what has been built, and how to
reach them. Success means a recruiter understands role, experience and evidence within seconds, and
a client finds a working contact route without hunting.

## Positioning

The work is presented the way it was made: a terminal-driven, retro-pixel, minimal interface where
the craft is visible in the execution rather than in decoration. The site itself is the first
project: the aesthetic and the engineering are the same claim.

## Operating Context

Static site, read on a phone in a browser as often as on a desktop. Visitors arrive from a job
board link, a shared URL or a direct type-in. Text is in English by default with a Spanish
translation available; both versions must be indexable and must point at each other.

## Capabilities and Constraints

- Astro static output, no server runtime. Every page must work from a CDN.
- The home is a single terminal screen: boot loader, typewriter, then a command list and a prompt.
  The typed text exists in the HTML, the animation only reveals it.
- English default locale, Spanish secondary, switchable without a reload and without leaving the
  page. Both are indexable and point at each other with hreflang.
- Real content lives in `src/data/profile.ts` and `src/data/copy.ts`, so the owner edits it in one
  place.
- Undecided: the contact mechanism (email link, external form service, calendar link).
- The projects, blog and snippet pages were migrated from portfolio_2.0 into this repository with
  their original slugs, so the indexed URLs keep their address. The old site can be retired once
  this one is deployed.
- The production domain is `https://www.adrian-alvarez.com` and the deploy target is Vercel, both
  taken from the predecessor and confirmed by the owner.

## Brand Commitments

- The visual direction is pinned by the owner: minimal, retro, pixel, read as a terminal. Retro and
  pixel are the material, not a costume: the page must feel like a machine interface, not like
  decoration applied to a landing page.
- The owner pinned the experience, not only the look: everything on one screen, a retro terminal
  loader, then a typewriter that writes the basic information.
- The identity continues portfolio_2.0: the pixel monogram `AAA` and the Geist Pixel typeface are
  carried over, and the terminal keeps the same `/en/` and `/es/` URLs so the indexed pages of the
  old site keep their address.
- The site is for the owner's own work. No invented clients, testimonials, metrics or numbers.

## Evidence on Hand

- The live predecessor, `https://www.adrian-alvarez.com/en/`, is the reference implementation and
  the source of the real content: name, role, employer, location, email, phone, four social
  profiles, six project case studies, five blog posts, snippets, certifications and the work
  history. It is the evidence, and it is the anti-reference for the look.
- Project, blog and snippet pages still live in portfolio_2.0. They are linked from the terminal
  and must exist before this site replaces the old one.
- The Geo pixel typeface is the incumbent display face and is self-hosted from Fontsource.
- Nothing else. No testimonials, no client logos, no performance benchmarks exist. The build must
  not fabricate any of them.

## Product Principles

1. The first viewport answers who and what, without scrolling and without reading.
2. Real work leads; the interface recedes.
3. Nothing invented. Synthetic content is labelled and listed for replacement.
4. One grammar, one rhythm, and the same interaction vocabulary on every page.
5. Fast and crawlable: a page that loads in one round trip and can be indexed per locale.

## Accessibility & Inclusion

Every interactive element reachable by keyboard with a visible focus state, text contrast meeting
WCAG AA against the actual background, and the terminal aesthetic never carried by colour alone.
Motion respects `prefers-reduced-motion`.
