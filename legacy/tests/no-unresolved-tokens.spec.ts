import { test, expect } from "@playwright/test";
import { astralCategories, somanyCategories, allCategories } from "../src/content/divisions";
import { products } from "../src/content/products";
import { projects } from "../src/content/projects";

/**
 * Phase 0 gate (see AGENTS.md rebuild brief §0.2): every route must be free
 * of unresolved template tokens in its rendered output. validate-content.ts
 * catches these at the source level before build; this catches anything
 * that slips through by composition (e.g. a token assembled from two clean
 * strings at runtime) by checking what actually reaches the DOM.
 */

const staticRoutes = [
  "/",
  "/about",
  "/products",
  "/astral",
  "/somany",
  "/projects",
  "/dealers",
  "/downloads",
  "/contact",
  "/contact/thank-you",
  "/legal/privacy",
  "/legal/terms",
];

const dynamicRoutes = [
  ...allCategories.map((c) => `/products/${c.slug}`),
  ...astralCategories.map((c) => `/astral/${c.slug}`),
  ...somanyCategories.map((c) => `/somany/${c.slug}`),
  ...products.map((p) => `/products/${p.category}/${p.slug}`),
  ...projects.map((p) => `/projects/${p.slug}`),
];

const routes = [...staticRoutes, ...dynamicRoutes];

for (const route of routes) {
  test(`no unresolved tokens on ${route}`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status(), `${route} should respond 2xx`).toBeLessThan(400);

    const bodyText = await page.locator("body").innerText();
    expect(bodyText, `${route} rendered an unresolved template token`).not.toMatch(/\{\{|\}\}/);

    const hrefs = await page.locator("a[href]").evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    for (const href of hrefs) {
      expect(href, `${route} has an anchor with an unresolved token in href`).not.toMatch(/\{\{|\}\}/);
    }
  });
}
