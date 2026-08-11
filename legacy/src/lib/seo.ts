import { facts } from "@/content/facts";

/** Builds an absolute canonical URL for a given site-relative path, e.g. "/products". */
export function canonical(path: string): string {
  return new URL(path, facts.brand.domain).toString();
}
