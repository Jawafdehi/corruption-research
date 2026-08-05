# 27th CIAA Annual Report — FY 2073/74

Fiscal year **BS 2073/74** (AD 2016/17). Commission for the Investigation of Abuse of Authority (अख्तियार दुरुपयोग अनुसन्धान आयोग).

## Files

- `27th-annual-report-2073-74.pdf` — source PDF ([ciaa.gov.np](https://ciaa.gov.np/uploads/publicationsAndReports/4Gvb5l.pdf))
- `27th-annual-report-2073-74.likhit.md` — full-report Markdown via **likhit** (Nepali PDF→Markdown with legacy-font repair; recovers body text, headings, and ruled tables). 2,316 KB.
- `figures/` — chart data that likhit **cannot** convert (charts/graphs are images).
  - `figure_pages.json` — 12 candidate chart pages the detector found.
  - `pages/p*.png` — 300-DPI renders of those pages.
  - `figures.json` / `figures.md` — **14 charts** transcribed by a two-pass vision read (34 values estimated off-axis).

## Method

`likhit` is a text/font-extraction pipeline: it recovers prose and the ruled statistical **tables** as Markdown, but silently drops **chart/graph images** (bar, pie, line). Those charts encode numbers only as pixels, so they were rendered to PNG and transcribed by two independent vision reads, reconciled per value. See `../_tools/EXTRACT_SPEC.md`.

## Charts extracted

- **p20** (uncaptioned) — उजुरीको संख्या (stacked_bar, 14 points)
- **p21** (uncaptioned) — बढी उजुरी परेका क्षेत्रहरू (stacked_bar_horizontal, 30 points)
- **p22** (uncaptioned) — आ.व. २०७३/७४ मा प्रारम्भिक छानबिनबाट भएको कारबाही (pie, 3 points)
- **p23** (uncaptioned) — विगत ४ आ.व.मा दर्ता र फछ्यौंट भएका तथा बाँकी रहेका उजुरीको स्थिति (line, 12 points)
- **p24** (uncaptioned) — विस्तृत अनुसन्धानबाट भएको कारबाही (bar, 8 points)
- **p25** (uncaptioned) — विषयगत आधारमा मुद्दा दर्ताको संख्या (pie, 7 points)
- **p26** (uncaptioned) — विशेष अदालतबाट फैसला भएका भ्रष्टाचारसम्बन्धी मुद्दाहरूमा सफलताको प्रतिशत (line, 8 points)
- **p341** अनुसूची- ७ — आ.व.२०७३/७४ मा विशेष अदालतमा दायर भएका विभिन्न प्रकृतिका मुद्दाहरूको संख्या (pie, 7 points)
- **p341** अनुसूची- ८(क) — आ.व. २०७३/७४ मा विभिन्न प्रकृतिका मुद्दाहरूमा मागदाबी लिइएको बिगोको प्रतिशत (pie, 5 points)
- **p342** अनुसूची -८(ख) — विशेष अदालतबाट फैसला भएका भ्रष्टाचारसम्बन्धी मुद्दाहरूमा सफलताको प्रतिशत (line, 8 points)
- **p342** अनुसूची -८(ग) — आ.व.२०७३/७४ मा विस्तृत अनुसन्धानबाट भएको कारबाहीको विवरण (pie, 6 points)
- **p343** अनुसूची -९(क) — आ.व.२०७३/७४ मा प्रारम्भिक छानबिनबाट भएको कारबाहीको विवरण (pie, 4 points)
- **p343** अनुसूची -९(ख) — ५ वर्षको कुल उजुरी फछ्यौंटको प्रवृत्ति (bar_grouped, 15 points)
- **p344** अनुसूची -१० — विभिन्न आर्थिक वर्षहरूमा जम्मा उजुरी संख्या र फछ्यौंटको प्रवृत्ति (line, 24 points)
