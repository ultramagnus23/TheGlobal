# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Five buyer types land on this site with different jobs:

- **Dealers/retailers** — want stock depth proof, margins, and credit terms.
- **Builders/contractors** — want to know if a material is in stock today and when it reaches their site.
- **Architects/specifiers** — want spec sheets and technical data with no phone call required.
- **Government/infrastructure/tender buyers** — want authorisation letters, GSTIN, and tender-grade documentation.
- **Homeowners** — want to see the Somany range and find a showroom/dealer.

## Product Purpose

The Global is a construction-materials distributor in Jaipur, Rajasthan, operating since 2007 through two legal entities. The website exists to convert each of the five buyer types by making the single differentiator undeniable: they hold standing warehouse inventory rather than ordering in after an enquiry.

## Positioning

Standing inventory in a Jaipur warehouse is the mechanism a neighbouring distributor cannot truthfully copy without holding the same stock. Everything on the site — the copy, the planned live stock board, the honesty about out-of-stock items — exists to make that claim checkable, not just stated.

## Operating Context

Two legal entities under one brand:
- **Global Sales** — Authorised Astral distributor: CPVC/UPVC/SWR pipes, fittings, fire systems, adhesives, water tanks.
- **Global Marketing** — Exclusive Authorised Somany distributor for Rajasthan: floor tiles, wall tiles, large-format slabs, sanitaryware, bath fittings.

Warehouse and dispatch operate out of Jaipur, serving dealers and site teams across Rajasthan's districts. Buyers site-visit, call, or browse the catalogue before committing to a bulk or phased order.

## Capabilities and Constraints

- Next.js App Router site (existing codebase), TypeScript, Tailwind, deployed on Vercel.
- **Data integrity is a hard, build-failing constraint carried over from a prior audit**: no `{{PLACEHOLDER}}` tokens, no zero-rendering counters, no dead tel:/wa.me links, no empty Downloads rows presented as live, no category filters for categories with zero products. A prebuild validator already exists for parts of this (`scripts/validate-content.ts` from Phase 0) and must keep failing the build on violations as new work lands.
- The site currently runs on clearly-labelled DEMO data (a site-wide banner) — real GSTIN, addresses, and phone numbers have never been supplied. Any new work must keep this honest rather than implying the placeholders are real.
- A real Somany 2026 catalogue PDF was supplied mid-project and used to populate real collection names/sizes/regions into the product catalogue; the PDF's own photography was not extracted (Somany's copyright) — generated stand-in imagery was used instead, labelled by convention as AI-generated pending real photography.
- No Higgsfield/Monid/ffmpeg CLIs are installed in this environment, so any AI-video-chain approach (scroll-world style) is not executable here without the user installing and authenticating those tools themselves.
- Free-tier image generation (Z-Image-Turbo via an MCP tool) is available but rate-limited (hit a daily quota mid-session); not a reliable unlimited asset pipeline.

## Brand Commitments

Voice: confident, factual, slightly literary, facts before poetry. Specific lines the user has asked to be preserved verbatim across rebuilds: "We hold stock. That is the entire business model." No em dashes in copy (explicit, repeated instruction — enforced project-wide, including in code comments authored for this project).

## Evidence on Hand

- Real product data for ~12 SKUs across Astral and Somany categories (`src/content/products.ts`), including 7 added from the real Somany catalogue PDF (Duragres Master, Durastone Master, Ceramica Neolla, Coverstone Technical Porcelain, Marvela Flortuff Master, Somany Vanity Collection, Somany Instant Geyser).
- Real project case studies are explicitly TODO — `content/projects.ts` currently holds placeholder case studies pending real ones; no real project photography exists yet.
- No real downloadable PDFs exist yet (catalogues, price lists, authorisation letters) — `DownloadCard` degrades gracefully to a "call us" state rather than a dead link, by design.
- No real business facts (GSTIN, phone numbers, registered address, warehouse sqft) have been supplied — `src/content/facts.ts` and `company.ts` hold `{{TOKEN}}`-style or DEMO-labelled placeholders.

## Product Principles

1. Facts precede poetry — every persuasive claim ships with the evidence next to it, not just the sentiment.
2. Absence is honest — a missing value renders as nothing, never as a placeholder, zero, or fabricated data.
3. The interaction should behave like a standing-inventory business, not just describe one — this was the identified gap in the previous design pass (a static, editorial-brochure feel despite a real-time-inventory pitch).
4. Two-entity reality (Global Sales vs. Global Marketing) is real legal/GSTIN structure, not a stylistic device — it must stay accurate wherever contact/authorisation info appears.

## Accessibility & Inclusion

WCAG 2.2 AA is an explicit, repeated requirement across this project's briefs: full keyboard navigability, visible focus rings, 44px touch targets, complete `prefers-reduced-motion` fallbacks that lose no information, axe zero violations. A large share of the real-world buyer base is expected to read Hindi first; a Hindi toggle has been requested but not yet built.
