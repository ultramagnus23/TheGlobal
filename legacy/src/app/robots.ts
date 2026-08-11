import type { MetadataRoute } from "next";
import { facts } from "@/content/facts";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/design-system", "/contact/thank-you"],
      },
    ],
    sitemap: new URL("/sitemap.xml", facts.brand.domain).toString(),
  };
}
