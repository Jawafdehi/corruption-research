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
  parts: readonly {
    key: string;
    /** What this slice is, e.g. "placed in Tameli". */
    label: string;
    /** Its share, pre-formatted: "59.6%". */
    share: string;
    /** Its count, pre-formatted: "17,716". */
    count: string;
    value: number;
    tone: "out" | "on" | "other";
  }[];
  total: number;
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
  /** Example chip shown in the hint line. */
  hintChip: string;
  /** One line telling a reader the chips open. */
  hint: string;
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

      {/* Stated plainly. The chips are discoverable once a reader has clicked one;
          this is for the reader who has not. */}
      <p className="mb-3 flex items-center gap-2 text-[0.72rem] text-muted-foreground">
        <span
          aria-hidden="true"
          className="inline-flex items-center gap-1 rounded-full border border-accent/45 bg-accent/[0.08] px-2 py-[0.1rem] text-[0.6rem] font-semibold text-accent"
        >
          <span className="font-mono text-[0.55rem] leading-none">▸</span>
          {labels.hintChip}
        </span>
        {labels.hint}
      </p>

      <div className="space-y-3">
        {phases.map((phase) => {
          const colour = TONE[phase.tone];
          return (
            <section
              key={phase.key}
              className="overflow-hidden rounded-xl border border-border/80 bg-background/50"
            >
              {/* A tinted strip rather than a ruled line: it names the institution and
                  carries its colour, so the three cards read as three places. */}
              <h3
                className="flex items-center gap-2 px-4 py-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] md:px-5"
                style={{
                  color: colour,
                  background: `color-mix(in srgb, ${colour} 7%, transparent)`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-[3px] rounded-full"
                  style={{ background: colour }}
                />
                {phase.label}
              </h3>

              <ol className="px-4 py-3.5 md:px-5 md:py-4">
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

                      <div className={last ? "pb-0.5" : "pb-3.5"}>
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

                          {/* Reads as a control, not a label. The caret does the work:
                              a coloured pill on its own was being taken for a tag, so
                              it carries an affordance a reader already knows. */}
                          {s.insight ? (
                            <button
                              type="button"
                              onClick={() => setOpen(isOpen ? null : s.key)}
                              aria-expanded={isOpen}
                              aria-controls={panelId}
                              className={
                                "group inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-[0.2rem] text-[0.65rem] font-semibold shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
                                (isOpen
                                  ? "border-accent bg-accent text-background"
                                  : "border-accent/45 bg-accent/[0.08] text-accent hover:border-accent hover:bg-accent/[0.18]")
                              }
                            >
                              <span
                                aria-hidden="true"
                                className={
                                  "inline-block font-mono text-[0.6rem] leading-none transition-transform " +
                                  (isOpen ? "rotate-90" : "group-hover:translate-x-px")
                                }
                              >
                                ▸
                              </span>
                              {s.insight.tag}
                              <span className="sr-only">
                                {" — "}
                                {isOpen ? labels.close : labels.open}
                              </span>
                            </button>
                          ) : null}
                        </div>

                        {s.exit ? <ExitBranch exit={s.exit} no={labels.no} /> : null}

                        {s.insight ? (
                          <div
                            id={panelId}
                            role="region"
                            hidden={!isOpen}
                            className="mt-2.5 max-w-xl rounded-lg border border-accent/20 border-l-[3px] border-l-accent/60 bg-[hsl(var(--surface))] p-4"
                          >
                            <p className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                              {s.insight.kind === "gap" ? labels.gap : labels.finding}
                            </p>
                            <p className="mt-1.5 font-display text-sm font-bold leading-snug text-foreground">
                              {s.insight.title}
                            </p>
                            {/* The data sits inside the panel, not on the face of the
                                figure. A bar and three counts under one stage out of
                                eight reads as clutter until a reader has asked for it. */}
                            {s.split ? <SplitBar split={s.split} /> : null}
                            <p className="mt-2 text-[0.8rem] leading-6 text-foreground/80">
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
    <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 pl-0.5 text-[0.68rem]">
      <span aria-hidden="true" className="font-mono text-foreground/25">
        ↳
      </span>
      <span className="text-muted-foreground">{exit.question}</span>
      <span aria-hidden="true" className="font-mono text-foreground/40">
        {no} →
      </span>
      {/* Square, flat, no caret: an outcome a complaint reaches, not a control. The
          indicators above are rounded pills with a border and a caret, and the two
          must not be mistaken for each other — a reader who taps Tameli expecting it
          to open has been misled by the styling. */}
      <span
        className={
          "rounded-[3px] px-1.5 py-[0.05rem] font-semibold " +
          (exit.tone === "tameli"
            ? "bg-accent/[0.12] text-accent/90"
            : "bg-foreground/[0.07] text-foreground/60")
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
    <figure className="mt-2.5">
      <div className="flex h-3 overflow-hidden rounded-full" role="presentation">
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
      {/* Figure and label on one line per row: a legend that makes the reader hop
          back to the bar to find out which colour it meant is not a legend. */}
      <dl className="mt-2.5 space-y-1">
        {split.parts.map((p) => (
          <div key={p.key} className="flex items-baseline gap-2 text-[0.72rem]">
            <span
              aria-hidden="true"
              className="mt-[0.3rem] inline-block h-2 w-2 shrink-0 rounded-full"
              style={{ background: PART_FILL[p.tone] }}
            />
            <dt className="w-[3.1rem] shrink-0 font-mono font-bold tabular-nums text-foreground">
              {p.share}
            </dt>
            <dd className="min-w-0 flex-1 text-muted-foreground">
              {p.label}{" "}
              <span className="font-mono tabular-nums text-foreground/60">{p.count}</span>
            </dd>
          </div>
        ))}
      </dl>
      <figcaption className="mt-2 border-t border-border pt-2 text-[0.68rem] leading-5 text-muted-foreground">
        {split.caption}
      </figcaption>
    </figure>
  );
}
