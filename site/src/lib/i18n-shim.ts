// A minimal stand-in for `react-i18next`, aliased to that name in `vite.config.ts`
// and `tsconfig.json`.
//
// WHY the alias rather than plain English strings: these pages are written to be
// lifted into the jawafdehi.org SPA, which translates every string through
// `t("key", "English default")`. If this dashboard hardcoded its copy, the move
// would mean re-threading every string through `t()` by hand — the kind of
// mechanical edit that quietly drops a few. Instead the pages call the real API,
// and moving them means deleting the alias so the import resolves to the actual
// library. The keys are already correct and the English defaults become the
// fallbacks they already are.
//
// Only the surface the research pages use is implemented. English is the source
// language: it lives inline at each call site as the `t()` default, so a key with
// no Nepali entry renders English rather than a blank or a raw key.
//
// NOTE ON THE NEPALI LOCALE: `locales/ne.ts` is an UNREVIEWED first pass and is
// marked as such in the UI. See the header of that file before publishing.
//
// Deliberately subscription-based rather than context-based: real react-i18next
// re-renders consumers off its own singleton emitter, with no provider required.
// Matching that here means `useTranslation()` keeps working unchanged after the
// alias is deleted — no provider to add, nothing to unpick at the call sites.

import { useMemo, useSyncExternalStore } from "react";

import { ne } from "@/locales/ne";

export const LANGUAGES = ["en", "ne"] as const;
export type Language = (typeof LANGUAGES)[number];

/** Native names — a language picker that names languages in English helps nobody. */
export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  ne: "नेपाली",
};

const STORAGE_KEY = "jawafdehi.research.lang";

type Vars = Record<string, string | number>;

const CATALOGUES: Record<Language, Record<string, string>> = { en: {}, ne };

const isLanguage = (v: unknown): v is Language =>
  typeof v === "string" && (LANGUAGES as readonly string[]).includes(v);

/** Devanagari digits, matching the notebook's own `DEV` table in `corpus_data.py`. */
const DEVANAGARI = "०१२३४५६७८९";

/**
 * Western digits -> Devanagari. Applied to interpolated numbers (and to Nepali
 * copy that spells a number out) only when the active language is Nepali, so the
 * figures in a Nepali sentence read as Nepali. Percent and comma separators are
 * left alone — both are written the same way in Nepali-language reporting.
 */
export const toDevanagariDigits = (s: string): string =>
  s.replace(/[0-9]/g, (d) => DEVANAGARI[Number(d)]);

/** Replace `{{name}}` placeholders, leaving unknown ones visible rather than blank. */
function interpolate(template: string, vars: Vars | undefined, lng: Language): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    if (!(key in vars)) return match;
    const raw = String(vars[key]);
    return lng === "ne" ? toDevanagariDigits(raw) : raw;
  });
}

export type TFunction = (key: string, defaultValue?: string, vars?: Vars) => string;

/**
 * Look the key up in the active catalogue, falling back to the English default
 * supplied at the call site. English has no catalogue — its copy *is* the default
 * argument — so an `en` lookup always takes the fallback path.
 */
function translateWith(lng: Language): TFunction {
  const catalogue = CATALOGUES[lng];
  return (key, defaultValue, vars) =>
    interpolate(catalogue[key] ?? defaultValue ?? key, vars, lng);
}

// --- the store -------------------------------------------------------------

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(saved)) return saved;
  } catch {
    // Private browsing and blocked third-party storage both throw here. The
    // toggle still works for the session; only the preference is lost.
  }
  return "en";
}

let current: Language = readStoredLanguage();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => current;
/** The server/prerender snapshot. The stored preference is not readable there. */
const getServerSnapshot = (): Language => "en";

/**
 * Keep the document in step with the active language. `lang` drives font
 * selection, hyphenation and screen-reader pronunciation — a Devanagari page
 * still announced as English is read out wrong.
 */
function syncDocument(lng: Language) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lng;
}

syncDocument(current);

export const i18n = {
  get language(): Language {
    return current;
  },
  getFixedT: (lng?: string): TFunction => translateWith(isLanguage(lng) ? lng : current),
  changeLanguage: async (lng: string) => {
    if (!isLanguage(lng) || lng === current) return translateWith(current);
    current = lng;
    try {
      window.localStorage.setItem(STORAGE_KEY, lng);
    } catch {
      // See `readStoredLanguage` — a non-persisting toggle beats a throwing one.
    }
    syncDocument(lng);
    listeners.forEach((l) => l());
    return translateWith(lng);
  },
};

export function useTranslation() {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // Rebuilt per language so every consumer re-renders with the new catalogue.
  const t = useMemo(() => translateWith(language), [language]);
  return { t, i18n, language };
}
