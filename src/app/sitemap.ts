import type { MetadataRoute } from "next";
import { facts } from "@/content/facts";
import { astralCategories, somanyCategories, allCategories } from "@/content/divisions";
import { products } from "@/content/products";
import { projects } from "@/content/projects";

const staticRoutes = [
  "",
  "/about",
  "/products",
  "/astral",
  "/somany",
  "/projects",
  "/dealers",
  "/downloads",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = facts.brand.domain;
  const now = new Date();
  const url = (path: string) => new URL(path, base).toString();

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: url(path),
    lastModified: now,
  }));

  for (const category of allCategories) {
    entries.push({ url: url(`/products/${category.slug}`), lastModified: now });
  }
  for (const category of astralCategories) {
    entries.push({ url: url(`/astral/${category.slug}`), lastModified: now });
  }
  for (const category of somanyCategories) {
    entries.push({ url: url(`/somany/${category.slug}`), lastModified: now });
  }
  for (const product of products) {
    entries.push({ url: url(`/products/${product.category}/${product.slug}`), lastModified: now });
  }
  for (const project of projects) {
    entries.push({ url: url(`/projects/${project.slug}`), lastModified: now });
  }

  return entries;
}
