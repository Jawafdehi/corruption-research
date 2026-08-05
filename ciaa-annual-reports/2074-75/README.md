# 28th CIAA Annual Report — FY 2074/75

Fiscal year **BS 2074/75** (AD 2017/18). Commission for the Investigation of Abuse of Authority (अख्तियार दुरुपयोग अनुसन्धान आयोग).

## Files

- `28th-annual-report-2074-75.pdf` — source PDF ([ciaa.gov.np](https://ciaa.gov.np/uploads/publicationsAndReports/1548567688annual_report_207475.pdf))
- `28th-annual-report-2074-75.likhit.md` — full-report Markdown via **likhit** (Nepali PDF→Markdown with legacy-font repair; recovers body text, headings, and ruled tables). 1,960 KB.
- `figures/` — chart data that likhit **cannot** convert (charts/graphs are images).
  - `figure_pages.json` — 23 candidate chart pages the detector found.
  - `pages/p*.png` — 300-DPI renders of those pages.
  - `figures.json` / `figures.md` — **19 charts** transcribed by a two-pass vision read (8 values estimated off-axis).

## Method

`likhit` is a text/font-extraction pipeline: it recovers prose and the ruled statistical **tables** as Markdown, but silently drops **chart/graph images** (bar, pie, line). Those charts encode numbers only as pixels, so they were rendered to PNG and transcribed by two independent vision reads, reconciled per value. See `../_tools/EXTRACT_SPEC.md`.

## Charts extracted

- **p18** (uncaptioned) — उजुरीको संख्या (bar, 12 points)
- **p19** (uncaptioned) — उजुरी/सूचनाका माध्यमहरू (pie, 6 points)
- **p20** (uncaptioned) — बढी उजुरी परेका क्षेत्रहरू (bar, 30 points)
- **p21** (uncaptioned) — आ.व. २०७४/७५ मा प्रारम्भिक छानबिनबाट भएको कारबाही (pie, 4 points)
- **p21** (uncaptioned) — विगत पाँच आ.व. मा दर्ता फछ्यौट र बाँकी भएका उजुरी (line, 15 points)
- **p22** (uncaptioned) — विस्तृत अनुसन्धानबाट भएको कारबाही (pie, 6 points)
- **p23** (uncaptioned) — विषयगत आधारमा मुद्दा दर्ताको संख्या (pie, 7 points)
- **p24** (uncaptioned) — विशेष अदालतबाट फैसला प्राप्त भएका भ्रष्टाचार सम्बन्धी मुद्दामा सफलताको प्रतिशत (line, 9 points)
- **p190** (uncaptioned) — उजुरी दर्ताको संख्या (bar, 3 points)
- **p190** (uncaptioned) — मुद्दाको संख्या (bar, 3 points)
- **p191** (uncaptioned) — रिसवत सम्बन्धी मुद्दाहरू (bar, 14 points)
- **p193** (uncaptioned) — झुठा विवरण (शैक्षिक योग्यताको नक्कली प्रमाणपत्र, नागरिकता, सिफारिसपत्र) पेश गर्ने कर्मचारीहरू (bar, 5 points)
- **p243** अनुसूची-६ — आ.व. ०७४/७५ मा प्रारम्भिक छानबिनबाट भएको कारबाही (pie, 4 points)
- **p243** अनुसूची-७ — विगत ५ वर्षको कुल उजुरी र फछ्यौंटको प्रवृत्ति (bar, 15 points)
- **p244** अनुसूची-८ — विभिन्न आर्थिक वर्षहरूमा उजुरी दर्ता तथा फछ्यौंटको प्रवृत्ति (bar, 26 points)
- **p247** अनुसूची-१० — विषयगत आधारमा मुद्दा दर्ताको संख्या (pie, 7 points)
- **p247** अनुसूची-११ — आ.व. २०७४/७५ मा आयोगबाट निर्णय भएका विभिन्न प्रकृतिका मुद्दाहरूमा माँग दाबी लिइएको बिगोको प्रतिशत (pie, 6 points)
- **p248** अनुसूची-१२ — विशेष अदालतबाट फैसला प्राप्त भएका भ्रष्टाचार सम्बन्धी मुद्दामा सफलताको प्रतिशत (line, 9 points)
- **p248** अनुसूची-१३ — विस्तृत अनुसन्धानबाट भएको कारबाही (bar, 6 points)
