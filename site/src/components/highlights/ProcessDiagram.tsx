/**
 * How a corruption complaint travels, laid out around an oval.
 *
 * The seven steps sit on an elliptical path rather than a straight column. The
 * sweep deliberately stops short of closing: it runs about 300 degrees and
 * leaves a gap between the last step and the first, because this is a sequence
 * that ends at the Supreme Court, not a cycle that feeds back to the start. A
 * closed ring would assert a loop the process does not have.
 *
 * The three ways out radiate OUTWARD from the steps that have them, so leaving
 * the process reads as leaving the ring. The centre carries what they all lead
 * to, which is also the one word a reader most needs defined.
 *
 * Legal content checks against the अख्तियार दुरुपयोग अनुसन्धान आयोग कार्यविधि,
 * २०७८ and विशेष अदालत ऐन, २०५९ दफा १७: तामेली is reachable after screening
 * (दफा २१), after the preliminary inquiry (दफा २२(३)(छ)) and on the investigation
 * report (दफा २५(ग)); the detailed investigation has no exit of its own; the
 * appeal is conditional.
 *
 * An ellipse cannot be read on a phone, so narrow screens get the same seven
 * steps as a vertical list. Both render from the same `stages` prop.
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
  noTameli: string;
  chargeSheet: string;
  ifGrounds: string;
  ifAppealed: string;
  exitTitle: string;
  exitHere: string;
  srIntro: string;
  srExit: string;
};

const L = {
  w: 1000,
  h: 760,
  cx: 500,
  cy: 382,
  rx: 252,
  ry: 212,
  nodeW: 166,
  nodeH: 56,
  /** Degrees of the ellipse the sequence occupies. The rest is the open gap. */
  sweep: 300,
  start: -90,
  /** How far an exit sits beyond its step, along the outward radius. */
  exitOut: 170,
  exitW: 116,
  exitH: 34,
};

const rad = (d: number) => (d * Math.PI) / 180;
/** Point on the ellipse at a given angle, in SVG coordinates (y grows down). */
const onEllipse = (deg: number) => ({
  x: L.cx + L.rx * Math.cos(rad(deg)),
  y: L.cy + L.ry * Math.sin(rad(deg)),
});

function twoLines(s: string): [string, string?] {
  if (s.length <= 15) return [s];
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
  const green = "hsl(var(--court))";
  const red = "hsl(var(--accent))";
  const ink = "hsl(var(--foreground))";

  const step = L.sweep / (stages.length - 1);
  const placed = stages.map((s, i) => {
    const deg = L.start + i * step;
    return { s, i, deg, ...onEllipse(deg), isCourt: i >= 5 };
  });

  return (
    <div>
      {/* ---------- wide: the oval ---------- */}
      <div className="hidden md:block" aria-hidden="true">
        <svg viewBox={`0 0 ${L.w} ${L.h}`} className="h-auto w-full" role="presentation" focusable="false">
          <defs>
            {[
              ["ov-ink", "hsl(var(--foreground) / 0.6)"],
              ["ov-green", "hsl(var(--court))"],
              ["ov-red", "hsl(var(--accent))"],
            ].map(([id, c]) => (
              <marker key={id} id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0 0.5 L10 5 L0 9.5 Z" fill={c} />
              </marker>
            ))}
          </defs>

          {/* The path itself, faint, so the ring reads even between the nodes. */}
          <ellipse
            cx={L.cx}
            cy={L.cy}
            rx={L.rx}
            ry={L.ry}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={1}
            strokeDasharray="2 6"
          />

          {/* Arcs between consecutive steps, inset so they meet the node edges. */}
          {placed.slice(0, -1).map((p, i) => {
            const next = placed[i + 1];
            const pad = 13;
            const a = onEllipse(p.deg + pad);
            const b = onEllipse(next.deg - pad);
            const c = next.isCourt ? green : "hsl(var(--foreground) / 0.6)";
            const mid = onEllipse((p.deg + next.deg) / 2);
            const out = {
              x: (mid.x - L.cx) / Math.hypot(mid.x - L.cx, mid.y - L.cy),
              y: (mid.y - L.cy) / Math.hypot(mid.x - L.cx, mid.y - L.cy),
            };
            // A step that can end in Tameli is a decision: its onward arc is the
            // "yes". The others keep the condition that actually governs them.
            const label = p.s.exit ? labels.yes : i === 5 ? labels.ifAppealed : null;
            return (
              <g key={`arc-${p.s.key}`}>
                <path
                  d={`M${a.x} ${a.y} A ${L.rx} ${L.ry} 0 0 1 ${b.x} ${b.y}`}
                  fill="none"
                  stroke={c}
                  strokeWidth={2.25}
                  strokeLinecap="round"
                  markerEnd={next.isCourt ? "url(#ov-green)" : "url(#ov-ink)"}
                />
                {label ? (
                  // On a chip and pushed inside the ring: a curved arrow sweeps
                  // through wherever its own label wants to sit, and nudging text
                  // around an arc is a losing game.
                  <g>
                    <rect
                      x={mid.x - out.x * 40 - (label.length * 6.5 + 14) / 2}
                      y={mid.y - out.y * 40 - 10}
                      width={label.length * 6.5 + 14}
                      height={20}
                      rx={4}
                      fill="hsl(var(--background))"
                    />
                    <text
                      x={mid.x - out.x * 40}
                      y={mid.y - out.y * 40 + 4}
                      textAnchor="middle"
                      fontSize={12.5}
                      fontWeight={600}
                      fill={next.isCourt ? green : "hsl(var(--muted-foreground))"}
                    >
                      {label}
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}

          {/* Ways out. A short outward stub and a dot on the ring, rather than
              the same word printed three times: one legend under the figure says
              what they are, and repeating it at each step only added clutter. */}
          {placed.map((p) => {
            if (!p.s.exit) return null;
            const len = Math.hypot(p.x - L.cx, p.y - L.cy);
            const ux = (p.x - L.cx) / len;
            const uy = (p.y - L.cy) / len;
            const from = { x: p.x + ux * (L.nodeW / 2 - 24), y: p.y + uy * (L.nodeH / 2 + 1) };
            const to = { x: p.x + ux * 104, y: p.y + uy * 104 };
            return (
              <g key={`exit-${p.s.key}`}>
                <path
                  d={`M${from.x} ${from.y} L${to.x} ${to.y}`}
                  fill="none"
                  stroke={red}
                  strokeWidth={2.25}
                  strokeLinecap="round"
                  strokeDasharray="6 5"
                  markerEnd="url(#ov-red)"
                />
                {/* On a chip and clear of the arrow tip: a near-horizontal exit
                    puts its own label straight across the stroke otherwise. */}
                <rect
                  x={p.x + ux * 146 - (labels.noTameli.length * 6.6 + 14) / 2}
                  y={p.y + uy * 146 - 10}
                  width={labels.noTameli.length * 6.6 + 14}
                  height={20}
                  rx={4}
                  fill="hsl(var(--surface))"
                />
                <text
                  x={p.x + ux * 146}
                  y={p.y + uy * 146 + 4}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={600}
                  fill={red}
                >
                  {labels.noTameli}
                </text>
              </g>
            );
          })}

          {/* Centre: the short title, so the middle of the ring carries the
              figure's name instead of sitting empty. */}
          <text
            x={L.cx}
            y={L.cy + 6}
            textAnchor="middle"
            className="font-display"
            fontSize={22}
            fontWeight={700}
            fill={ink}
          >
            {labels.centreTitle}
          </text>

          {/* Steps */}
          {placed.map((p) => {
            const [a, b] = twoLines(p.s.title);
            const c = p.isCourt ? green : "hsl(var(--border))";
            return (
              <g key={p.s.key}>
                <rect
                  x={p.x - L.nodeW / 2}
                  y={p.y - L.nodeH / 2}
                  width={L.nodeW}
                  height={L.nodeH}
                  rx={L.nodeH / 2}
                  fill="hsl(var(--surface))"
                  stroke={c}
                  strokeWidth={p.isCourt ? 1.75 : 1.25}
                />
                <text
                  x={p.x}
                  y={b ? p.y - 4 : p.y + 5}
                  textAnchor="middle"
                  className="font-display"
                  fontSize={14}
                  fontWeight={700}
                  fill={p.isCourt ? green : ink}
                >
                  <tspan x={p.x}>{a}</tspan>
                  {b ? (
                    <tspan x={p.x} dy={16}>
                      {b}
                    </tspan>
                  ) : null}
                </text>
                {/* A step that can end in Tameli carries a red number. The marker
                    has to be part of the node, not a dot beside it: drawn with the
                    exits it sat under the node and was invisible. */}
                <circle
                  cx={p.x - L.nodeW / 2 + 2}
                  cy={p.y}
                  r={11}
                  fill={p.s.exit ? red : p.isCourt ? green : "hsl(var(--foreground) / 0.65)"}
                />
                <text
                  x={p.x - L.nodeW / 2 + 2}
                  y={p.y + 4}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={12}
                  fontWeight={700}
                  fill="hsl(var(--background))"
                >
                  {p.i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ---------- narrow: the same seven steps, stacked ---------- */}
      <ol className="space-y-2 md:hidden" aria-hidden="true">
        {stages.map((s, i) => (
          <li key={s.key}>
            <div
              className="rounded-full border bg-[hsl(var(--surface))] px-4 py-2.5"
              style={{ borderColor: i >= 5 ? green : "hsl(var(--border))" }}
            >
              <span className="mr-2 font-mono text-xs text-muted-foreground">{i + 1}</span>
              <span
                className="font-display text-sm font-bold"
                style={i >= 5 ? { color: green } : undefined}
              >
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
