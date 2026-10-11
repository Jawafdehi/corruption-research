import { ChartHeading } from "@/components/highlights/ChartHeading";
import { useFormat } from "@/lib/format";

export type DurationBand = {
  band: string;
  cases: number;
};

/**
 * How long decided cases took, filing to verdict.
 *
 * A real table rather than a styled list: each row carries three distinct quantities
 * and a reader comparing bands needs to know which column they are reading. The bar
 * sits in its own column under a shared "share" header, so it is understood as the
 * percentage drawn rather than as a fourth unlabelled measurement.
 *
 * Every row prints its own count and share, so the figure is readable without
 * hovering and colour never carries meaning on its own.
 */
export function DurationBands({
  bands,
  measured,
  labels,
}: {
  bands: readonly DurationBand[];
  measured: number;
  labels: {
    heading: string;
    band: string;
    cases: string;
    share: string;
  };
}) {
  const { n, pct1 } = useFormat();
  const max = Math.max(...bands.map((b) => b.cases), 1);
  const share = (v: number) => (measured ? (v / measured) * 100 : 0);

  return (
    <div>
      <ChartHeading>{labels.heading}</ChartHeading>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-[0.7rem] uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="py-2 pr-3 text-left font-medium">
              {labels.band}
            </th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">
              {labels.cases}
            </th>
            {/* One header over the number and the bar, because they are the same
                quantity twice and two headers would imply two measurements. */}
            <th scope="col" colSpan={2} className="py-2 text-right font-medium">
              {labels.share}
            </th>
          </tr>
        </thead>
        <tbody>
          {bands.map((b, i) => (
            <tr key={b.band} className="border-b border-border/60 last:border-0">
              <th
                scope="row"
                className="py-2.5 pr-3 text-left text-sm font-normal text-foreground/85"
              >
                {b.band}
              </th>
              <td className="py-2.5 pr-3 text-right font-mono text-xs tabular-nums text-foreground/80">
                {n(b.cases)}
              </td>
              <td className="py-2.5 pr-3 text-right font-mono text-xs font-semibold tabular-nums text-foreground">
                {pct1(share(b.cases))}
              </td>
              <td className="w-[38%] py-2.5">
                <div
                  className="h-2.5 w-full rounded-sm bg-foreground/[0.07]"
                  title={`${b.band}: ${n(b.cases)} of ${n(measured)} decided cases`}
                >
                  <div
                    className="h-full rounded-sm"
                    style={{
                      width: `${(b.cases / max) * 100}%`,
                      // The first two bands are the ones the cumulative claim rests on.
                      backgroundColor:
                        i < 2 ? "hsl(var(--accent) / 0.85)" : "hsl(var(--foreground) / 0.4)",
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
