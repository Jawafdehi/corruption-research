# 29th CIAA Annual Report — FY 2075/76

Fiscal year **BS 2075/76** (AD 2018/19). Commission for the Investigation of Abuse of Authority (अख्तियार दुरुपयोग अनुसन्धान आयोग).

## Files

- `29th-annual-report-2075-76.pdf` — source PDF ([ciaa.gov.np](https://ciaa.gov.np/uploads/publicationsAndReports/vwdQnx.pdf))
- `29th-annual-report-2075-76.likhit.md` — full-report Markdown via **likhit** (Nepali PDF→Markdown with legacy-font repair; recovers body text, headings, and ruled tables). 2,233 KB.
- `figures/` — chart data that likhit **cannot** convert (charts/graphs are images).
  - `figure_pages.json` — 27 candidate chart pages the detector found.
  - `pages/p*.png` — 300-DPI renders of those pages.
  - `figures.json` / `figures.md` — **31 charts** transcribed by a two-pass vision read (56 values estimated off-axis).

## Method

`likhit` is a text/font-extraction pipeline: it recovers prose and the ruled statistical **tables** as Markdown, but silently drops **chart/graph images** (bar, pie, line). Those charts encode numbers only as pixels, so they were rendered to PNG and transcribed by two independent vision reads, reconciled per value. See `../_tools/EXTRACT_SPEC.md`.

## Charts extracted

- **p22** चित्र २.१ — आयोगमा रहेका उजुरीको संख्या (bar, 18 points)
- **p23** चित्र २.२ — प्रदेशगत उजुरीको प्रतिशत (pie, 7 points)
- **p24** चित्र २.३ — बढी उजुरी परेका क्षेत्रहरू (bar, 15 points)
- **p25** चित्र २.४ — प्रारम्भिक छानबिनबाट फछ्यौंट उजुरीको प्रतिशत (pie, 4 points)
- **p26** चित्र २.५ — विगत ५ वर्षमा उजुरी दर्ता र फछ्यौंटको प्रवृत्ति (line, 15 points)
- **p27** चित्र २.६ — विस्तृत अनुसन्धानबाट भएको कारबाही (pie, 6 points)
- **p28** चित्र २.७ — आयोगको बैठकबाट भएका निर्णयहरूको विवरण (venn, 11 points)
- **p29** चित्र २.८ — विषयगत आधारमा मुद्दा दर्ताको प्रतिशत (pie, 7 points)
- **p126** चित्र २.९ — विशेष अदालतबाट प्राप्त भ्रष्टाचारसम्बन्धी मुद्दामा सफलताको प्रतिशत (line, 17 points)
- **p248** चित्र ५.१ — विगत चार वर्षमा मुद्दा दर्ताको प्रवृत्ति (bar, 4 points)
- **p250** चित्र ५.२ — आर्थिक वर्ष २०७५।७६ मा रिसवतसम्बन्धी मुद्दाको क्षेत्रगत संख्या (pie, 13 points)
- **p251** चित्र ५.३ — आर्थिक वर्ष २०७५।७६ मा राजस्व हिनामिनासम्बन्धी मुद्दा र प्रतिवादीको संख्या (bar, 6 points)
- **p254** चित्र ५.७ — गैरकानूनी लाभ हानिसम्बन्धी मुद्दाका प्रतिवादीको संख्या (bar, 4 points)
- **p258** चित्र ५.१० — आर्थिक वर्ष २०७५।७६ मा दायर मुद्दामा प्रतिवादीको संख्यात्मक विवरण (stacked_bar_3d, 28 points)
- **p264** चित्र ५.११ — आ.व. २०५९/६० देखि २०६८/६९ सम्मका विभिन्न विषयका मुद्दाको संख्या (line, 70 points)
- **p265** चित्र ५.१२ — आ.व. २०६९/७० देखि २०७५/७६ सम्मका विभिन्न विषयका मुद्दाको संख्या (line, 49 points)
- **p266** चित्र ५.१३ — आयोग स्थापनादेखि हालसम्मको मुद्दा दर्ताको प्रवृत्ति (line, 29 points)
- **p267** चित्र ५.१४ — अदालतबाट प्राप्त फैसलामा सफलता दर (line, 17 points)
- **p268** चित्र ५.१५ — पुनरावेदन र पुनरावलोकनको संख्या (bar_horizontal, 46 points)
- **p316** अनुसूची - ७ — आ.व. २०७५/७६ मा आयोगका महाशाखाका आधारमा उजुरी संख्या (bar_3d, 10 points)
- **p316** अनुसूची - ८ — आ.व.२०७५/७६ मा आयोगका मातहत कार्यालयका आधारमा उजुरी संख्या (bar_3d, 8 points)
- **p317** अनुसूची - ९ — प्रदेशअनुसार उजुरीको संख्या (pie_3d, 7 points)
- **p317** अनुसूची - १० — आ.व. २०७५/७६ मा प्रारम्भिक छानबिनबाट भएका कारबाहीको विवरण (pie_3d, 4 points)
- **p318** अनुसूची - ११ — विगत ५ वर्षमा कुल उजुरी फछ्यौंटको प्रवृत्ति (bar_grouped, 15 points)
- **p318** अनुसूची - १२ — विभिन्न आर्थिक वर्षमा उजुरी दर्ता र फछ्यौंटको प्रवृत्ति (bar_grouped_3d, 28 points)
- **p319** अनुसूची - १३ — आ.व. २०७५/७६ मा आयोगबाट निर्णय भई विशेष अदालतमा दायर भएका विभिन्न प्रकृतिका मुद्दाहरूको संख्या (pie_3d, 7 points)
- **p319** अनुसूची - १४ — आ.व. २०७५/७६ मा आयोगबाट निर्णय भएका विभिन्न प्रकृतिका मुद्दाहरूमा मागदाबी लिइएको बिगोको प्रतिशत (pie_3d, 5 points)
- **p320** अनुसूची - १५ — विशेष अदालतबाट फैसला भएका भ्रष्टाचारसम्बन्धी मुद्दाहरूमा सफलताको प्रतिशत (line, 10 points)
- **p320** अनुसूची - १६ — आ.व. २०७५/७६ मा विस्तृत अनुसन्धानबाट भएका कारबाहीको संख्या (pie_3d, 6 points)
- **p321** अनुसूची - १७ — विगत ५ वर्षमा नक्कली शैक्षिक योग्यतासम्बन्धी मुद्दाको विवरण (line, 5 points)
- **p321** अनुसूची - १८ — विगत ५ वर्षको घुस (रिसवत) सम्बन्धी मुद्दाको प्रवृत्ति (line, 10 points)
