import { type Disposal, tameliPct } from "@/data/research-corruption";
import { useFormat } from "@/lib/format";

/**
 * The Commission's post-investigation decisions, year by year, as a table.
 *
 * A table rather than a chart here because the question this answers is "what did it
 * decide in year X" — a lookup, which a reader does by scanning a column, not by
 * estimating a bar height. The same series is plotted on the Investigation tab, where
 * the shape of the change is the point; the two are the same nine rows read two ways.
 *
 * The lowest and highest shelving years are marked, because the finding is the spread
 * between them and nothing else in a nine-row table tells you where to look.
 */
export function TameliByYear({
  rows,
  yearLabel,
  investigatedLabel,
  courtLabel,
  holdLabel,
  shareLabel,
}: {
  rows: readonly Disposal[];
  yearLabel: string;
  investigatedLabel: string;
  courtLabel: string;
  holdLabel: string;
  shareLabel: string;
}) {
  const { n, pct1 } = useFormat();
  // Only years the report states an investigation total for. FY2073/74 prints its
  // actions but never how many complaints they were taken on -- checked in the
  // chapter prose, the annex it points to, and the ministry-wise annex -- so the row
  // would carry a blank in the column the table exists to show. Filtered rather than
  // hard-coded, so the row returns by itself if a later source fills the gap.
  const shown = rows.filter((r) => r.investigated !== null);
  const shares = shown.map(tameliPct);
  const min = Math.min(...shares);
  const max = Math.max(...shares);

  return (
    <div className="chart-scroll">
      <table className="w-full min-w-[384px] border-collapse text-sm">
        <caption className="sr-only">
          {`${holdLabel} ${shareLabel}, ${shown[0]?.fy} – ${shown[shown.length - 1]?.fy}`}
        </caption>
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="py-2 pr-3 text-left font-medium">
              {yearLabel}
            </th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">
              {investigatedLabel}
            </th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">
              {courtLabel}
            </th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">
              {holdLabel}
            </th>
            <th scope="col" className="py-2 text-right font-medium">
              {shareLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {shown.map((r) => {
            const share = tameliPct(r);
            const extreme = share === min || share === max;
            return (
              <tr
                key={r.fy}
                className={
                  "border-b border-border/60 last:border-0" +
                  (extreme ? " bg-accent/[0.06]" : "")
                }
              >
                <th
                  scope="row"
                  className="py-2 pr-3 text-left font-mono text-xs font-normal tabular-nums text-foreground/80"
                >
                  {r.fy}
                </th>
                <td className="py-2 pr-3 text-right font-mono text-xs tabular-nums text-foreground/80">
                  {n(r.investigated ?? 0)}
                </td>
                <td className="py-2 pr-3 text-right font-mono text-xs tabular-nums text-foreground/80">
                  {n(r.filed)}
                </td>
                <td className="py-2 pr-3 text-right font-mono text-xs tabular-nums text-foreground/80">
                  {n(r.tameli)}
                </td>
                <td
                  className={
                    "py-2 text-right font-mono text-xs tabular-nums " +
                    (extreme ? "font-semibold text-accent" : "text-foreground")
                  }
                >
                  {pct1(share)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
