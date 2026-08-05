# 25th CIAA Annual Report — FY 2071/72

Fiscal year **BS 2071/72** (AD 2014/15). Commission for the Investigation of Abuse of Authority (अख्तियार दुरुपयोग अनुसन्धान आयोग).

## Files

- `25th-annual-report-2071-72.pdf` — source PDF ([ciaa.gov.np](https://ciaa.gov.np/uploads/publicationsAndReports/eyIL96.pdf))
- `25th-annual-report-2071-72.md` — full-report Markdown via **markitdown**. This report's text layer is already clean Unicode Devanagari, so likhit's font-repair is a no-op and this output is text-equivalent; likhit's full pipeline hung on this born-digital PDF (>90 min), so plain markitdown was used. 2,622 KB.
- `figures/` — chart data that likhit **cannot** convert (charts/graphs are images).
  - `figure_pages.json` — 13 candidate chart pages the detector found.
  - `pages/p*.png` — 300-DPI renders of those pages.
  - `figures.json` / `figures.md` — **18 charts** transcribed by a two-pass vision read (13 values estimated off-axis).

## Method

`likhit` is a text/font-extraction pipeline: it recovers prose and the ruled statistical **tables** as Markdown, but silently drops **chart/graph images** (bar, pie, line). Those charts encode numbers only as pixels, so they were rendered to PNG and transcribed by two independent vision reads, reconciled per value. See `../_tools/EXTRACT_SPEC.md`.

## Charts extracted

- **p6** (uncaptioned) —  (bar, 5 points)
- **p6** (uncaptioned) — आयोगको क्षेत्रीय कार्यालयमा प्राप्त उजुरी र फछ्यौट (bar, 10 points)
- **p7** (uncaptioned) — विस्तृत अनुसन्धानपछि उजुरी फछ्यौट (pie, 8 points)
- **p8** (uncaptioned) — उजुरी दर्ता र फछ्यौटको प्रवृत्ति (line, 48 points)
- **p9** (uncaptioned) — बढी उजुरी परेका क्षेत्रहरु (bar, 18 points)
- **p9** (uncaptioned) —  (bar, 9 points)
- **p353** अनुसूची- ८(क) — आ.व. २०७१/७२ मा विशेष अदालतमा दायर भएका विभिन्न प्रकृतिका मुद्दाहरूको संख्या (pie, 7 points)
- **p353** अनुसूची- ८(ख) — आ.व. २०७१/७२ विशेष अदालतमा दायर भएका विभिन्न प्रकृतिका मुद्दाहरूमा मागदाबी लिइएको बिगो (रु. दस लाखमा) (pie, 6 points)
- **p354** अनुसूची- ८(ग) — आ.व २०७१/७२ मा विशेष अदालतमा दायर भएका मुद्दाहरूमा मागदाबी गरिएको बिगो (रु. दस लाखमा) (pie, 6 points)
- **p354** अनुसूची- ८(घ) — विशेष अदालतबाट फैसला भएका भ्रष्टाचारसम्बन्धी मुद्दामा सफलताको प्रतिशत (line, 6 points)
- **p355** अनुसूची- ९(क) — आ.व. २०७१/७२ मा प्रारम्भिक अनुसन्धानबाट भएको कारबाहीको विवरण (pie, 4 points)
- **p355** अनुसूची- ९(ख) — ३ वर्षको कुल उजुरी तथा कुल फछ्यौटको प्रवृत्ति (bar, 6 points)
- **p356** अनुसूची- ९(ग) — ३ वर्षको कुल उजुरी फछ्यौटको प्रवृत्ति (bar, 9 points)
- **p356** अनुसूची- ९(घ) — आ.व.अनुसार मुद्दा दायर संख्या (bar, 6 points)
- **p357** अनुसूची- ९(ङ) — बढी उजुरी परेका क्षेत्रहरू (bar, 18 points)
- **p357** अनुसूची- १० — आ.व. २०७१/७२ मा आयोगबाट विस्तृत अनुसन्धानतर्फ भएका निर्णय अनुसार कारबाहीको विवरण (pie, 7 points)
- **p358** अनुसूची- ११ — सामुदायिक शिक्षा कार्यक्रममा सहभागीहरूको संख्या (line, 8 points)
- **p359** अनुसूची- १२ — उजुरीको संख्या तथा फछ्यौट संख्याको प्रवृत्ति (line, 48 points)
