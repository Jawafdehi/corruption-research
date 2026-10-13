import type { ReactNode } from "react";

/**
 * A reading of the chart above it, marked as a reading.
 *
 * These paragraphs used to sit under a figure as ordinary body text, which left a
 * reader no way to tell the chart's own description apart from what we concluded from
 * it. Set apart with a tag and a rule, so the analysis is visibly ours and the figure
 * stays the figure.
 *
 * Deliberately quieter than GapCallout: that block marks where the record stops
 * answering, and if every observation looked the same the distinction would be lost.
 */
export function DataNote({
  label,
  children,
  stat,
  statCaption,
}: {
  /** e.g. "What the figures show". */
  label: string;
  children: ReactNode;
  /** Optional figure the reading turns on. */
  stat?: string;
  statCaption?: ReactNode;
}) {
  return (
    <aside className="mt-6 rounded-lg border border-border border-l-[3px] border-l-foreground/40 bg-[hsl(var(--surface))] px-5 py-4 md:px-6 md:py-5">
      <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>

      {stat ? (
        <div className="mt-3 flex flex-col gap-1.5 md:flex-row md:items-baseline md:gap-4">
          <p className="font-mono text-2xl font-semibold leading-none tabular-nums tracking-tight text-foreground md:text-3xl">
            {stat}
          </p>
          <p className="max-w-2xl text-sm leading-6 text-foreground/80">{statCaption}</p>
        </div>
      ) : null}

      <div className="mt-2.5 max-w-3xl space-y-3 text-sm leading-6 text-foreground/85">
        {children}
      </div>
    </aside>
  );
}
