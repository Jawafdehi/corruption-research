import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ErrorBar,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MonthFiling } from "@/data/research-corruption";
import { useMounted } from "@/hooks/useMounted";
import { MONO_STACK } from "@/lib/data-quality";
import { useFormat } from "@/lib/format";

/**
 * Cases filed per Nepali month — mean bar with ±1 SD error bars across complete
 * fiscal years. Surfaces the filing seasonality: a peak in Ashadh (the
 * fiscal year-end) and a trough in Kartik (the Dashain/Tihar festival month).
 * The tall error bars are themselves the point — filing volume swings widely
 * year to year.
 *
 * The dashed line is the average across all twelve months. Without it a reader can see
 * that one bar is tall but has nothing to measure "tall" against; with it, every month
 * reads as above or below the year's own baseline at a glance.
 */
export function FiledByMonth({
  data,
  peakMonth,
  meanLabel,
  sdLabel,
  averageLabel,
}: {
  data: readonly MonthFiling[];
  /** Month index (1–12) to accent; e.g. the fiscal year-end peak. */
  peakMonth?: number;
  meanLabel: string;
  sdLabel: string;
  /** Caption on the all-month baseline, e.g. "all-month average". */
  averageLabel: string;
}) {
  const { n, dec1 } = useFormat();
  const mounted = useMounted();
  const height = 300;
  // Pin the axis to [0, nice-max]: filings can't be negative, so a large SD
  // (e.g. Kartik mean 11.2 ± 11.3) must not push the auto-domain below zero;
  // the max still clears every upper whisker (mean + sd).
  const maxY = Math.ceil(Math.max(...data.map((d) => d.mean + d.sd)) / 10) * 10;
  // Explicit ticks. `domain` alone does not stop Recharts deriving tick VALUES from
  // the data, and the error bars reach below zero -- Kartik is 11.7 ± 11.8 -- so the
  // axis was labelling itself "-0.10000000000000142" and "14.899999999999999".
  // The baseline every bar is read against: the mean of the twelve monthly means, which
  // is the average month across every complete fiscal year in the series.
  const overall = data.length ? data.reduce((sum, d) => sum + d.mean, 0) / data.length : 0;
  const step = maxY <= 20 ? 5 : 10;
  const ticks = Array.from({ length: maxY / step + 1 }, (_, i) => i * step);

  if (!mounted) return <div className="w-full" style={{ height }} />;

  const ariaLabel = `${meanLabel} by Nepali month, with ${sdLabel}. ${averageLabel} ${dec1(
    overall,
  )}. ${data.map((d) => `${d.name} ${d.mean} ±${d.sd}`).join(", ")}`;

  return (
    <div className="w-full" role="img" aria-label={ariaLabel}>
      {/* The baseline is named here rather than on the line itself. In the plot the
          caption lands on whichever bar or whisker happens to sit at that height —
          and which one that is changes with the data and with the language. */}
      <div className="mb-1 flex items-center justify-end gap-2 pr-3 text-xs text-muted-foreground">
        <span aria-hidden="true" className="inline-block h-px w-7 border-t-[1.5px] border-dashed border-foreground/75" />
        <span>
          {averageLabel}{" "}
          <span className="font-mono font-semibold tabular-nums text-foreground">
            {dec1(overall)}
          </span>
        </span>
      </div>

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data as MonthFiling[]} margin={{ top: 8, right: 12, bottom: 22, left: 4 }}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis
              dataKey="name"
              interval={0}
              tickLine={false}
              axisLine={false}
              angle={-35}
              textAnchor="end"
              height={44}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              width={36}
              domain={[0, maxY]}
              ticks={ticks}
              allowDataOverflow
              tickFormatter={(v: number) => n(v)}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))", fillOpacity: 0.4 }}
              contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 13 }}
              itemStyle={{ fontFamily: MONO_STACK }}
              formatter={(value: number, _n, entry: { payload?: MonthFiling }) => [
                `${n(value)} ± ${n(entry?.payload?.sd ?? 0)}`,
                meanLabel,
              ]}
            />
            <Bar dataKey="mean" name={meanLabel} radius={[3, 3, 0, 0]} isAnimationActive={false}>
              {data.map((d) => (
                // Lighter blue than navy so the dark error whiskers stay legible
                // against the fill; the fiscal year-end peak is accented in crimson.
                <Cell key={d.month} fill={peakMonth === d.month ? "hsl(var(--accent))" : "#2a78d6"} />
              ))}
              <ErrorBar
                dataKey="sd"
                width={7}
                strokeWidth={2}
                stroke="hsl(var(--foreground))"
                direction="y"
              />
            </Bar>

            {/* After <Bar> on purpose: Recharts paints in JSX order, and a baseline
                drawn under the fills is invisible exactly where it matters most. */}
            <ReferenceLine
              y={overall}
              stroke="hsl(var(--foreground))"
              strokeOpacity={0.75}
              strokeDasharray="5 4"
              strokeWidth={1.5}
              ifOverflow="extendDomain"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
