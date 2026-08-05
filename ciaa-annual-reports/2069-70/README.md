# 23rd CIAA Annual Report — FY 2069/70

Fiscal year **BS 2069/70** (AD 2012/13). Commission for the Investigation of Abuse of Authority (अख्तियार दुरुपयोग अनुसन्धान आयोग).

## Files

- `23rd-annual-report-2069-70.pdf` — source PDF ([ciaa.gov.np](https://ciaa.gov.np/uploads/publicationsAndReports/sklz3p.pdf))
- `23rd-annual-report-2069-70.likhit.md` — full-report Markdown via **likhit** (Nepali PDF→Markdown with legacy-font repair; recovers body text, headings, and ruled tables). 3,813 KB.
- `figures/` — chart data that likhit **cannot** convert (charts/graphs are images).
  - `figure_pages.json` — 14 candidate chart pages the detector found.
  - `pages/p*.png` — 300-DPI renders of those pages.
  - `figures.json` / `figures.md` — **12 charts** transcribed by a two-pass vision read (7 values estimated off-axis).

## Method

`likhit` is a text/font-extraction pipeline: it recovers prose and the ruled statistical **tables** as Markdown, but silently drops **chart/graph images** (bar, pie, line). Those charts encode numbers only as pixels, so they were rendered to PNG and transcribed by two independent vision reads, reconciled per value. See `../_tools/EXTRACT_SPEC.md`.

## Charts extracted

- **p527** अनुसूची - ५ — आ.व.२०५७/५८ देखि २०६९/७० सम्म दायर भएका नक्कली प्रमाणपत्रसम्बन्धी मुद्दामा सो प्रमाणपत्रको प्रयोजन (pie, 2 points)
- **p528** अनुसूची - ६ (क) — आ.व. २०५७/५८ देखि २०६९/७० मा नक्कली प्रमाणपत्र सम्बन्धी मुद्दाको फैसला विवरण (bar, 18 points)
- **p528** अनुसूची - ६ (ख) — आ.व. २०५७/५८ देखि २०६९/७० सम्ममा शैक्षिक प्रमाणपत्र सम्बन्धी मुद्दाहरूमा सफल असफल अनुपात (pie, 2 points)
- **p534** अनुसूची - ९ — आ.व. २०६९।७० मा परेका उजुरी र फछ्यौँटको विवरण (bar, 3 points)
- **p535** अनुसूची - १० — आ.व.२०६९/७० मा कुल उजुरी ११२९८ मध्ये फछ्यौँट तथा चालू आ.व.मा सरेको जिम्मेवारीको अनुपात (pie, 2 points)
- **p536** अनुसूची - ११ — आ.व. २०५८/५९ देखि २०६९/७० सम्मको कुल उजुरी र फछ्यौटको विवरण (bar, 24 points)
- **p537** अनुसूची - १२ — आ.व. ०६९।७० मा मुद्दा जित हारको स्थिति (pie, 2 points)
- **p538** अनुसूची - १३ — आ.व. ०६९।७० को अभियोजन र अन्य कारवाहीहरूको विवरण (pie, 10 points)
- **p539** अनुसूची - १४ — आ.व.०६९।७० मा विशेष अदालतमा दायर भएका मुद्दाहरूको किसिम (pie, 7 points)
- **p540** अनुसूची - १५ — आ.व. २०५८/५९ देखि ०६९/७० सम्मको कारवाहीको तुलनात्मक विवरण (bar, 48 points)
- **p541** अनुसूची - १६ — आ.व. २०५९।६० देखि आ.व. ०६९।७० सम्मको बैठक र निर्णय संख्या (line, 20 points)
- **p542** अनुसूची - १७ — आ.व. २०४८/४९ देखि आ.व. २०६९/७० सम्ममा परेका उजुरी र फछ्यौटको विवरण (line, 42 points)
