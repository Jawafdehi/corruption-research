import { useFormat } from "@/lib/format";

export type AppealSide = {
  key: string;
  /** Who brought the appeal. */
  who: string;
  /** What a full reversal means for this side, in plain words. */
  stake: string;
  appeals: number;
  decided: number;
  reversed: number;
};

/**
 * How often each side wins the appeals it brings.
 *
 * ⚠️ Drawn over DECIDED appeals, not over every appeal established.
 *
 * The earlier version drew one bar across all appeals and split it three ways --
 * won, decided otherwise, and no outcome recorded -- then printed the success rate
 * underneath. Those two things disagree: 157 of 429 is 36.6%, but 157 of the 705
 * appeals the defence actually brought is 22%, so the band a reader measured by eye
 * was never the number in the caption. Two different denominators in one figure is
 * the whole reason it read as confusing.
 *
 * So the bar now answers exactly one question -- of the appeals that reached a
 * decision, what share succeeded -- and the untraced appeals are stated once below,
 * as a count, where they cannot be mistaken for part of the rate.
 *
 * Plain divs rather than a chart library: one side's bar is barely one percent wide
 * and needs a guaranteed minimum width to stay visible at all.
 */
export function AppealAsymmetry({
  sides,
  wonLabel,
  ofDecidedLabel,
  untraced,
  untracedLabel,
}: {
  sides: readonly AppealSide[];
  wonLabel: string;
  /** "{{won}} of {{decided}} decided appeals succeeded" */
  ofDecidedLabel: string;
  untraced: { missing: number; total: number } | null;
  /** "No outcome is recorded for {{missing}} of the {{total}} appeals traced ({{pct}})." */
  untracedLabel: string;
}) {
  const { n, pct1 } = useFormat();

  return (
    <div>
      <ul className="space-y-6">
        {sides.map((s) => {
          const rate = s.decided ? (s.reversed / s.decided) * 100 : 0;
          // Never thinner than a hairline: the Commission's bar is ~1% and would
          // otherwise vanish, which would read as "no data" rather than "almost never".
          const width = Math.max(rate, 0.8);

          return (
            <li key={s.key}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                <p className="text-sm font-semibold text-foreground">{s.who}</p>
                <p className="text-xs text-muted-foreground">{s.stake}</p>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="h-7 min-w-0 flex-1 overflow-hidden rounded-sm bg-foreground/[0.07]"
                  role="img"
                  aria-label={`${s.who}: ${n(s.reversed)} ${wonLabel} ${n(s.decided)} — ${pct1(rate)}`}
                >
                  <div
                    className="h-full rounded-sm bg-accent"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="shrink-0 font-mono text-base font-semibold tabular-nums text-accent">
                  {pct1(rate)}
                </span>
              </div>

              <p className="mt-1.5 font-mono text-xs tabular-nums text-muted-foreground">
                {ofDecidedLabel
                  .replace("{{won}}", n(s.reversed))
                  .replace("{{decided}}", n(s.decided))}
              </p>
            </li>
          );
        })}
      </ul>

      {/* Stated as a count under the bars rather than drawn as a third band inside
          them: it is not part of either rate, and inside the bar it kept being read
          as though it were. */}
      {untraced ? (
        <p className="mt-5 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
          {untracedLabel
            .replace("{{missing}}", n(untraced.missing))
            .replace("{{total}}", n(untraced.total))
            .replace(
              "{{pct}}",
              pct1(untraced.total ? (untraced.missing / untraced.total) * 100 : 0),
            )}
        </p>
      ) : null}
    </div>
  );
}
