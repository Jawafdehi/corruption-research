import { useMemo } from "react";
import { toDevanagariDigits, useTranslation } from "react-i18next";

import { fyLabel } from "@/data/research-corruption";

/**
 * Locale-aware number formatting for the figures that are rendered directly
 * rather than interpolated through `t()` — stat tiles, table cells, chart
 * labels.
 *
 * WHY this exists rather than a bare `toLocaleString()` per page: numbers that
 * go through `t()` already get Devanagari digits from the interpolator, so
 * without this a Nepali page would print a Devanagari figure in a sentence and
 * a Western one in the tile directly above it.
 *
 * Grouping is pinned to `en-US` instead of the browser's locale so the same
 * build renders the same separators everywhere; only the digits change with the
 * language. At the magnitudes on this site (five digits at most) South Asian and
 * Western grouping agree, so this is a formatting choice, not a numeric one.
 */
export function useFormat() {
  const { t, language } = useTranslation();

  return useMemo(() => {
    const digits = (s: string) => (language === "ne" ? toDevanagariDigits(s) : s);
    return {
      /** Whole number with thousands separators: `2,949` / `२,९४९`. */
      n: (v: number) => digits(v.toLocaleString("en-US")),
      /** Rounded percentage: `53%` / `५३%`. */
      pct: (v: number) => digits(`${Math.round(v)}%`),
      /** Percentage to one decimal, for figures where the tenth carries meaning. */
      pct1: (v: number) => digits(`${v.toFixed(1)}%`),
      /** Two decimals, for a percentage quoted from a judgment exactly as written. */
      pct2: (v: number) => digits(`${v.toFixed(2)}%`),
      /** One decimal, for an average where rounding to a whole number would mislead. */
      dec1: (v: number) => digits(v.toFixed(1)),
      /** Bare fiscal-year label for axis ticks: `2069/70` / `२०६९/७०`. */
      fy: (year: number) => digits(fyLabel(year)),
      /**
       * Fiscal year with its prefix, for tooltips and chart labels. The prefix is
       * a word, so it goes through `t()` rather than being concatenated — Nepali
       * writes it `आ.व.` and it is not interchangeable with "FY".
       */
      fyLong: (year: number) =>
        t("research.corruption.fy", "FY {{fy}}", { fy: fyLabel(year) }),
    };
  }, [t, language]);
}
