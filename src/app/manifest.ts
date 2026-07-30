import type { MetadataRoute } from "next";
import { facts } from "@/content/facts";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: facts.brand.name,
    short_name: facts.brand.name,
    description: "Construction materials distribution — Astral pipes & Somany tiles, Jaipur, Rajasthan.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBFBF9",
    theme_color: "#0E2A47",
    icons: [],
  };
}
