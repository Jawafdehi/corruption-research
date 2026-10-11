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
/**
 * A fiscal-year tick that links to the report it came from.
 *
 * The citation belongs on the year it describes, not in a run of nine links under the
 * chart where a reader has to match them back up by eye. Dotted underline so the
 * affordance is visible without the axis turning into a row of blue links.
 */
function FyTick({ x, y, payload, hrefs, linkTitle }: any) {
  const href = hrefs[payload.value];
  const label = (
    <text
      x={0}
      y={0}
      dy={10}
      textAnchor="middle"
      fontSize={11}
      fill="hsl(var(--muted-foreground))"
      style={href ? { textDecoration: "underline dotted", cursor: "pointer" } : undefined}
    >
      {payload.value}
    </text>
  );
  return (
    <g transform={`translate(${x},${y})`}>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer">
          <title>{linkTitle.replace("{{fy}}", payload.value)}</title>
          {label}
        </a>
      ) : (
        label
      )}
    </g>
  );
}

export function TameliTrend({
  rows,
  tameliLabel,
  filedLabel,
  shareLabel,
  linkTitle,
}: {
  rows: readonly Disposal[];
  tameliLabel: string;
  filedLabel: string;
  shareLabel: string;
  /** Hover title on a year tick, e.g. "Open the {{fy}} annual report". */
  linkTitle: string;
}) {
  const { n, pct } = useFormat();
  const mounted = useMounted();

  const data = rows.map((r) => ({
    fy: r.fy,
    tameli: r.tameli,
    filed: r.filed,
    share: Math.round(tameliPct(r) * 10) / 10,
  }));

  const hrefs = Object.fromEntries(rows.map((r) => [r.fy, r.source_url]));

  const ariaLabel = data
    .map((d) => `${d.fy}: ${tameliLabel} ${n(d.tameli)}, ${shareLabel} ${pct(d.share)}`)
    .join("; ");

  if (!mounted) return <div className="h-[300px] w-full" />;

  const swatch = (color: string, label: string, line = false) => (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className={line ? "h-0.5 w-4 rounded-full" : "h-2.5 w-2.5 rounded-sm"}
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );

  return (
    <div className="w-full">
      <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <li>{swatch("hsl(var(--alert))", tameliLabel)}</li>
        <li>{swatch("hsl(var(--primary))", filedLabel)}</li>
        <li>{swatch("hsl(var(--accent))", shareLabel, true)}</li>
      </ul>

      <div role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={300} minWidth={440}>
        <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="fy"
            tickLine={false}
            axisLine={false}
            interval={0}
            height={34}
            tick={<FyTick hrefs={hrefs} linkTitle={linkTitle} />}
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
    </div>
  );
}
