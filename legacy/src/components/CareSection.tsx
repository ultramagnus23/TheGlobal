"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    title: "We keep the shelf full.",
    body: "Large standing inventory in Jaipur, not a promise to order it once you ask.",
  },
  {
    title: "We say no when we mean it.",
    body: "If a range isn't in stock, we say so. A wrong promise costs a site more than an honest delay.",
  },
  {
    title: "We price the project, not the moment.",
    body: "Competitive pricing that holds across a build, not a rate that changes once you're committed.",
  },
];

/**
 * A short values statement, not a features list — the brief for this
 * section explicitly asked the site to communicate that reliability here is
 * a choice, not a slogan. Copy stays inside facts.ts's approved claims
 * (stock, honesty about availability, pricing) rather than inventing new
 * ones; this just gives them a human voice instead of a bullet list.
 */
export function CareSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-h2 font-semibold text-ink max-w-[20ch]"
        >
          Reliability isn&apos;t a slogan here. It&apos;s the only thing we sell.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mt-14">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
              className="border-t-2 border-brass pt-5"
            >
              <h3 className="text-h3 font-semibold text-ink">{pillar.title}</h3>
              <p className="text-body text-ink-secondary mt-2">{pillar.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
