import { PlaceholderImage } from "@/components/PlaceholderImage";

interface AuthorisationBlockProps {
  eyebrow: string;
  statement: string;
  detail: string;
}

export function AuthorisationBlock({ eyebrow, statement, detail }: AuthorisationBlockProps) {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10 items-center">
        <PlaceholderImage
          label="Authorised partnership"
          alt="Handshake sealing the authorised distribution partnership"
          src="/images/generated/authorisation-partnership.webp"
          className="aspect-[3/4] rounded-2xl border-t-2 border-brass"
        />
        <div className="space-y-4">
          <p
            className="text-eyebrow uppercase tracking-[0.1em] font-semibold"
            style={{ color: "var(--partner-text)" }}
          >
            {eyebrow}
          </p>
          <h2 className="text-h2 font-bold text-ink">{statement}</h2>
          <p className="text-body text-ink-secondary max-w-[34em]">{detail}</p>
        </div>
      </div>
    </section>
  );
}
