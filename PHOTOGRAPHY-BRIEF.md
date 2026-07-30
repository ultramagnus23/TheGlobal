# Photography Brief — The Global

Every photo on the live site is currently a labelled placeholder box (grep the codebase for
`PlaceholderImage` to find every spot one is used). This brief is the shot list to hand to a
photographer in Jaipur to replace them.

## Direction

- **Warm, low-contrast, high-detail.** Natural light. No HDR crunch, no orange-teal grade, no lens
  flare, no artificial mood lighting.
- **Real people, not stock.** If staff are photographed, they should be The Global's own team —
  never a generic stock image of unrelated people.
- **Product photography is reverent, not busy.** One object, one clean near-white sweep, one soft
  light source, one honest shadow. No collages, no four-photos-in-a-row.
- **Consistency.** All images should look like they came from the same shoot, same equipment, same
  grade — not a mismatched grab-bag from different sources or eras.

## Shot list

### Warehouse & operations
1. **Warehouse racking, wide shot** — full-height racking, stocked, showing genuine depth of
   inventory. Used as the homepage hero background.
2. **Forklift or staff loading/unloading, in motion** — conveys an active, working facility.
3. **Truck fleet** — loaded trucks at the warehouse or mid-dispatch, ideally golden-hour light.
4. **The team on the warehouse floor** — real staff, candid rather than posed, hi-vis or working
   attire appropriate to the setting.
5. **Framed authorisation certificates** — the actual Somany exclusive-distributor and Astral
   partnership documents, photographed clearly enough to read on-screen at a reasonable zoom.

### Product photography
6. **A single Astral pipe fitting**, macro, on a near-white sweep — the "hero object" shot for the
   Astral division page and homepage division card.
7. **A single large-format Somany tile slab**, on a near-white sweep, same lighting setup as #6 for
   visual consistency between the two divisions.
8. **Tile texture close-up** — matt/glossy finish detail, shows quality up close.
9. Additional per-SKU product shots as needed for `src/content/products.ts` entries — each product
   currently has one `imageLabel` placeholder; replace with a real photo per product using the same
   sweep/lighting setup as #6–7.

### Finished spaces
10. **A finished bathroom**, real completed project, showing Somany tiles/sanitaryware in situ.
11. **A finished floor**, real completed project, showing Somany tiles in situ.

Caption finished-space photography honestly by the **product range supplied**, not by inventing a
client name or project scale we can't verify (see `src/content/projects.ts` — captions are
currently written this way deliberately; keep that convention with real photography too).

## Technical delivery

- Deliver both a high-resolution master and a web-optimised version per shot (target: under 220KB
  after compression, per the site's performance budget).
- Provide images in a format `next/image` can serve efficiently (JPEG or PNG source is fine — the
  build pipeline generates AVIF/WebP automatically).
- For the homepage hero and division-page heroes specifically, deliver at minimum 2400×1350px
  (16:9) so the image holds up at full-bleed desktop widths.
- Write a genuinely descriptive `alt` text for each image when it's wired in (see README section 5)
  — screen reader users rely on this, and it should describe what's actually in the photo, not
  repeat the surrounding heading.
