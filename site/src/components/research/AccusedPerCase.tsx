import { ChartHeading } from "@/components/highlights/ChartHeading";
import { useFormat } from "@/lib/format";

export type AccusedRow = {
  en: string;
  ne: string;
  cases: number;
  accused: number;
  /** Share of this offence's decided cases upheld in full, as a percentage. */
  fullPct: number;
};

/**
 * Two measurements per offence, side by side: how many people are charged together,
 * and how often the charge is upheld in full.
 *
 * A table with named column headers, not a bar list. The previous version drew one bar
 * per offence with a bare number beside it, and a reader could not tell whether that
 * number was a count, a ratio or a percentage — the first thing the headers now settle.
 * Only the defendant column is drawn as a bar, so the bar can only be read as the count
 * it belongs to.
 *
 * Showing the conviction column alongside is deliberate. The relationship between the
 * two is visible in the figures themselves, and a reader can see it without being told
 * it; stating it as a finding would assert a cause the data does not establish.
 */
export function AccusedPerCase({
  rows,
  heading,
  subheading,
  offenceLabel,
  averageLabel,
  averageUnit,
  convictionLabel,
  casesLabel,
  casesWord,
  defendantsWord,
  language,
}: {
  rows: readonly AccusedRow[];
  heading: string;
  subheading: string;
  offenceLabel: string;
  averageLabel: string;
  /** Unit note under the column header, e.g. "people per case". */
  averageUnit: string;
  convictionLabel: string;
  /** Unit note under the conviction header, e.g. "% of decided cases". */
  casesLabel: string;
  /** Plural noun for the case count under each offence, e.g. "cases". */
  casesWord: string;
  /** Plural noun for the defendant count, e.g. "defendants". */
  defendantsWord: string;
  language: string;
}) {
  const { n, pct } = useFormat();
  const average = (r: AccusedRow) => (r.cases ? r.accused / r.cases : 0);
  const sorted = [...rows].sort((a, b) => average(b) - average(a));
  const max = Math.max(...sorted.map(average), 1);

  const avg1 = (v: number) =>
    new Intl.NumberFormat(language === "ne" ? "ne-NP" : "en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(v);

  return (
    <div>
      <ChartHeading>{heading}</ChartHeading>
      <p className="-mt-2 mb-5 text-center text-xs text-muted-foreground">{subheading}</p>

      <div className="chart-scroll">
        <table className="w-full min-w-[430px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border align-bottom">
              <th scope="col" className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {offenceLabel}
              </th>
              <th scope="col" className="w-[46%] py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {averageLabel}
                <span className="mt-0.5 block font-normal normal-case tracking-normal text-[0.68rem] text-muted-foreground/80">
                  {averageUnit}
                </span>
              </th>
              <th scope="col" className="py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {convictionLabel}
                <span className="mt-0.5 block font-normal normal-case tracking-normal text-[0.68rem] text-muted-foreground/80">
                  {casesLabel}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.en} className="border-b border-border/60 last:border-0">
                <th
                  scope="row"
                  className="py-2.5 pr-4 text-left text-sm font-normal text-foreground/85"
                  title={r.ne}
                >
                  {r.en}
                  {/* Spelled out, not "1,098 / 41": a bare fraction gives a reader no
                      way to tell which side is which. */}
                  <span className="mt-0.5 block text-[0.68rem] text-muted-foreground">
                    <span className="font-mono tabular-nums">{n(r.cases)}</span> {casesWord}
                    {" · "}
                    <span className="font-mono tabular-nums">{n(r.accused)}</span> {defendantsWord}
                  </span>
                </th>

                <td className="py-2.5 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2.5 min-w-0 flex-1 rounded-sm bg-foreground/[0.07]">
                      <div
                        className="h-full rounded-sm bg-accent"
                        style={{ width: `${(average(r) / max) * 100}%` }}
                      />
                    </div>
                    <span className="w-9 shrink-0 text-right font-mono text-sm font-semibold tabular-nums text-foreground">
                      {avg1(average(r))}
                    </span>
                  </div>
                </td>

                {/* No bar here. A second bar would invite the two columns to be read
                    as one scale, and they are a count and a percentage. */}
                <td className="py-2.5 text-right font-mono text-sm tabular-nums text-foreground/80">
                  {pct(r.fullPct)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
