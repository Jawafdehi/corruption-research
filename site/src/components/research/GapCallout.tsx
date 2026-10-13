import type { ReactNode } from "react";

/**
 * One place where the record runs out, shown inside the stage it belongs to.
 *
 * Shape: what the record shows, then the question it leaves open. An earlier version
 * paired "what the record shows" with "what would close it" in two columns, which read
 * as a specification rather than a finding — the missing field is the answer, not the
 * point. Leading with the question and explaining underneath puts the reader's own
 * question on the page before the methodology does.
 *
 * `stat` is for a gap that turns on one figure. Where a gap turns on a case or a rule
 * instead, it is omitted and `shows` carries the weight.
 */
export function GapCallout({
  label,
  title,
  stat,
  statCaption,
  showsLabel,
  shows,
  questionLabel,
  question,
  children,
}: {
  /** Short stage tag, e.g. "Prosecution decisions". */
  label: string;
  title: string;
  /** Optional headline figure, e.g. "Rs 40.8 billion". */
  stat?: string;
  statCaption?: ReactNode;
  showsLabel?: string;
  /** What the evidence establishes. Omitted when the stat caption already says it. */
  shows?: ReactNode;
  questionLabel: string;
  /** The question the record cannot answer, set as a question. */
  question: ReactNode;
  /** Why it cannot be answered, and what would change that. */
  children?: ReactNode;
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

        {/* The figure and its sentence share a rule, so the number reads as part of
            the claim rather than as a stat tile dropped into a paragraph. */}
        {stat ? (
          <div className="mt-6 flex flex-col gap-2.5 border-l-2 border-accent/50 pl-5 md:flex-row md:items-baseline md:gap-6">
            <p className="font-mono text-3xl font-semibold leading-none tracking-tight text-accent md:text-4xl">
              {stat}
            </p>
            <p className="max-w-2xl text-sm leading-6 text-foreground/85">{statCaption}</p>
          </div>
        ) : null}

        {shows ? (
          <div className="mt-6">
            {showsLabel ? (
              <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.12em] text-accent/85">
                {showsLabel}
              </p>
            ) : null}
            <div className="mt-2.5 max-w-3xl space-y-3 text-sm leading-6 text-foreground/90">
              {shows}
            </div>
          </div>
        ) : null}

        <div className="mt-7 border-t border-accent/25 pt-6">
          <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.12em] text-accent/85">
            {questionLabel}
          </p>
          <p className="mt-2.5 max-w-3xl font-display text-lg font-bold leading-snug text-foreground md:text-xl">
            {question}
          </p>
          {children ? (
            <div className="mt-3.5 max-w-3xl space-y-3 text-sm leading-6 text-foreground/80">
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
