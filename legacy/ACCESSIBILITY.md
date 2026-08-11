# Accessibility

This site is built for a 45–75-year-old professional audience on mixed connectivity and devices —
see the governing sentence in the build brief. This document records the decisions made for that
audience and the results of the automated and manual checks run during the build.

## Mature-audience decisions (WCAG 2.2 AA target, AAA text contrast)

- **Body text floor: 18px mobile / 20px desktop.** Nothing on the site — including the footer and
  legal copy — goes below 16px. This is the single highest-impact decision in the brief and is
  enforced via the `text-body`, `text-legal` etc. tokens in `globals.css`; no component should use
  a raw Tailwind text size below `text-base` (16px) for content.
- **Tap targets: 56×56px minimum**, 64px for primary CTAs. See the `Button` component's
  `min-h-14`/`min-h-16` classes and the header/mobile-bar buttons.
- **No hover-only information.** Every icon (chip status icons, chevrons) is paired with a text
  label. The `Chip` component enforces this — it always renders an icon + word, never colour alone.
- **Colour is never the sole carrier of meaning.** Availability states (`in-stock`, `limited`,
  `made-to-order`) always pair an icon and a word with the colour (`src/components/Chip.tsx`).
- **Focus is always visible.** A global `:focus-visible` rule (`globals.css`) applies a 3px navy
  outline with 3px offset; it is never removed without an equally visible replacement.
- **No auto-playing carousels, auto-opening modals, or exit-intent popups.** The one carousel on
  the site (`Gallery`) is fully button-driven with visible ‹ › controls, never swipe-only.
- **`prefers-reduced-motion` is honoured globally** — see the media query in `globals.css`, which
  disables the `Reveal` component's fade/rise transform and all other transitions/animations.
- **No CAPTCHA.** The enquiry form uses a honeypot field plus server-side rate limiting instead
  (`src/app/actions/enquiry.ts`).
- **Skip-to-content link** is the first focusable element on every page (`layout.tsx`), jumping to
  `#main-content`.

## Automated testing performed

`axe-core` (v4.9, loaded via CDN into a live browser session) was run against the homepage and the
`/contact` page. Two real issues were found and fixed during this pass:

1. **Honeypot field breaking small-viewport layout.** The enquiry form's honeypot input used
   `left: -9999px` to hide it from real users. This caused the document's layout viewport to
   enlarge (a known browser behaviour: far-offset absolutely-positioned content can grow
   `scrollWidth`), which in turn made `position: fixed` elements with `inset-x-0` (the header,
   the mobile action bar) stretch to that enlarged width instead of the visible viewport —
   producing horizontal scroll at 320px and at 200% zoom. Fixed by hiding the honeypot near the
   origin (`h-px w-px overflow-hidden opacity-0`) instead of off-screen, and hardening globally
   with `overflow-wrap: break-word` and `overflow-x: hidden` on `html`/`body`.
2. **WhatsApp green used as link text colour**, which both failed contrast (3.75:1 against
   `--canvas-sunken`, axe-confirmed) and violated the brief's own anti-pattern #18 ("WhatsApp
   green used as a general accent anywhere other than the WhatsApp button itself"). Fixed by
   converting every such instance to a proper filled button (`bg-whatsapp`, bold white text),
   matching the pattern already used correctly in the mobile action bar.

After these fixes, axe-core reports **zero violations** on both pages tested.

### A documented false positive

axe-core also flagged the white hero/division-hero text (over a dark placeholder image with a
45%-opacity navy scrim) as failing contrast, reporting an effective background colour of
`#8f98a0`. This was investigated and confirmed as a **tool limitation, not a real defect**:

- The hero's dark backdrop is built from two stacked `position: absolute` siblings — an opaque
  placeholder fill and a semi-transparent scrim — not an ancestor/descendant relationship.
- axe-core's contrast checker walks the DOM **ancestor** chain for background colour; it cannot
  see an opaque sibling positioned behind an element via absolute positioning.
- Reproducing the arithmetic confirms this: alpha-blending the scrim colour (`navy-900` at 45%
  opacity) over the page's actual `--canvas` white background — which is what axe can see —
  produces `rgb(143, 152, 160)` ≈ `#8F98A0`, exactly matching axe's reported value.
- The real rendered backdrop (opaque `navy-900` placeholder + 45% scrim, both dark) never involves
  white at all, so the true contrast for white text matches the `/design-system` page's verified
  white-on-navy-900 ratio of 16.71:1 — far above the 4.5:1 requirement.

This pattern (dark photo + scrim + white text) is standard and will read the same way once real
warehouse/product photography replaces the placeholders (see `PHOTOGRAPHY-BRIEF.md`). If a future
contributor re-runs axe-core and sees this specific finding recur on the hero sections, this is
why — it does not need re-fixing, only documentation of why it's safe.

## Manual checks performed

- **320px viewport**: homepage, `/contact`, `/astral`, and a product detail page checked for
  `document.documentElement.scrollWidth > clientWidth` — no overflow after the honeypot fix above.
- **200% zoom** (simulated via `document.documentElement.style.zoom = '2'` at a 1280px viewport,
  equivalent to a 640px effective layout): no horizontal overflow.
- **Keyboard**: the skip link, mobile nav panel (opens on click, closes on `Escape`), and header
  hairline/mobile-action-bar scroll-triggered state were all verified functionally.

## Known gaps / recommended follow-up

- **Real Lighthouse audit.** This build environment doesn't have a way to run a full
  Lighthouse trace (mobile 4G throttling, LCP/CLS/INP measurement). Run
  `npx lighthouse http://localhost:3000 --view` locally (or via Chrome DevTools → Lighthouse)
  against `/`, `/somany`, `/products/[category]`, and `/contact` before launch, per the budget in
  the build brief (Performance ≥95, Accessibility 100, SEO/Best Practices ≥95).
- **Hindi locale** (`/hi`) is not yet built — the footer's language toggle currently links to a
  route that doesn't exist yet.
- **Real photography** — see `PHOTOGRAPHY-BRIEF.md`. Once real images replace the placeholders,
  re-run axe-core once more as a final sanity check (contrast against a real photo can differ from
  a flat placeholder fill).
