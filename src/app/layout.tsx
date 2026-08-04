import type { Metadata } from "next";
import { fraunces, inter, ibmPlexSans, notoSansDevanagari } from "@/lib/fonts";
import { facts } from "@/content/facts";
import { Header } from "@/components/Header";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Footer } from "@/components/Footer";
import { buildSiteJsonLd, canonical } from "@/lib/jsonld";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(facts.brand.domain),
  title: {
    default: "The Global — Construction Materials, Jaipur, Rajasthan",
    template: "%s | The Global",
  },
  description:
    "Exclusive Authorised Somany distributor for Rajasthan. Trusted Astral distribution partner. Supplying dealers, builders and infrastructure projects for 18+ years.",
  alternates: {
    canonical: canonical("/"),
    languages: {
      "en-IN": canonical("/"),
      "x-default": canonical("/"),
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${ibmPlexSans.variable} ${notoSansDevanagari.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        {buildSiteJsonLd().map((entry, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
          />
        ))}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <div className="flex-1 flex flex-col pt-16 md:pt-[72px]">
          {children}
        </div>
        <div className="pb-[72px] lg:pb-0">
          <Footer />
        </div>
        <MobileActionBar />
      </body>
    </html>
  );
}
