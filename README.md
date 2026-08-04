# The Global — theglobal.co.in

Website for The Global (Global Sales — Astral distributor; Global Marketing — exclusive Somany
distributor for Rajasthan). Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS.

This README is written for whoever maintains the content day-to-day, not just developers. If
you're comfortable editing a text file, you can do most of what's below yourself.

## 1. Local setup

You need [Node.js](https://nodejs.org) 20 or newer installed.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). The site reloads automatically as you
edit files.

To check the site builds cleanly before deploying:

```bash
npm run build
```

## 2. Environment variables

Create a `.env.local` file in the project root (it's git-ignored, never commit it) for the
enquiry form's email delivery. None of these are required for the site to run — until they're
set, enquiry submissions are only logged to the server console.

```bash
# Pick ONE email provider and wire it into src/app/actions/enquiry.ts (see the TODO comment there):
RESEND_API_KEY=
# — or —
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
ENQUIRY_NOTIFICATION_EMAIL=
```

## 3. Changing a phone number, WhatsApp number, or any business fact

Everything factual about the business — phone numbers, GSTIN, addresses, hours, the warehouse
size — lives in **one file**: [`src/content/facts.ts`](src/content/facts.ts).

Open it and replace any `{{TOKEN}}` placeholder with the real value, for example:

```ts
phone: "{{GLOBAL_SALES_PHONE}}",
```
becomes
```ts
phone: "+91 98765 43210",
```

Every page that shows that phone number (header, footer, contact page, WhatsApp links) updates
automatically — you only edit it once.

The remaining placeholders to fill in before launch:
- `GLOBAL_SALES_GSTIN`, `GLOBAL_MARKETING_GSTIN`
- `GLOBAL_SALES_REGISTERED_ADDRESS`, `GLOBAL_MARKETING_REGISTERED_ADDRESS`
- `GLOBAL_SALES_PHONE`, `GLOBAL_MARKETING_PHONE` (and matching `WHATSAPP_NUMBER`s, digits only,
  country code first — e.g. `919876543210`)
- `PRIMARY_PHONE_DISPLAY` / `PRIMARY_PHONE_DIGITS` / `PRIMARY_WHATSAPP_DIGITS` — the number shown
  in the sticky header and mobile call/WhatsApp bar
- `WAREHOUSE_SQFT` in the capability section

## 4. Adding or editing a product

Product data lives in [`src/content/products.ts`](src/content/products.ts). Each product is one
object in the `products` array:

```ts
{
  slug: "cpvc-pipe-sdr-11",       // becomes the URL: /products/cpvc-pipes/cpvc-pipe-sdr-11
  category: "cpvc-pipes",         // must match a category slug in src/content/divisions.ts
  brand: "astral",                // "astral" or "somany"
  name: "CPVC Pipe, SDR 11",
  range: "Astral CPVC Plumbing System",
  description: "...",
  imageLabel: "CPVC pipe length on sweep",   // placeholder caption until a real photo is added
  availability: "in-stock",       // "in-stock" | "limited" | "made-to-order"
  attributes: [{ label: "Size range", value: "15mm – 50mm" }, ...],  // shown as a summary list
  specs: [{ label: "Standard", value: "ASTM D2846" }, ...],          // shown in the full spec table
  downloads: [{ title: "CPVC Pipe Spec Sheet", href: "/downloads/astral-cpvc-spec.pdf" }],
}
```

Copy an existing entry, change the values, and save — the new product page and its category
listing both update automatically. To add a whole new category, add an entry to `astralCategories`
or `somanyCategories` in [`src/content/divisions.ts`](src/content/divisions.ts) first.

## 5. Swapping a placeholder image for a real photo

Most photos on the site are AI-generated stand-ins living in `/public/images/generated/` — used
only because no real photography exists yet, not because they're good enough to keep. A few spots
(the authorisation certificate, any staff photo) are still flat labelled boxes on purpose — see
[`PHOTOGRAPHY-BRIEF.md`](PHOTOGRAPHY-BRIEF.md) for why and for the full shot list.

The `PlaceholderImage` component (`src/components/PlaceholderImage.tsx`) handles both cases: pass
it a `src` (or `imageSrc` on components like `DivisionHero`/`DivisionCard`) and it renders that
image via `next/image`; omit `src` and it renders the flat labelled box instead.

To swap a generated placeholder or flat box for a real photo:
1. Add the optimised image file to `/public/images/` (a new subfolder is fine, e.g. `/public/images/real/`).
2. Find where that spot's `src`/`imageSrc` (or, for flat placeholders, `label`) is set — search for
   its text, e.g. `"Jaipur warehouse, racked to the ceiling"`, or search `/images/generated/` for
   the current generated file.
3. Point `src`/`imageSrc` at the new file, e.g. `"/images/real/warehouse-hero.jpg"`.
4. Update the matching `alt` text to actually describe the new photo — screen readers depend on it.

## 6. Adding real PDFs to Downloads

The `/downloads` page and the Astral/Somany division pages link to PDF files that don't exist yet.
Drop the real files into `/public/downloads/` using the exact filenames already referenced (see
[`src/content/downloads.ts`](src/content/downloads.ts)), for example
`/public/downloads/astral-catalogue.pdf`.

## 7. Deploying

The site is built for [Vercel](https://vercel.com):

1. Push this repository to GitHub.
2. Import it in Vercel.
3. Add the environment variables from section 2 (if you've wired up email).
4. Deploy. Vercel builds with `npm run build` automatically.

Before going live, update `facts.brand.domain` in `src/content/facts.ts` if the domain changes,
and fill in every `{{TOKEN}}` placeholder listed in section 3.

## 8. Project structure (for developers)

- `src/app/` — routes (Next.js App Router). Each folder is a URL segment.
- `src/components/` — reusable UI components.
- `src/content/` — typed, Zod-validated content: `facts.ts`, `products.ts`, `divisions.ts`,
  `projects.ts`, `audiences.ts`, `downloads.ts`, `faq.ts`.
- `src/lib/` — small utilities (contrast calculation, WhatsApp link builder, SEO canonical helper,
  JSON-LD builders, class-name helper).
- `src/app/globals.css` — every design token from the brief (colour, type scale) as CSS custom
  properties, mapped into Tailwind via `@theme inline`. No arbitrary hex values should appear in
  component JSX — add a token here first.
- `src/app/design-system/page.tsx` — a `noindex` internal page rendering every colour swatch with
  its computed contrast ratio, the full type scale, and every button/chip state, for design QA.
- `src/app/actions/enquiry.ts` — the enquiry form's server action (validation, honeypot, naive
  rate limiting, and the email TODO).

See also [`ACCESSIBILITY.md`](ACCESSIBILITY.md) for the mature-audience accessibility decisions and
axe-core results, and [`PHOTOGRAPHY-BRIEF.md`](PHOTOGRAPHY-BRIEF.md) for the real-photography shot
list.
