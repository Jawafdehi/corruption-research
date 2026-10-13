import type { ReactNode } from "react";

/**
 * A gap that needs more room than GapCallout's fixed shape gives it.
 *
 * GapCallout is "what the record shows, then the open question" and that order is the
 * right one for a gap that turns on a single figure. This one has to teach a method
 * before the question means anything — a worked example, then a judgment, then the
 * question, then what is missing — so the shell carries the crimson identity and the
 * page supplies the sequence.
 */
export function GapSection({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="mt-10 overflow-hidden rounded-xl border border-accent/30 bg-accent/[0.05]">
      <div className="border-l-4 border-accent px-5 py-6 md:px-8 md:py-8">
        <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent">
          {label}
        </p>
        <div aria-hidden="true" className="mt-2.5 h-px w-12 bg-accent/45" />
        <h3 className="mt-3 max-w-3xl font-display text-xl font-bold leading-tight tracking-tight text-foreground md:text-2xl">
          {title}
        </h3>
        {children}
      </div>
    </aside>
  );
}

/** A step inside a GapSection. Set off by a rule so the sequence is visible. */
export function GapStep({
  heading,
  children,
  first,
}: {
  heading: string;
  children: ReactNode;
  /** The first step sits under the title and needs no rule above it. */
  first?: boolean;
}) {
  return (
    <section
      className={
        first ? "mt-7" : "mt-9 border-t border-accent/25 pt-8"
      }
    >
      <h4 className="max-w-3xl font-display text-lg font-bold leading-snug text-foreground md:text-xl">
        {heading}
      </h4>
      {children}
    </section>
  );
}

/**
 * One of the two methods, as a numbered panel.
 *
 * Numbered rather than merely titled: the two are a pair being compared, and a reader
 * who has lost their place in the second panel needs to be able to see at a glance
 * that there was a first one.
 */
export function GapPanel({
  number,
  title,
  lead,
  children,
}: {
  number: number;
  title: string;
  /** The instruction the method amounts to, in one line. */
  lead: string;
  children: ReactNode;
}) {
  return (
    // min-w-0: a grid item's default min-width is its content, so without this the
    // widest table inside stretches the panel past the viewport instead of scrolling.
    <div className="min-w-0 rounded-lg border border-border bg-[hsl(var(--surface))] p-4 md:p-5">
      <div className="flex items-baseline gap-2.5">
        <span
          aria-hidden="true"
          className="font-mono text-sm font-bold tabular-nums text-accent"
        >
          {number}.
        </span>
        <p className="font-display text-base font-bold leading-snug text-foreground">
          {title}
        </p>
      </div>
      {/* Two lines' worth of room whether the lead needs it or not, so the two
          panels' tables start level and can be read across. */}
      <p className="mt-1.5 text-sm font-semibold leading-6 text-foreground/80 md:min-h-[3rem]">
        {lead}
      </p>
      {children}
    </div>
  );
}

/** Body copy inside a gap, held to a readable measure. */
export function GapBody({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 max-w-3xl space-y-3 text-sm leading-6 text-foreground/85">
      {children}
    </div>
  );
}

/** The question itself, given the weight the rest of the section builds towards. */
export function GapQuestion({
  label,
  question,
  children,
}: {
  label: string;
  question: string;
  children?: ReactNode;
}) {
  return (
    <>
      <p className="mt-4 font-mono text-[0.7rem] font-bold uppercase tracking-[0.12em] text-accent/85">
        {label}
      </p>
      <p className="mt-2.5 max-w-3xl font-display text-lg font-bold leading-snug text-foreground md:text-xl">
        {question}
      </p>
      {children}
    </>
  );
}
