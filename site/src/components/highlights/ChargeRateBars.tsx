import { ChartHeading } from "@/components/highlights/ChartHeading";
import { useFormat } from "@/lib/format";

export type ChargeRate = {
  key: string;
  label: string;
  /** The charge as the register writes it. */
  term: string;
  /** Full convictions as a share of this charge's decided cases. */
  fullPct: number;
  convicted: number;
  decided: number;
};

/**
 * Full-conviction rate by charge, sorted, with the court average marked.
 *
 * Horizontal bars because the labels are long and the comparison is between
 * categories rather than across time. Every row prints its own numerator and
 * denominator: the rates differ by a factor of twenty here, and a reader needs to
 * see that the low ones rest on enough cases to mean something.
 *
 * Bars are neutral and only the leader is crimson. Colour is never the sole
 * carrier of meaning, so the rate is printed on every row as well.
 */
export function ChargeRateBars({
  rows,
  avgPct,
  rateLabel,
}: {
  rows: readonly ChargeRate[];
  /** Still sets the scale, so bar lengths stay comparable with the full chart. */
  avgPct: number;
  rateLabel: string;
}) {
  const { n, pct } = useFormat();
  const max = Math.max(...rows.map((r) => r.fullPct), avgPct, 1);
  const scale = (v: number) => (v / max) * 100;
  const top = rows[0]?.key;

  return (
    <div>
      <ChartHeading>{rateLabel}</ChartHeading>

      <div className="relative">
        <ul className="relative z-10 space-y-3">
          {rows.map((r) => (
            <li key={r.key}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-sm text-foreground/85" title={r.term}>
                  {r.label}
                </span>
                <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-foreground">
                  {pct(r.fullPct)}
                </span>
              </div>
              <div className="mt-1.5 h-2.5 w-full rounded-sm bg-foreground/[0.07]">
                <div
                  className="h-full rounded-sm"
                  style={{
                    width: `${scale(r.fullPct)}%`,
                    backgroundColor:
                      r.key === top ? "hsl(var(--accent))" : "hsl(var(--foreground) / 0.45)",
                  }}
                  title={`${r.label}: ${n(r.convicted)} full convictions of ${n(r.decided)} decided cases`}
                />
              </div>
              <p className="mt-1 font-mono text-[0.7rem] tabular-nums text-muted-foreground">
                {n(r.convicted)} / {n(r.decided)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
