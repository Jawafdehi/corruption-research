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
 * The appeal asymmetry and the tracing gap in one figure.
 *
 * Each row is every appeal one side brought, split three ways: won outright,
 * decided some other way, and no outcome in the record. Drawn over the full
 * established count rather than over decided appeals only, so the grey band is
 * part of the picture instead of a footnote under it. A reader cannot take the
 * win rates away without also seeing how much of the record is missing.
 *
 * Plain divs rather than a chart library: one side's winning band is well under
 * one percent, and a bar that thin needs a guaranteed minimum width and its own
 * label to stay readable at all.
 */
export function AppealAsymmetry({
  sides,
  wonLabel,
  otherLabel,
  unknownLabel,
}: {
  sides: readonly AppealSide[];
  wonLabel: string;
  otherLabel: string;
  unknownLabel: string;
}) {
  const { n, pct1 } = useFormat();

  return (
    <div className="space-y-7">
      {sides.map((s) => {
        const otherDecided = s.decided - s.reversed;
        const unknown = s.appeals - s.decided;
        const share = (v: number) => (s.appeals ? (v / s.appeals) * 100 : 0);
        // The winning band carries the finding, so it never renders thinner than
        // a hairline even when it is a fraction of a percent of the row.
        const wonWidth = Math.max(share(s.reversed), 0.6);
        const rate = s.decided ? (s.reversed / s.decided) * 100 : 0;

        return (
          <div key={s.key}>
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-sm font-semibold text-foreground">{s.who}</p>
              <p className="text-xs text-muted-foreground">{s.stake}</p>
            </div>

            <div
              className="flex h-9 w-full overflow-hidden rounded border border-border"
              role="img"
              aria-label={`${s.who}: ${n(s.reversed)} ${wonLabel}, ${n(otherDecided)} ${otherLabel}, ${n(unknown)} ${unknownLabel}, of ${n(s.appeals)}`}
            >
              <div
                className="h-full bg-primary"
                style={{ width: `${wonWidth}%` }}
                title={`${wonLabel}: ${n(s.reversed)}`}
              />
              <div
                className="h-full bg-muted-foreground/35"
                style={{ width: `${share(otherDecided)}%` }}
                title={`${otherLabel}: ${n(otherDecided)}`}
              />
              <div
                className="h-full bg-muted/60"
                style={{
                  width: `${share(unknown)}%`,
                  backgroundImage:
                    "repeating-linear-gradient(45deg, hsl(var(--border)) 0 4px, transparent 4px 8px)",
                }}
                title={`${unknownLabel}: ${n(unknown)}`}
              />
            </div>

            <p className="mt-2 font-mono text-sm tabular-nums text-foreground">
              <span className="font-semibold text-primary">
                {n(s.reversed)} {wonLabel}
              </span>
              <span className="text-muted-foreground">
                {" "}
                / {n(s.decided)} {otherLabel.toLowerCase()} = {pct1(rate)}
              </span>
            </p>
          </div>
        );
      })}

      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" />
          {wonLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-muted-foreground/35" />
          {otherLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm border border-border"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, hsl(var(--border)) 0 3px, transparent 3px 6px)",
            }}
          />
          {unknownLabel}
        </span>
      </div>
    </div>
  );
}
