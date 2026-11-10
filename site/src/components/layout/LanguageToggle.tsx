import { LANGUAGES, LANGUAGE_LABELS, useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

/**
 * A two-option segmented control rather than a switch. A switch has an implicit
 * on/off direction and only labels one state — fine for a setting, wrong for a
 * pair of languages where neither is "off" and a reader needs to see the option
 * they are not currently in, written in its own script.
 */
export function LanguageToggle() {
  const { t, i18n, language } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <div
        role="group"
        aria-label={t("research.corruption.lang.aria", "Language")}
        className="inline-flex rounded-md border border-border bg-background p-0.5"
      >
        {LANGUAGES.map((lng) => {
          const active = lng === language;
          return (
            <button
              key={lng}
              type="button"
              // `lang` on the button itself so each label is announced in its own
              // language even while the page is in the other one.
              lang={lng}
              aria-pressed={active}
              onClick={() => void i18n.changeLanguage(lng)}
              className={cn(
                // 44 px tall: a full tap target on a phone, as on the home page.
                "min-h-[44px] rounded px-3 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {LANGUAGE_LABELS[lng]}
            </button>
          );
        })}
      </div>

      {/*
        The Nepali copy has not been through a native-speaker review, and a reader
        cannot tell a reviewed translation from an unreviewed one by looking at it.
        Saying so is the honest option while that remains true — delete this once
        `locales/ne.ts` has been cleared.
      */}
      {language === "ne" && (
        <span
          title={t(
            "research.corruption.lang.unreviewedTitle",
            "This Nepali translation is an unreviewed machine-authored first pass. The figures are counted from the court record and do not change with the language.",
          )}
          className="whitespace-nowrap rounded border border-border px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
        >
          {t("research.corruption.lang.unreviewed", "unreviewed translation")}
        </span>
      )}
    </div>
  );
}

/**
 * The "unreviewed translation" note, on its own line under the site header in Nepali mode
 * (the header itself is shared with the home page and carries no page-specific badges).
 */
export function UnreviewedBadge() {
  const { t, language } = useTranslation();
  if (language !== "ne") return null;
  return (
    <div className="border-b border-border bg-[hsl(var(--surface))]">
      <div className="container px-4 py-1.5 md:px-6">
        <span
          title={t(
            "research.corruption.lang.unreviewedTitle",
            "This Nepali translation is an unreviewed machine-authored first pass. The figures are counted from the court record and do not change with the language.",
          )}
          className="rounded border border-border px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
        >
          {t("research.corruption.lang.unreviewed", "unreviewed translation")}
        </span>
      </div>
    </div>
  );
}
