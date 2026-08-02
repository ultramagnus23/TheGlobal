import { facts } from "@/content/facts";

interface Fact {
  numeral: string;
  label: string;
  detail: string;
}

const hero: Fact = {
  numeral: facts.capability.years,
  label: "Years in operation",
  detail: "Serving dealers, builders and infrastructure projects across Rajasthan since 2007.",
};

const rest: Fact[] = [
  {
    numeral: facts.capability.warehouseSqft,
    label: "sq ft Jaipur warehouse",
    detail: "Standing inventory held and ready to dispatch.",
  },
  {
    numeral: facts.capability.districtsServed,
    label: "Districts served",
    detail: "Statewide supply across Rajasthan.",
  },
  {
    numeral: facts.capability.dispatch,
    label: "Dispatch",
    detail: "Pan-India shipping alongside our Rajasthan base.",
  },
];

export function BentoGrid() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-h2 font-bold text-center mb-12">Depth of stock is the whole business.</h2>

        {/* Asymmetric bento: one wide hero cell, then three unequal-width cells below — not a uniform grid. */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-surface p-10 md:p-14 border-t-2 border-brass shadow-[0_1px_2px_rgba(11,15,20,0.04)]">
            <p className="font-numeral text-numeral font-semibold text-navy-800 tabular">
              {hero.numeral}
            </p>
            <p className="text-h3 font-semibold text-ink mt-2">{hero.label}</p>
            <p className="text-body text-ink-secondary mt-2 max-w-[40em]">{hero.detail}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr] gap-6">
            {rest.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl bg-surface p-8 shadow-[0_1px_2px_rgba(11,15,20,0.04)]"
              >
                <p className="font-numeral text-numeral font-semibold text-navy-800 tabular">
                  {item.numeral}
                </p>
                <p className="text-h3 font-semibold text-ink mt-2">{item.label}</p>
                <p className="text-body text-ink-secondary mt-2">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
