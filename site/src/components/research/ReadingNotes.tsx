import type { ReactNode } from "react";

export type ReadingNote = {
  key: string;
  /** The figure the note turns on, e.g. "30 months". Optional. */
  stat?: string;
  /** Short headline — the point of the note in four or five words. */
  title: string;
  body: ReactNode;
};

/**
 * The two or three things a reader has to know to read the chart above, broken apart
 * and numbered.
 *
 * These notes used to run together as one paragraph under a figure, which put the
 * pace, the caveat about unfinished cohorts and the backlog count in the same breath —
 * everything in one place, and so nothing legible. Numbering them makes each a separate
 * claim the eye can land on, and the figure each one turns on carries it.
 *
 * Quieter than KeyFinding on purpose. These explain how to read a chart; they are not
 * themselves the finding.
 */
export function ReadingNotes({
  label,
  notes,
  footnote,
}: {
  /** e.g. "Reading the chart". */
  label: string;
  notes: readonly ReadingNote[];
  /** One line of provenance or scope, set small underneath. */
  footnote?: ReactNode;
}) {
  return (
    <aside className="mt-6 overflow-hidden rounded-xl border border-border bg-[hsl(var(--surface))]">
      <div className="px-5 pt-5 md:px-7 md:pt-6">
        <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <div aria-hidden="true" className="mt-2.5 h-px w-10 bg-foreground/25" />
      </div>

      {/* Dividers between notes rather than cards inside a card: one panel reads as one
          explanation, and the rules keep the three claims from running together. */}
      <ol className="grid px-5 pb-5 pt-5 md:grid-cols-3 md:px-7 md:pb-6 md:[&>li+li]:border-l md:[&>li+li]:border-border/70">
        {notes.map((note, i) => (
          <li
            key={note.key}
            className="border-t border-border/70 pt-5 first:border-0 first:pt-0 md:border-t-0 md:px-5 md:pt-0 md:first:pl-0 md:last:pr-0"
          >
            <p
              aria-hidden="true"
              className="font-mono text-[0.72rem] font-bold tabular-nums tracking-[0.16em] text-accent"
            >
              {String(i + 1).padStart(2, "0")}
            </p>

            {note.stat ? (
              <p className="mt-2 font-mono text-2xl font-semibold leading-none tracking-tight text-foreground md:text-[1.75rem]">
                {note.stat}
              </p>
            ) : null}

            <p className="mt-2 font-display text-base font-bold leading-snug text-foreground">
              {note.title}
            </p>
            <p className="mt-1.5 text-sm leading-6 text-foreground/80">{note.body}</p>
          </li>
        ))}
      </ol>

      {footnote ? (
        <p className="border-t border-border/70 px-5 py-3.5 text-xs leading-5 text-muted-foreground md:px-7">
          {footnote}
        </p>
      ) : null}
    </aside>
  );
}
