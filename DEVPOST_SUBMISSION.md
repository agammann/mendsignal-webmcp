# Pulse — Devpost submission copy

## Project name

Pulse

## Tagline

The open repair memory for humans and agents.

## One-line summary

Pulse turns human repair observations and AI-agent information work into structured, reusable evidence through ten real WebMCP tools.

## Inspiration

Repair knowledge is everywhere and nowhere. A successful fix might be buried in a forum comment, a video, a repair café log, or someone's memory. Even when someone finds useful advice, the result usually disappears after the problem is solved.

We wanted to explore a different kind of open web: one where humans and AI agents do not just consume information together, but actively improve the structured knowledge available to the next person. Pulse turns individual repair experiences into shared repair evidence.

## What it does

Pulse is an open repair knowledge network where humans and AI agents troubleshoot physical objects together.

People create cases describing a product, symptoms, diagnostic observations, repair attempts, and final outcomes. An agent visiting the same site can search similar repairs, inspect successful and unsuccessful outcomes, create a new case, add diagnostic steps, record observations supplied by the human, and document whether the final repair worked.

The AI handles information retrieval and organization. The human provides physical-world observations and performs appropriate repairs. When the repair is finished, the result becomes reusable knowledge for the next person experiencing the same problem.

## Why WebMCP

Pulse is designed around structured agent interaction rather than visual browser automation. Without WebMCP, an agent would need to inspect pages, identify controls, reverse-engineer forms, and simulate human interaction.

Pulse instead exposes ten explicit capabilities including `search_repairs`, `get_repair_case`, `create_repair_case`, `add_diagnostic_result`, and `record_repair_outcome`. The agent knows exactly which actions are supported and receives compact structured data in return. WebMCP is the product architecture, not a decorative integration.

## How it creates a better user experience

Repair troubleshooting usually means switching among search results, videos, forum threads, notes, and the object itself. Pulse lets the user stay focused. They describe the problem to their agent; the agent retrieves structured repair evidence, compares previous outcomes, records the person's observations, and keeps the history organized.

The page updates alongside the agent. A visible activity panel shows searches, case creation, diagnostic changes, and outcomes, so automation is legible instead of mysterious.

## What people and agents can do together

An AI agent cannot physically inspect a broken controller, keyboard, bicycle, or computer peripheral. A person cannot instantly compare thousands of previous repair attempts.

Pulse gives each participant the work they are best at. The agent searches and organizes collective knowledge. The human observes the physical world and reports the result. Together they create a repair trail neither could create independently, and every completed case can help the next human-agent pair.

## How we implemented WebMCP

Pulse registers application capabilities through the current imperative browser model context API: `document.modelContext.registerTool(...)`, with a carefully feature-detected `navigator.modelContext` fallback.

Every tool has a descriptive name, JSON Schema input contract, explicit required fields, read-only annotations where appropriate, compact structured output, and safe error handling. Community-authored content is marked untrusted. Read tools query public repair evidence; mutation tools create cases, diagnostic records, repair attempts, outcomes, and community votes.

The tools call the same Next route handlers and Cloudflare D1 database as the React interface. Successful mutations dispatch a page event, refresh visible state, and add an activity record. The result is genuine application behavior rather than an isolated agent demo.

## Challenges we ran into

The largest design challenge was deciding what the visiting agent should do versus what the website should do. It would have been easy to build another chatbot that generated repair suggestions. Instead, the site provides durable structured tools and state; the visiting agent supplies reasoning and conversation; the person supplies physical evidence.

We also had to treat repair knowledge carefully. Not every repair is appropriate for DIY work. Every case has a low-risk, moderate-risk, or professional-recommended classification. Higher-risk histories remain retrievable, but the server refuses procedural diagnostic steps and recommends qualified service.

Finally, repair confidence needed to be credible. Pulse avoids opaque AI percentages and shows Repair Evidence instead: reports, attempts, fixed/improved/did-not-work counts, median time, and typical cost.

## Accomplishments that we're proud of

- Ten real imperative WebMCP tools backed by the production database
- One coherent human + agent workflow from search to final outcome
- Visible mutation activity and immediately refreshed repair timelines
- Thirty believable, labeled demo histories across nine product categories
- Deterministic weighted matching with overlapping successes and failures
- Relational D1 persistence, validation, constraints, safety gates, and rate limiting
- A polished responsive interface that remains useful without WebMCP
- Seven passing automated workflow tests and a production worker build

## What we learned

WebMCP changes the application design question. Normally the visual interface becomes an accidental API that an agent must reverse-engineer. With WebMCP, human and agent interfaces can be designed intentionally around the same capabilities.

That shifted our attention away from browser automation and toward collaboration: which actions are safe, which evidence only a human can provide, which state should be transparent, and how a successful interaction improves the next one.

## What's next

Pulse could grow into a broader open repair ecosystem with Open Repair Data Standard import/export, manual references, parts compatibility, repair café integrations, manufacturer documentation, repairability statistics, regional parts sourcing, verified contributor reputation, richer product identification, and community moderation.

The long-term idea is simple: when something breaks, the open web should remember what actually fixed it.

## Built with

WebMCP, Next.js, React, TypeScript, Vinext, Tailwind CSS, Cloudflare Workers, Cloudflare D1, Drizzle ORM, OpenAI Sites, Node.js test runner, and Lucide icons.

## Links

- Live application: **https://pulse.alx21.chatgpt.site**
- Source code: **https://github.com/agammann/pulse**
- Demo video: **https://youtu.be/TlpEn9vFPhI**

## Suggested gallery captions

1. **Repair Evidence, not opaque confidence** — Compare successful and failed outcomes, time, cost, and community verification.
2. **One timeline shared by human and agent** — Diagnostic steps, physical observations, attempts, and final outcome remain visible together.
3. **Ten discoverable WebMCP capabilities** — Typed tools let agents use the real application without scraping the interface.
4. **Transparent agent activity** — Every search and mutation is visible while the ordinary human interface remains fully usable.
