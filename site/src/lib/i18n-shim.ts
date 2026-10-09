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
// Only the surface the research pages use is implemented. This dashboard is
// English-only, matching the standing exception for the research route (its Nepali
// copy is an unreviewed first pass).

type Vars = Record<string, string | number>;

/** Replace `{{name}}` placeholders, leaving unknown ones visible rather than blank. */
function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

export type TFunction = (key: string, defaultValue?: string, vars?: Vars) => string;

/**
 * Resolves to the English default supplied at the call site. The key is accepted and
 * ignored — it exists so the strings are already keyed when these pages move into the
 * main SPA's locale files.
 */
const translate: TFunction = (key, defaultValue, vars) =>
  interpolate(defaultValue ?? key, vars);

export const i18n = {
  language: "en",
  getFixedT: (_lng?: string): TFunction => translate,
  changeLanguage: async (_lng: string) => translate,
};

export function useTranslation() {
  return { t: translate, i18n };
}
