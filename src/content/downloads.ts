import { z } from "zod";

const downloadItemSchema = z.object({
  title: z.string(),
  href: z.string(),
  brand: z.enum(["astral", "somany", "company"]),
});

export type DownloadItem = z.infer<typeof downloadItemSchema>;

/** TODO: drop the real PDF files into /public/downloads/ using these exact filenames. */
export const downloads: DownloadItem[] = [
  { title: "Astral Product Catalogue", href: "/downloads/astral-catalogue.pdf", brand: "astral" },
  { title: "Astral Price List", href: "/downloads/astral-price-list.pdf", brand: "astral" },
  { title: "Global Sales — Astral Authorisation Letter", href: "/downloads/astral-authorisation.pdf", brand: "astral" },
  { title: "Somany Product Catalogue", href: "/downloads/somany-catalogue.pdf", brand: "somany" },
  { title: "Somany Price List", href: "/downloads/somany-price-list.pdf", brand: "somany" },
  { title: "Global Marketing — Somany Exclusive Authorisation Letter", href: "/downloads/somany-authorisation.pdf", brand: "somany" },
  { title: "Company Profile — The Global", href: "/downloads/company-profile.pdf", brand: "company" },
  { title: "GST Registration Certificates", href: "/downloads/gst-certificates.pdf", brand: "company" },
];
