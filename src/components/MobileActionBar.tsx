"use client";

import { useEffect, useState } from "react";
import { facts } from "@/content/facts";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

export function MobileActionBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappHref = buildWhatsAppLink(
    facts.primaryContact.whatsappNumber,
    "Hello The Global, I am enquiring about your products."
  );

  return (
    <div
      className={cn(
        "lg:hidden fixed inset-x-0 bottom-0 z-40 flex",
        "h-[72px] pb-[env(safe-area-inset-bottom)]",
        "transition-transform duration-200",
        visible ? "translate-y-0" : "translate-y-full"
      )}
      aria-hidden={!visible}
    >
      <a
        href={facts.primaryContact.phoneHref}
        tabIndex={visible ? 0 : -1}
        className="flex-1 flex items-center justify-center gap-2 bg-navy-800 text-white text-lg font-semibold"
      >
        Call Now
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
        className="flex-1 flex items-center justify-center gap-2 bg-whatsapp text-white text-xl font-bold"
      >
        WhatsApp
      </a>
    </div>
  );
}
