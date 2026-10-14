import { useFormat } from "@/lib/format";

export type TrendPoint = {
  /** Axis label, e.g. a fiscal year. */
  label: string;
  value: number;
  /** Drawn dashed and excluded from the "settled" reading. */
  provisional?: boolean;
};

/**
 * A year-by-year line small enough to sit inside a highlight card.
 *
 * It exists because two of the highlights were single numbers that describe a
 * fourteen-year record and nothing else — a median, and a conviction rate for one
 * charge. Both are true and both invite the same wrong inference, that the figure
 * describes now. A line is the shortest honest correction: the number stays, and the
 * shape underneath it says which part of the period it came from.
 *
 * Hand-drawn SVG rather than a chart library. At this size the axes, grid, tooltip and
 * legend a library brings are all things that have to be switched off again, and the
 * two annotated points carry everything a reader needs.
 */
export function MiniTrend({
  points,
  format,
  reference,
  highlight,
  ariaLabel,
}: {
  points: readonly TrendPoint[];
  /** Renders a value for the annotations, e.g. `${v} months` or `${v}%`. */
  format: (v: number) => string;
  /** A baseline worth drawing, e.g. the all-period median the card quotes. */
  reference?: { value: number; label: string };
  /** Indices of the points to annotate. Keep it to two: this is a card, not a chart. */
  highlight: readonly number[];
  ariaLabel: string;
}) {
  const { n } = useFormat();
  const W = 600;
  const H = 148;
  const padX = 10;
  const padTop = 30;
  const padBottom = 24;

  const values = points.map((p) => p.value);
  const maxRaw = Math.max(...values, reference?.value ?? 0);
  // Headroom so an annotated peak's label is not clipped by the top edge.
  const max = maxRaw * 1.12 || 1;
  const x = (i: number) => padX + (i * (W - padX * 2)) / Math.max(points.length - 1, 1);
  const y = (v: number) => padTop + (1 - v / max) * (H - padTop - padBottom);

  // The solid run stops at the last settled point, and the dashed run starts there, so
  // the two meet rather than leaving a gap at the join.
  const lastSettled = points.reduce((acc, p, i) => (p.provisional ? acc : i), 0);
  const line = (from: number, to: number) =>
    points
      .slice(from, to + 1)
      .map((p, k) => `${x(from + k)},${y(p.value)}`)
      .join(" ");

  const hasProvisional = points.some((p) => p.provisional);
  const areaTop = line(0, lastSettled);
  const area = `${areaTop} ${x(lastSettled)},${H - padBottom} ${x(0)},${H - padBottom}`;

  return (
    <figure className="mt-1" aria-label={ariaLabel}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={ariaLabel}>
        {reference ? (
          <>
            <line
              x1={padX}
              x2={W - padX}
              y1={y(reference.value)}
              y2={y(reference.value)}
              stroke="hsl(var(--foreground))"
              strokeOpacity={0.45}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <text
              x={W - padX}
              y={y(reference.value) - 6}
              textAnchor="end"
              fontSize={13}
              fill="hsl(var(--foreground))"
              fillOpacity={0.6}
            >
              {reference.label}
            </text>
          </>
        ) : null}

        <polygon points={area} fill="hsl(var(--accent))" fillOpacity={0.08} />
        <polyline
          points={areaTop}
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {hasProvisional ? (
          <polyline
            points={line(lastSettled, points.length - 1)}
            fill="none"
            stroke="hsl(var(--accent))"
            strokeOpacity={0.5}
            strokeWidth={2.5}
            strokeDasharray="5 5"
            strokeLinecap="round"
          />
        ) : null}

        {highlight.map((i) => {
          const p = points[i];
          if (!p) return null;
          const anchor = i === 0 ? "start" : i === points.length - 1 ? "end" : "middle";
          const nudge = i === 0 ? -4 : i === points.length - 1 ? 4 : 0;
          return (
            <g key={p.label}>
              <circle cx={x(i)} cy={y(p.value)} r={4.5} fill="hsl(var(--accent))" />
              <text
                x={x(i) - nudge}
                y={y(p.value) - 12}
                textAnchor={anchor}
                fontSize={17}
                fontWeight={700}
                fill="hsl(var(--accent))"
              >
                {format(p.value)}
              </text>
              <text
                x={x(i) - nudge}
                y={H - 6}
                textAnchor={anchor}
                fontSize={13}
                fill="hsl(var(--muted-foreground))"
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* The series as text, for a reader who cannot use the figure at all. */}
      <span className="sr-only">
        {points.map((p) => `${p.label}: ${format(p.value)}${p.provisional ? " (provisional)" : ""}`).join(", ")}
        {reference ? `. ${reference.label}.` : ""}
        {` ${n(points.length)}`}
      </span>
    </figure>
  );
}
