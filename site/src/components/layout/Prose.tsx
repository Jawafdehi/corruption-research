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
