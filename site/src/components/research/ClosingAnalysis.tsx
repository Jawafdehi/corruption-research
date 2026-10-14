import type { ReactNode } from "react";

/**
 * The closing read on a section: the one thing everything above adds up to.
 *
 * Deliberately short. An earlier version recapped three figures on a numbered spine
 * and then asked the question; on a page that has already shown all three, the recap
 * is the reader's third pass over the same numbers and the question arrives tired.
 * One finding, one figure, the question, and what would answer it.
 */
export function ClosingAnalysis({
  headline,
  stat,
  statCaption,
  questionLabel,
  question,
  children,
}: {
  headline: string;
  stat: string;
  statCaption: ReactNode;
  questionLabel: string;
  question: ReactNode;
  /** What would answer it. */
  children?: ReactNode;
}) {
  return (
    <section className="mt-12 overflow-hidden rounded-xl border border-accent/30 bg-accent/[0.05]">
      <div className="px-5 py-7 md:px-9 md:py-9">
        <h3 className="max-w-3xl font-display text-xl font-bold leading-tight tracking-tight text-foreground md:text-2xl">
          {headline}
        </h3>

        {/* The figure and its sentence sit together on one line at desktop width, so
            the number is read as part of the claim rather than as a separate stat. */}
        <div className="mt-6 flex flex-col gap-3 border-l-2 border-accent/50 pl-5 md:flex-row md:items-baseline md:gap-6">
          <p className="font-mono text-4xl font-semibold leading-none tracking-tight text-accent md:text-5xl">
            {stat}
          </p>
          <p className="max-w-xl text-sm leading-6 text-foreground/85">{statCaption}</p>
        </div>

        <div className="mt-8 border-t border-accent/25 pt-6">
          <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.12em] text-accent/85">
            {questionLabel}
          </p>
          <p className="mt-2.5 max-w-3xl font-display text-lg font-bold leading-snug text-foreground md:text-xl">
            {question}
          </p>
          {children ? (
            <div className="mt-3 max-w-3xl space-y-3 text-sm leading-6 text-foreground/80">
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
