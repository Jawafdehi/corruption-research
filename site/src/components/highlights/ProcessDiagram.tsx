/**
 * How a corruption complaint travels: institutional swimlanes.
 *
 * The composition carries the argument. A complaint runs left to right along the
 * Commission's lane; everything that leaves the system exits UPWARD into a single
 * Tameli bar, so the three exits read as one drain at a glance; and a case that
 * survives descends through two separate court lanes. Up is out, down is onward,
 * and the lanes stop the judiciary reading as a department of the Commission.
 *
 * Legal content checks against the अख्तियार दुरुपयोग अनुसन्धान आयोग कार्यविधि,
 * २०७८ (दफा २०–२५) and विशेष अदालत ऐन, २०५९ दफा १७: तामेली is reachable at
 * screening, after the preliminary inquiry and at the Commission's decision; the
 * detailed investigation has no exit of its own; the appeal is conditional, not
 * a step every case takes.
 *
 * Inline SVG, no new dependency. Geometry lives in `L`.
 */

export type DiagramNode = {
  key: string;
  title: string;
  body: string;
  exit?: string;
};

export type DiagramLabels = {
  ciaa: string;
  courtLane: string;
  supremeLane: string;
  exitLane: string;
  decision: string;
  prosecute: string;
  ifGrounds: string;
  ifAppealed: string;
  exitTitle: string;
  exitFrom: string;
  srIntro: string;
  srExit: string;
};

const L = {
  w: 1000,
  h: 452,
  labelX: 150,
  laneX: 170,
  laneW: 812,
  node: { w: 140, gap: 15, h: 60 },
  exitLane: { y: 36, h: 46 },
  ciaaLane: { y: 106, h: 116 },
  courtLane: { y: 246, h: 72 },
  supremeLane: { y: 342, h: 72 },
  diamond: { rx: 66, ry: 40 },
  courtNode: { x: 742, w: 220, h: 46 },
};
const ROW = L.ciaaLane.y + L.ciaaLane.h / 2;
const nodeX = (i: number) => L.laneX + 10 + i * (L.node.w + L.node.gap);
const nodeMid = (i: number) => nodeX(i) + L.node.w / 2;
const DIAMOND_CX = nodeX(4) + L.diamond.rx + 6;
const COURT_MID = L.courtNode.x + L.courtNode.w / 2;
const COURT_Y = L.courtLane.y + 13;
const SUPREME_Y = L.supremeLane.y + 13;

/** Split a label into at most two lines at the space nearest the middle. */
function twoLines(s: string): [string, string?] {
  if (s.length <= 13) return [s];
  const mid = s.length / 2;
  let best = -1;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === " " && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  }
  return best < 0 ? [s] : [s.slice(0, best), s.slice(best + 1)];
}

const Title = ({
  x,
  y,
  text,
  fill,
  size = 14.5,
}: {
  x: number;
  y: number;
  text: string;
  fill: string;
  size?: number;
}) => {
  const [a, b] = twoLines(text);
  return (
    <text
      x={x}
      y={b ? y - 7 : y + 1}
      textAnchor="middle"
      className="font-display"
      fontSize={size}
      fontWeight={700}
      fill={fill}
    >
      <tspan x={x}>{a}</tspan>
      {b ? (
        <tspan x={x} dy={17}>
          {b}
        </tspan>
      ) : null}
    </text>
  );
};

/** Connector label on a paper chip, so it stays legible over a lane fill. */
const Chip = ({
  x,
  y,
  children,
  fill,
}: {
  x: number;
  y: number;
  children: string;
  fill: string;
}) => {
  const w = children.length * 6.6 + 14;
  return (
    <g>
      <rect x={x - w / 2} y={y - 13} width={w} height={19} rx={3} fill="hsl(var(--background))" />
      <text x={x} y={y} fontSize={12.5} fontWeight={600} textAnchor="middle" fill={fill}>
        {children}
      </text>
    </g>
  );
};

const LaneLabel = ({ y, children, fill }: { y: number; children: string; fill: string }) => (
  <text
    x={L.labelX}
    y={y}
    textAnchor="end"
    fontSize={12}
    fontWeight={700}
    letterSpacing="0.07em"
    fill={fill}
  >
    {children.toUpperCase()}
  </text>
);

export function ProcessDiagram({
  stages,
  labels,
}: {
  stages: readonly DiagramNode[];
  labels: DiagramLabels;
}) {
  const [n1, n2, n3, n4, , court, supreme] = stages;
  const steps = [n1, n2, n3, n4];
  const ink = "hsl(var(--foreground))";
  const green = "hsl(var(--court))";
  const red = "hsl(var(--accent))";

  return (
    <div>
      {/* ---------- wide: swimlanes ---------- */}
      <div className="hidden md:block" aria-hidden="true">
        <svg
          viewBox={`0 0 ${L.w} ${L.h}`}
          className="h-auto w-full"
          role="presentation"
          focusable="false"
        >
          <defs>
            {[
              ["pd-a", "hsl(var(--foreground) / 0.55)"],
              ["pd-g", "hsl(var(--court))"],
              ["pd-r", "hsl(var(--accent))"],
            ].map(([id, c]) => (
              <marker
                key={id}
                id={id}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="5.2"
                markerHeight="5.2"
                orient="auto-start-reverse"
              >
                <path d="M0 0.5 L10 5 L0 9.5 Z" fill={c} />
              </marker>
            ))}
          </defs>

          {/* Lane beds */}
          <rect x={L.laneX} y={L.ciaaLane.y} width={L.laneW} height={L.ciaaLane.h} rx={8} fill="hsl(var(--foreground) / 0.035)" />
          <rect x={L.laneX} y={L.courtLane.y} width={L.laneW} height={L.courtLane.h} rx={8} fill="hsl(var(--court) / 0.055)" />
          <rect x={L.laneX} y={L.supremeLane.y} width={L.laneW} height={L.supremeLane.h} rx={8} fill="hsl(var(--court) / 0.055)" />
          <rect
            x={L.laneX}
            y={L.exitLane.y}
            width={L.laneW}
            height={L.exitLane.h}
            rx={8}
            fill="hsl(var(--accent) / 0.06)"
            stroke={red}
            strokeWidth={1.25}
            strokeDasharray="5 4"
          />

          <LaneLabel y={L.exitLane.y + 28} fill={red}>
            {labels.exitLane}
          </LaneLabel>
          <LaneLabel y={ROW + 4} fill="hsl(var(--muted-foreground))">
            {labels.ciaa}
          </LaneLabel>
          <LaneLabel y={L.courtLane.y + 42} fill={green}>
            {labels.courtLane}
          </LaneLabel>
          <LaneLabel y={L.supremeLane.y + 42} fill={green}>
            {labels.supremeLane}
          </LaneLabel>

          {/* The bar names the destination only. What तामेली actually means is a
              two-clause idea that does not belong inside a node, so it sits in a
              legend under the diagram where it can be read properly. */}
          <text
            x={L.laneX + 18}
            y={L.exitLane.y + 29}
            className="font-display"
            fontSize={16}
            fontWeight={700}
            fill={red}
          >
            {labels.exitTitle}
          </text>
          <text x={L.laneX + 18 + labels.exitTitle.length * 9.4 + 14} y={L.exitLane.y + 29} fontSize={12.5} fill={red} fillOpacity={0.75}>
            {labels.exitFrom}
          </text>

          {/* The run along the Commission's lane */}
          <g fill="none" stroke="hsl(var(--foreground) / 0.55)" strokeWidth={2.5} strokeLinecap="round" markerEnd="url(#pd-a)">
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M${nodeX(i) + L.node.w} ${ROW} L${nodeX(i + 1) - 4} ${ROW}`} />
            ))}
            <path d={`M${nodeX(3) + L.node.w} ${ROW} L${DIAMOND_CX - L.diamond.rx - 4} ${ROW}`} />
          </g>
          {/* Below the run, not on it: the gaps between nodes are 15px and any
              chip placed in one is painted over by the nodes either side. */}
          <Chip
            x={(nodeX(3) + L.node.w + DIAMOND_CX - L.diamond.rx) / 2}
            y={ROW + L.node.h / 2 + 24}
            fill="hsl(var(--muted-foreground))"
          >
            {labels.ifGrounds}
          </Chip>

          {/* Exits: up and out of the pipeline, into one bar */}
          <g fill="none" stroke={red} strokeWidth={2.25} strokeLinecap="round" strokeDasharray="7 5" markerEnd="url(#pd-r)">
            <path d={`M${nodeMid(1)} ${ROW - L.node.h / 2} L${nodeMid(1)} ${L.exitLane.y + L.exitLane.h + 4}`} />
            <path d={`M${nodeMid(2)} ${ROW - L.node.h / 2} L${nodeMid(2)} ${L.exitLane.y + L.exitLane.h + 4}`} />
            <path d={`M${DIAMOND_CX} ${ROW - L.diamond.ry} L${DIAMOND_CX} ${L.exitLane.y + L.exitLane.h + 4}`} />
          </g>

          {/* Onward: down into the courts */}
          <path
            d={`M${DIAMOND_CX} ${ROW + L.diamond.ry} C ${DIAMOND_CX} ${ROW + L.diamond.ry + 34}, ${COURT_MID} ${COURT_Y - 40}, ${COURT_MID} ${COURT_Y - 4}`}
            fill="none"
            stroke={green}
            strokeWidth={2.75}
            strokeLinecap="round"
            markerEnd="url(#pd-g)"
          />
          <Chip x={COURT_MID} y={COURT_Y - 20} fill={green}>
            {labels.prosecute}
          </Chip>

          <path
            d={`M${COURT_MID} ${COURT_Y + L.courtNode.h} L${COURT_MID} ${SUPREME_Y - 4}`}
            fill="none"
            stroke={green}
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeDasharray="7 5"
            markerEnd="url(#pd-g)"
          />
          <Chip x={COURT_MID} y={SUPREME_Y - 18} fill={green}>
            {labels.ifAppealed}
          </Chip>

          {/* Nodes */}
          {steps.map((s, i) => (
            <g key={s.key}>
              <rect
                x={nodeX(i)}
                y={ROW - L.node.h / 2}
                width={L.node.w}
                height={L.node.h}
                rx={6}
                fill="hsl(var(--surface))"
                stroke="hsl(var(--border))"
                strokeWidth={1.25}
              />
              <Title x={nodeMid(i)} y={ROW} text={s.title} fill={ink} />
            </g>
          ))}

          {/* The decision: a different shape, so its role does not rest on colour */}
          <polygon
            points={`${DIAMOND_CX},${ROW - L.diamond.ry} ${DIAMOND_CX + L.diamond.rx},${ROW} ${DIAMOND_CX},${ROW + L.diamond.ry} ${DIAMOND_CX - L.diamond.rx},${ROW}`}
            fill="hsl(var(--accent) / 0.08)"
            stroke={red}
            strokeWidth={1.75}
          />
          <text
            x={DIAMOND_CX}
            y={ROW + 5}
            textAnchor="middle"
            className="font-display"
            fontSize={14.5}
            fontWeight={700}
            fill={red}
          >
            {labels.decision}
          </text>

          {[
            { n: court, y: COURT_Y },
            { n: supreme, y: SUPREME_Y },
          ].map(({ n, y }) => (
            <g key={n.key}>
              <rect
                x={L.courtNode.x}
                y={y}
                width={L.courtNode.w}
                height={L.courtNode.h}
                rx={6}
                fill="hsl(var(--surface))"
                stroke={green}
                strokeWidth={1.75}
              />
              <Title x={COURT_MID} y={y + L.courtNode.h / 2} text={n.title} fill={green} size={15} />
            </g>
          ))}
        </svg>
      </div>

      {/* ---------- narrow: same grammar, vertical ---------- */}
      <div className="md:hidden" aria-hidden="true">
        <div className="mb-3 rounded-md border border-dashed border-accent bg-accent/5 px-3 py-2">
          <p className="font-display text-sm font-bold text-accent">{labels.exitTitle}</p>
          <p className="text-xs leading-5 text-accent/85">{labels.exitFrom}</p>
        </div>

        {stages.map((s, i) => {
          const isCourt = i >= 5;
          const lane =
            i === 0 ? labels.ciaa : i === 5 ? labels.courtLane : i === 6 ? labels.supremeLane : null;
          return (
            <div key={s.key}>
              {lane ? (
                <p
                  className="mb-1.5 mt-3 text-[0.68rem] font-bold uppercase tracking-wider first:mt-0"
                  style={{ color: isCourt ? green : "hsl(var(--muted-foreground))" }}
                >
                  {lane}
                </p>
              ) : null}
              <div
                className="rounded-md border bg-[hsl(var(--surface))] px-3 py-2.5"
                style={{ borderColor: isCourt ? green : "hsl(var(--border))" }}
              >
                <h4
                  className="font-display text-sm font-bold leading-snug"
                  style={isCourt ? { color: green } : undefined}
                >
                  {s.title}
                </h4>
                <p className="mt-1 text-sm leading-6 text-foreground/80">{s.body}</p>
              </div>
              {s.exit ? (
                <p className="flex items-center gap-1.5 pl-3 pt-1 text-xs font-medium text-accent">
                  <span aria-hidden="true">↑</span>
                  {s.exit}
                </p>
              ) : null}
              {i < stages.length - 1 ? (
                <div className="flex items-center gap-2 py-1 pl-3">
                  <span
                    aria-hidden="true"
                    className="block h-4 w-px"
                    style={{ backgroundColor: i >= 4 ? green : "hsl(var(--border))" }}
                  />
                  {i === 3 ? (
                    <span className="text-[0.7rem] text-muted-foreground">{labels.ifGrounds}</span>
                  ) : null}
                  {i === 4 ? (
                    <span className="text-[0.7rem] font-semibold" style={{ color: green }}>
                      {labels.prosecute}
                    </span>
                  ) : null}
                  {i === 5 ? (
                    <span className="text-[0.7rem] font-semibold" style={{ color: green }}>
                      {labels.ifAppealed}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

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

export const FlowNote = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-5 max-w-2xl text-xs leading-5 text-muted-foreground">{children}</p>
);
