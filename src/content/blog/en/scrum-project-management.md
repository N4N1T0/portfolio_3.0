---
title: 'Scrum for Web Projects: Sprints, Roles and Estimates'
date: 2023-09-15
dateModified: 2026-10-22
excerpt: 'How Scrum works on a client web project: sprint length, user stories, story points, the two roles that matter and where the process breaks.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'es/gestion-en-scrum'
tags: ['process', 'scrum']
---

Scrum is written for product teams with a permanent backlog. A client web project is different: it has a deadline, a scope that somebody signed, and a stakeholder who is not in the room every day. Most teams adopt the ceremonies and skip the parts that make it work in that context, then conclude that Scrum is bureaucracy.

I have run small client projects with it for years. This is the version that survives contact with a real contract.

## Sprint length: two weeks, almost always

One-week sprints work for a mature product with a responsive product owner. On a client project, one week is often too short to produce something a non-technical stakeholder can evaluate, so reviews turn into status meetings.

Two weeks gives enough time for a vertical slice: a page that renders, a checkout step that completes, a form that stores data. That matters more than velocity. If the demo at the end of the sprint is not something the client can click, the sprint produced tasks rather than value.

Four-week sprints hide problems for too long. By the time the review arrives, a wrong assumption has been baked into a month of work.

## User stories with an acceptance condition

A story is not a task with a persona attached. The useful form is:

> As a returning customer, I can pay with a saved card so I do not re-enter details.
> Done when: the saved card appears in checkout, payment succeeds in the test environment, and the order shows in the admin panel.

The "done when" clause is what makes a story estimable and testable. Without it, "payment with saved card" can mean a UI mock or a working integration, and the estimate is meaningless until someone guesses which.

I keep technical work in the same backlog, visible to the client: migrations, analytics events, the cookie banner nobody wants to schedule. Hiding it produces a sprint that looks on track while the launch date quietly moves.

## Story points, honestly

Story points estimate complexity, not time. That is the theory, and it is right, but the practical value is different: points let the team compare two stories without arguing about hours.

What points do not do is tell a client when it will be ready. For that you need a second number: average completed points per sprint. Once you have three sprints of history, the range of the next one is defensible. Before that, any date is a guess wearing a spreadsheet.

Two rules keep estimation honest:

- Estimate together. An estimate from one developer is a preference.
- Split anything above the team's largest completed story. If it cannot be split, it is a spike: time-boxed research, not delivery.

## The two roles that matter

Scrum defines three roles, and the [Scrum Guide](https://scrumguides.org/scrum-guide.html) is short enough to read once a year. On a client project, two of them decide whether the process works:

- **Product owner:** one person with authority to decide priority and accept work. If the client sends three stakeholders with different opinions and no tie-breaker, every sprint review becomes a negotiation and the backlog becomes a wish list.
- **Scrum master:** the person who removes blockers and protects the sprint. On a small team this is often the same person as the tech lead, which is a conflict of interest in theory and unavoidable in practice. It works as long as blocking issues are written down and reviewed, not handled from memory.

The development team is everyone who does the work. I do not split design and development into separate ceremonies: a story that needs both is one story.

## Where it breaks

Four failure modes account for most of the disappointment:

1. **No product owner with authority.** Priorities change weekly and nothing gets accepted.
2. **The sprint becomes a deadline.** Stakeholders start treating the review as a delivery commitment, and the team stops estimating honestly.
3. **No definition of done.** "Finished" means different things to design, development and the client, so nothing is ever really finished.
4. **Retrospectives with no action.** The team lists the same three problems every two weeks and changes nothing.

The last one is the cheapest to fix: one action per retrospective, assigned to a person, reviewed at the next one. If a team cannot sustain that, no framework will help.

## What it buys

The payoff is not speed. It is a shorter feedback loop between what the client imagined and what the site does. A two-week demo catches the wrong assumption while it is still cheap, and the backlog absorbs change without renegotiating the whole contract.

For a solo freelance practice, the lightweight version is simpler than Scrum: one board, one weekly review, one written scope per phase. I described that setup in [using Notion to run freelance projects](/en/blog/using-notion-to-improve-your-projects/). Use Scrum when there is a team and a stakeholder who needs to see progress; do not use it to look agile in a proposal.
