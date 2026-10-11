import { useFormat } from "@/lib/format";

export type AppealDecisionRow = {
  fy: string;
  appealed: number;
  notAppealed: number;
};

/**
 * The Commission's own decisions on whether to carry a Special Court verdict upward.
 *
 * A diverging bar per year — appeal above the line, decline below — because the two
 * are a choice between alternatives, not two independent series. Stacking them would
 * invite reading the pair as a total, which it is not: these are meeting decisions
 * taken in that year on verdicts handed down in some earlier year, so the column has
 * no denominator and no rate can be built from it.
 */
export function AppealDecisions({
  rows,
  appealedLabel,
  declinedLabel,
}: {
  rows: readonly AppealDecisionRow[];
  appealedLabel: string;
  declinedLabel: string;
}) {
  const { n } = useFormat();
  const max = Math.max(...rows.flatMap((r) => [r.appealed, r.notAppealed]), 1);
  const H = 96; // px for the tallest bar on either side of the baseline

  // Colours set inline from the CSS tokens rather than through Tailwind classes, so the
  // chart does not depend on a token being registered in the Tailwind config -- the
  // court green was not, and the whole upper half of this chart rendered transparent.
  const UP = "hsl(var(--court))";
  const DOWN = "hsl(var(--accent))";

  return (
    <div
      role="img"
      aria-label={rows
        .map((r) => `${r.fy}: ${appealedLabel} ${n(r.appealed)}, ${declinedLabel} ${n(r.notAppealed)}`)
        .join("; ")}
    >
      <div className="flex items-stretch gap-2">
        {rows.map((r) => (
          <div key={r.fy} className="flex min-w-0 flex-1 flex-col items-center">
            <span className="mb-1 font-mono text-[11px] tabular-nums" style={{ color: UP }}>
              {n(r.appealed)}
            </span>
            <div className="flex w-full flex-col justify-end" style={{ height: H }}>
              <div
                className="w-full rounded-t-sm"
                style={{ height: `${(r.appealed / max) * H}px`, backgroundColor: UP }}
              />
            </div>

            <div className="h-px w-full bg-foreground/25" />

            {/* The count sits directly under its own bar rather than at the foot of a
                fixed-height track, so a short bar does not leave its label stranded.
                The track keeps its height so the year labels still line up. */}
            <div className="flex w-full flex-col justify-start" style={{ height: H }}>
              <div
                className="w-full rounded-b-sm"
                style={{ height: `${(r.notAppealed / max) * H}px`, backgroundColor: DOWN }}
              />
              <span className="mt-1 font-mono text-[11px] tabular-nums" style={{ color: DOWN }}>
                {n(r.notAppealed)}
              </span>
            </div>

            <span className="mt-1.5 truncate text-[10px] text-muted-foreground">{r.fy}</span>
          </div>
        ))}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: UP }} />
          {appealedLabel}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: DOWN }} />
          {declinedLabel}
        </li>
      </ul>
    </div>
  );
}
