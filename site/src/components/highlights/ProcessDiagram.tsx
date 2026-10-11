/**
 * How a corruption complaint travels: a conventional vertical flowchart.
 *
 * Deliberately ordinary in form. Earlier attempts here were infographics —
 * swimlanes, institutional bands, grouped stage boxes — and they read as busy
 * rather than clear. A flowchart has a settled grammar that readers already know:
 * a rounded terminator to start, rectangles for steps, diamonds for decisions,
 * yes/no on the branches, terminators where a path ends. Using it means the
 * reader spends no effort learning the picture.
 *
 * One rendering at every width. The spine is vertical, which is the shape a phone
 * wants anyway, so there is no second mobile composition to keep in sync.
 *
 * Legal content checks against the अख्तियार दुरुपयोग अनुसन्धान आयोग कार्यविधि,
 * २०७८ and विशेष अदालत ऐन, २०५९ दफा १७:
 *   · तामेली is reachable at three points — after screening (दफा २१), after the
 *     preliminary inquiry (दफा २२(३)(छ)), and on the investigation report
 *     (दफा २५(ग)). Each is drawn as its own decision with its own exit.
 *   · The detailed investigation has no exit of its own; its report goes to the
 *     Commission's decision, which is where it can be set aside.
 *   · The appeal is a decision with a "no" branch, not an automatic step.
 */

export type DiagramNode = {
  key: string;
  title: string;
  body: string;
  exit?: string;
};

export type DiagramLabels = {
  start: string;
  yes: string;
  no: string;
  dScreen: string;
  dGrounds: string;
  dProsecute: string;
  dAppeal: string;
  chargeSheet: string;
  exitTitle: string;
  standsTitle: string;
  srIntro: string;
  srExit: string;
};

/** Geometry. Shapes sit on one spine; exits branch right at a fixed column. */
const L = {
  w: 560,
  spineX: 140,
  boxW: 240,
  boxH: 54,
  dRx: 100,
  dRy: 40,
  exitX: 356,
  exitW: 168,
  exitH: 40,
  gap: 23,
};

type Shape =
  | { kind: "terminator"; key: string; label: string; tone: "start" }
  | { kind: "process"; key: string; label: string; n: number; tone: "ciaa" | "court" }
  | {
      kind: "decision";
      key: string;
      label: string;
      n?: number;
      /** Where the "no" branch lands. */
      exit: { label: string; tone: "exit" | "stands" };
      /** Optional note on the "yes" branch, e.g. "charge sheet filed". */
      yesNote?: string;
    };

export function ProcessDiagram({
  stages,
  labels,
}: {
  stages: readonly DiagramNode[];
  labels: DiagramLabels;
}) {
  const [n1, n2, n3, n4, n5, court, appeal] = stages;

  // The chart in reading order. Numbers track the seven named stages; the
  // decisions between them are the rule's own branch points and are unnumbered
  // except where a decision *is* a stage (the prosecution decision, 5).
  const shapes: Shape[] = [
    { kind: "terminator", key: "start", label: labels.start, tone: "start" },
    { kind: "process", key: n1.key, label: n1.title, n: 1, tone: "ciaa" },
    { kind: "process", key: n2.key, label: n2.title, n: 2, tone: "ciaa" },
    {
      kind: "decision",
      key: "d-screen",
      label: labels.dScreen,
      exit: { label: labels.exitTitle, tone: "exit" },
    },
    { kind: "process", key: n3.key, label: n3.title, n: 3, tone: "ciaa" },
    {
      kind: "decision",
      key: "d-grounds",
      label: labels.dGrounds,
      exit: { label: labels.exitTitle, tone: "exit" },
    },
    { kind: "process", key: n4.key, label: n4.title, n: 4, tone: "ciaa" },
    {
      kind: "decision",
      key: n5.key,
      label: labels.dProsecute,
      n: 5,
      exit: { label: labels.exitTitle, tone: "exit" },
      yesNote: labels.chargeSheet,
    },
    { kind: "process", key: court.key, label: court.title, n: 6, tone: "court" },
    {
      kind: "decision",
      key: "d-appeal",
      label: labels.dAppeal,
      exit: { label: labels.standsTitle, tone: "stands" },
    },
    { kind: "process", key: appeal.key, label: appeal.title, n: 7, tone: "court" },
  ];

  // Lay the spine out top to bottom, recording each shape's vertical centre.
  let y = 16;
  const placed = shapes.map((s) => {
    const h = s.kind === "decision" ? L.dRy * 2 : s.kind === "terminator" ? 40 : L.boxH;
    const cy = y + h / 2;
    // A decision carrying a note on its yes-branch needs a second line of room
    // below it, or the note is painted over by the shape that follows.
    const extra = s.kind === "decision" && s.yesNote ? 18 : 0;
    y += h + L.gap + extra;
    return { s, cy, h };
  });
  const height = y - L.gap + 16;

  const ink = "hsl(var(--foreground))";
  const green = "hsl(var(--court))";
  const red = "hsl(var(--accent))";
  const toneFill = (t: string) =>
    t === "court" ? green : t === "start" ? "hsl(var(--foreground) / 0.8)" : ink;

  return (
    <div>
      <div className="mx-auto max-w-[560px]" aria-hidden="true">
        <svg
          viewBox={`0 0 ${L.w} ${height}`}
          className="h-auto w-full"
          role="presentation"
          focusable="false"
        >
          <defs>
            {[
              ["fc-ink", "hsl(var(--foreground) / 0.65)"],
              ["fc-red", "hsl(var(--accent))"],
              ["fc-green", "hsl(var(--court))"],
            ].map(([id, c]) => (
              <marker
                key={id}
                id={id}
                viewBox="0 0 10 10"
                refX="8.5"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M0 0.5 L10 5 L0 9.5 Z" fill={c} />
              </marker>
            ))}
          </defs>

          {/* Spine: each shape to the next, with yes/no on the decision exits. */}
          {placed.map((p, i) => {
            const next = placed[i + 1];
            if (!next) return null;
            const from = p.cy + p.h / 2;
            const to = next.cy - next.h / 2 - 3;
            const isCourtLink = p.s.kind === "process" && p.s.tone === "court";
            const stroke = isCourtLink ? green : "hsl(var(--foreground) / 0.65)";
            const marker = isCourtLink ? "url(#fc-green)" : "url(#fc-ink)";
            return (
              <g key={`c-${p.s.key}`}>
                <path
                  d={`M${L.spineX} ${from} L${L.spineX} ${to}`}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={2}
                  strokeLinecap="round"
                  markerEnd={marker}
                />
                {p.s.kind === "decision" ? (
                  <>
                    <text
                      x={L.spineX + 9}
                      y={from + 15}
                      fontSize={13}
                      fontWeight={700}
                      fill="hsl(var(--muted-foreground))"
                    >
                      {labels.yes}
                    </text>
                    {p.s.yesNote ? (
                      <text
                        x={L.spineX + 9}
                        y={from + 30}
                        fontSize={12}
                        fill="hsl(var(--muted-foreground))"
                      >
                        {p.s.yesNote}
                      </text>
                    ) : null}
                  </>
                ) : null}
              </g>
            );
          })}

          {/* "No" branches: right off each diamond to its own terminator. */}
          {placed.map((p) => {
            if (p.s.kind !== "decision") return null;
            const isStands = p.s.exit.tone === "stands";
            const c = isStands ? "hsl(var(--foreground) / 0.5)" : red;
            return (
              <g key={`e-${p.s.key}`}>
                <path
                  d={`M${L.spineX + L.dRx} ${p.cy} L${L.exitX - 3} ${p.cy}`}
                  fill="none"
                  stroke={c}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray="6 5"
                  markerEnd={isStands ? "url(#fc-ink)" : "url(#fc-red)"}
                />
                <text
                  x={(L.spineX + L.dRx + L.exitX) / 2}
                  y={p.cy - 9}
                  fontSize={13}
                  fontWeight={700}
                  textAnchor="middle"
                  fill="hsl(var(--muted-foreground))"
                >
                  {labels.no}
                </text>
                <rect
                  x={L.exitX}
                  y={p.cy - L.exitH / 2}
                  width={L.exitW}
                  height={L.exitH}
                  rx={L.exitH / 2}
                  fill={isStands ? "hsl(var(--foreground) / 0.04)" : "hsl(var(--accent) / 0.08)"}
                  stroke={c}
                  strokeWidth={1.5}
                  strokeDasharray={isStands ? undefined : "5 4"}
                />
                <text
                  x={L.exitX + L.exitW / 2}
                  y={p.cy + 5}
                  textAnchor="middle"
                  className="font-display"
                  fontSize={15}
                  fontWeight={700}
                  fill={isStands ? "hsl(var(--muted-foreground))" : red}
                >
                  {p.s.exit.label}
                </text>
              </g>
            );
          })}

          {/* Shapes */}
          {placed.map(({ s, cy }) => {
            if (s.kind === "terminator") {
              return (
                <g key={s.key}>
                  <rect
                    x={L.spineX - L.boxW / 2}
                    y={cy - 20}
                    width={L.boxW}
                    height={40}
                    rx={20}
                    fill={toneFill("start")}
                  />
                  <text
                    x={L.spineX}
                    y={cy + 5}
                    textAnchor="middle"
                    className="font-display"
                    fontSize={15}
                    fontWeight={700}
                    fill="hsl(var(--background))"
                  >
                    {s.label}
                  </text>
                </g>
              );
            }

            if (s.kind === "decision") {
              const c = s.n ? red : "hsl(var(--foreground) / 0.75)";
              return (
                <g key={s.key}>
                  <polygon
                    points={`${L.spineX},${cy - L.dRy} ${L.spineX + L.dRx},${cy} ${L.spineX},${cy + L.dRy} ${L.spineX - L.dRx},${cy}`}
                    fill={s.n ? "hsl(var(--accent) / 0.07)" : "hsl(var(--surface))"}
                    stroke={c}
                    strokeWidth={1.75}
                  />
                  <text
                    x={L.spineX}
                    y={cy + 5}
                    textAnchor="middle"
                    className="font-display"
                    fontSize={15}
                    fontWeight={700}
                    fill={c}
                  >
                    {s.label}
                  </text>
                  {s.n ? <StepNo x={L.spineX - L.dRx * 0.5} y={cy - L.dRy * 0.5} n={s.n} fill={red} /> : null}
                </g>
              );
            }

            const c = s.tone === "court" ? green : "hsl(var(--border))";
            return (
              <g key={s.key}>
                <rect
                  x={L.spineX - L.boxW / 2}
                  y={cy - L.boxH / 2}
                  width={L.boxW}
                  height={L.boxH}
                  rx={6}
                  fill="hsl(var(--surface))"
                  stroke={c}
                  strokeWidth={s.tone === "court" ? 1.75 : 1.25}
                />
                <text
                  x={L.spineX}
                  y={cy + 6}
                  textAnchor="middle"
                  className="font-display"
                  fontSize={16}
                  fontWeight={700}
                  fill={s.tone === "court" ? green : ink}
                >
                  {s.label}
                </text>
                <StepNo
                  x={L.spineX - L.boxW / 2}
                  y={cy - L.boxH / 2}
                  n={s.n}
                  fill={s.tone === "court" ? green : "hsl(var(--foreground) / 0.65)"}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* The one description assistive tech reads. */}
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

/** Step number, sat on the shape's upper-left. */
const StepNo = ({ x, y, n, fill }: { x: number; y: number; n: number; fill: string }) => (
  <g>
    <circle cx={x} cy={y} r={10.5} fill={fill} />
    <text
      x={x}
      y={y + 4}
      textAnchor="middle"
      className="font-mono"
      fontSize={11.5}
      fontWeight={700}
      fill="hsl(var(--background))"
    >
      {n}
    </text>
  </g>
);
