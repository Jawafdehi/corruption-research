# 30th CIAA Annual Report — FY 2076/77

Fiscal year **BS 2076/77** (AD 2019/20). Commission for the Investigation of Abuse of Authority (अख्तियार दुरुपयोग अनुसन्धान आयोग).

## Files

- `30th-annual-report-2076-77.pdf` — source PDF ([ciaa.gov.np](https://ciaa.gov.np/uploads/publicationsAndReports/UOJL53.pdf))
- `30th-annual-report-2076-77.md` — full-report Markdown via **markitdown**. This report's text layer is already clean Unicode Devanagari, so likhit's font-repair is a no-op and this output is text-equivalent; likhit's full pipeline hung on this born-digital PDF (>90 min), so plain markitdown was used. 3,103 KB.
- `figures/` — chart data that likhit **cannot** convert (charts/graphs are images).
  - `figure_pages.json` — 34 candidate chart pages the detector found.
  - `pages/p*.png` — 300-DPI renders of those pages.
  - `figures.json` / `figures.md` — **40 charts** transcribed by a two-pass vision read (134 values estimated off-axis).

## Method

`likhit` is a text/font-extraction pipeline: it recovers prose and the ruled statistical **tables** as Markdown, but silently drops **chart/graph images** (bar, pie, line). Those charts encode numbers only as pixels, so they were rendered to PNG and transcribed by two independent vision reads, reconciled per value. See `../_tools/EXTRACT_SPEC.md`.

## Charts extracted

- **p23** चित्र २.१ — आयोगमा रहेका उजुरीको संख्यात्मक स्थिति (grouped bar, 18 points)
- **p24** चित्र २.२ — प्रदेशगत जम्मा उजुरीको प्रतिशत (pie, 7 points)
- **p25** चित्र २.३ — प्रदेशगत उजुरीको प्रतिशत (प्रदेश र स्थानीय सरकारविरुद्ध परेका उजुरी) (pie, 7 points)
- **p26** चित्र २.४ — प्रदेशगत उजुरीको प्रतिशत (संघीय सरकारविरुद्ध परेका उजुरी) (pie, 7 points)
- **p27** चित्र २.५ — तीन तहका सरकारका प्रदेशगत उजुरीको प्रवृत्ति (line, 21 points)
- **p28** चित्र २.६ (क) — आ.व. २०७६/७७ मा उजुरी परेका क्षेत्रहरूको स्थिति (bar, 12 points)
- **p28** चित्र २.६ (ख) — विगत ५ वर्षमा बढी उजुरी परेका क्षेत्रहरूको प्रवृत्ति (line, 15 points)
- **p29** चित्र २.७ — प्रारम्भिक छानबिनबाट फछ्यौट उजुरीको प्रतिशत (pie, 4 points)
- **p30** चित्र २.८ — विगत ५ आर्थिक वर्षमा उजुरी दर्ता, फछ्यौट र बाँकी उजुरीको प्रवृत्ति (line, 15 points)
- **p31** चित्र २.६ — विस्तृत अनुसन्धानबाट भएको कारबाही (pie, 6 points)
- **p32** चित्र २.७ — आयोगको बैठकबाट भएका निर्णयहरूको भेन चित्र (venn diagram, 12 points)
- **p33** चित्र २.८ — विषयगत आधारमा मुद्दा दर्ताको प्रतिशत (pie, 7 points)
- **p170** चित्र २.९ — विशेष अदालतबाट प्राप्त भ्रष्टाचारसम्बन्धी मुद्दामा सफलताको प्रतिशत (line, 11 points)
- **p271** चित्र ५.१ — विगत पाँच वर्षमा मुद्दा दर्ताको प्रवृत्ति (bar, 5 points)
- **p273** चित्र ५.२ — आर्थिक वर्ष २०७६।७७ मा घुस रिसवत मुद्दाका प्रतिवादीको क्षेत्रगत संख्या (bar, 6 points)
- **p275** चित्र ५.३ — राजस्व चुहावट मुद्दाका प्रतिवादीहरूको क्षेत्रगत विवरण (bar, 8 points)
- **p276** चित्र ५.४ — सार्वजनिक सम्पत्तिको हानि नोक्सानीसम्बन्धी मुद्दाको क्षेत्रगत विवरण (pie, 16 points)
- **p278** चित्र ५.५ — गैरकानूनी लाभ हानिसम्बन्धी मुद्दाको क्षेत्रगत विवरण (pie, 7 points)
- **p281** चित्र ५.८ — गैरकानूनी सम्पत्ति आर्जन मुद्दाका प्रतिवादीहरूको क्षेत्रगत विवरण (bar, 8 points)
- **p283** चित्र ५.९ — आर्थिक वर्ष २०७६।७७ मा दायर मुद्दाका किसिमका आधारमा प्रतिवादीहरूको पदगत विवरण (stacked_bar, 31 points)
- **p290** (uncaptioned) — आयोग स्थापनादेखि हालसम्मको मुद्दा दायरको प्रवृत्ति (line, 30 points)
- **p292** चित्र ५.१० — पुनरावेदन र पुनरावलोकनको संख्या (bar, 32 points)
- **p356** अनुसूची - ८(क) — आ.व. २०७६/७७ मा आयोगका महाशाखाका आधारमा उजुरी संख्या (bar, 10 points)
- **p356** अनुसूची - ८(ख) — आ.व. २०७५/७६ मा आयोगका मातहत कार्यालयका आधारमा उजुरी संख्या (bar, 8 points)
- **p357** अनुसूची - ८(ग) — भौगोलिक आधारमा प्रदेशगत उजुरी (bar, 7 points)
- **p357** अनुसूची - ८(घ) — संघीय निकायहरूको आधारमा प्रदेशगत उजुरी (bar, 7 points)
- **p358** अनुसूची - ८(ङ) — प्रदेश निकायहरूको आधारमा प्रदेशगत उजुरी (bar, 7 points)
- **p358** अनुसूची - ८(च) — स्थानीय निकायहरूको आधारमा प्रदेशगत उजुरी (bar, 7 points)
- **p359** अनुसूची - ८(छ) — तीन तहका सरकारका प्रदेशगत उजुरीको प्रवृत्ति (line, 21 points)
- **p359** अनुसूची - ९ — आ.व. २०७६/७७ मा प्रारम्भिक छानबिनबाट भएका कारबाहीको विवरण (pie, 4 points)
- **p360** अनुसूची - १० — विभिन्न आर्थिक वर्षमा उजुरी दर्ता र फछ्यौटको प्रवृत्ति (line, 30 points)
- **p360** अनुसूची - ११ — विगत ५ वर्षमा कुल उजुरी फछ्यौटको प्रवृत्ति (line, 15 points)
- **p361** अनुसूची - १२ — आ.व. २०७६/७७ मा आयोगबाट निर्णय भई विशेष अदालतमा दायर भएका विभिन्न प्रकृतिका मुद्दा (bar, 7 points)
- **p361** अनुसूची - १३ — आ.व. २०७६/७७ मा आयोगबाट निर्णय भएका विभिन्न प्रकृतिका मुद्दाहरूमा मागदाबी लिइएको बिगोको प्रतिशत (pie, 7 points)
- **p362** अनुसूची - १४ — आ.व. २०७६/७७ मा विस्तृत अनुसन्धानबाट भएका कारबाहीको हिस्सा (pie, 6 points)
- **p362** अनुसूची - १५ — विशेष अदालतबाट फैसला भएका भ्रष्टाचारसम्बन्धी मुद्दाहरूमा सफलताको प्रतिशत (line, 11 points)
- **p363** अनुसूची - १६ — विगत ५ वर्षमा गैरकानूनी सम्पत्ति आर्जनसम्बन्धी मुद्दाको विवरण (line, 5 points)
- **p363** अनुसूची - १७ — विगत ५ वर्षमा नक्कली शैक्षिक योग्यतासम्बन्धी मुद्दाको विवरण (line, 5 points)
- **p364** अनुसूची - १८ — विगत ५ वर्षको घुस (रिसवत) सम्बन्धी मुद्दा र प्रतिवादीको प्रवृत्ति (line, 10 points)
- **p364** अनुसूची - १९ — विगत १८ वर्षमा मुद्दा दायर र प्रतिवादीको प्रवृत्ति (line, 36 points)
