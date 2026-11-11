import { useTranslation } from "react-i18next";

import { Block, Body, Eyebrow, Lede, SectionHeading } from "@/components/layout/Prose";

/**
 * The site's own privacy note (damo, 10 November; Google Analytics from 11 November): what is
 * collected, what the browser keeps,
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
        <SectionHeading>{t("research.corruption.privacy.title", "What this site collects")}</SectionHeading>
        <Lede>
          {t(
            "research.corruption.privacy.lede",
            "It has no advertising, no sign-in and no forms. We use Google Analytics to count page views and clicks, so Google receives your IP address and browser details. We don't sell or share anything else. The site's own files, the fonts included, come from Jawafdehi's own servers.",
          )}
        </Lede>
      </Block>

      <Block>
        <SectionHeading>{t("research.corruption.privacy.storedTitle", "What your browser keeps")}</SectionHeading>
        <Body>
          {t(
            "research.corruption.privacy.stored",
            "Three small settings, in your browser's own storage, never sent to us: your language (English or Nepali), the view you chose on the home page (funnel or pipeline), and whether you have already tapped a card, so that the hint is not shown again. Google Analytics also sets its own cookies (_ga) to tell repeat visits apart. Clearing your browser's data for this site removes them.",
          )}
        </Body>
      </Block>

      <Block>
        <SectionHeading>{t("research.corruption.privacy.hostTitle", "Hosting")}</SectionHeading>
        <Body>
          {t(
            "research.corruption.privacy.host",
            "The site is served by Cloudflare. Like any web host, Cloudflare uses your IP address and browser details to deliver the pages and to protect the site from attacks. If a page fails to load, your browser may send Cloudflare a short error report. No code of ours runs on the server, and apart from Google Analytics we add no logging of our own.",
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
