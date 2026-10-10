import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Small coloured label above a heading. */
export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">{children}</p>
);

export const SectionHeading = ({ children }: { children: ReactNode }) => (
  <h2 className="font-display text-[1.7rem] font-bold leading-tight tracking-tight text-foreground md:text-[2.25rem]">
    {children}
  </h2>
);

export const Lede = ({ children }: { children: ReactNode }) => (
  <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/90 md:text-lg md:leading-8">
    {children}
  </p>
);

export const Body = ({ children }: { children: ReactNode }) => (
  <p className="mt-4 max-w-3xl text-sm leading-6 text-foreground/80 md:text-base md:leading-7">
    {children}
  </p>
);

/** A block of page, separated from its neighbours. */
export const Block = ({ children, className }: { children: ReactNode; className?: string }) => (
  <section className={cn("mt-12 first:mt-0 md:mt-16", className)}>{children}</section>
);

/**
 * A chart and the text that discloses what it covers. The caption is not decoration:
 * every chart here counts a different subset, and a reader who assumes one denominator
 * across all of them will draw a wrong conclusion.
 */
export const Figure = ({
  title,
  subtitle,
  caption,
  children,
}: {
  title: string;
  subtitle?: string;
  caption?: ReactNode;
  children: ReactNode;
}) => (
  <figure className="mt-8 rounded-lg border border-border bg-card/40 p-4 md:p-6">
    <figcaption className="mb-4">
      <h3 className="font-display text-lg font-semibold leading-snug text-foreground md:text-xl">
        {title}
      </h3>
      {subtitle ? <p className="mt-1 text-sm leading-6 text-muted-foreground">{subtitle}</p> : null}
    </figcaption>
    <div className="chart-scroll">{children}</div>
    {caption ? (
      <p className="mt-4 text-xs leading-5 text-muted-foreground">{caption}</p>
    ) : null}
  </figure>
);

/** A single headline number. */
export const StatTile = ({
  value,
  label,
  note,
  tone = "default",
}: {
  value: string;
  label: string;
  note?: string;
  tone?: "default" | "accent";
}) => (
  <div className="rounded-lg border border-border bg-card/40 p-4">
    <p
      className={cn(
        "font-mono text-2xl font-semibold leading-none md:text-3xl",
        tone === "accent" ? "text-accent" : "text-foreground",
      )}
    >
      {value}
    </p>
    <p className="mt-2 text-sm font-medium leading-5 text-foreground">{label}</p>
    {note ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{note}</p> : null}
  </div>
);

export const StatRow = ({ children }: { children: ReactNode }) => (
  <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">{children}</div>
);

/**
 * A caveat the reader has to carry to read the next chart correctly. Styled to be
 * noticed — these are the sentences that stop a figure being misquoted.
 */
export const Caveat = ({ children }: { children: ReactNode }) => (
  <aside className="mt-8 rounded-lg border-l-4 border-alert bg-alert/5 p-4 text-sm leading-6 text-foreground/85">
    {children}
  </aside>
);

/** An outbound link to the record a figure rests on. */
export const Cite = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    className="underline decoration-dotted underline-offset-2 hover:text-foreground"
    target="_blank"
    rel="noreferrer"
  >
    {children}
  </a>
);

/**
 * One verified finding, built for the ten-second scan: the number first, then the
 * claim, then the single sentence that says what it means, then the way in to the
 * evidence. Reading only the stat and the headline should leave you with something
 * true — if a finding needs its caveat to avoid being misread, the caveat belongs
 * in `meaning`, not further down the page.
 */
export const Finding = ({
  stat,
  statNote,
  headline,
  meaning,
  action,
}: {
  stat: string;
  statNote: string;
  headline: string;
  meaning: string;
  action?: ReactNode;
}) => (
  <article className="flex flex-col gap-3 border-t border-border py-6 md:flex-row md:gap-8 md:py-7">
    <div className="md:w-56 md:shrink-0">
      <p className="font-mono text-3xl font-semibold leading-none text-accent md:text-4xl">
        {stat}
      </p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{statNote}</p>
    </div>
    <div className="md:flex-1">
      <h3 className="font-display text-lg font-bold leading-snug text-foreground md:text-xl">
        {headline}
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/80 md:text-base md:leading-7">
        {meaning}
      </p>
      {action ? <p className="mt-3 text-sm">{action}</p> : null}
    </div>
  </article>
);

/**
 * The scope line under the title. An MP reading a rate needs to know what it is a
 * rate *of* before the first chart, not in the methodology section.
 */
export const ScopeBar = ({ items }: { items: { label: string; value: string }[] }) => (
  <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-y border-border py-4">
    {items.map((it) => (
      <div key={it.label}>
        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{it.label}</dt>
        <dd className="mt-0.5 font-mono text-sm font-medium text-foreground">{it.value}</dd>
      </div>
    ))}
  </dl>
);

/**
 * An explicit "the data does not answer this" block. Distinct from `Caveat`, which
 * qualifies a figure that exists; this marks a question we cannot answer at all, so
 * a reader does not take its absence for a zero.
 */
export const Unknown = ({ title, children }: { title: string; children: ReactNode }) => (
  <aside className="mt-8 rounded-lg border border-dashed border-border bg-muted/30 p-4">
    <p className="text-sm font-semibold text-foreground">{title}</p>
    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{children}</p>
  </aside>
);
