import { useFormat } from "@/lib/format";

export type OutcomeSegment = {
  key: string;
  label: string;
  /** The court's own Nepali term, shown so the label maps to the cause list. */
  term: string;
  value: number;
  /** What this disposition does and does not mean. Surfaced on hover and focus. */
  definition: string;
  fill: string;
};

/**
 * The three dispositions as one bar, because they partition the same denominator.
 *
 * A stacked bar rather than a donut: these are parts of one decided population and
 * the question a reader actually has is how they compare in length, which a single
 * run of bars answers directly. Values are printed on the chart rather than hidden
 * in a tooltip, so nothing has to be hovered to be read.
 */
export function OutcomeSplit({
  segments,
  total,
  totalLabel,
}: {
  segments: readonly OutcomeSegment[];
  total: number;
  totalLabel: string;
}) {
  const { n, pct1 } = useFormat();
  const share = (v: number) => (total ? (v / total) * 100 : 0);

  return (
    <div>
      {/*
        One bar per disposition rather than a single stacked run. Stacked, the
        three read as slices of a whole and the eye compares segment lengths
        against each other; separated, each one is its own measured quantity
        against the same baseline, which is what a reader actually wants here.
      */}
      <ul className="space-y-3">
        {segments.map((s) => (
          <li key={s.key} title={s.definition}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-foreground/85">
                {s.label}{" "}
                <span lang="ne" className="text-muted-foreground">
                  {s.term}
                </span>
              </span>
              <span className="shrink-0 font-mono text-sm tabular-nums text-foreground">
                {n(s.value)}
                <span className="ml-2 font-semibold">{pct1(share(s.value))}</span>
              </span>
            </div>
            <div className="mt-1.5 h-2.5 w-full rounded-sm bg-foreground/[0.07]">
              <div
                className="h-full rounded-sm"
                style={{ width: `${share(s.value)}%`, backgroundColor: s.fill }}
              />
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-3 border-t border-border pt-2.5 text-right font-mono text-xs tabular-nums text-muted-foreground">
        {totalLabel} {n(total)}
      </p>
    </div>
  );
}
