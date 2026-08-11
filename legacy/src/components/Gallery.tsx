"use client";

import { useState } from "react";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { cn } from "@/lib/cn";

interface GalleryImage {
  label: string;
  src?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  alt: string;
}

export function Gallery({ images, alt }: GalleryProps) {
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }
  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <PlaceholderImage
          label={images[index].label}
          src={images[index].src}
          alt={`${alt}, image ${index + 1} of ${images.length}`}
          className="aspect-[4/3] rounded-2xl"
        />
        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/90 border border-border flex items-center justify-center text-xl"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/90 border border-border flex items-center justify-center text-xl"
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.label}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}: ${img.label}`}
              aria-current={i === index}
              className={cn(
                "shrink-0 h-24 w-24 rounded-xl overflow-hidden border-2",
                i === index ? "border-navy-600" : "border-transparent"
              )}
            >
              <PlaceholderImage label="" alt="" src={img.src} className="h-full w-full" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
