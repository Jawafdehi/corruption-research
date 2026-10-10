import { useFormat } from "@/lib/format";

export type DurationBand = {
  band: string;
  cases: number;
};

/**
 * How long decided cases took, filing to verdict.
 *
 * Horizontal bars rather than a stacked one: the question is "how many landed in
 * each band", which is a comparison between bands, and four separate bars answer
 * it without the reader having to measure segment lengths against each other.
 *
 * Every bar prints its own count and share, so the chart is readable without
 * hovering and colour never carries the meaning on its own.
 */
export function DurationBands({
  bands,
  measured,
  median,
  pending,
  labels,
}: {
  bands: readonly DurationBand[];
  measured: number;
  median: number;
  pending: number;
  labels: {
    heading: string;
    cumulative: string;
    pendingNote: string;
    medianNote: string;
  };
}) {
  const { n, pct1 } = useFormat();
  const max = Math.max(...bands.map((b) => b.cases), 1);
  const share = (v: number) => (measured ? (v / measured) * 100 : 0);

  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">{labels.heading}</p>

      <ul className="space-y-3">
        {bands.map((b, i) => (
          <li key={b.band}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-foreground/85">{b.band}</span>
              <span className="shrink-0 font-mono text-sm tabular-nums text-foreground">
                {n(b.cases)}
                <span className="ml-2 font-semibold">{pct1(share(b.cases))}</span>
              </span>
            </div>
            <div className="mt-1.5 h-2.5 w-full rounded-sm bg-foreground/[0.07]">
              <div
                className="h-full rounded-sm"
                style={{
                  width: `${(b.cases / max) * 100}%`,
                  // The first two bands are the ones the cumulative claim rests on.
                  backgroundColor:
                    i < 2 ? "hsl(var(--accent) / 0.85)" : "hsl(var(--foreground) / 0.4)",
                }}
                title={`${b.band}: ${n(b.cases)} of ${n(measured)} decided cases`}
              />
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-1.5 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
        <div className="flex gap-2">
          <dt className="shrink-0 font-medium text-foreground/80">{labels.cumulative}</dt>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0">{labels.medianNote}</dt>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0">{labels.pendingNote}</dt>
        </div>
      </dl>
    </div>
  );
}
