import { useTranslation } from "react-i18next";

import { Block, Body, Eyebrow, Lede, SectionHeading } from "@/components/layout/Prose";

/**
 * The site's own privacy note (damo, 10 November): no tracking, what the browser keeps,
 * and a contact. Every sentence here is a claim about the build and its hosting, checked in
 * work/2026-11-08-research-site-design/PRIVACY.md; change the two together.
 */
export default function Privacy() {
  const { t } = useTranslation();
  const link = "underline underline-offset-2 hover:text-foreground";

  return (
    <>
      <Block>
        <Eyebrow>{t("research.corruption.privacy.eyebrow", "Privacy")}</Eyebrow>
        <SectionHeading>{t("research.corruption.privacy.title", "This site does not track you")}</SectionHeading>
        <Lede>
          {t(
            "research.corruption.privacy.lede",
            "It sets no cookies. It has no analytics, no advertising, no sign-in and no forms. Every file it loads, the fonts included, comes from research.jawafdehi.org itself, so reading it connects your browser to no other company.",
          )}
        </Lede>
      </Block>

      <Block>
        <SectionHeading>{t("research.corruption.privacy.storedTitle", "What your browser keeps")}</SectionHeading>
        <Body>
          {t(
            "research.corruption.privacy.stored",
            "Three small settings, in your browser's own storage, never sent to us: your language (English or Nepali), the view you chose on the home page (funnel or pipeline), and whether you have already tapped a card, so that the hint is not shown again. Clearing your browser's data for this site removes them.",
          )}
        </Body>
      </Block>

      <Block>
        <SectionHeading>{t("research.corruption.privacy.hostTitle", "Hosting")}</SectionHeading>
        <Body>
          {t(
            "research.corruption.privacy.host",
            "The site is served by Cloudflare. Like any web host, Cloudflare uses your IP address and browser details to deliver the pages and to protect the site from attacks. If a page fails to load, your browser may send Cloudflare a short error report. No code of ours runs on the server, and we add no logging of our own.",
          )}
        </Body>
      </Block>

      <Block>
        <SectionHeading>{t("research.corruption.privacy.peopleTitle", "The people in the records")}</SectionHeading>
        <Body>
          {t(
            "research.corruption.privacy.people",
            "This site counts cases, not people. It does not name any defendant, complainant, witness or judge.",
          )}
        </Body>
        <Body>
          {t(
            "research.corruption.privacy.links",
            "The sources link to public documents on other sites: the CIAA, the Supreme Court, Nepal Kanoon Patrika and jawafdehi.org. When you open one, that site's own privacy policy applies.",
          )}
        </Body>
      </Block>

      <Block>
        <SectionHeading>{t("research.corruption.privacy.contactTitle", "Full policy and contact")}</SectionHeading>
        <Body>
          {t(
            "research.corruption.privacy.contact",
            "This site is covered by Jawafdehi Initiative's privacy policy. For questions or requests, write to us.",
          )}{" "}
          <a className={link} href="https://jawafdehi.org/privacy">
            jawafdehi.org/privacy
          </a>{" "}
          ·{" "}
          <a className={link} href="mailto:privacy@jawafdehi.org">
            privacy@jawafdehi.org
          </a>
        </Body>
      </Block>
    </>
  );
}
