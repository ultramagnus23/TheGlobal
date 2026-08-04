"use client";

import dynamic from "next/dynamic";

const WireframeHouse = dynamic(() => import("@/components/WireframeHouse").then((m) => m.WireframeHouse), {
  ssr: false,
});

export function HeroVisual() {
  return <WireframeHouse />;
}
