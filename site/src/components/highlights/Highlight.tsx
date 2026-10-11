import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

/**
 * Reveal-on-enter, once, and only when the reader has not asked for less motion.
 *
 * Returns `true` immediately under `prefers-reduced-motion` so the content is
 * never gated behind an animation that will not play. Also returns `true` if
 * IntersectionObserver is unavailable, so an old browser shows everything rather
 * than a blank column.
 */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(
    () =>
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (shown || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return { ref, shown };
}

const Reveal = ({ children, className }: { children: ReactNode; className?: string }) => {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn(
        "motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out",
        shown ? "opacity-100 translate-y-0" : "opacity-0 motion-safe:translate-y-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

/** Short rule beside the index number. */
const Rule = () => (
  <div aria-hidden="true" className="h-[3px] w-10 rounded-full bg-accent/60" />
);

export type HighlightMeta = {
  /** Where the figure comes from, in a few words. Rendered after a *. */
  source: string;
  sourceHref?: string;
  /** Section to read next. */
  to: string;
  toLabel: string;
};

/**
 * One finding. The layout varies by `size` rather than every finding being poured
 * into the same card: the lead gets the figure and the chart side by side, the
 * paired ones stack, and `full` is for a finding whose chart needs the width.
 */
export function Highlight({
  index,
  stat,
  statCaption,
  headline,
  explain,
  chart,
  meta,
  children,
}: {
  index: number;
  stat?: string;
  statCaption?: string;
  headline: string;
  explain: string;
  chart?: ReactNode;
  meta: HighlightMeta;
  children?: ReactNode;
}) {
  return (
    <Reveal className="h-full min-w-0">
      <article
        className={cn(
          // `relative` anchors the stretched link below, so the whole card is one
          // hit area without nesting a second interactive element inside a link.
          // One shape for every finding, so the grid reads as a set rather than a
          // hierarchy. `h-full` lets the grid equalise heights across a row.
          "group relative flex h-full flex-col gap-4 rounded-lg border border-border",
          "bg-[hsl(var(--surface))] p-5 transition-colors hover:border-accent/50 md:p-6",
        )}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {String(index).padStart(2, "0")}
          </span>
          <Rule />
        </div>

        <div>
          <div>
            <h3
              className="font-display text-lg font-bold leading-snug tracking-tight text-foreground md:text-xl"
            >
              {headline}
            </h3>

            {stat ? (
              <p className="mt-5">
                <span
                  className="block font-mono text-3xl font-semibold leading-none tracking-tight text-accent md:text-4xl"
                >
                  {stat}
                </span>
                {statCaption ? (
                  <span className="mt-2.5 block max-w-sm text-sm leading-5 text-muted-foreground">
                    {statCaption}
                  </span>
                ) : null}
              </p>
            ) : null}

            <p className="mt-4 text-sm leading-6 text-foreground/80">{explain}</p>

            {children}
          </div>

        </div>

        {chart ? <div className="chart-scroll min-w-0">{chart}</div> : null}

        <footer className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
          <span>
            <span aria-hidden="true" className="mr-1">
              *
            </span>
              {meta.sourceHref ? (
                <a
                  href={meta.sourceHref}
                  target="_blank"
                  rel="noreferrer"
                  className="relative z-10 underline decoration-dotted underline-offset-2 hover:text-foreground"
                >
                  {meta.source}
                </a>
            ) : (
              meta.source
            )}
          </span>
            {/* Stretched: covers the card so a click anywhere follows it. The
                source link above sits on its own stacking context so it stays
                separately clickable. */}
            <Link
              to={meta.to}
              className="font-medium text-accent underline underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:opacity-80"
            >
            {meta.toLabel}
          </Link>
        </footer>
      </article>
    </Reveal>
  );
}

export { Reveal };
