import { useFormat } from "@/lib/format";

export type SpreadBand = {
  from: number;
  to: number;
  cases: number;
};

/**
 * How long the decided appeals actually took, as a spread rather than a trend.
 *
 * A median on its own invites the reading that most cases sit near it. These do not:
 * the distribution has two humps, one under two years and another between six and
 * eight, and the bar for the band holding the median is the smallest reason to quote
 * it. Cohort medians were the obvious alternative and the wrong one — they bounce
 * between 1.9 and 6.3 years with no direction, so a line would assert a trend the
 * series does not carry.
 */
export function DurationSpread({
  bands,
  total,
  bandLabel,
  openEndLabel,
  caption,
}: {
  bands: readonly SpreadBand[];
  total: number;
  /** Renders a closed band, e.g. "2–4 yr". */
  bandLabel: (from: number, to: number) => string;
  /** Renders the last, open-ended band, e.g. "8 yr +". */
  openEndLabel: (from: number) => string;
  caption: string;
}) {
  const { n, pct } = useFormat();
  const max = Math.max(...bands.map((b) => b.cases), 1);

  return (
    <figure className="mt-1">
      <ul className="space-y-1.5">
        {bands.map((b, i) => {
          const last = i === bands.length - 1;
          const label = last ? openEndLabel(b.from) : bandLabel(b.from, b.to);
          return (
            <li key={`${b.from}-${b.to}`} className="flex items-center gap-2.5">
              <span className="w-[4.2rem] shrink-0 text-right font-mono text-[0.7rem] tabular-nums text-muted-foreground">
                {label}
              </span>
              <span className="h-3.5 min-w-0 flex-1 rounded-sm bg-foreground/[0.06]">
                <span
                  className="block h-full rounded-sm bg-accent"
                  style={{ width: `${(b.cases / max) * 100}%` }}
                />
              </span>
              <span className="w-[5.4rem] shrink-0 font-mono text-[0.7rem] tabular-nums text-foreground/80">
                {n(b.cases)}
                <span className="text-muted-foreground"> · {pct((b.cases / total) * 100)}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <figcaption className="mt-2 text-[0.68rem] leading-5 text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
