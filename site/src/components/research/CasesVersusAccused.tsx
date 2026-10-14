import { useFormat } from "@/lib/format";

export type GrainRow = {
  key: string;
  label: string;
  /** The court's own Nepali term, so the label maps back to the cause list. */
  term: string;
  cases: number;
  accused: number;
  fill: string;
};

/**
 * The same three verdicts counted twice: once per case, once per accused person.
 *
 * Two bars against a shared 0–100% baseline rather than a grouped bar chart of raw
 * counts, because the finding is that the two distributions disagree — and a reader
 * can see two shares diverge at a glance where they would have to do arithmetic on
 * counts. The counts are printed alongside so nothing is hidden behind the share.
 *
 * Deliberately NOT a per-person conviction rate. The court publishes one verdict per
 * case, so "accused in cases that ended in full conviction" is as far as the record
 * goes; the partial-conviction band is exactly the population whose individual outcome
 * the record does not state, and it is labelled that way instead of being split.
 */
export function CasesVersusAccused({
  rows,
  caseLabel,
  accusedLabel,
}: {
  rows: readonly GrainRow[];
  caseLabel: string;
  accusedLabel: string;
}) {
  const { n, pct1 } = useFormat();
  const totalCases = rows.reduce((s, r) => s + r.cases, 0);
  const totalAccused = rows.reduce((s, r) => s + r.accused, 0);

  const bars = [
    { label: caseLabel, total: totalCases, get: (r: GrainRow) => r.cases },
    { label: accusedLabel, total: totalAccused, get: (r: GrainRow) => r.accused },
  ];

  const ariaLabel = bars
    .map(
      (b) =>
        `${b.label}: ` +
        rows.map((r) => `${r.label} ${pct1((b.get(r) / b.total) * 100)}`).join(", "),
    )
    .join(". ");

  return (
    <div role="img" aria-label={ariaLabel}>
      {bars.map((bar) => (
        <div key={bar.label} className="mb-5 last:mb-0">
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium text-foreground">{bar.label}</span>
            <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
              {n(bar.total)}
            </span>
          </div>

          <div className="flex h-7 w-full overflow-hidden rounded-sm">
            {rows.map((r) => {
              const share = bar.total ? (bar.get(r) / bar.total) * 100 : 0;
              return (
                <div
                  key={r.key}
                  title={`${r.label} — ${n(bar.get(r))} (${pct1(share)})`}
                  style={{ width: `${share}%`, backgroundColor: r.fill }}
                  className="flex items-center justify-center"
                >
                  {/* Printed in-band only where there is room for it; the figure is
                      repeated in the legend below, so a narrow band losing its label
                      costs the reader nothing. */}
                  {share >= 12 ? (
                    <span className="font-mono text-[11px] font-semibold tabular-nums text-white/95">
                      {pct1(share)}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <ul className="mt-4 space-y-2 border-t border-border pt-3">
        {rows.map((r) => (
          <li key={r.key} className="flex items-baseline gap-2.5 text-sm">
            <span
              aria-hidden="true"
              className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: r.fill }}
            />
            <span className="text-foreground/85">
              {r.label}{" "}
              <span lang="ne" className="text-muted-foreground">
                {r.term}
              </span>
            </span>
            <span className="ml-auto shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
              {n(r.cases)} {caseLabel.toLowerCase()} · {n(r.accused)} {accusedLabel.toLowerCase()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
