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
  intro,
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
  /** Optional framing sentence between the title and the two columns. */
  intro?: ReactNode;
  /** Optional detail: a worked case, a caveat, a link. */
  children?: ReactNode;
}) {
  return (
    <aside className="mt-10 overflow-hidden rounded-lg border border-accent/35 bg-accent/[0.045] shadow-sm">
      {/* Deliberately the loudest block on its page. These are the findings the whole
          project exists for -- the point where the public record stops answering -- and
          on a page of charts a quiet bordered aside reads as a footnote. A tinted face,
          a heavier accent edge and a rule under the tag give it the weight of a
          section without making it a second page. */}
      <div className="border-l-4 border-accent px-5 py-6 md:px-7 md:py-7">
        <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent">
          {label}
        </p>
        <div aria-hidden="true" className="mt-2.5 h-px w-12 bg-accent/45" />
        <h3 className="mt-3 max-w-3xl font-display text-xl font-bold leading-tight tracking-tight text-foreground md:text-2xl">
          {title}
        </h3>

        {intro ? (
          <p className="mt-4 max-w-3xl text-sm leading-6 text-foreground/85">{intro}</p>
        ) : null}

        <dl className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2">
          <div>
            <dt className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-accent/85">
              {showsLabel}
            </dt>
            <dd className="mt-2 text-sm leading-6 text-foreground/90">{shows}</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-accent/85">
              {fixLabel}
            </dt>
            <dd className="mt-2 text-sm leading-6 text-foreground/90">{fix}</dd>
          </div>
        </dl>

        {children ? (
          <div className="mt-6 border-t border-accent/25 pt-4 text-sm leading-6 text-foreground/70">
            {children}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
