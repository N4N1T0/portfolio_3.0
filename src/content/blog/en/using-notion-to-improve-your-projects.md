---
title: 'Using Notion to Run Freelance Web Projects'
date: 2025-01-10
dateModified: 2026-10-22
excerpt: 'The Notion setup I use as a freelance developer: one database per project, a client pipeline, and templates that keep proposals and handovers short.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'es/usando-notion-para-mejorar-tus-proyectos'
tags: ['notion', 'process']
---

A freelance developer does not need a project management tool. They need three things in one place: what was agreed, what is next, and what the client has to decide. Notion is good enough at all three, and it costs nothing to start, which is why I have kept it for years.

This is the actual setup, not a list of Notion features.

## One database, not one page per project

The core is a single database called Projects, with a page per client project. Each page has the same properties:

- **Status:** lead, proposal, active, paused, delivered.
- **Client:** a relation to a Clients database.
- **Deadline:** a single date, not a range. A range hides slippage.
- **Budget and hours:** two numbers, so profitability is visible without a spreadsheet.
- **Next action:** one sentence. If it is empty, the project is not being worked on.

A page per project inside a database beats a folder per project because the database can answer questions: what is active, what is late, which client has consumed the most hours. A folder cannot.

## The project page has four sections

Every project page follows the same template, and the template is short enough that I actually fill it in:

1. **Scope.** What is included, in the client's words, and what is explicitly not. This is the section that prevents arguments in month two.
2. **Decisions log.** A dated list of decisions and who made them: "2026-03-04, client approved removing the blog from phase 1". Searchable, and defensible.
3. **Tasks.** A linked database view filtered to this project. Status, owner, due date.
4. **Handover.** Credentials policy, deploy steps, where the DNS lives, what to do when something breaks.

The scope section matters more than the tool. A clear scope is the difference between a change request and a favour, and it belongs next to the work rather than in an email nobody finds.

## Clients are a pipeline, not a contact list

The second database is Clients, with the stages I actually have: conversation, proposal sent, won, active, past. Each row links to its projects and holds the last contact date.

Two rules keep it useful:

- **The next action is always written.** "Send proposal" with no date is a wish. "Send proposal, Thursday" is a plan.
- **Every call produces a note.** Three lines: what was decided, what is blocked, what happens next. Notes go on the client page, not in my head.

When a project ends, the client row stays. That is where future work comes from, and it is the cheapest marketing a freelancer has.

## What I deliberately do not keep in Notion

- **Code and issues.** They live in the repository. Duplicating them in Notion creates two sources of truth.
- **Invoices.** The accounting tool owns those. Notion holds the reference, not the document.
- **Time tracking, minute by minute.** I log hours per day per project. More granularity is a hobby, not a management system.

For team projects with a client who needs to see progress every two weeks, Notion alone is not enough structure: [Scrum for web projects](/en/blog/scrum-project-management/) covers the ceremonies and the roles that make a sprint review useful.

## A template is only worth it if it is short

I published the template I use. It has the project database, the client pipeline and the two page templates above, and nothing else. Every section I added over the years and never opened got deleted in the next cleanup.

[Open the template](https://www.notion.so/New-Project-17b38ce933b980f2b957de5e7a88c05e?pvs=4). Duplicate it into your workspace and delete what you will not use. A system you maintain for its own sake is worse than a notebook.

## Start with one project

The failure mode of productivity tooling is spending a weekend designing the system instead of doing the work. The version that sticks is smaller:

1. Create the Projects database with five properties: status, client, deadline, next action, budget.
2. Add the project you are working on today.
3. Write the scope in the client's words.
4. Add the next action.

Everything else can wait until the first time you cannot answer a question without it. When a project ships, the handover section is worth writing before the invoice: it is also the checklist for [the technical SEO pass](/en/blog/seo-optimization/) that should happen before launch.
