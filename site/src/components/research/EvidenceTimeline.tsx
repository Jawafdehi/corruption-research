import type { ReactNode } from "react";

export type EvidenceEntry = {
  key: string;
  /** When, in the reader's terms: "FY2070/71", "2072". */
  when: string;
  /** What kind of record this is, one short line. */
  kind: string;
  body: ReactNode;
  /** The figure this entry turns on, if it has one. */
  stat?: string;
  statCaption?: string;
  /** The ruling the other entries sit either side of. Drawn as the spine's pivot. */
  pivot?: boolean;
};

/**
 * Dated records on one spine, with the ruling they bracket marked.
 *
 * The claim here is about sequence — the Commission used a method, the court settled
 * the question, the Commission went on using it — and sequence is the one thing a
 * paragraph cannot show at a glance. The pivot entry is drawn differently so a reader
 * can see which side of the ruling each record falls on without reading dates.
 */
export function EvidenceTimeline({
  label,
  entries,
}: {
  label: string;
  entries: readonly EvidenceEntry[];
}) {
  return (
    <div className="mt-6 rounded-lg border border-border bg-[hsl(var(--surface))] px-5 py-5 md:px-6 md:py-6">
      <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>

      <ol className="mt-4">
        {entries.map((e, i) => (
          <li key={e.key} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Spine and marker. The line stops at the last entry so the sequence
                reads as finished rather than trailing off. */}
            <div className="relative flex w-3 shrink-0 justify-center">
              {i < entries.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-2 h-full w-px -translate-x-1/2 bg-border"
                />
              ) : null}
              <span
                aria-hidden="true"
                className={
                  "relative mt-1 block rounded-full " +
                  (e.pivot
                    ? "h-3 w-3 bg-accent ring-4 ring-[hsl(var(--surface))]"
                    : "h-2 w-2 bg-foreground/35 ring-4 ring-[hsl(var(--surface))]")
                }
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={
                  "font-mono text-[0.72rem] font-semibold uppercase tracking-[0.12em] " +
                  (e.pivot ? "text-accent" : "text-muted-foreground")
                }
              >
                {e.when}
              </p>
              <p
                className={
                  "mt-1 font-display text-[0.95rem] font-bold leading-snug " +
                  (e.pivot ? "text-accent" : "text-foreground")
                }
              >
                {e.kind}
              </p>
              <p className="mt-1.5 text-sm leading-6 text-foreground/80">{e.body}</p>

              {e.stat ? (
                <p className="mt-3 border-l-2 border-foreground/20 pl-3.5">
                  <span className="block font-mono text-xl font-semibold tabular-nums leading-tight text-foreground">
                    {e.stat}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                    {e.statCaption}
                  </span>
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
