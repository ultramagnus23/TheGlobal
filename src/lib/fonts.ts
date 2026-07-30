import { Manrope, Inter, IBM_Plex_Sans, Noto_Sans_Devanagari } from "next/font/google";

// next/font self-hosts these at build time (no runtime request to Google Fonts),
// subset per §4 (latin + devanagari), and are preloaded for the above-the-fold weights only.

export const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
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
