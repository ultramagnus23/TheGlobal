# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are people who need construction materials in Rajasthan and want to know stock is physically available now, not ordered in after enquiry: dealers (stock, margins, credit terms), builders/contractors (bulk pricing, site-wise dispatch timed to a build schedule), architects/specifiers (full catalogues, technical spec sheets), government/tender buyers (authorisation letters, GSTIN, tender-grade documentation), and homeowners (want to see the Somany range and find a dealer or showroom). A purchase manager on a half-lit site at dusk and an architect in a studio at night are both target visitors who need to feel the company already has everything, physically, on hand.

## Product Purpose

The Global is a Jaipur-based construction materials distributor (est. 2007, 18+ years) operating as two entities: Global Sales (authorised Astral distributor — CPVC/UPVC/SWR pipes, fittings, fire protection systems, adhesives, water tanks) and Global Marketing (exclusive authorised Somany distributor for Rajasthan — floor tiles, wall tiles, large-format slabs, sanitaryware, bath fittings). The site exists to convert enquiries into stock-backed orders across five audiences and to route each to the right entity, product, or dealer.

## Positioning

Standing inventory in a Jaipur warehouse. The Global holds stock; competitors order in only after you enquire. This is the one claim a neighboring distributor without warehouse depth could not truthfully copy. Reinforced by the exclusive state-level Somany authorisation for Rajasthan (no other Rajasthan distributor can legally claim it) and by pan-India dispatch from that same standing stock.

## Operating Context

Two-entity structure requires visible routing throughout (which entity handles which enquiry). Audiences arrive with different jobs: a dealer wants margins and credit terms, a tender buyer wants GSTIN and authorisation letters, a homeowner wants to see product in person. Product catalogue spans two distinct supplier systems (Astral plumbing/drainage, Somany tiles/sanitaryware) that must stay visually and structurally distinguishable while sharing one site. Enquiries route through a server action (src/app/actions/enquiry.ts) with email delivery currently unconfigured (logs to console only until RESEND_API_KEY or SMTP env vars are set).

## Capabilities and Constraints

- Stack: Next.js 16 (App Router), TypeScript, Tailwind CSS 4, React 19, Zod-validated content, framer-motion already a dependency. Three.js (or similar) will need to be added for the WebGL particle hero.
- Content is centralized and typed: `src/content/facts.ts` (business facts), `products.ts`, `divisions.ts` (Astral/Somany categories), `projects.ts`, `audiences.ts`, `downloads.ts`, `faq.ts`. Editing one file propagates everywhere it's used.
- **Known, accepted gap (user-confirmed, not to be treated as a blocking build failure for this engagement):** `src/content/facts.ts` still contains `{{TOKEN}}` placeholders for both entities' GSTIN, registered addresses, phone/WhatsApp numbers, and warehouse sqft — these are real business facts the user has not yet supplied. The user explicitly chose to proceed without blocking on this rather than provide them now. Do not fabricate values for these; keep the existing token convention so a real integrity-gate pass can be run later when real facts are supplied. Downloads PDFs referenced in `downloads.ts` are also not yet real files.
- **Known, accepted gap (user-confirmed):** No real photography exists yet (every image is a labelled `PlaceholderImage` per `PHOTOGRAPHY-BRIEF.md`). The user's direction: use actual product imagery sourced from the official Astral and Somany brand websites where it depicts genuine Astral/Somany product lines The Global distributes (pipes, fittings, tiles, sanitaryware) — this is standard practice for an authorised distributor showing the supplier's own product photography. Do NOT fabricate warehouse interiors, staff, authorisation certificates, or named-project photography that would misrepresent The Global's own premises or history — those stay as honest placeholders until real photography exists. Any sourced image must be fetched with the user's awareness (this falls under the "downloading a file" permission category) and captioned/attributed accurately as manufacturer product photography, not as The Global's own site photography.
- The homepage's signature particle-assembled house (hero) is hand-authored SVG/vector art, not a photograph — it is unaffected by the photography gap.
- WCAG 2.2 AA is a hard target; see `ACCESSIBILITY.md` for prior decisions and axe-core results already established.

## Brand Commitments

- Name: The Global. Domain: theglobal.co.in.
- Voice: confident, factual, slightly literary. Facts before poetry. Preserve existing lines verbatim where they appear: "We hold stock. That is the entire business model." and "Everything a building needs. Already here."
- No em dashes in copy. No heading restated in its first sentence.
- Concept spine for the whole site: raw material becomes built form (dust becomes tile, granules become pipe) — because a distributor turns scattered supply into a finished site. This is not decorative; every particle/motion moment must trace back to this idea.
- Dark "night warehouse" theme for homepage and brand pages (Astral/Somany); light "daylight dispatch" theme for catalogue, forms, and long-reading pages. OKLCH color system, ember/glaze/bone on void; no pure black or white.
- Category-reflex bans (explicit, carried from the brief): industrial-dark-plus-safety-orange-plus-concrete-texture; navy/white-plus-hard-hat-stock-photo; heritage Rajasthan pink; warm-paper editorial serif minimalism; terminal-green dark mode; glass cards over blurred warehouse photos. Also banned outright: side-stripe borders, gradient text, glassmorphism, hero-metric template, identical card grids, modal-first patterns.

## Evidence on Hand

- Real, structured business content already exists for: division/category taxonomy (Astral: CPVC, UPVC, SWR/drainage, fire protection, adhesives, water tanks; Somany: floor tiles, wall tiles, large-format slabs, sanitaryware, bath fittings), audience routing copy, FAQ, and a product schema with attributes/specs/downloads per SKU.
- Not yet on hand, and explicitly not to be fabricated: GSTIN numbers, registered addresses, phone/WhatsApp numbers, warehouse square footage, named/evidenced project case studies with real photography, authorisation certificate scans, downloadable spec-sheet PDFs. State these as open items rather than inventing figures.
- Manufacturer (Astral/Somany) official product photography may be sourced from their public websites per the Brand Commitments note above, with the user's awareness at fetch time.

## Product Principles

1. Stock reality is never more than one scroll away from any spectacle — the particle hero earns its scale because it dramatizes something literally true about the business (standing inventory), not because particles are fashionable.
2. Two entities, one experience: routing between Global Sales and Global Marketing must always be legible, never a source of user confusion about who to contact for what.
3. Design carries the persuasive load on the homepage and brand pages (Astral/Somany); the catalogue, forms, and documentation pages prioritize scanability and task completion over spectacle.
4. No fabricated specificity: placeholders stay honestly labelled placeholders until real data exists, on both content (facts, PDFs) and imagery (warehouse, staff, certificates, named projects) axes.
5. Motion always communicates assembly, settling, or dispatch — decorative-only animation gets cut.

## Accessibility & Inclusion

WCAG 2.2 AA hard target, carried from `ACCESSIBILITY.md`. The particle/canvas hero sequence specifically must: be keyboard-navigable (arrow keys advance beats when canvas is focused), pair every canvas moment with real DOM text, respect `prefers-reduced-motion` with a complete static final frame (the finished house, not a blank state), maintain visible 2px focus rings and 44px touch targets, and pass axe with zero violations.
