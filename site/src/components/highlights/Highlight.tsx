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

/** The crimson rule that marks the lead finding, and only the lead finding. */
const Rule = ({ lead }: { lead?: boolean }) => (
  <div
    aria-hidden="true"
    className={cn("h-[3px] w-14 rounded-full", lead ? "bg-accent" : "bg-foreground/25")}
  />
);

export type HighlightMeta = {
  /** Fiscal years, population and denominator. Shown under the finding, not hidden. */
  context: string;
  /** Where the figure comes from. */
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
  size = "half",
  stat,
  statCaption,
  headline,
  explain,
  chart,
  meta,
  children,
}: {
  index: number;
  size?: "lead" | "half" | "full";
  stat?: string;
  statCaption?: string;
  headline: string;
  explain: string;
  chart?: ReactNode;
  meta: HighlightMeta;
  children?: ReactNode;
}) {
  const lead = size === "lead";

  return (
    <Reveal className="h-full">
      <article
        className={cn(
          "flex h-full flex-col",
          lead ? "gap-6" : "gap-4",
          size === "half" &&
            "rounded-lg border border-border bg-[hsl(var(--surface))] p-5 md:p-6",
        )}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {String(index).padStart(2, "0")}
          </span>
          <Rule lead={lead} />
        </div>

        <div className={cn(lead && "grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]")}>
          <div>
            <h3
              className={cn(
                "font-display font-bold leading-[1.15] tracking-tight text-foreground",
                lead ? "text-2xl md:text-[2.1rem]" : "text-lg md:text-xl",
              )}
            >
              {headline}
            </h3>

            {stat ? (
              <p className="mt-5">
                <span
                  className={cn(
                    "block font-mono font-semibold leading-none tracking-tight text-accent",
                    lead ? "text-5xl md:text-6xl" : "text-3xl md:text-4xl",
                  )}
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

            <p
              className={cn(
                "mt-5 max-w-prose leading-7 text-foreground/80",
                lead ? "text-base md:text-[1.0625rem]" : "text-sm md:text-base md:leading-7",
              )}
            >
              {explain}
            </p>

            {children}
          </div>

          {lead && chart ? <div className="min-w-0 self-center">{chart}</div> : null}
        </div>

        {!lead && chart ? <div className="min-w-0">{chart}</div> : null}

        <footer className="mt-auto space-y-2 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
          <p>{meta.context}</p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              {meta.sourceHref ? (
                <a
                  href={meta.sourceHref}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-dotted underline-offset-2 hover:text-foreground"
                >
                  {meta.source}
                </a>
              ) : (
                meta.source
              )}
            </span>
            <Link
              to={meta.to}
              className="font-medium text-accent underline underline-offset-4 hover:opacity-80"
            >
              {meta.toLabel}
            </Link>
          </p>
        </footer>
      </article>
    </Reveal>
  );
}

export { Reveal };
