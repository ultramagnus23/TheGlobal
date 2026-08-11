import { Fraunces, Inter, IBM_Plex_Sans, Noto_Sans_Devanagari } from "next/font/google";

// next/font self-hosts these at build time (no runtime request to Google Fonts),
// subset per §4 (latin + devanagari), and are preloaded for the above-the-fold weights only.
//
// Fraunces replaces Manrope for display type — editorial serif per the brand's dark
// "Ink & Brass" direction. Deliberately excludes weight 400 and below for headings
// (kept at 500/600 minimum) even though Fraunces is used at 300 in the reference
// mockup — this site's stated audience (older readers, outdoor glare) needs body
// and heading weight to stay readable, so thin optical weights are reserved for
// small decorative accents only (e.g. the footer tagline), never for body copy.

export const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-numeral",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: false,
});
