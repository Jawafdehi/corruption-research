import type { ReactNode } from "react";

export type MethodCard = {
  key: string;
  /** "Method 1: Original investment" */
  title: string;
  /** One line on whose approach this is. */
  kicker: string;
  /** The input figure and what it is, e.g. "Rs 20 lakh" / "Original purchase price". */
  inputLabel: string;
  inputValue: string;
  /** What that method would treat as unexplained. */
  outputLabel: string;
  outputValue: string;
  body: ReactNode;
  /** The method the cited ruling describes, given the accent treatment. */
  ruling?: boolean;
};

/**
 * Two ways of calculating the same figure, set against each other.
 *
 * A worked example rather than a definition. "Original investment rather than current
 * value" is a sentence a lawyer parses and a general reader does not; two columns with
 * one purchase running through both make the difference arithmetic instead of
 * terminology, and the gap between the output figures is the whole point.
 *
 * The illustrative warning is a required prop, not an optional footnote. These are
 * invented round numbers chosen to show a mechanism, and a reader who takes them for
 * a real case has been actively misled.
 */
export function MethodComparison({
  scenario,
  question,
  methods,
  outputArrowLabel,
  illustrativeNote,
}: {
  /** The shared facts both columns work from. */
  scenario: ReactNode;
  /** What the example is asking. */
  question: ReactNode;
  methods: readonly MethodCard[];
  /** Label on the line between input and output, e.g. "would be treated as unexplained". */
  outputArrowLabel: string;
  illustrativeNote: string;
}) {
  return (
    <div className="mt-6 rounded-lg border border-border bg-[hsl(var(--surface))] p-5 md:p-6">
      <p className="max-w-3xl text-sm leading-6 text-foreground/85">{scenario}</p>
      <p className="mt-3 max-w-3xl font-display text-base font-bold leading-snug text-foreground">
        {question}
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {methods.map((m) => (
          <div
            key={m.key}
            className={
              "rounded-lg border p-4 md:p-5 " +
              (m.ruling
                ? "border-accent/40 bg-accent/[0.05]"
                : "border-border bg-background/60")
            }
          >
            <p
              className={
                "font-display text-base font-bold leading-snug " +
                (m.ruling ? "text-accent" : "text-foreground")
              }
            >
              {m.title}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{m.kicker}</p>

            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                  {m.inputLabel}
                </dt>
                <dd className="font-mono text-lg font-semibold tabular-nums text-foreground/80">
                  {m.inputValue}
                </dd>
              </div>

              {/* The arrow carries the label, so the second figure is read as a
                  consequence of the first rather than as a second measurement. */}
              <div className="flex items-center gap-2 text-[0.7rem] text-muted-foreground">
                <span aria-hidden="true" className="font-mono">
                  ↓
                </span>
                {outputArrowLabel}
              </div>

              <div>
                <dt className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                  {m.outputLabel}
                </dt>
                <dd
                  className={
                    "font-mono text-2xl font-semibold tabular-nums " +
                    (m.ruling ? "text-accent" : "text-foreground")
                  }
                >
                  {m.outputValue}
                </dd>
              </div>
            </dl>

            <p className="mt-4 border-t border-border pt-3 text-xs leading-5 text-foreground/75">
              {m.body}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-5 text-muted-foreground">{illustrativeNote}</p>
    </div>
  );
}
