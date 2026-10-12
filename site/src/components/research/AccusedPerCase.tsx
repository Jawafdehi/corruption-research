import { ChartHeading } from "@/components/highlights/ChartHeading";
import { useFormat } from "@/lib/format";

export type AccusedRow = {
  en: string;
  ne: string;
  cases: number;
  accused: number;
};

/**
 * Average number of defendants per decided case, by offence type.
 *
 * Reports one quantity and names it: the average. An earlier version printed a bare
 * "1,098 / 41" under each bar, which a reader had to decode before they knew whether
 * the number above was a rate, a count or a ratio — so the two counts are now labelled
 * where they appear.
 *
 * Offence names are English only. The Nepali term stays available on hover rather than
 * sitting beside every label, where it doubled the width of the longest rows and made
 * the column of averages harder to scan.
 *
 * ⚠️ Says nothing about conviction. Case size and conviction rate are two different
 * measurements and are charted separately; nothing here should be read as explaining
 * the other.
 */
export function AccusedPerCase({
  rows,
  heading,
  subheading,
  casesLabel,
  defendantsLabel,
  language,
}: {
  rows: readonly AccusedRow[];
  heading: string;
  subheading: string;
  casesLabel: string;
  defendantsLabel: string;
  language: string;
}) {
  const { n } = useFormat();
  const average = (r: AccusedRow) => (r.cases ? r.accused / r.cases : 0);
  const sorted = [...rows].sort((a, b) => average(b) - average(a));
  const max = Math.max(...sorted.map(average), 1);

  // One decimal place throughout, so 26.8 and 1.0 line up as the same kind of number.
  const fmt = (v: number) =>
    new Intl.NumberFormat(language === "ne" ? "ne-NP" : "en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(v);

  return (
    <div>
      <ChartHeading>{heading}</ChartHeading>
      <p className="-mt-2 mb-5 text-center text-xs text-muted-foreground">{subheading}</p>

      <ul
        className="space-y-3.5"
        role="img"
        aria-label={sorted.map((r) => `${r.en}: ${fmt(average(r))}`).join("; ")}
      >
        {sorted.map((r) => (
          <li key={r.en} className="grid grid-cols-[1fr_auto] items-baseline gap-x-4">
            <span className="truncate text-sm text-foreground/85" title={r.ne}>
              {r.en}
            </span>
            <span className="font-mono text-base font-semibold tabular-nums text-foreground">
              {fmt(average(r))}
            </span>

            {/* Bar and counts share the row below the label, so the bar length and the
                number beside it are unmistakably the same quantity. */}
            <div className="col-span-2 mt-1.5 flex items-center gap-3">
              <div className="h-2.5 min-w-0 flex-1 rounded-sm bg-foreground/[0.07]">
                <div
                  className="h-full rounded-sm bg-accent"
                  style={{ width: `${(average(r) / max) * 100}%` }}
                />
              </div>
              <span className="shrink-0 font-mono text-[0.7rem] tabular-nums text-muted-foreground">
                {casesLabel} {n(r.cases)} · {defendantsLabel} {n(r.accused)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
