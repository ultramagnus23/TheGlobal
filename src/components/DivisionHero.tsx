import { Button } from "@/components/Button";
import { PlaceholderImage } from "@/components/PlaceholderImage";

interface DivisionHeroProps {
  eyebrow: string;
  heading: string;
  sub: string;
  imageLabel: string;
  imageAlt: string;
  ctaHref: string;
  ctaLabel: string;
}

export function DivisionHero({ eyebrow, heading, sub, imageLabel, imageAlt, ctaHref, ctaLabel }: DivisionHeroProps) {
  return (
    <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden">
      <PlaceholderImage label={imageLabel} alt={imageAlt} dark className="absolute inset-0" />
      <div className="absolute inset-0 bg-navy-900/50" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 text-center text-white space-y-5">
        <p
          className="text-eyebrow uppercase tracking-[0.1em] font-semibold"
          style={{ color: "var(--partner)" }}
        >
          {eyebrow}
        </p>
        <h1 className="text-h1 font-bold tracking-tight">{heading}</h1>
        <p className="text-lead text-white/90 max-w-[34em] mx-auto">{sub}</p>
        <div className="pt-2">
          <Button href={ctaHref} tier="primary" size="large">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
