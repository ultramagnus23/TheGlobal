interface MapEmbedProps {
  query: string;
  label: string;
}

/** Plain-text address is rendered by the caller above/below this so the page survives a failed map load. */
export function MapEmbed({ query, label }: MapEmbedProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-border">
      <iframe
        title={label}
        src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
        className="w-full aspect-[4/3]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
