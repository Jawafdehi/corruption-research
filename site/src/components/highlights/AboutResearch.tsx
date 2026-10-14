import type { ReactNode } from "react";

/**
 * What this research is, who built it and what it is for.
 *
 * It sits above the findings because a reader who does not know who is counting has
 * no way to weigh what is counted. Deliberately plain: no mission statement, no
 * adjectives doing the work of facts, and no names — the people who contributed did so
 * in a professional capacity and the work stands on its sources, not on their titles.
 */
export function AboutResearch({
  label,
  heading,
  children,
  facts,
}: {
  label: string;
  heading: string;
  children: ReactNode;
  /** The few countable things about the work itself. */
  facts: readonly { key: string; value: string; label: string }[];
}) {
  return (
    <section className="mt-8 overflow-hidden rounded-xl border border-border bg-[hsl(var(--surface))] md:mt-10">
      <div className="border-b border-border px-5 py-5 md:px-8 md:py-6">
        <p className="font-mono text-[0.64rem] font-bold uppercase tracking-[0.16em] text-accent">
          {label}
        </p>
        <h2 className="mt-2.5 max-w-3xl font-display text-xl font-bold leading-tight tracking-tight text-foreground md:text-2xl">
          {heading}
        </h2>
        <div className="mt-3.5 max-w-3xl space-y-3.5 text-sm leading-7 text-foreground/85 [&_a]:font-medium [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </div>

      <dl className="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
        {facts.map((f) => (
          <div key={f.key} className="px-5 py-4 md:px-6">
            <dt className="font-mono text-lg font-bold tabular-nums leading-none text-foreground md:text-xl">
              {f.value}
            </dt>
            <dd className="mt-1.5 text-[0.72rem] leading-5 text-muted-foreground">{f.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
