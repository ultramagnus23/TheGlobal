import { IS_DEMO_DATA } from "@/content/company";

/**
 * Loud, impossible-to-miss banner while company.ts holds placeholder
 * business data instead of the real thing. Deliberately styled outside the
 * site's own design tokens so it reads as a build-tool warning, not site
 * content, and can't be mistaken for a themed component once real data
 * lands and this stops rendering.
 */
export function DemoDataBanner() {
  if (!IS_DEMO_DATA) return null;

  return (
    <div
      role="alert"
      className="sticky top-0 z-[999] flex items-center justify-center gap-2 bg-[#F5B400] px-4 py-2 text-center text-sm font-bold text-black"
    >
      DEMO DATA: phone numbers, GSTIN, and addresses on this site are placeholders, not real. Not for production
      use.
    </div>
  );
}
