# 31st CIAA Annual Report — FY 2077/78

Fiscal year **BS 2077/78** (AD 2020/21). Commission for the Investigation of Abuse of Authority (अख्तियार दुरुपयोग अनुसन्धान आयोग).

## Files

- `31st-annual-report-2077-78.pdf` — source PDF ([ciaa.gov.np](https://ciaa.gov.np/uploads/publicationsAndReports/wbZQvp.pdf))
- `31st-annual-report-2077-78.md` — full-report Markdown via **markitdown**. This report's text layer is already clean Unicode Devanagari, so likhit's font-repair is a no-op and this output is text-equivalent; likhit's full pipeline hung on this born-digital PDF (>90 min), so plain markitdown was used. 2,302 KB.
- `figures/` — chart data that likhit **cannot** convert (charts/graphs are images).
  - `figure_pages.json` — 35 candidate chart pages the detector found.
  - `pages/p*.png` — 300-DPI renders of those pages.
  - `figures.json` / `figures.md` — **38 charts** transcribed by a two-pass vision read (49 values estimated off-axis).

## Method

`likhit` is a text/font-extraction pipeline: it recovers prose and the ruled statistical **tables** as Markdown, but silently drops **chart/graph images** (bar, pie, line). Those charts encode numbers only as pixels, so they were rendered to PNG and transcribed by two independent vision reads, reconciled per value. See `../_tools/EXTRACT_SPEC.md`.

## Charts extracted

- **p26** चित्र २.१ — अख्तियार दुरुपयोग अनुसन्धान आयोग, टंगाल र मातहत कार्यालयका उजुरी र फछ्यौटको स्थिति (bar, 18 points)
- **p27** चित्र २.२ — प्रदेशगत उजुरीको प्रतिशत (pie, 7 points)
- **p28** चित्र २.३(क) — तीन तहका सरकारका प्रदेशगत उजुरीको प्रवृत्ति (line, 21 points)
- **p28** चित्र २.३(ख) — तीन तहका सरकारका उजुरीको स्थिति (pie, 3 points)
- **p29** चित्र २.४ — प्रदेशगत उजुरीको प्रतिशत (pie, 7 points)
- **p30** चित्र २.५ — प्रदेशगत उजुरीको प्रतिशत (pie, 7 points)
- **p31** चित्र २.६ (क) — आर्थिक वर्ष ०७७/०७८ मा उजुरी परेका क्षेत्रहरूको स्थिति (bar, 12 points)
- **p31** चित्र २.६ (ख) — विगत ५ वर्षमा बढी उजुरी परेका क्षेत्रहरूको प्रवृत्ति (line, 15 points)
- **p32** चित्र २.७ — प्रारम्भिक छानबिनबाट फछ्यौट उजुरीको प्रतिशत (pie, 4 points)
- **p33** चित्र २.८ — विगत ५ आर्थिक वर्षमा उजुरी दर्ता, फछ्यौट र बाँकी उजुरीको प्रवृत्ति (line, 15 points)
- **p34** चित्र २.९ — विस्तृत अनुसन्धानबाट भएको कारबाही (pie, 6 points)
- **p35** चित्र २.१० — आयोगको बैठकबाट भएका निर्णयहरूको भेनचित्र (venn, 10 points)
- **p36** चित्र २.११ — विषयगत आधारमा मुद्दा दर्ताको प्रतिशत (pie, 7 points)
- **p75** चित्र २.१२ — विशेष अदालतबाट फैसला भएका भ्रष्टाचारसम्बन्धी मुद्दामा सफलताको प्रतिशत (line, 12 points)
- **p205** चित्र ५.२ — आर्थिक वर्ष ०७७।७८ मा घुस रिसवत मुद्दाका प्रतिवादीको क्षेत्रगत संख्या (bar, 6 points)
- **p206** चित्र ५.३ — राजस्व चुहावट मुद्दाका प्रतिवादीहरूको क्षेत्रगत विवरण (bar, 4 points)
- **p207** चित्र ५.४ — सार्वजनिक सम्पत्तिको हानि नोक्सानीसम्बन्धी मुद्दाका प्रतिवादीहरूको क्षेत्रगत विवरण (pie, 7 points)
- **p208** चित्र ५.५ — गैरकानुनी लाभ हानिसम्बन्धी मुद्दाका प्रतिवादीहरूको क्षेत्रगत विवरण (pie, 9 points)
- **p210** चित्र ५.६ — गैरकानुनी सम्पत्ति आर्जन मुद्दाका प्रतिवादीहरूको क्षेत्रगत विवरण (bar, 4 points)
- **p211** चित्र ५.७ — आर्थिक वर्ष २०७६।७७ मा दायर मुद्दाका किसिमका आधारमा प्रतिवादीहरूको पदगत विवरण (stacked_bar, 22 points)
- **p220** चित्र नं. ५.८ — मुद्दा दायर (line, 30 points)
- **p221** चित्र ५.९ — पुनरावेदन र पुनरावलोकनको संख्या (bar, 50 points)
- **p289** अनुसूची - ८(क) — आ.व. २०७७/७८ मा आयोगका महाशाखाका आधारमा उजुरी संख्या (bar, 9 points)
- **p289** अनुसूची - ८(ख) — आ.व. २०७७/७८ मा आयोगका कार्यालयका आधारमा उजुरी संख्या (bar, 8 points)
- **p290** अनुसूची - ८(ग) — भौगोलिक आधारमा प्रदेशगत उजुरी (bar, 7 points)
- **p290** अनुसूची - ८(घ) — संघीय निकायहरूको आधारमा प्रदेशगत उजुरी (bar, 7 points)
- **p291** अनुसूची - ८(ङ) — प्रदेश निकायहरूको आधारमा प्रदेशगत उजुरी (bar, 7 points)
- **p291** अनुसूची - ८(च) — स्थानीय निकायहरूको आधारमा प्रदेशगत उजुरी (bar, 7 points)
- **p292** अनुसूची - ८(छ) — तीन तहका सरकारका प्रदेशगत उजुरीको प्रवृत्ति (line, 21 points)
- **p292** अनुसूची - ९ — विभिन्न आर्थिक वर्षमा उजुरी दर्ता र फछ्यौटको प्रवृत्ति (line, 32 points)
- **p293** अनुसूची - १० — विगत ५ वर्षमा कुल उजुरीको फछ्यौट विवरणको प्रवृत्ति (line, 15 points)
- **p293** अनुसूची - ११ — आ.व. २०७७/७८ मा आयोगबाट निर्णय भई विशेष अदालतमा दायर भएका विभिन्न प्रकृतिका मुद्दा (bar, 7 points)
- **p294** अनुसूची - १२ — आ.व. २०७७/७८ मा आयोगबाट निर्णय भएका विभिन्न प्रकृतिका मुद्दाहरूमा मागदाबी लिइएको बिगोको प्रतिशत (pie, 7 points)
- **p294** अनुसूची - १३ — आ.व. २०७७/७८ मा विस्तृत अनुसन्धानबाट भएका कारबाहीको हिस्सा (pie, 6 points)
- **p295** अनुसूची - १४ — विगत ५ वर्षमा गैरकानुनी सम्पत्ति आर्जनसम्बन्धी मुद्दाको विवरण (line, 5 points)
- **p295** अनुसूची - १५ — विगत ५ वर्षमा नक्कली शैक्षिक योग्यतासम्बन्धी मुद्दाको विवरण (line, 5 points)
- **p296** अनुसूची - १६ — विगत ५ वर्षको घुस (रिसवत) सम्बन्धी मुद्दा र प्रतिवादीको प्रवृत्ति (line, 10 points)
- **p296** अनुसूची - १७ — विगत १९ वर्षमा मुद्दा दायर र प्रतिवादीको प्रवृत्ति (line, 38 points)
