import { useId, useState } from "react";
import { Link } from "react-router-dom";

export type RouteInsight = {
  /** What the gap is ABOUT, in one or two words. Printed on the indicator chip. */
  tag: string;
  title: string;
  body: string;
  /** Internal destination. A path routes in-app; an absolute URL opens jawafdehi.org. */
  href: string;
  linkLabel: string;
  /**
   * "finding" is something the record establishes; "gap" is something the published
   * record cannot answer. Kept visually apart because a missing number and a measured
   * one are not the same claim.
   */
  kind: "finding" | "gap";
};

/** Where a complaint can leave the route, and the question that sends it there. */
export type RouteExit = {
  question: string;
  label: string;
  tone: "tameli" | "stands";
};

/** The one place a count belongs in the figure itself: what screening actually did. */
export type RouteSplit = {
  caption: string;
  parts: readonly { key: string; label: string; value: number; tone: "out" | "on" | "other" }[];
  total: number;
  totalLabel: string;
};

export type RouteStep = {
  key: string;
  n: number;
  title: string;
  exit?: RouteExit;
  split?: RouteSplit;
  insight?: RouteInsight;
};

export type RoutePhase = {
  key: string;
  label: string;
  tone: "commission" | "court";
  steps: readonly RouteStep[];
};

export type RouteLabels = {
  no: string;
  open: string;
  close: string;
  finding: string;
  gap: string;
  srIntro: string;
};

const TONE = {
  commission: "hsl(var(--foreground))",
  court: "hsl(var(--court))",
} as const;

const PART_FILL = {
  out: "hsl(var(--accent))",
  on: "hsl(var(--court))",
  other: "hsl(var(--foreground) / 0.3)",
} as const;

/**
 * The route a complaint takes: three phases, eight stages, and the ways out.
 *
 * An earlier version drew the same eight stages as one flat numbered list with a "?"
 * on the ones that had research behind them. It was accurate and told a reader almost
 * nothing: eight identical rows have no hierarchy, and a question mark says only that
 * something exists, never what. Two changes follow from that. The stages are grouped
 * into the three institutions that actually hold them, so the shape of the system is
 * visible before any label is read; and every indicator carries its own subject —
 * "Tracking", "Reasons", "The wait" — so a reader chooses what to open instead of
 * clicking to find out what they are opening.
 *
 * Exits hang off the stage that produces them rather than sitting in their own boxes.
 * Tameli is not a destination at the bottom of a diagram; it is what most complaints
 * do at a particular decision, and drawing it anywhere else misstates the process.
 *
 * HTML and CSS rather than SVG: the indicators have to be real buttons and the panels
 * real regions, and in SVG all of that is rebuilt by hand.
 */
export function RouteMap({
  phases,
  labels,
}: {
  phases: readonly RoutePhase[];
  labels: RouteLabels;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();

  return (
    <div>
      <p className="sr-only">{labels.srIntro}</p>

      <div className="space-y-3">
        {phases.map((phase) => {
          const colour = TONE[phase.tone];
          return (
            <section
              key={phase.key}
              className="overflow-hidden rounded-xl border border-border bg-background/40"
            >
              <h3
                className="border-b border-border px-4 py-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] md:px-5"
                style={{ color: colour }}
              >
                {phase.label}
              </h3>

              <ol className="px-4 py-3 md:px-5 md:py-4">
                {phase.steps.map((s, i) => {
                  const last = i === phase.steps.length - 1;
                  const panelId = `${uid}-${s.key}`;
                  const isOpen = open === s.key;

                  return (
                    <li
                      key={s.key}
                      className="relative grid grid-cols-[1.4rem_minmax(0,1fr)] gap-x-3 md:grid-cols-[1.6rem_minmax(0,1fr)]"
                    >
                      {/* The through-line. It runs between stages inside a phase and
                          stops at the last one, so the join to the next phase is the
                          gap between the cards rather than a line crossing a border. */}
                      <div className="relative flex justify-center">
                        {!last ? (
                          <span
                            aria-hidden="true"
                            className="absolute left-1/2 top-1 h-full w-[1.5px] -translate-x-1/2"
                            style={{ background: `color-mix(in srgb, ${colour} 22%, transparent)` }}
                          />
                        ) : null}
                        <span
                          aria-hidden="true"
                          className="relative mt-[0.3rem] h-2.5 w-2.5 shrink-0 rounded-full ring-[3px] ring-background"
                          style={{ background: colour }}
                        />
                      </div>

                      <div className={last ? "pb-0.5" : "pb-4"}>
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5">
                          {/* Numbering stays, small: it orders the stages without
                              becoming the thing the figure is about. */}
                          <span
                            aria-hidden="true"
                            className="font-mono text-[0.62rem] font-bold tabular-nums text-muted-foreground"
                          >
                            {s.n}
                          </span>
                          <p className="font-display text-[0.95rem] font-bold leading-snug text-foreground">
                            {s.title}
                          </p>

                          {s.insight ? (
                            <button
                              type="button"
                              onClick={() => setOpen(isOpen ? null : s.key)}
                              aria-expanded={isOpen}
                              aria-controls={panelId}
                              className={
                                "inline-flex items-center gap-1 rounded-full border px-2 py-[0.1rem] text-[0.65rem] font-semibold transition-colors " +
                                (isOpen
                                  ? "border-accent bg-accent text-background"
                                  : "border-accent/40 bg-accent/[0.08] text-accent hover:bg-accent/[0.16]")
                              }
                            >
                              <span
                                aria-hidden="true"
                                className={
                                  "inline-block h-1.5 w-1.5 rounded-full " +
                                  (isOpen ? "bg-background" : "bg-accent")
                                }
                              />
                              {s.insight.tag}
                              <span className="sr-only">
                                {" — "}
                                {isOpen ? labels.close : labels.open}
                              </span>
                            </button>
                          ) : null}
                        </div>

                        {s.split ? <SplitBar split={s.split} /> : null}

                        {s.exit ? <ExitBranch exit={s.exit} no={labels.no} /> : null}

                        {s.insight ? (
                          <div
                            id={panelId}
                            role="region"
                            hidden={!isOpen}
                            className="mt-2.5 max-w-xl rounded-lg border border-border bg-[hsl(var(--surface))] p-3.5"
                          >
                            <p className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                              {s.insight.kind === "gap" ? labels.gap : labels.finding}
                            </p>
                            <p className="mt-1.5 font-display text-sm font-bold leading-snug text-foreground">
                              {s.insight.title}
                            </p>
                            <p className="mt-1 text-[0.8rem] leading-6 text-foreground/80">
                              {s.insight.body}
                            </p>
                            {s.insight.href.startsWith("http") ? (
                              <a
                                href={s.insight.href}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-block text-[0.8rem] font-semibold text-accent underline underline-offset-4"
                              >
                                {s.insight.linkLabel} ↗︎
                              </a>
                            ) : (
                              <Link
                                to={s.insight.href}
                                className="mt-2 inline-block text-[0.8rem] font-semibold text-accent underline underline-offset-4"
                              >
                                {s.insight.linkLabel} →
                              </Link>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/** The branch off the main line, drawn as a branch. */
function ExitBranch({ exit, no }: { exit: RouteExit; no: string }) {
  return (
    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem]">
      <span aria-hidden="true" className="font-mono text-muted-foreground">
        └
      </span>
      <span className="text-muted-foreground">{exit.question}</span>
      <span aria-hidden="true" className="font-mono text-muted-foreground">
        {no} →
      </span>
      <span
        className={
          "rounded-full px-2 py-[0.1rem] font-semibold " +
          (exit.tone === "tameli"
            ? "bg-accent/10 text-accent ring-1 ring-accent/30"
            : "bg-foreground/[0.07] text-foreground/70 ring-1 ring-border")
        }
      >
        {exit.label}
      </span>
    </p>
  );
}

/**
 * What one stage actually did, as a proportional bar.
 *
 * The figure carries exactly one of these. A count belongs in the diagram only where
 * the shape of the split *is* the finding — here, that almost everything leaving this
 * stage leaves the process at it.
 */
function SplitBar({ split }: { split: RouteSplit }) {
  return (
    <div className="mt-2 max-w-md">
      <div className="flex h-2.5 overflow-hidden rounded-sm" role="presentation">
        {split.parts.map((p) => (
          <span
            key={p.key}
            className="block h-full"
            style={{
              width: `${(p.value / split.total) * 100}%`,
              background: PART_FILL[p.tone],
            }}
          />
        ))}
      </div>
      <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[0.68rem] text-muted-foreground">
        {split.parts.map((p) => (
          <li key={p.key} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: PART_FILL[p.tone] }}
            />
            <span className="font-mono font-semibold tabular-nums text-foreground/85">
              {p.label}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-1 text-[0.65rem] leading-5 text-muted-foreground">{split.caption}</p>
    </div>
  );
}
