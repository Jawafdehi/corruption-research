import type { ReactNode } from "react";

/**
 * One place where the record runs out, shown inside the stage it belongs to.
 *
 * These used to live together on a separate "accountability gaps" page, which meant a
 * reader had to hold the whole pipeline in their head to know which stage each one
 * described. Moved into the stage itself, each gap lands next to the evidence it
 * qualifies -- and a tab that says what it cannot show, where it cannot show it, is
 * more use than a tab that says it somewhere else.
 *
 * The two halves are always the same pair and always in the same order: what the
 * record does establish, and the specific field or document that would close it. A
 * gap with no second half is a complaint rather than a finding, so `fix` is required.
 */
export function GapCallout({
  label,
  title,
  shows,
  fix,
  showsLabel,
  fixLabel,
  children,
}: {
  /** Short stage tag, e.g. "Investigation". */
  label: string;
  title: string;
  /** What the evidence establishes, in one or two sentences. */
  shows: ReactNode;
  /** The missing field, document or identifier. */
  fix: ReactNode;
  showsLabel: string;
  fixLabel: string;
  /** Optional detail: a worked case, a caveat, a link. */
  children?: ReactNode;
}) {
  return (
    <aside className="mt-8 overflow-hidden rounded-lg border border-border bg-[hsl(var(--surface))]">
      {/* The accent edge is the only thing marking these as a set now that they no
          longer sit on a page of their own. */}
      <div className="border-l-[3px] border-accent px-5 py-5 md:px-6 md:py-6">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent">
          {label}
        </p>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-foreground md:text-xl">
          {title}
        </h3>

        <dl className="mt-4 grid gap-x-8 gap-y-4 md:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {showsLabel}
            </dt>
            <dd className="mt-1.5 text-sm leading-6 text-foreground/85">{shows}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {fixLabel}
            </dt>
            <dd className="mt-1.5 text-sm leading-6 text-foreground/85">{fix}</dd>
          </div>
        </dl>

        {children ? (
          <div className="mt-4 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
            {children}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
