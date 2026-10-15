import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";

import type { RouteLabels, RoutePhase, RouteStep } from "./RouteMap";

/**
 * The same eight stages, bent onto an oval.
 *
 * The ring runs 1 at the top clockwise to 8 and stops short of closing, because this
 * is a sequence that ends at the Supreme Court, not a cycle that returns to the start.
 * The gap between the last node and the first is the whole argument for the shape.
 *
 * The centre is the point of the oval, not a side effect of it: a ring leaves a hole,
 * and the hole is exactly the room an opened finding needs. Nothing else on this page
 * has somewhere to put the detail that does not push the figure off the screen.
 *
 * SVG draws the ring, the arrows and the exits; the stage labels are HTML positioned
 * over it. That split is deliberate — the stages have to be real buttons, focusable
 * and operable from a keyboard, and in SVG every part of that is hand-built.
 *
 * Below the md breakpoint this is not rendered at all. An ellipse cannot be read on a
 * phone, and the vertical version is not a fallback but the better layout at that width.
 */

const GEO = {
  w: 1360,
  h: 980,
  cx: 680,
  cy: 480,
  rx: 330,
  ry: 280,
  /** How far outside the ring a stage box sits, so no box crosses an arc. */
  out: 150,
  /** Degrees swept from the first node to the last; the remainder is the open gap. */
  sweep: 315,
  start: -90,
};

const rad = (d: number) => (d * Math.PI) / 180;
const at = (deg: number, kx = GEO.rx, ky = GEO.ry) => ({
  x: GEO.cx + kx * Math.cos(rad(deg)),
  y: GEO.cy + ky * Math.sin(rad(deg)),
});

type Placed = {
  step: RouteStep;
  tone: "commission" | "court";
  deg: number;
  x: number;
  y: number;
};

export function RouteOval({
  phases,
  labels,
}: {
  phases: readonly RoutePhase[];
  labels: RouteLabels;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  // Open, then bring the panel to the reader. Without this the detail appears below
  // a figure 800px tall and nothing on screen changes.
  const onToggle = (key: string) => {
    const next = open === key ? null : key;
    setOpen(next);
    if (next) {
      window.requestAnimationFrame(() =>
        panelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        }),
      );
    }
  };

  const flat: { step: RouteStep; tone: "commission" | "court" }[] =
    phases.flatMap((p) => p.steps.map((step) => ({ step, tone: p.tone })));
  const stepDeg = GEO.sweep / Math.max(flat.length - 1, 1);
  const placed: Placed[] = flat.map((f, i) => {
    const deg = GEO.start + i * stepDeg;
    return { ...f, deg, ...at(deg) };
  });

  const ink = "hsl(var(--foreground) / 0.45)";
  const court = "hsl(var(--court))";
  const openStep = placed.find((p) => p.step.key === open);
  // A chip that defines a term opens into the same panel as a finding does, keyed on
  // the step plus a suffix so the two can never collide.
  const openExit = placed.find((p) => `${p.step.key}-exit` === open);

  return (
    <>
      <div className="relative">
        <svg
          viewBox={`0 0 ${GEO.w} ${GEO.h}`}
          className="h-auto w-full"
          role="presentation"
          focusable="false"
          aria-hidden="true"
        >
          <defs>
            <marker
              id={`${uid}-arrow`}
              viewBox="0 0 10 10"
              refX="8.5"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0 0.5 L10 5 L0 9.5 Z" fill={ink} />
            </marker>
          </defs>

          {/* The open gap, drawn faintly so the ring still reads as one shape. */}
          <ellipse
            cx={GEO.cx}
            cy={GEO.cy}
            rx={GEO.rx}
            ry={GEO.ry}
            fill="none"
            stroke="hsl(var(--foreground) / 0.1)"
            strokeWidth={1}
            strokeDasharray="2 9"
          />

          {placed.slice(0, -1).map((p, i) => {
            const next = placed[i + 1];
            const a = at(p.deg + 7.5);
            const b = at(next.deg - 7.5);
            const toCourt = next.tone === "court";
            return (
              <path
                key={`arc-${p.step.key}`}
                d={`M${a.x} ${a.y} A ${GEO.rx} ${GEO.ry} 0 0 1 ${b.x} ${b.y}`}
                fill="none"
                stroke={toCourt ? court : ink}
                strokeWidth={2.25}
                strokeLinecap="round"
                markerEnd={`url(#${uid}-arrow)`}
              />
            );
          })}

          {/* A stub from each node out to its box. */}
          {placed.map((p) => {
            const len = Math.hypot(p.x - GEO.cx, p.y - GEO.cy);
            const ux = (p.x - GEO.cx) / len;
            const uy = (p.y - GEO.cy) / len;
            return (
              <line
                key={`stub-${p.step.key}`}
                x1={p.x + ux * 11}
                y1={p.y + uy * 11}
                x2={p.x + ux * (GEO.out - 62)}
                y2={p.y + uy * (GEO.out - 62)}
                stroke="hsl(var(--foreground) / 0.18)"
                strokeWidth={1.5}
              />
            );
          })}

          {/* No exit arrows. They were drawn outward from the node, into exactly the
            space the stage label occupies, and collided with it at four of the eight
            positions. The branch is carried in words under each label instead. */}
        </svg>

        {/* Stage boxes, HTML over the ring so each is a real control. Each is centred
          on a point pushed GEO.out beyond its node along the radius, which is what
          keeps a box from ever sitting on an arc. */}
        {placed.map((p) => {
          const len = Math.hypot(p.x - GEO.cx, p.y - GEO.cy);
          const bx = p.x + ((p.x - GEO.cx) / len) * GEO.out;
          const by = p.y + ((p.y - GEO.cy) / len) * GEO.out;
          // A stage opens its finding; a stage with no finding but a term that needs
          // defining opens that instead. Never both, so one key per box.
          const key = p.step.insight
            ? p.step.key
            : p.step.exit?.note
              ? `${p.step.key}-exit`
              : null;
          const isOpen = key !== null && open === key;
          const colour =
            p.tone === "court" ? "hsl(var(--court))" : "hsl(var(--foreground))";
          const panelId = `${uid}-panel`;

          return (
            <div
              key={p.step.key}
              className="absolute w-[15.5rem] -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${(bx / GEO.w) * 100}%`,
                top: `${(by / GEO.h) * 100}%`,
              }}
            >
              <StageBox
                step={p.step}
                colour={colour}
                isOpen={isOpen}
                labels={labels}
                panelId={panelId}
                openKey={key}
                onToggle={() => key && onToggle(key)}
              />
            </div>
          );
        })}

        {/* The centre names the figure. The finding does NOT go here: panels run to
          five or six sentences and a hole 24rem wide clipped them mid-word and
          covered two of the nodes doing it. */}
        <div className="pointer-events-none absolute left-1/2 top-[46%] w-[min(40%,22rem)] -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="font-display text-base font-bold leading-snug text-foreground/70">
            {labels.ovalCentre}
          </p>
          <p className="mt-1.5 text-[0.74rem] leading-5 text-muted-foreground">
            {labels.ovalHint}
          </p>
        </div>
      </div>

      {/* Opened findings land under the ring, where length costs nothing. */}
      <div ref={panelRef} aria-live="polite" className="scroll-mt-6">
        {openExit?.step.exit?.note ? (
          <div
            id={`${uid}-panel`}
            role="region"
            className="mx-auto mt-2 max-w-2xl rounded-xl border border-accent/25 border-l-[3px] border-l-accent/60 bg-[hsl(var(--surface))] p-4 text-[0.8rem] leading-6 text-foreground/85"
          >
            {openExit.step.exit.note}
          </div>
        ) : openStep?.step.insight ? (
          <div
            id={`${uid}-panel`}
            role="region"
            className="mx-auto mt-2 max-w-2xl rounded-xl border border-accent/25 border-l-[3px] border-l-accent/60 bg-[hsl(var(--surface))] p-4"
          >
            <p className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.14em] text-accent/80">
              {openStep.step.n}. {openStep.step.title}
            </p>
            <p className="mt-1.5 font-display text-sm font-bold leading-snug text-foreground">
              {openStep.step.insight.title}
            </p>
            {openStep.step.split ? (
              <OvalSplit split={openStep.step.split} />
            ) : null}
            <div className="mt-2 space-y-2 text-[0.8rem] leading-6 text-foreground/80 [&_a]:font-semibold [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2">
              {openStep.step.insight.body}
            </div>
            {openStep.step.insight.gapNote ? (
              <div className="mt-3 rounded-md bg-accent/[0.06] px-3 py-2.5">
                <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-accent/80">
                  {labels.gap}
                </p>
                <div className="mt-1 text-[0.78rem] leading-6 text-foreground/80 [&_a]:font-semibold [&_a]:text-accent [&_a]:underline">
                  {openStep.step.insight.gapNote}
                </div>
              </div>
            ) : null}
            {openStep.step.insight.href.startsWith("http") ? (
              <a
                href={openStep.step.insight.href}
                target="_blank"
                rel="noreferrer"
                className="mt-2.5 inline-block text-[0.8rem] font-semibold text-accent underline underline-offset-4"
              >
                {openStep.step.insight.linkLabel} ↗︎
              </a>
            ) : (
              <Link
                to={openStep.step.insight.href}
                className="mt-2.5 inline-block text-[0.8rem] font-semibold text-accent underline underline-offset-4"
              >
                {openStep.step.insight.linkLabel} →
              </Link>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}

/** The screening split, reused inside an opened oval panel. */
function OvalSplit({ split }: { split: NonNullable<RouteStep["split"]> }) {
  const fill = {
    out: "hsl(var(--accent))",
    on: "hsl(var(--court))",
    other: "hsl(var(--foreground) / 0.3)",
  } as const;
  return (
    <figure className="mt-2.5">
      <div className="flex h-3 overflow-hidden rounded-full">
        {split.parts.map((p) => (
          <span
            key={p.key}
            className="block h-full"
            style={{
              width: `${(p.value / split.total) * 100}%`,
              background: fill[p.tone],
            }}
          />
        ))}
      </div>
      <dl className="mt-2 space-y-1">
        {split.parts.map((p) => (
          <div key={p.key} className="flex items-baseline gap-2 text-[0.72rem]">
            <span
              aria-hidden="true"
              className="mt-[0.3rem] inline-block h-2 w-2 shrink-0 rounded-full"
              style={{ background: fill[p.tone] }}
            />
            <dt className="w-[3.1rem] shrink-0 font-mono font-bold tabular-nums text-foreground">
              {p.share}
            </dt>
            <dd className="min-w-0 flex-1 text-muted-foreground">{p.label}</dd>
          </div>
        ))}
      </dl>
      <figcaption className="mt-2 border-t border-border pt-2 text-[0.68rem] leading-5 text-muted-foreground">
        {split.caption}
      </figcaption>
    </figure>
  );
}

/**
 * One stage, as a box.
 *
 * The box is the point: eight labels floating against a ring read as annotations on a
 * drawing, and the reader has to work out which words belong to which node. A card
 * with its own number, edge and background reads as a step.
 */
function StageBox({
  step,
  colour,
  isOpen,
  labels,
  panelId,
  openKey,
  onToggle,
}: {
  step: RouteStep;
  colour: string;
  isOpen: boolean;
  labels: RouteLabels;
  panelId: string;
  /** null when this box has nothing to open. */
  openKey: string | null;
  onToggle: () => void;
}) {
  const body = (
    <>
      <div className="flex items-start gap-2">
        <span
          aria-hidden="true"
          className="mt-[0.1rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[0.6rem] font-bold tabular-nums text-background"
          style={{ background: colour }}
        >
          {step.n}
        </span>
        <span className="font-display text-[0.86rem] font-bold leading-[1.3] text-foreground">
          {step.title}
        </span>
      </div>

      {step.exit ? (
        <span className="mt-1.5 block pl-7 text-[0.64rem] leading-snug text-accent/85">
          {step.exit.condition} <span aria-hidden="true">→</span>{" "}
          <span className="font-semibold underline decoration-accent/40 underline-offset-2">
            {step.exit.label}
          </span>
        </span>
      ) : null}

      {step.insight ? (
        <span
          className={
            "mt-2 flex items-start gap-1 border-t border-border/70 pt-2 text-[0.68rem] font-semibold leading-snug transition-colors " +
            (isOpen ? "text-accent" : "text-accent/70 group-hover:text-accent")
          }
        >
          {step.insight.title}
          <span
            aria-hidden="true"
            className={
              "font-mono transition-transform " +
              (isOpen ? "" : "group-hover:translate-x-0.5")
            }
          >
            →
          </span>
        </span>
      ) : null}
    </>
  );

  const shell =
    "block w-full rounded-lg border bg-[hsl(var(--surface))] px-3 py-2.5 text-left shadow-sm transition-all ";

  if (!openKey) {
    return <div className={shell + "border-border/70 opacity-90"}>{body}</div>;
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={panelId}
      className={
        "group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 " +
        shell +
        (isOpen
          ? "border-accent bg-accent/[0.07] shadow-md"
          : "border-border hover:border-accent/60 hover:shadow-md")
      }
    >
      {body}
      <span className="sr-only">{isOpen ? labels.close : labels.open}</span>
    </button>
  );
}
