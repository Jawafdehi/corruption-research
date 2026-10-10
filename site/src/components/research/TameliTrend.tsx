import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useMounted } from "@/hooks/useMounted";
import { MONO_STACK } from "@/lib/data-quality";
import { useFormat } from "@/lib/format";
import { type Disposal, tameliPct } from "@/data/research-corruption";

/**
 * The Commission's second filter: of the complaints that completed a full
 * investigation, how many were closed as तामेली rather than prosecuted.
 *
 * Bars are counts and the line is the share, because the counts alone would read
 * as "the Commission got busier" — the share is the finding. Both come from the
 * same table in the same annual report, so the line never divides across sources.
 */
export function TameliTrend({
  rows,
  tameliLabel,
  filedLabel,
  shareLabel,
}: {
  rows: readonly Disposal[];
  tameliLabel: string;
  filedLabel: string;
  shareLabel: string;
}) {
  const { n, pct } = useFormat();
  const mounted = useMounted();

  const data = rows.map((r) => ({
    fy: r.fy,
    tameli: r.tameli,
    filed: r.filed,
    share: Math.round(tameliPct(r) * 10) / 10,
  }));

  const ariaLabel = data
    .map((d) => `${d.fy}: ${tameliLabel} ${n(d.tameli)}, ${shareLabel} ${pct(d.share)}`)
    .join("; ");

  if (!mounted) return <div className="h-[300px] w-full" />;

  return (
    <div className="w-full" role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={300} minWidth={440}>
        <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="fy"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            yAxisId="count"
            width={44}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => n(v)}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            yAxisId="share"
            orientation="right"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            width={44}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => pct(v)}
            tick={{ fontSize: 11, fill: "hsl(var(--accent))" }}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted))", fillOpacity: 0.4 }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid hsl(var(--border))",
              fontSize: 13,
            }}
            itemStyle={{ fontFamily: MONO_STACK }}
            formatter={(value: number, name: string) =>
              name === shareLabel ? [pct(value), name] : [n(value), name]
            }
          />
          <Bar
            yAxisId="count"
            dataKey="tameli"
            name={tameliLabel}
            fill="hsl(var(--alert))"
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
          <Bar
            yAxisId="count"
            dataKey="filed"
            name={filedLabel}
            fill="hsl(var(--primary))"
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
          <Line
            yAxisId="share"
            type="monotone"
            dataKey="share"
            name={shareLabel}
            stroke="hsl(var(--accent))"
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
