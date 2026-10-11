import { useFormat } from "@/lib/format";

export type AccusedRow = {
  en: string;
  ne: string;
  cases: number;
  accused: number;
};

/**
 * How many people are charged in one case, by offence family.
 *
 * Sorted by people-per-case rather than by volume, because the finding is the spread:
 * a forged certificate is one person and one document, a rigged land transfer is dozens
 * of people on one docket. That spread is the mechanism behind the conviction-rate
 * spread on the same page, so the two charts are meant to be read against each other.
 *
 * Bars are scaled to the largest row, and the raw cases/accused counts sit under each
 * label, so the ratio can never be read without its denominators.
 */
export function AccusedPerCase({
  rows,
  perCaseLabel,
  language,
}: {
  rows: readonly AccusedRow[];
  perCaseLabel: string;
  language: string;
}) {
  const { n } = useFormat();
  const ratio = (r: AccusedRow) => (r.cases ? r.accused / r.cases : 0);
  const sorted = [...rows].sort((a, b) => ratio(b) - ratio(a));
  const max = Math.max(...sorted.map(ratio), 1);

  const fmt = (v: number) =>
    new Intl.NumberFormat(language === "ne" ? "ne-NP" : "en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(v);

  return (
    <div
      role="img"
      aria-label={sorted
        .map((r) => `${r.en}: ${fmt(ratio(r))} ${perCaseLabel}`)
        .join("; ")}
    >
      <ul className="space-y-3">
        {sorted.map((r) => (
          <li key={r.en}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-foreground/85">
                {r.en}{" "}
                <span lang="ne" className="text-muted-foreground">
                  {r.ne}
                </span>
              </span>
              <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-foreground">
                {fmt(ratio(r))}
              </span>
            </div>
            <div className="mt-1.5 h-2.5 w-full rounded-sm bg-foreground/[0.07]">
              <div
                className="h-full rounded-sm bg-accent"
                style={{ width: `${(ratio(r) / max) * 100}%` }}
              />
            </div>
            <p className="mt-1 font-mono text-[11px] tabular-nums text-muted-foreground">
              {n(r.accused)} / {n(r.cases)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
