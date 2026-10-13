import type { ReactNode } from "react";

import { useFormat } from "@/lib/format";

export type LedgerRow = {
  key: string;
  /** Arithmetic operator shown in the gutter. The first row has none. */
  op?: string;
  label: string;
  value: string;
  /** The line the sum arrives at, given a rule above it and heavier type. */
  total?: boolean;
};

/**
 * The arithmetic of one judgment, set out as arithmetic.
 *
 * The figures in decision no. 9433 are the whole argument — two totals and the gap
 * between them — and a sentence carrying three lakh-formatted rupee amounts is a
 * sentence nobody finishes. Laid out as a sum with the operators in the gutter, a
 * reader can check it.
 *
 * The bar underneath exists because a percentage against a threshold is a comparison,
 * and a comparison is the one thing a pair of numbers in prose does badly. The marker
 * is labelled as what the court applied *in this case*: it is not a statutory rule, and
 * drawing it as a fixed line without saying so would invent one.
 */
export function CaseLedger({
  label,
  title,
  cite,
  rows,
  share,
  shareLabel,
  threshold,
  thresholdLabel,
  outcome,
}: {
  /** e.g. "The case". */
  label: string;
  title: string;
  cite?: ReactNode;
  rows: readonly LedgerRow[];
  /** The percentage the case turned on, e.g. 8.1. */
  share: number;
  shareLabel: ReactNode;
  /** The percentage the court treated as the limit, e.g. 10. */
  threshold: number;
  thresholdLabel: string;
  /** What the court did with that comparison. */
  outcome: ReactNode;
}) {
  // Headroom past the threshold, so the marker is not pinned to the right edge where
  // it would read as the end of the scale rather than as a line that can be crossed.
  const scale = threshold * 1.25;
  // Rendered directly rather than through t(), so it needs the same digit treatment
  // the interpolated figures get — otherwise a Nepali page prints 8.10% next to ८.१०%.
  const { pct2 } = useFormat();

  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-border bg-[hsl(var(--surface))]">
      <div className="border-b border-border px-5 py-4 md:px-6">
        <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1.5 font-display text-base font-bold leading-snug text-foreground">
          {title}
        </p>
        {cite ? <p className="mt-1 text-xs leading-5">{cite}</p> : null}
      </div>

      <dl className="px-5 py-4 md:px-6">
        {rows.map((r) => (
          <div
            key={r.key}
            className={
              "flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-2 " +
              (r.total ? "mt-1 border-t border-foreground/20 pt-3" : "")
            }
          >
            <dt
              aria-hidden="true"
              className="w-4 shrink-0 font-mono text-sm text-muted-foreground"
            >
              {r.op ?? ""}
            </dt>
            {/* The label takes the whole line on a narrow screen and the amount drops
                beneath it, right-aligned. Squeezed onto one line the label wraps to
                three and the sum stops looking like a sum. */}
            <dd className="min-w-0 basis-[calc(100%-1.75rem)] text-sm leading-6 text-foreground/85 sm:flex-1 sm:basis-auto">
              {r.label}
            </dd>
            <dd
              className={
                "ml-auto shrink-0 font-mono tabular-nums " +
                (r.total
                  ? "text-lg font-semibold text-foreground"
                  : "text-sm text-foreground/80")
              }
            >
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="border-t border-border px-5 py-5 md:px-6">
        <div className="flex items-baseline gap-3">
          <p className="font-mono text-3xl font-semibold leading-none tracking-tight text-foreground">
            {pct2(share)}
          </p>
          <p className="text-sm leading-6 text-foreground/80">{shareLabel}</p>
        </div>

        <div className="relative mt-4 h-3 rounded-sm bg-foreground/[0.07]">
          <div
            className="h-full rounded-sm bg-accent"
            style={{ width: `${(share / scale) * 100}%` }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-[-5px] w-px bg-foreground/55"
            style={{ left: `${(threshold / scale) * 100}%` }}
          />
        </div>
        <p
          className="mt-1.5 text-[0.7rem] text-muted-foreground"
          style={{ marginLeft: `${(threshold / scale) * 100}%` }}
        >
          {thresholdLabel}
        </p>

        <p className="mt-4 border-t border-border pt-3.5 text-sm leading-6 text-foreground/85">
          {outcome}
        </p>
      </div>
    </div>
  );
}
