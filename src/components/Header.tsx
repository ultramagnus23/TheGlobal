"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { facts } from "@/content/facts";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { label: "Products", href: "/products" },
  { label: "Astral", href: "/astral" },
  { label: "Somany", href: "/somany" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 h-16 md:h-[72px]",
        "bg-[rgba(251,251,249,0.82)] backdrop-blur-xl",
        "border-b transition-[border-color] duration-200",
        scrolled ? "border-hairline" : "border-transparent"
      )}
    >
      <div className="mx-auto h-full max-w-7xl px-4 md:px-8 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-xl md:text-2xl font-bold text-navy-800 tracking-tight shrink-0"
        >
          {facts.brand.name}
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg font-medium text-ink hover:text-navy-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={facts.primaryContact.phoneHref}
            className="hidden md:inline-flex items-center gap-2 min-h-14 px-4 rounded-xl border-[1.5px] border-border-interactive font-numeral text-lg font-semibold text-navy-800 hover:bg-navy-100"
          >
            Call {facts.primaryContact.phoneDisplay}
          </a>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden inline-flex items-center justify-center h-14 w-14 rounded-xl border-[1.5px] border-border-interactive"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path
                  d="M5 5L19 19M19 5L5 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6H21M3 12H21M3 18H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="mobile-nav-panel"
          ref={menuRef}
          className="lg:hidden absolute inset-x-0 top-full bg-surface border-b border-hairline shadow-[0_8px_24px_rgba(11,15,20,0.08)]"
        >
          <nav aria-label="Mobile primary" className="flex flex-col p-4 gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="min-h-14 flex items-center px-4 rounded-lg text-lg font-medium text-ink hover:bg-canvas-sunken"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="min-h-14 flex items-center px-4 rounded-lg text-lg font-medium text-ink hover:bg-canvas-sunken"
            >
              About
            </Link>
            <Link
              href="/dealers"
              onClick={() => setMenuOpen(false)}
              className="min-h-14 flex items-center px-4 rounded-lg text-lg font-medium text-ink hover:bg-canvas-sunken"
            >
              Become a Dealer
            </Link>
            <a
              href={facts.primaryContact.phoneHref}
              className="min-h-14 flex items-center px-4 rounded-lg text-lg font-semibold text-navy-800 border-t border-hairline mt-1 pt-4"
            >
              Call {facts.primaryContact.phoneDisplay}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
