// Data layer for the Corruption Accountability dashboard.
//
// Deliberately mirrors the module of the same name in the jawafdehi.org SPA: same
// exported names, same types, same helpers. The ONE difference is where `REPORT`
// comes from — there it is a baked literal, here it is generated from the research
// pack's `dataset/` by `gen_site_data.py`. Moving these pages into the main SPA is
// therefore a file copy; only this module's first few lines change.
//
// The by-year axis is FISCAL YEAR (2069/70 … 2082/83) — never single Bikram-Sambat
// years. Every figure is a count of CASES: the court records one verdict per case
// and publishes no per-accused outcome, so a per-person rate cannot be derived and
// must never be implied by the copy.

import generated from "./report.generated.json";

export type OutcomeCounts = {
  /** ठहर — charge upheld / full conviction. */
  convicted: number;
  /** आंशिक ठहर — partial conviction. */
  partial: number;
  /** सफाई — acquittal. */
  acquitted: number;
};

export type ChargeOutcome = OutcomeCounts & {
  /** English offense-family label. */
  en: string;
  /** Nepali offense-family label. */
  ne: string;
};

export type JusticeRow = {
  /** Nepali name as it appears in the bench record. */
  name: string;
  /** Deciding hearings the justice sat on (bench-grain, not judge-grain). */
  decisions: number;
  /** Conviction rate (%) on the definition `corpus_data` currently uses. */
  convPct: number;
};

export type VerdictYearRow = {
  /** Fiscal year of verdict, as its start year — 2069 = FY 2069/70. */
  fy: number;
  convicted: number;
  partial: number;
  acquitted: number;
  /** Full convictions among fake-credential cases this year. */
  fakeConv: number;
  /** Decided fake-credential cases this year (the ~90%-conviction charge). */
  fakeDisp: number;
};

export type CohortRow = {
  /** Fiscal year of filing (registration), as its start year. */
  fy: number;
  decided: number;
  pending: number;
  /** Median months from registration to verdict (decided cases only). */
  medianMonths: number;
};

export type ChargeMixYear = {
  fy: number;
  bribery: number;
  fake: number;
  embezzlement: number;
  benefit: number;
  loss: number;
  /** Smaller families folded together (illicit enrichment, irregularity, etc.). */
  other: number;
};

export type MonthFiling = {
  /** Nepali month index: 1 = Baisakh … 12 = Chaitra. */
  month: number;
  name: string;
  /** Mean cases filed in this month across complete fiscal years. */
  mean: number;
  /** ±1 sample standard deviation across those years. */
  sd: number;
};

export type SourceAgreementRow = {
  fy: number;
  /** Filings the CIAA's own annual reports publish for that year. */
  ciaaFiled: number;
  /** Register cases plausibly CIAA-filed: all -CR- minus the non-CIAA streams. */
  registerComparable: number;
};

/** A reason a register case is absent from the CIAA's own filing table, and how many. */
export type SurplusReason = {
  en: string;
  count: number;
  /** Set on the residual bucket, so copy can quote the unexplained count without hardcoding it. */
  unexplained?: boolean;
};

/** One side of one trial outcome's appeal record. */
export type AppealRow = {
  trial_outcome: string;
  appealed_by: string;
  appeals: number;
  affirmed: number;
  claim_denied: number;
  reversed: number;
  partially_reversed: number;
  other_procedural: number;
  no_outcome_recorded: number;
};

/** Fiscal-year label from its start year: 2069 → "2069/70", 2082 → "2082/83". */
export const fyLabel = (fy: number): string => `${fy}/${String((fy + 1) % 100).padStart(2, "0")}`;

// In-platform citation targets. Each is a real public page on jawafdehi.org.
// EDITORIAL, not derived — figures are cited to materials Jawafdehi hosts, never to
// an external news site. This is the one block that is hand-maintained.
export const CITATIONS = {
  ciaa35: "https://jawafdehi.org/material/ciaa_annual_report/ee0b4f80b24b8665",
  /** The whole CIAA annual-report series. */
  ciaaReports: "https://jawafdehi.org/search?type=material&q=CIAA%20annual%20report",
  /** CIAA charge-sheet-filing announcements. */
  ciaaPressReleases: "https://jawafdehi.org/search?type=material&q=CIAA%20press%20release",
  /** AG abhiyog-patra (charge sheets). */
  chargeSheets: "https://jawafdehi.org/search?type=material&q=charge%20sheet",
  /** The Special Court record base. */
  courtRecords: "https://jawafdehi.org/courtcases",
  /** Live coverage counts. */
  dataQuality: "https://jawafdehi.org/data-quality",
  /** The reproducible pack this dashboard is built from. */
  researchPack: "https://github.com/Jawafdehi/corruption-research",
} as const;

/** Which material backs each funnel stage. */
export const FUNNEL_SOURCE: Record<string, keyof typeof CITATIONS> = {
  complaints: "ciaa35",
  investigated: "ciaa35",
  filed: "ciaa35",
  convicted: "courtRecords",
};

/**
 * Every figure the dashboard renders, derived from `dataset/` by `gen_site_data.py`.
 * Nothing here is hand-entered, so a number cannot drift from the data it describes —
 * regenerate rather than edit.
 */
export const REPORT = generated;

export type Report = typeof REPORT;

/** Derived: share (%) of a single outcome within a charge row. */
export function outcomePct(row: OutcomeCounts, key: keyof OutcomeCounts): number {
  const total = row.convicted + row.partial + row.acquitted;
  return total ? (row[key] / total) * 100 : 0;
}

export type VerdictYearRates = {
  year: number;
  /** Decided cases this year. */
  total: number;
  convPct: number;
  acqPct: number;
  partPct: number;
  /** Full-conviction rate on everything except fake-credential cases (%). */
  coreConvPct: number;
  /** Fake-credential share of the decided docket (%). */
  fakeSharePct: number;
};

/** Derived per-year rates powering the outcome-trend and decomposition charts. */
export function verdictYearRates(rows: readonly VerdictYearRow[]): VerdictYearRates[] {
  return rows.map((r) => {
    const total = r.convicted + r.partial + r.acquitted;
    const coreDisp = total - r.fakeDisp;
    const coreConv = r.convicted - r.fakeConv;
    return {
      year: r.fy,
      total,
      convPct: total ? (r.convicted / total) * 100 : 0,
      acqPct: total ? (r.acquitted / total) * 100 : 0,
      partPct: total ? (r.partial / total) * 100 : 0,
      coreConvPct: coreDisp ? (coreConv / coreDisp) * 100 : 0,
      fakeSharePct: total ? (r.fakeDisp / total) * 100 : 0,
    };
  });
}

/** Decided cases carrying a clean disposition — the conviction-rate denominator. */
export const decidedClean = (o: OutcomeCounts): number => o.convicted + o.partial + o.acquitted;
