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
      <div
        className="flex h-11 w-full overflow-hidden rounded border border-border"
        role="img"
        aria-label={segments
          .map((s) => `${s.label} ${n(s.value)}, ${pct1(share(s.value))}`)
          .join("; ")}
      >
        {segments.map((s) => (
          <div
            key={s.key}
            className="h-full border-r border-[hsl(var(--surface))] last:border-r-0"
            style={{ width: `${share(s.value)}%`, backgroundColor: s.fill }}
            title={`${s.label} (${s.term}): ${n(s.value)} of ${n(total)} — ${s.definition}`}
          />
        ))}
      </div>

      <dl className="mt-4 space-y-2.5">
        {segments.map((s) => (
          <div key={s.key} className="flex items-baseline gap-2.5" title={s.definition}>
            <span
              aria-hidden="true"
              className="mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: s.fill }}
            />
            <dt className="min-w-0 flex-1 text-sm leading-5 text-foreground/85">
              {s.label}{" "}
              <span lang="ne" className="text-muted-foreground">
                {s.term}
              </span>
            </dt>
            <dd className="shrink-0 font-mono text-sm tabular-nums text-foreground">
              {n(s.value)}
              <span className="ml-2 text-muted-foreground">{pct1(share(s.value))}</span>
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 border-t border-border pt-2.5 text-right font-mono text-xs tabular-nums text-muted-foreground">
        {totalLabel} {n(total)}
      </p>
    </div>
  );
}
