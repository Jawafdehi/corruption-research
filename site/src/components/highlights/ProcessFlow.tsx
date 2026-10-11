import type { ReactNode } from "react";

/**
 * The route a corruption complaint takes, as a compact diagram.
 *
 * Checked against the अख्तियार दुरुपयोग अनुसन्धान आयोग कार्यविधि, २०७८; the
 * appeal forum against the विशेष अदालत ऐन, २०५९ दफा १७.
 *
 * One language at a time: every string here comes through `t()`, so the English
 * reader gets English and the Nepali reader gets Nepali rather than both at once.
 * तामेली is romanised as "Tameli" on the English side, because there is no English
 * word for it and translating it as "closed" would lose that it is a specific
 * disposition with its own legal consequences.
 *
 * A complaint can be put in तामेली at THREE points, not one: at screening
 * (दफा २१), after the preliminary inquiry (दफा २२(३)(छ)), and at the Commission's
 * decision on the investigation report (दफा २५(ग)). Each of those boxes carries
 * its own exit. Detailed investigation has no exit of its own because the
 * कार्यविधि routes its report to the Commission's decision instead.
 */

export type FlowStage = {
  key: string;
  title: string;
  body: string;
  /** A तामेली exit available at this stage. Omitted where the rule gives none. */
  exit?: string;
  /** Label for the path that continues, shown only where the split matters. */
  continues?: string;
};

const Connector = () => (
  <div aria-hidden="true" className="flex justify-center py-1">
    <svg width="14" height="20" viewBox="0 0 14 20" className="text-border">
      <line x1="7" y1="0" x2="7" y2="13" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 12 L7 18 L11 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export function ProcessFlow({
  stages,
  exitNote,
}: {
  stages: readonly FlowStage[];
  /** Short gloss shown once beside the first exit, e.g. "closed, no further action". */
  exitNote: string;
  }) {
  let firstExitSeen = false;

  return (
    <ol className="max-w-xl">
      {stages.map((s, i) => {
        const showNote = Boolean(s.exit) && !firstExitSeen;
        if (s.exit) firstExitSeen = true;

        return (
          <li key={s.key}>
            <div className="rounded-md border border-border bg-[hsl(var(--surface))] px-4 py-3">
              <div className="flex items-baseline gap-2.5">
                <span
                  aria-hidden="true"
                  className="font-mono text-xs font-semibold tabular-nums text-accent"
                >
                  {i + 1}
                </span>
                <h4 className="font-display text-sm font-bold leading-snug md:text-base">
                  {s.title}
                </h4>
              </div>
              <p className="mt-1.5 pl-6 text-sm leading-6 text-foreground/80">{s.body}</p>
            </div>

            {s.exit ? (
              // Drawn as a sideways exit rather than a fork, because the main line
              // continues either way. The dot and the arrow carry the direction;
              // the wording carries the meaning.
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pl-6 pt-1.5 text-xs">
                <span aria-hidden="true" className="text-muted-foreground">
                  ↳
                </span>
                <span className="rounded border border-border bg-background px-2 py-0.5 font-medium">
                  {s.exit}
                </span>
                {showNote ? <span className="text-muted-foreground">{exitNote}</span> : null}
              </div>
            ) : null}

            {i < stages.length - 1 ? <Connector /> : null}
          </li>
        );
      })}
    </ol>
  );
}

export const FlowNote = ({ children }: { children: ReactNode }) => (
  <p className="mt-4 max-w-xl text-xs leading-5 text-muted-foreground">{children}</p>
);
