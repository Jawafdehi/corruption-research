import type { ReactNode } from "react";

export type AnalysisPoint = {
  /** The figure this observation turns on. */
  stat: string;
  /** What that figure is, in one sentence. */
  text: ReactNode;
};

/**
 * The closing read on a section: what everything above adds up to.
 *
 * Not the two-column gap block used elsewhere. That block asks "what does the record
 * show / what would close it", which works where a gap is one discrete finding. Here
 * the whole page has already shown the figures, so repeating them in a two-column
 * summary just says them a third time. What a reader needs at the foot of the page is
 * the thing the figures have in common, and the question they leave open.
 *
 * So: one number that holds the section together, the observations that lead to it on
 * a connected spine, and the open question set apart at the end. The spine is the
 * point — these are not three separate facts, they are one pattern seen at three
 * places in the process.
 */
export function ClosingAnalysis({
  eyebrow,
  stat,
  statCaption,
  points,
  question,
  questionLabel,
  children,
}: {
  eyebrow: string;
  stat: string;
  statCaption: ReactNode;
  points: readonly AnalysisPoint[];
  questionLabel: string;
  question: ReactNode;
  /** What would answer it. */
  children?: ReactNode;
}) {
  return (
    <section className="mt-12 overflow-hidden rounded-xl border border-accent/30 bg-accent/[0.05]">
      <div className="px-5 py-7 md:px-9 md:py-9">
        <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent">
          {eyebrow}
        </p>

        {/* The number first and large: it is the one figure that holds the whole
            section together, and a reader who takes nothing else should take it. */}
        <p className="mt-5 font-mono text-4xl font-semibold leading-none tracking-tight text-accent md:text-6xl">
          {stat}
        </p>
        <p className="mt-3 max-w-2xl font-display text-lg font-bold leading-snug text-foreground md:text-xl">
          {statCaption}
        </p>

        {/* A spine, not a list. These are the same pattern at three points in the
            process, and the connecting rule is what says so. */}
        <ol className="mt-8 space-y-0">
          {points.map((p, i) => (
            <li key={i} className="relative flex gap-4 pb-6 last:pb-0 md:gap-5">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/45 bg-[hsl(var(--surface))] font-mono text-xs font-semibold text-accent">
                  {i + 1}
                </span>
                {i < points.length - 1 ? (
                  <span aria-hidden="true" className="mt-1 w-px flex-1 bg-accent/30" />
                ) : null}
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="font-mono text-base font-semibold tabular-nums text-foreground md:text-lg">
                  {p.stat}
                </p>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-foreground/85">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-7 border-t border-accent/25 pt-6">
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
