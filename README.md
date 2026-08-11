# The Global — Next.js site

Next.js 14 (App Router, JavaScript), deployed on Netlify with Netlify Forms.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Node 18.17+ or 20+. No environment variables are needed.

## Deploy to Netlify

1. Push this folder to a Git repo.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Build command `npm run build`, publish directory `.next`. `netlify.toml` already sets this and enables `@netlify/plugin-nextjs`, which Netlify installs automatically.
4. Deploy. Nothing else to configure.

Netlify CLI alternative:

```bash
npm i -g netlify-cli
netlify init
netlify deploy --build --prod
```

## Netlify Forms

Form detection happens at build time against static HTML, so the form is declared in
`public/__forms.html` (name: `enquiry`). The React form in `components/EnquiryForm.jsx`
posts url-encoded data to `/__forms.html` and then redirects to `/thanks`.

Submissions appear under **Site configuration → Forms** in the Netlify dashboard.
Add an email notification there to get them in your inbox. A honeypot field
(`bot-field`) is already wired up for spam.

To add a field: add it to `public/__forms.html` **and** to the React form. Netlify
only records fields it saw in the static HTML at build time.

## Pages

| Route        | What it is                                                              |
|--------------|-------------------------------------------------------------------------|
| `/`          | Hero (Three.js villa), scroll story, stats, brands, projects, India map, tools, contact form |
| `/catalogue` | Filter by brand, room and type, plus search and an enquiry list          |
| `/tools`     | Tile, pipe and tank calculators                                          |
| `/admin`     | Add, edit, delete products, photos, CSV/XLSX bulk import, export/restore  |
| `/thanks`    | Post-submission page                                                     |

## Product data

`lib/products.js` holds the defaults. The admin page writes to `localStorage`, and the
catalogue reads from it, so edits are per browser. That is the honest limit of a static
site with no backend.

To make it real across devices, replace `loadProducts` / `saveProducts` with a database.
Both functions are the only touch points, so a Supabase or Netlify Blobs swap is a
small change:

```js
export async function loadProducts() {
  const { data } = await supabase.from('products').select('*');
  return data;
}
```

Then make `/catalogue` a server component and pass products in as props.

## Notes

- Three.js scenes only render while their canvas is on screen, and pause when the tab is
  hidden. Pixel ratio is capped and shadows are off on small screens.
- Product images currently point at Astral and Somany CDNs. Move them into `public/`
  before launch.
- Fill in the real `tel:`, `mailto:`, WhatsApp and Maps links in `app/page.jsx`.
