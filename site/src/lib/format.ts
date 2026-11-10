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
/** Nepali month names as the CIAA and the courts write them, 1 = वैशाख … 12 = चैत. */
const NE_MONTHS = ["वैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"];

const EN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * BS (Bikram Sambat) date for an AD date, for the Nepali page. Only months whose first day
 * has been checked against an official source are listed: कात्तिक २०८३ began on 18 October
 * 2026 (the CIAA's 36th-report press note: असोज १ = 17 September 2026). A date outside them
 * is written as an AD date marked सन्, never guessed.
 */
const BS_MONTH_STARTS: { ad: string; days: number; year: number; month: number }[] = [
  { ad: "2026-10-18", days: 30, year: 2083, month: 7 },
];

function bsDate(iso: string): { year: number; month: number; day: number } | null {
  const d = Date.parse(`${iso}T00:00:00Z`);
  for (const m of BS_MONTH_STARTS) {
    const offset = Math.round((d - Date.parse(`${m.ad}T00:00:00Z`)) / 86_400_000);
    if (offset >= 0 && offset < m.days) return { year: m.year, month: m.month, day: offset + 1 };
  }
  return null;
}

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
      /** An amount in billions of rupees: `Rs 40.8 billion` / `रू. ४०.८ अर्ब`, as the text writes it. */
      rsBn: (bn: number) =>
        language === "ne" ? `रू. ${digits(bn.toFixed(1))} अर्ब` : `Rs ${bn.toFixed(1)} billion`,
      /**
       * A calendar date: `2 November 2026` / `२०८३ कात्तिक १६` (BS, the way the Nepali page
       * writes dates), or `सन् २०२६-११-०२` where no checked BS conversion exists.
       */
      date: (iso: string) => {
        if (language !== "ne") {
          const [y, m, d] = iso.split("-").map(Number);
          return `${d} ${EN_MONTHS[m - 1]} ${y}`;
        }
        const bs = bsDate(iso);
        return bs
          ? digits(`${bs.year} ${NE_MONTHS[bs.month - 1]} ${bs.day}`)
          : `सन् ${digits(iso)}`;
      },
      /** Nepali month name: the data's romanised `name` in English, Devanagari in Nepali. */
      month: (m: { month: number; name: string }) =>
        language === "ne" ? (NE_MONTHS[m.month - 1] ?? m.name) : m.name,
      fyLong: (year: number) =>
        t("research.corruption.fy", "FY {{fy}}", { fy: fyLabel(year) }),
    };
  }, [t, language]);
}
