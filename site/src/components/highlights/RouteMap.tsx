import { useId, useState } from "react";
import { Link } from "react-router-dom";

export type RouteInsight = {
  title: string;
  body: string;
  /** Internal destination. A path routes in-app; an absolute URL opens jawafdehi.org. */
  href: string;
  linkLabel: string;
  /**
   * What the reader is being shown. "finding" is something the record establishes;
   * "gap" is something the published record cannot answer. Keeping them visually
   * apart is the point — a missing number and a measured one are not the same claim.
   */
  kind: "finding" | "gap";
};

export type RouteExit = { label: string; tone: "tameli" | "stands" };

export type RouteStep =
  | {
      kind: "stage";
      key: string;
      n: number;
      title: string;
      /** Drawn in the court tone: stages 6–8 are courts, not the Commission. */
      court?: boolean;
      /** A stage that is itself a decision, and so can send a complaint out. */
      exit?: RouteExit;
      decision?: string;
      insight?: RouteInsight;
      /** The one figure big enough to read from across the room. */
      figure?: { value: string; label: string };
    }
  | { kind: "decision"; key: string; label: string; exit: RouteExit };

export type RouteLabels = {
  yes: string;
  no: string;
  insightOpen: string;
  insightClose: string;
  finding: string;
  gap: string;
  srIntro: string;
};

/**
 * The route a complaint takes, as a vertical spine.
 *
 * Replaces an oval. The ring was handsome and unreadable: a reader had to work out
 * where it started, which way it turned, and it could not grow — adding an eighth
 * stage meant re-solving the geometry for every node. A spine reads top to bottom in
 * the direction people already read, takes a ninth stage without redrawing anything,
 * and is the same layout on a phone as on a desktop rather than a separate fallback.
 *
 * HTML and CSS rather than SVG. The insight indicators have to be real buttons — focusable,
 * announced, operable by keyboard and touch — and the panels real regions. In SVG all of
 * that has to be rebuilt by hand.
 *
 * Progressive disclosure: nothing but the route shows until a reader asks. One panel is
 * open at a time, so the figure cannot unfold into the wall of text it replaced.
 */
export function RouteMap({ steps, labels }: { steps: readonly RouteStep[]; labels: RouteLabels }) {
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();

  return (
    <div>
      <p className="sr-only">{labels.srIntro}</p>

      <ol className="relative">
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          const isStage = s.kind === "stage";
          const court = isStage && s.court;
          const exit = s.kind === "decision" ? s.exit : s.exit;
          const insight = isStage ? s.insight : undefined;
          const panelId = `${uid}-${s.key}`;
          const isOpen = open === s.key;

          return (
            <li key={s.key} className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 md:grid-cols-[2.5rem_minmax(0,1fr)] md:gap-x-4">
              {/* Rail. The line is drawn behind the marker and stops at the last row,
                  so the route reads as finished rather than running off the bottom. */}
              <div className="relative flex justify-center">
                {!last ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border"
                    />
                    {/* The route has a direction and the rail alone does not show it.
                        One chevron per gap, low-contrast enough to stay out of the way. */}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] leading-none text-foreground/35"
                    >
                      ▼
                    </span>
                  </>
                ) : null}
                <span
                  aria-hidden="true"
                  className={
                    isStage
                      ? "relative mt-1 flex h-7 w-7 items-center justify-center rounded-full font-mono text-[0.7rem] font-bold tabular-nums ring-4 ring-[hsl(var(--surface))] " +
                        (court
                          ? "bg-[hsl(var(--court))] text-background"
                          : "bg-foreground/85 text-background")
                      : "relative mt-1.5 h-4 w-4 rotate-45 border-2 border-foreground/45 bg-[hsl(var(--surface))] ring-4 ring-[hsl(var(--surface))]"
                  }
                >
                  {isStage ? s.n : null}
                </span>
              </div>

              <div className={last ? "pb-0" : "pb-5"}>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                  <p
                    className={
                      isStage
                        ? "font-display text-[0.95rem] font-bold leading-snug text-foreground md:text-base"
                        : "text-sm leading-snug text-foreground/70"
                    }
                  >
                    {isStage ? s.title : s.label}
                  </p>

                  {/* The branch, inline rather than drawn out to its own terminal: at
                      this width an arrow across the page costs more room than it earns. */}
                  {exit ? (
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[0.7rem] font-semibold">
                      <span aria-hidden="true" className="text-muted-foreground">
                        {labels.no} →
                      </span>
                      <span
                        className={
                          "rounded-full px-2 py-0.5 " +
                          (exit.tone === "tameli"
                            ? "bg-accent/10 text-accent ring-1 ring-accent/30"
                            : "bg-foreground/[0.07] text-foreground/70 ring-1 ring-border")
                        }
                      >
                        {exit.label}
                      </span>
                    </span>
                  ) : null}

                  {insight ? (
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : s.key)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className={
                        "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-bold leading-none transition-colors " +
                        (isOpen
                          ? "border-accent bg-accent text-background"
                          : "border-accent/45 bg-accent/10 text-accent hover:bg-accent/20")
                      }
                    >
                      <span aria-hidden="true">{isOpen ? "×" : "?"}</span>
                      <span className="sr-only">
                        {isOpen ? labels.insightClose : labels.insightOpen} — {insight.title}
                      </span>
                    </button>
                  ) : null}
                </div>

                {/* The one stage that carries a number carries it in the open. */}
                {isStage && s.figure ? (
                  <p className="mt-1.5 flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-bold leading-none tracking-tight text-[hsl(var(--court))] md:text-[1.75rem]">
                      {s.figure.value}
                    </span>
                    <span className="text-xs leading-5 text-muted-foreground">
                      {s.figure.label}
                    </span>
                  </p>
                ) : null}

                {insight ? (
                  <div
                    id={panelId}
                    role="region"
                    hidden={!isOpen}
                    className="mt-2.5 max-w-xl rounded-lg border border-border bg-[hsl(var(--surface))] p-3.5"
                  >
                    <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      {insight.kind === "gap" ? labels.gap : labels.finding}
                    </p>
                    <p className="mt-1.5 font-display text-sm font-bold leading-snug text-foreground">
                      {insight.title}
                    </p>
                    <p className="mt-1 text-[0.8rem] leading-6 text-foreground/80">{insight.body}</p>
                    {insight.href.startsWith("http") ? (
                      <a
                        href={insight.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[0.8rem] font-semibold text-accent underline underline-offset-4"
                      >
                        {insight.linkLabel} ↗︎
                      </a>
                    ) : (
                      <Link
                        to={insight.href}
                        className="mt-2 inline-block text-[0.8rem] font-semibold text-accent underline underline-offset-4"
                      >
                        {insight.linkLabel} →
                      </Link>
                    )}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
