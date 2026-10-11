/**
 * How a corruption complaint travels, laid out around an oval.
 *
 * Same grammar as a vertical flowchart, bent onto a ring: rounded steps, diamond
 * decisions, "yes" continuing round the ring and "no" leaving it. The decisions
 * are drawn as diamonds rather than carried as floating text, because a branch
 * needs a shape a reader already recognises; labels alone read as captions.
 *
 * Ten positions sit on the ring: six steps and four decisions, alternating
 * almost everywhere, which is what keeps the pills from colliding.
 *
 * The sweep stops short of closing. It runs 300 degrees and leaves a gap between
 * the last node and the first, because this is a sequence that ends at the
 * Supreme Court, not a cycle that returns to the start.
 *
 * Legal content checks against the अख्तियार दुरुपयोग अनुसन्धान आयोग कार्यविधि,
 * २०७८ and विशेष अदालत ऐन, २०५९ दफा १७: तामेली is reachable after screening
 * (दफा २१), after the preliminary inquiry (दफा २२(३)(छ)) and on the investigation
 * report (दफा २५(ग)); the detailed investigation has no exit of its own; the
 * appeal is conditional, so it too is a decision with a "no".
 *
 * An ellipse cannot be read on a phone, so narrow screens get the steps stacked.
 */

export type DiagramNode = {
  key: string;
  title: string;
  body: string;
  exit?: string;
};

export type DiagramLabels = {
  centreTitle: string;
  yes: string;
  no: string;
  dScreen: string;
  dGrounds: string;
  dProsecute: string;
  dAppeal: string;
  exitTitle: string;
  standsTitle: string;
  exitHere: string;
  srIntro: string;
  srExit: string;
};

const L = {
  w: 1280,
  h: 980,
  cx: 640,
  cy: 466,
  /** Sized for breathing room, not for compactness. At the previous radius two
      adjacent pills left a 31px gap and the ring read as crowded; here the
      tightest neighbours are about 64px apart. */
  rx: 388,
  ry: 316,
  pillW: 146,
  pillH: 48,
  dRx: 53,
  dRy: 34,
  sweep: 310,
  start: -90,
  /** Distance from a decision out to its "no" terminal. */
  exitOut: 124,
};

const rad = (d: number) => (d * Math.PI) / 180;
const at = (deg: number, kx = L.rx, ky = L.ry) => ({
  x: L.cx + kx * Math.cos(rad(deg)),
  y: L.cy + ky * Math.sin(rad(deg)),
});

function twoLines(s: string): [string, string?] {
  if (s.length <= 14) return [s];
  const mid = s.length / 2;
  let best = -1;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === " " && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  }
  return best < 0 ? [s] : [s.slice(0, best), s.slice(best + 1)];
}

export function ProcessDiagram({
  stages,
  labels,
}: {
  stages: readonly DiagramNode[];
  labels: DiagramLabels;
}) {
  // A single accent. Crimson is reserved for leaving the process; every other
  // element is a neutral, so the three ways out are the only thing that pulls the
  // eye. Before this, the decision diamond was crimson too and competed with the
  // terminals it pointed at.
  const green = "hsl(var(--court))";
  const red = "hsl(var(--accent))";
  const ink = "hsl(var(--foreground))";
  const grey = "hsl(var(--foreground) / 0.55)";
  const stone = "hsl(var(--foreground) / 0.3)";

  type Ring =
    | { kind: "step"; key: string; label: string; n: number; court?: boolean }
    | {
        kind: "decision";
        key: string;
        label: string;
        n?: number;
        exit: { label: string; tone: "tameli" | "stands" };
      };

  // Six steps and four decisions, alternating. The prosecution decision IS a
  // decision, so it takes a diamond and keeps its number; the other three are
  // the branch points the rule puts between steps.
  const ring: Ring[] = [
    { kind: "step", key: stages[0].key, label: stages[0].title, n: 1 },
    { kind: "step", key: stages[1].key, label: stages[1].title, n: 2 },
    { kind: "decision", key: "d-screen", label: labels.dScreen, exit: { label: labels.exitTitle, tone: "tameli" } },
    { kind: "step", key: stages[2].key, label: stages[2].title, n: 3 },
    { kind: "decision", key: "d-grounds", label: labels.dGrounds, exit: { label: labels.exitTitle, tone: "tameli" } },
    { kind: "step", key: stages[3].key, label: stages[3].title, n: 4 },
    { kind: "decision", key: stages[4].key, label: labels.dProsecute, n: 5, exit: { label: labels.exitTitle, tone: "tameli" } },
    { kind: "step", key: stages[5].key, label: stages[5].title, n: 6, court: true },
    { kind: "decision", key: "d-appeal", label: labels.dAppeal, exit: { label: labels.standsTitle, tone: "stands" } },
    { kind: "step", key: stages[6].key, label: stages[6].title, n: 7, court: true },
  ];

  const stepDeg = L.sweep / (ring.length - 1);
  const placed = ring.map((r, i) => ({ r, i, deg: L.start + i * stepDeg, ...at(L.start + i * stepDeg) }));

  return (
    <div>
      <div className="hidden md:block" aria-hidden="true">
        <svg viewBox={`0 0 ${L.w} ${L.h}`} className="h-auto w-full" role="presentation" focusable="false">
          <defs>
            {[
              ["ov-ink", grey],
              ["ov-green", green],
              ["ov-red", red],
            ].map(([id, c]) => (
              <marker key={id} id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0 0.5 L10 5 L0 9.5 Z" fill={c} />
              </marker>
            ))}
          </defs>

          <ellipse cx={L.cx} cy={L.cy} rx={L.rx} ry={L.ry} fill="none" stroke="hsl(var(--foreground) / 0.12)" strokeWidth={1} strokeDasharray="2 8" />

          {/* Arcs. One leaving a decision is that decision's "yes". */}
          {placed.slice(0, -1).map((p, i) => {
            const next = placed[i + 1];
            const padA = p.r.kind === "decision" ? 10 : 13;
            const padB = next.r.kind === "decision" ? 10 : 13;
            const a = at(p.deg + padA);
            const b = at(next.deg - padB);
            const toCourt = next.r.kind === "step" && next.r.court;
            const c = toCourt ? green : grey;
            const mid = at((p.deg + next.deg) / 2);
            const len = Math.hypot(mid.x - L.cx, mid.y - L.cy);
            const ux = (mid.x - L.cx) / len;
            const uy = (mid.y - L.cy) / len;
            const isYes = p.r.kind === "decision";
            return (
              <g key={`arc-${p.r.key}`}>
                <path
                  d={`M${a.x} ${a.y} A ${L.rx} ${L.ry} 0 0 1 ${b.x} ${b.y}`}
                  fill="none"
                  stroke={c}
                  strokeWidth={2.25}
                  strokeLinecap="round"
                  markerEnd={toCourt ? "url(#ov-green)" : "url(#ov-ink)"}
                />
                {isYes ? (
                  <g>
                    <rect
                      x={mid.x - ux * 30 - 20}
                      y={mid.y - uy * 30 - 10}
                      width={40}
                      height={20}
                      rx={10}
                      fill="hsl(var(--surface))"
                      stroke={stone}
                      strokeWidth={1}
                    />
                    <text x={mid.x - ux * 30} y={mid.y - uy * 30 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={c}>
                      {labels.yes}
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}

          {/* "No" branches, outward from each diamond to its own terminal. */}
          {placed.map((p) => {
            if (p.r.kind !== "decision") return null;
            const len = Math.hypot(p.x - L.cx, p.y - L.cy);
            const ux = (p.x - L.cx) / len;
            const uy = (p.y - L.cy) / len;
            const isStands = p.r.exit.tone === "stands";
            const c = isStands ? grey : red;
            // The arrow has to stop at the terminal's EDGE, and the terminal's
            // width depends on its label. A fixed arrow length ran the long one,
            // "Verdict stands", straight through its own pill.
            const w = p.r.exit.label.length * 7.4 + 22;
            const labDist = L.exitOut + 48;
            const tipDist = labDist - w / 2 - 6;
            const from = { x: p.x + ux * (L.dRx * 0.6), y: p.y + uy * (L.dRy * 0.7) };
            const to = { x: p.x + ux * tipDist, y: p.y + uy * tipDist };
            const lab = { x: p.x + ux * labDist, y: p.y + uy * labDist };
            return (
              <g key={`no-${p.r.key}`}>
                <path
                  d={`M${from.x} ${from.y} L${to.x} ${to.y}`}
                  fill="none"
                  stroke={c}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray="6 5"
                  markerEnd={isStands ? "url(#ov-ink)" : "url(#ov-red)"}
                />
                <text
                  x={(from.x + to.x) / 2 - uy * 13}
                  y={(from.y + to.y) / 2 + ux * 13 + 4}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={700}
                  fill={c}
                >
                  {labels.no}
                </text>
                <rect
                  x={lab.x - w / 2}
                  y={lab.y - 17}
                  width={w}
                  height={34}
                  rx={17}
                  fill={isStands ? "hsl(var(--foreground) / 0.04)" : "hsl(var(--accent) / 0.08)"}
                  stroke={c}
                  strokeWidth={1.4}
                  strokeDasharray={isStands ? undefined : "5 4"}
                />
                <text x={lab.x} y={lab.y + 5} textAnchor="middle" className="font-display" fontSize={14} fontWeight={700} fill={c}>
                  {p.r.exit.label}
                </text>
              </g>
            );
          })}

          <text x={L.cx} y={L.cy + 8} textAnchor="middle" className="font-display" fontSize={23} fontWeight={700} fill={ink}>
            {labels.centreTitle}
          </text>

          {/* Nodes */}
          {placed.map((p) => {
            if (p.r.kind === "decision") {
              const c = "hsl(var(--foreground) / 0.72)";
              return (
                <g key={p.r.key}>
                  <polygon
                    points={`${p.x},${p.y - L.dRy} ${p.x + L.dRx},${p.y} ${p.x},${p.y + L.dRy} ${p.x - L.dRx},${p.y}`}
                    fill="hsl(var(--surface))"
                    stroke={c}
                    strokeWidth={1.4}
                  />
                  <text x={p.x} y={p.y + 4} textAnchor="middle" className="font-display" fontSize={11.5} fontWeight={700} fill={c}>
                    {p.r.label}
                  </text>
                  {p.r.n ? (
                    <g>
                      <circle cx={p.x - L.dRx * 0.62} cy={p.y - L.dRy * 0.62} r={10.5} fill="hsl(var(--foreground) / 0.65)" />
                      <text x={p.x - L.dRx * 0.62} y={p.y - L.dRy * 0.62 + 4} textAnchor="middle" className="font-mono" fontSize={11.5} fontWeight={700} fill="hsl(var(--background))">
                        {p.r.n}
                      </text>
                    </g>
                  ) : null}
                </g>
              );
            }
            const [a, b] = twoLines(p.r.label);
            const c = p.r.court ? green : stone;
            return (
              <g key={p.r.key}>
                <rect
                  x={p.x - L.pillW / 2}
                  y={p.y - L.pillH / 2}
                  width={L.pillW}
                  height={L.pillH}
                  rx={L.pillH / 2}
                  fill="hsl(var(--surface))"
                  stroke={c}
                  strokeWidth={p.r.court ? 1.6 : 1.1}
                />
                <text
                  x={p.x}
                  y={b ? p.y - 4 : p.y + 5}
                  textAnchor="middle"
                  className="font-display"
                  fontSize={13.5}
                  fontWeight={700}
                  fill={p.r.court ? green : ink}
                >
                  <tspan x={p.x}>{a}</tspan>
                  {b ? (
                    <tspan x={p.x} dy={15}>
                      {b}
                    </tspan>
                  ) : null}
                </text>
                <circle cx={p.x - L.pillW / 2 + 2} cy={p.y} r={10.5} fill={p.r.court ? green : "hsl(var(--foreground) / 0.65)"} />
                <text x={p.x - L.pillW / 2 + 2} y={p.y + 4} textAnchor="middle" className="font-mono" fontSize={11.5} fontWeight={700} fill="hsl(var(--background))">
                  {p.r.n}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ---------- narrow ---------- */}
      <ol className="space-y-2 md:hidden" aria-hidden="true">
        {stages.map((s, i) => (
          <li key={s.key}>
            <div
              className="rounded-full border bg-[hsl(var(--surface))] px-4 py-2.5"
              style={{ borderColor: i >= 5 ? green : "hsl(var(--border))" }}
            >
              <span className="mr-2 font-mono text-xs text-muted-foreground">{i + 1}</span>
              <span className="font-display text-sm font-bold" style={i >= 5 ? { color: green } : undefined}>
                {s.title}
              </span>
            </div>
            {s.exit ? (
              <p className="flex items-center gap-1.5 py-1 pl-6 text-xs font-medium text-accent">
                <span aria-hidden="true">↳</span>
                {labels.exitHere}
              </p>
            ) : null}
          </li>
        ))}
      </ol>

      <ol className="sr-only">
        <li>{labels.srIntro}</li>
        {stages.map((s) => (
          <li key={s.key}>
            {s.title}. {s.body}
            {s.exit ? ` ${labels.srExit}` : ""}
          </li>
        ))}
      </ol>
    </div>
  );
}
