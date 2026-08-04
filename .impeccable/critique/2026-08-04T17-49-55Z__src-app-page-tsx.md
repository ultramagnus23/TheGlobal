---
target: The Global website (homepage + key routes)
total_score: 23
max_score: 36
na_heuristics: 7
p0_count: 1
p1_count: 3
timestamp: 2026-08-04T17-49-55Z
slug: src-app-page-tsx
---
Method: dual-agent (A: a6dc2f54cd0e958ab · B: a742c830a5ec73915)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | Filtering `/products` to an empty category (6 of 11 categories) renders a silent blank grid — no message, no explanation. |
| 2 | Match Between System & Real World | 3/4 | Strong domain fluency (SDR 11, PEI rating, GSTIN) balanced with plain language elsewhere. Docked for `timeline.ts` displaying events out of chronological order. |
| 3 | User Control and Freedom | 3/4 | Escape closes mobile menu, breadcrumbs present, filter has a clear reset. No path back from a dead-end click besides the persistent nav. |
| 4 | Consistency and Standards | 2/4 | `ProductsFilterGrid.tsx` has no empty-state message while the near-identical `products/[category]/page.tsx` does — same problem, inconsistent handling two clicks apart. |
| 5 | Error Prevention | 3/4 | `DownloadCard.tsx` checks file existence server-side before offering a link — excellent. *(Originally scored 2/4: every dynamic route — product, category, project pages — was silently 404ing. Root-caused and fixed during this audit: `middleware.ts` used a file-convention deprecated in this Next.js build in favor of `proxy.ts`; production `next build` masked it because SSG pre-renders those routes regardless. Score reflects the corrected state — see Priority Issues.)* |
| 6 | Recognition Rather Than Recall | 3/4 | Persistent header, breadcrumbs, `sr-only` labels on icon buttons, icon+text stock chips (never color alone). Solid. |
| 7 | Flexibility and Efficiency | n/a | Persuade-mode marketing/lead-gen site — no expert workflow exists to accelerate. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Disciplined type scale and whitespace. Docked for a 12-button flat filter row competing for attention on an otherwise minimal `/products` page. |
| 9 | Error Recovery | 2/4 | Form errors are specific and inline (good). The empty product-filter state and the generic 404 page offer no context-specific recovery. |
| 10 | Help and Documentation | 1/4 | Scored (not n/a) because spec sheets/catalogues/authorisation letters are a literal named product of this business. `public/downloads/` doesn't exist — 0 of 8 documents are live anywhere on the site. |
| **Total** | | **23/36 (64%)** | **Acceptable — significant improvements needed before users are happy** |

*(#7 marked n/a per Persuade-mode rule; total renormalized to /36.)*

## Design Specificity Verdict

**LLM assessment**: This is not a reskinned template. The copy voice ("We hold stock. That is the entire business model." / "We say no when we mean it.") is written specifically for a company whose entire pitch is standing inventory over backorders, and the data model backs it up structurally — `Product.availability` drives both the visible stock chip and the JSON-LD `Offer.availability`, and WhatsApp deep-links pre-fill the specific product name. The two-entity structure (two GSTINs, two mandates, two accent colors) genuinely encodes an unusual business detail correctly.

Where it slips into category-interchangeable territory: the homepage's dominant mode — full-bleed editorial sections, a scroll narrative, a timeline, a values triptych — is a layout pattern any premium B2B distributor could ship with different nouns. The differentiation lives in the words, not yet in the interaction design: nothing on the page *behaves* differently because this is a stock-not-backorder business. There's no live stock check, no warehouse-depth visualization, no "dispatched today" signal tied to real data — exactly the gap the separate full-rebuild brief (Stock Board, Dispatch Map) is meant to close.

**Deterministic scan**: The detector's `cream-palette` rule fired on every single page checked (5/5) — the current "Ink & Brass" warm-cream palette is itself a recognized, common pattern the tool flags on sight, which cuts against design specificity at the token level, independent of the copy layer above it. `overused-font` (Inter, 79–93% of text) also fired on all 5 pages. No false positives identified in the 2 CLI findings (`border-accent-on-rounded` in `AuthorisationBlock.tsx:16` and `BentoGrid.tsx:41` — both genuine: a `border-t-2` accent against fully rounded card corners).

**Visual overlays**: Browser-injected evidence (not a persistent on-page overlay in this run — see Assessment B methodology) surfaced real, specific defects beyond what either the source read or the browser walkthrough alone caught:
- **Contrast failures**: 1.1:1 on homepage body text (`#16150f` on `#0e0d0a` — near-invisible, needs 4.5:1), 1.8:1 and 2.7:1 on badge/pill text over photography, and on `/astral`, white hero text at 1.1:1 against a light background (`#ffffff` on `#f5f1e8` — this reads as a hero-scrim/overlay bug, not a token choice, since white-on-cream is backwards).
- **`em-dash-overuse`**: 18 em-dashes in homepage body text, 12 on `/astral`, 10 on `/contact` — a direct, measured violation of the separate rebuild brief's explicit copy rule ("No em dashes. Use commas, colons, semicolons, periods, parentheses").
- **`kicker-above-heading` ×4, `all-caps-body` on multiple eyebrows, `cramped-padding`** on the WhatsApp CTA and filter buttons (0px vertical padding at 18–20px text size).

## Overall Impression

The writing is the best asset here — specific, confident, and provably grounded in the same facts the legal data uses. But right now that voice is fronting a site where the actual browsing experience actively worked against it: every product, category, and project link led to a dead end (found and fixed mid-audit — see below), spec sheets and catalogues don't exist anywhere, and the visual system a detector can measure in seconds (1.1:1 contrast, 18 em-dashes, a palette the tool recognizes on sight) undercuts the craft visible in the copy and content model. The single biggest opportunity: make the site *behave* like a standing-inventory business, not just describe one — the separate rebuild brief's Stock Board and BOQ Builder are exactly that; right now nothing on the page reacts to or proves the inventory claim in real time.

## What's Working

1. **Brand voice encoded as product truth, not slogans.** `CareSection.tsx`'s three pillars map 1:1 to `facts.claims` in the content layer — the persuasive copy is provably grounded in the same facts the legal/GSTIN data uses, not invented separately.
2. **Accessibility as structural decision.** The 18px/20px body-text floor is explicitly justified in code comments for an older audience reading outdoors on a phone — a specific persona reasoning, not a generic checkbox. Paired with 56–64px touch targets, a sitewide focus ring, and `prefers-reduced-motion` handling.
3. **`DownloadCard`'s server-side existence check.** Rather than shipping broken links for content that isn't ready, it checks the file actually exists and swaps to an honest "not posted yet, call us" state — exactly the kind of error-prevention craft most of the rest of the routing layer didn't get (see P0 below).

## Priority Issues

**[P0 — found and fixed during this audit] Every dynamic route silently 404'd.** `/products/[category]`, `/products/[category]/[slug]`, `/astral/[category]`, `/somany/[category]`, and `/projects/[slug]` all returned a live 404 in dev, confirmed via server logs (`GET /products/cpvc-pipes/cpvc-pipe-sdr-11 404`) — every product card, "Explore ›" link, and project plate sitewide led nowhere. Root cause: `src/middleware.ts`, added earlier this session for noindex headers, used a file convention this Next.js build deprecated in favor of `proxy.ts` (confirmed in `node_modules/next/dist/docs`). Production `next build` masked it entirely because SSG pre-renders those routes at build time regardless of the runtime routing bug — this would have shipped invisibly. **Fixed**: renamed to `src/proxy.ts` / `export function proxy()`, confirmed all dynamic routes now resolve 200 in both dev and a fresh build. Recorded here because it was real, severe, and specific to this codebase, not a generic critique point.

**[P1] Silent empty state on the products filter.** Selecting 6 of 11 categories on `/products` (UPVC Pipes, Fire Protection, Adhesives & Sealants, Water Storage Tanks, Large Format Slabs, Bath Fittings) produces a blank grid with zero message, confirmed live. `ProductsFilterGrid.tsx` has no empty-state branch, unlike the near-identical `products/[category]/page.tsx`, which shows "Full range available — call us for current stock and pricing on this category."
**Why it matters**: this is the exact moment a skeptical builder tests the "large standing inventory" claim, and the site's answer is silence — the opposite of the "we say no when we mean it" honesty the brand claims elsewhere.
**Fix**: port the existing fallback copy into `ProductsFilterGrid.tsx`.
**Suggested command**: `/impeccable harden`

**[P1] Zero of 8 documents exist; every download sitewide is disabled.** `public/downloads/` doesn't exist on disk. Confirmed live: all 3 Astral downloads render "Not posted online yet."
**Why it matters**: Architects/Specifiers and Government/Infrastructure — 2 of 5 named buyer personas — self-qualify vendors through documents before ever calling. Today they get nothing to download anywhere on the site.
**Fix**: prioritize both authorisation letters, GST certificates, and one catalogue per brand first.
**Suggested command**: `/impeccable harden`

**[P1] Text contrast fails WCAG in multiple places, one severely.** Detector-measured: 1.1:1 on homepage body text (need 4.5:1), 1.1:1 on `/astral`'s hero heading and lead paragraph (white text on a light cream background — almost certainly a missing/broken scrim over the hero image rather than an intentional token pairing).
**Why it matters**: this isn't a subjective aesthetic call, it's a measured accessibility failure that fails WCAG AA outright and, on `/astral`, likely reads as flat-out illegible over certain hero images.
**Fix**: audit every text-over-image/text-over-photo pairing for a scrim; re-check the `#16150f`/`#0e0d0a` pairing, which looks like a near-duplicate color bug rather than a deliberate low-contrast choice.
**Suggested command**: `/impeccable audit`

**[P2] The one persona-routing section on the homepage is buried at position 10 of 11.** "Who we supply" (`AudienceRow`) is the only homepage block that routes Dealers, Builders, Architects, Government, and Homeowners differently — and it sits after nine sections of brand narrative.
**Why it matters**: a first-time visitor from any of the five buyer types has to scroll through the entire editorial story before reaching the one block that tells them where to click next.
**Fix**: surface a condensed version near the top, directly under the hero.
**Suggested command**: `/impeccable layout`

**[P2] 18 em-dashes on the homepage alone, against the project's own stated copy rule.** Detector-measured across pages; the separate full-rebuild brief explicitly bans em-dashes ("No em dashes. Use commas, colons, semicolons, periods, parentheses").
**Why it matters**: small on its own, but it's a measurable, already-decided style violation that will recur at scale as the catalogue and project pages grow — cheap to fix now, expensive to sweep later.
**Fix**: pass a copy lint over `src/content/*.ts` and component-inline copy.
**Suggested command**: `/impeccable clarify`

## Persona Red Flags

**Jordan (confused first-timer, builder/contractor checking stock and getting a quote):**
- Lands on hero, clicks "View Products" — clear, no confusion.
- On `/products`, sees legible "In stock"/"Limited stock" chips — exactly what Jordan needs.
- Clicking a category the demo catalogue doesn't populate (e.g. "UPVC Pipes & Fittings") gets a blank page with no explanation — Jordan can't tell "we don't stock this" from "the site is broken," directly undercutting the inventory claim.
- *(Originally: clicking a real product card 404'd before Jordan could reach the enquiry action — now fixed; Jordan can complete this path.)*

**Riley (deliberate stress tester, architect/specifier downloading a spec sheet):**
- Goes to `/downloads` — all 8 documents show the disabled state. Zero self-serve documents exist anywhere.
- Tries the per-product route instead (the schema has `Product.downloads` for exactly this) — now reachable post-fix, but still surfaces the same "not posted yet" fallback, since no files exist on disk.
- Catches the out-of-order timeline and the mismatch between the generic header phone number and the entity-specific numbers used elsewhere — compiles a pattern that reads as "the deeper layer of this site isn't finished," a disqualifying signal for a tender-grade evaluation regardless of how strong the top-level copy is.

## Minor Observations

- Desktop nav omits "Become a Dealer" and "About" — Dealers is one of five named personas with its own landing page, reachable only via mobile menu or footer.
- Homepage stat counters (`CountUp`) render literal "0" in server-rendered HTML before JS animates them up — confirmed in rendered text output. Anyone on a slow connection or a crawler sees the opposite of the intended message.
- `content/timeline.ts` lists events out of chronological order (2012 before 2009) — currently demo data, but the rendering has no sort, so this will recur with real dates unless fixed structurally.
- Placeholder business data (`+91 90000 00001`, `08DEMOX1234A1Z5`) sits directly next to well-crafted authorisation/credibility copy — flagged separately from the demo banner itself as a pre-launch checklist item.
- Detector: `border-accent-on-rounded` in `AuthorisationBlock.tsx:16` and `BentoGrid.tsx:41` — a `border-t-2` accent clashing with fully rounded corners on both.

## Questions to Consider

1. If "we hold inventory, not backorders" is the entire pitch, why does nothing on the page *behave* differently because of it — no live stock check, no depth visualization, no real-time "dispatched today" signal?
2. The homepage makes it structurally harder to reach "Who we supply" — the only section that routes each buyer type to their next step — than it does to read the editorial brand story. Is this homepage's job to tell a story or to route a task?
3. Every architect- and government-facing proof point (spec sheets, catalogues, authorisation letters, GST certificates) is currently a dead end. Would a tender committee read that as "documents pending" or as a reason to doubt the "exclusive authorised distributor" claim?
4. The most specific, ownable writing on the site lives in `CareSection` ("We say no when we mean it"). Why doesn't that honesty show up in the actual browsing experience — as an empty-state message, or copy near the download library — where it would do the most trust-building work?
