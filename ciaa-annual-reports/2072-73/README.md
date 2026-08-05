# 26th CIAA Annual Report — FY 2072/73

Fiscal year **BS 2072/73** (AD 2015/16). Commission for the Investigation of Abuse of Authority (अख्तियार दुरुपयोग अनुसन्धान आयोग).

## Files

- `26th-annual-report-2072-73.pdf` — source PDF ([ciaa.gov.np](https://ciaa.gov.np/uploads/publicationsAndReports/150079060226th_yearly_report_final_2073.pdf))
- `26th-annual-report-2072-73.likhit.md` — full-report Markdown via **likhit** (Nepali PDF→Markdown with legacy-font repair; recovers body text, headings, and ruled tables). 2,161 KB.
- `figures/` — chart data that likhit **cannot** convert (charts/graphs are images).
  - `figure_pages.json` — 12 candidate chart pages the detector found.
  - `pages/p*.png` — 300-DPI renders of those pages.
  - `figures.json` / `figures.md` — **13 charts** transcribed by a two-pass vision read (0 values estimated off-axis).

## Method

`likhit` is a text/font-extraction pipeline: it recovers prose and the ruled statistical **tables** as Markdown, but silently drops **chart/graph images** (bar, pie, line). Those charts encode numbers only as pixels, so they were rendered to PNG and transcribed by two independent vision reads, reconciled per value. See `../_tools/EXTRACT_SPEC.md`.

## Charts extracted

- **p7** (uncaptioned) — बढी उजुरी परेका क्षेत्रहरू (bar, 24 points)
- **p8** (uncaptioned) — आ.व.२०७२/७३ मा प्रारम्भिक अनुसन्धानबाट भएको कारबाही (pie, 4 points)
- **p9** (uncaptioned) — विस्तृत अनुसन्धानबाट भएको कारबाही (pie, 6 points)
- **p9** (uncaptioned) — विषयगत आधारमा मुद्दा दर्ताको संख्या (pie, 7 points)
- **p10** (uncaptioned) — विभिन्न आर्थिक वर्षहरूमा उजुरी दर्ता तथा फछ्यौंटको प्रवृत्ति (line, 22 points)
- **p12** (uncaptioned) — सामुदायिक शिक्षा कार्यक्रममा सहभागी संख्या (line, 9 points)
- **p358** अनुसूची- ७ — आ.व.२०७२/७३ मा विशेष अदालतमा दायर भएका विभिन्न प्रकृतिका मुद्दाहरूको संख्या (pie, 7 points)
- **p358** अनुसूची- ८(क) — मागदाबी लिइएको कुल बिगोमा अनुसन्धानको क्षेत्र अनुसारको अंश (pie, 5 points)
- **p359** अनुसूची -८(ख) — विशेष अदालतबाट फैसला भएका भ्रष्टाचारसम्बन्धी मुद्दाहरूमा सफलताको प्रतिशत (line, 7 points)
- **p359** अनुसूची -८(ग) — विस्तृत अनुसन्धानबाट भएको कारबाही (pie, 6 points)
- **p360** अनुसूची -९(क) — आ.व.२०७२/७३ मा प्रारम्भिक छानबिनबाट भएको कारबाहीको विवरण (pie, 4 points)
- **p360** अनुसूची -९(ख) — विगत ४ वर्षको कुल उजुरी फछ्यौंटको प्रवृत्ति (bar, 12 points)
- **p361** अनुसूची -१० — विभिन्न आर्थिक वर्षहरूमा उजुरी दर्ता भएको संख्या र फछ्यौंटको प्रवृत्ति (line, 22 points)
