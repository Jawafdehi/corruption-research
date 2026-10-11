import { ChartHeading } from "@/components/highlights/ChartHeading";
import type { JusticeRow } from "@/data/research-corruption";
import { useFormat } from "@/lib/format";

/**
 * Every bench's full-conviction rate as one dot on one axis.
 *
 * A strip plot, not the dot-plot-with-names used on the Court outcomes tab: that one
 * is 39 labelled rows and answers "which justice", which is not a question a summary
 * card should be asking. Here the finding is only the width of the spread, and a
 * single axis shows it in about a second.
 *
 * Dots are translucent so where benches pile up near the average the overlap reads as
 * density, which is the honest shape — most benches sit near the middle and the
 * extremes are extremes.
 */
export function BenchSpread({
  justices,
  avgPct,
  heading,
  lowLabel,
  highLabel,
  avgLabel,
}: {
  justices: readonly JusticeRow[];
  avgPct: number;
  heading: string;
  lowLabel: string;
  highLabel: string;
  avgLabel: string;
}) {
  const { pct } = useFormat();
  const rates = justices.map((j) => j.convPct);
  const lo = Math.min(...rates);
  const hi = Math.max(...rates);

  return (
    <div>
      <ChartHeading>{heading}</ChartHeading>

      <div
        className="relative h-16"
        role="img"
        aria-label={`${justices.length} benches, ${pct(lo)} to ${pct(hi)}, court average ${pct(avgPct)}`}
      >
        {/* The axis the dots sit on. 0–100%, so a reader is not reading a zoomed
            scale that exaggerates the spread. */}
        <div className="absolute inset-x-0 top-7 h-px bg-border" />

        {/* Court average, drawn first so dots sit over it. */}
        <div
          aria-hidden="true"
          className="absolute top-3 h-9 border-l border-dashed border-foreground/40"
          style={{ left: `${avgPct}%` }}
        />

        {justices.map((j) => {
          const extreme = j.convPct === lo || j.convPct === hi;
          return (
            <span
              key={j.name}
              title={`${j.name}: ${pct(j.convPct)} over ${j.decisions} decisions`}
              className="absolute h-2.5 w-2.5 -translate-x-1/2 rounded-full"
              style={{
                left: `${j.convPct}%`,
                top: 22,
                backgroundColor: extreme ? "hsl(var(--accent))" : "hsl(var(--foreground))",
                opacity: extreme ? 1 : 0.28,
              }}
            />
          );
        })}

        <span className="absolute top-9 -translate-x-1/2 font-mono text-[11px] font-semibold tabular-nums text-accent"
          style={{ left: `${lo}%` }}>
          {pct(lo)}
        </span>
        <span className="absolute top-9 -translate-x-1/2 font-mono text-[11px] font-semibold tabular-nums text-accent"
          style={{ left: `${hi}%` }}>
          {pct(hi)}
        </span>
      </div>

      <dl className="mt-1 flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-border pt-2.5 text-xs text-muted-foreground">
        <div className="flex gap-1.5">
          <dt>{lowLabel}</dt>
          <dd className="font-mono tabular-nums text-foreground/80">{pct(lo)}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt>{avgLabel}</dt>
          <dd className="font-mono tabular-nums text-foreground/80">{pct(avgPct)}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt>{highLabel}</dt>
          <dd className="font-mono tabular-nums text-foreground/80">{pct(hi)}</dd>
        </div>
      </dl>
    </div>
  );
}
