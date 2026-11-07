import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { marked } from "marked";

import { Block, Eyebrow, Lede, SectionHeading } from "@/components/layout/Prose";

/**
 * The research report, rendered from the markdown in `../report/`. The markdown is the
 * source of record: each file is one part of the report, read in file-name order, and
 * the page adds nothing to it. Editing a finding means editing its file, so the site
 * and the written report cannot drift apart.
 *
 * The files are our own, committed in this repo, so rendering their HTML is safe.
 */
const FILES = import.meta.glob("../../../report/[0-9]*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

type Part = { slug: string; title: string; html: string };

const slugOf = (path: string) =>
  path
    .split("/")
    .pop()!
    .replace(/\.md$/, "")
    .replace(/^\d+-/, "");

function parts(): Part[] {
  return Object.keys(FILES)
    .sort()
    .map((path) => {
      const md = FILES[path];
      const title = md.match(/^#\s+(.+)$/m)?.[1] ?? slugOf(path);
      // Each part's own H1 becomes the section heading; the rest is rendered as is.
      const body = md.replace(/^#\s+.+$/m, "");
      return { slug: slugOf(path), title, html: marked.parse(body, { async: false }) as string };
    });
}

export default function Report() {
  const { t } = useTranslation();
  const list = useMemo(parts, []);

  return (
    <>
      <Block>
        <Eyebrow>{t("research.corruption.report.eyebrow", "The report")}</Eyebrow>
        <SectionHeading>{t("research.corruption.report.title", "Where accountability leaks")}</SectionHeading>
        <Lede>
          {t(
            "research.corruption.report.lede",
            "The full written findings, stage by stage, from a complaint to the CIAA to the money a court orders paid back. Each finding says what was measured, from which record, and what it cannot establish. Findings only: this report makes no recommendations.",
          )}
        </Lede>
        <nav aria-label={t("research.corruption.report.toc", "Contents")} className="mt-6">
          <ol className="list-decimal space-y-1 pl-6 text-sm text-foreground/80 md:text-base">
            {list.map((p) => (
              <li key={p.slug}>
                <a className="underline decoration-accent/50 underline-offset-2 hover:decoration-accent" href={`#${p.slug}`}>
                  {p.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Block>

      {list.map((p) => (
        <Block key={p.slug} id={p.slug}>
          <SectionHeading>{p.title}</SectionHeading>
          <div className="report-md" dangerouslySetInnerHTML={{ __html: p.html }} />
        </Block>
      ))}
    </>
  );
}
