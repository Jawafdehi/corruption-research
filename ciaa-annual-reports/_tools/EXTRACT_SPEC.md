# CIAA chart-data extraction spec (vision)

You transcribe the **data behind chart/graph images** in a CIAA (Nepal anti-corruption
commission) annual report. These charts are images that the `likhit` text converter cannot
read, so they must be read by eye. Accuracy matters: this feeds a public accountability dataset —
**a wrong digit is worse than a flagged uncertainty.**

## What counts as a chart (extract it)
Bar, stacked-bar, column, line, pie/donut, area charts, and any figure/graphic that encodes
numbers as a picture — including a chart pasted in as a raster image. Figures are usually
captioned **चित्र X.Y** (e.g. `चित्र २.१४`).

## What to SKIP (set has_chart=false, figures=[])
Photographs, the front/back cover, org logos, decorative art, and **plain ruled data tables**
(a bare grid of numbers with no bars/lines/slices). Those tables are already recovered as text
by likhit — do not re-transcribe them here. A page can legitimately have no chart.

## Method (be efficient — this is at scale)
1. **Read the page image once, full page.** The renders are 300-DPI; full-page is usually
   legible enough to read the printed data labels.
2. Extract every chart on the page: caption, title, type, axis labels, unit, and each data
   point (bar/point/slice) with its **label** (verbatim Nepali) and **value**.
3. **Verification pass:** read the same page image a *second* time and re-check every number
   against your first extraction. Fix any mismatch. Record `verify_note` = "ok" if the two
   reads agreed, or a short note on what you corrected.
4. Only if one specific value is genuinely illegible after both reads, do **one** cropped/zoomed
   read for just that value. Do **not** iteratively crop every bar — budget ~2–3 image reads
   per page total. If still unreadable, set `value_estimated: true` and note it.

## Numbers & labels
- Convert Devanagari numerals `०१२३४५६७८९` and separators (`,` `।`) to Western digits
  (`१४,१५६` → `14156`; `५९.०५` → `59.05`).
- If a value is printed on the mark, use it. If not, read it off the axis and set
  `value_estimated: true`.
- Keep category / axis / slice **labels verbatim in Devanagari**.
- Capture the unit if shown (e.g. `संख्या`, `प्रतिशत`, `रु. करोड`).
- **Multi-series charts** (grouped/stacked bars, multi-line, or a category repeated across years): set the `series` field on EVERY data point to the disambiguating name — the legend entry, or the year/period the point belongs to. Never emit two points with the same `label` and an empty `series`; if a category like `वन` appears once per fiscal year, put the fiscal year in `series` (`{"label":"वन","series":"२०७३/७४","value":...}`).
- Capture the figure caption in `figure_label` if the page prints one (e.g. `चित्र २.१४`); leave it `""` only when the figure truly has no printed number.

## Output — write this JSON file with the Write tool to the given `out` path
```json
{
  "report": "<report stem>",
  "year": "<fy folder, e.g. 2069-70>",
  "pages": [
    {
      "page": 517,
      "png": "<abs path>",
      "has_chart": true,
      "figures": [
        {
          "figure_label": "चित्र २.१४",
          "title_ne": "उजुरीको विषय क्षेत्रगत विवरण",
          "chart_type": "bar",
          "x_axis": "उजुरीको क्षेत्र",
          "y_axis": "उजुरी संख्या",
          "unit": "संख्या",
          "data": [
            {"label": "स्थानीय तह (सङ्घीय मामिला)", "series": "", "value": 14156, "value_estimated": false}
          ],
          "notes": "",
          "verify_note": "ok"
        }
      ]
    }
  ]
}
```
Include one entry in `pages` for **every** page you were given, echoing its page number and png,
even when `has_chart` is false (then `figures: []`). Write the file, then reply with a one-line
summary: `<year> part <k>: <n> pages, <m> charts, <u> uncertain values`.
