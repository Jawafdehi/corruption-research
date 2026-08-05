# CIAA annual reports — markdown (likhit) + chart data (vision)

Machine-readable copies of the **CIAA annual reports** for fiscal years **BS 2069/70 → 2082/83**, one folder per year. For each report:

- the **source PDF** (downloaded from `ciaa.gov.np`; see `download_manifest.json`),
- **the full report as Markdown** — prefer `*.likhit.md` (via [**likhit**](https://github.com/Jawafdehi/likhit), Jawafdehi's Nepali document→Markdown converter), which is the better text for every report that has one. A `*.md` (markitdown) is kept alongside it in a few folders as the superseded version. **One report — the 26th — is garbled whichever file you open**; it carries a ⚠ in the coverage table, and the digit-search note below explains how to work with it, and
- **`figures/`** — the **chart/graph data likhit cannot convert**. likhit reads text, not pictures; bar/pie/line charts are images, so their pages were rendered to PNG and transcribed by a **two-pass vision read** (`figures.json` + readable `figures.md`).

Built by `_tools/` (download → convert markdown → detect+render chart pages → vision double-pass → merge). Re-runnable.

## Coverage

| FY (BS) | Report | markdown | chart pages | charts extracted |
|---|---|---|---|---|
| 2069/70 | 23rd | likhit | 14 | 12 |
| 2070/71 | 24th | likhit | 13 | 6 |
| 2071/72 | 25th | likhit | 13 | 18 |
| 2072/73 | 26th | likhit ⚠ garbled | 12 | 13 |
| 2073/74 | 27th | likhit | 12 | 14 |
| 2074/75 | 28th | likhit | 23 | 19 |
| 2075/76 | 29th | likhit | 27 | 31 |
| 2076/77 | 30th | likhit | 34 | 40 |
| 2077/78 | 31st | likhit | 35 | 38 |
| 2078/79 | 32nd | likhit | 38 | 44 |
| 2079/80 | 33rd | likhit (repaired) | 50 | 49 |
| 2080/81 | 34th | likhit (repaired) | 58 | 58 |
| 2081/82 | 35th | likhit (repaired) | 46 | 46 |
| 2082/83 | 36th | — | — | **not yet published** by CIAA (FY ended ~2026-07; reports appear 12–18 mo later) |

## The two markdown converters, and a claim this section got wrong

`likhit` exists to repair **legacy pre-Unicode Devanagari fonts**, where a PDF's text layer is Latin-looking gibberish that ordinary extractors garble. Two reports here are like that — **23rd (FY2069/70) and 24th (FY2070/71)**: their raw text layer is 0% Devanagari / 73% Latin, and likhit correctly repairs them (`.likhit.md`).

The other reports look **born-digital** — 86–95% Devanagari in the raw text layer — and the original reasoning was that likhit's font-repair is therefore a **no-op**, making plain **markitdown** text-equivalent. That mattered because likhit's full plugin pipeline (multi-path evaluation + per-page image-dominance analysis) **hung pathologically on these particular image-heavy PDFs** — >90 min of CPU with no result, versus ~90 sec for markitdown.

**That reasoning does not hold, and the correction below is the important part of this section.** A high Devanagari fraction in the text layer does not mean every glyph is mapped correctly: these reports mix in legacy-font runs that markitdown silently mangles, and likhit repairs. Judge a conversion by whether common words are findable in it, not by the language of its bytes.

### Correction: the equivalence claim was wrong, and four reports were the worse for it

This section used to argue that markitdown output was **byte-for-byte identical** to likhit's, verified on the two born-digital reports where likhit eventually finished (33rd, 34th), and concluded that the reports where likhit hung could safely ship markitdown because it was "exactly what likhit would have produced".

**The evidence was real and the generalisation was not.** The 33rd and 34th likhit outputs are *themselves* mis-mapped — 1,255 and 1,340 scramble markers, and zero hits for `परिच्छेद` ("chapter"). So that comparison was between two equally garbled files, which are indeed equal. It said nothing about what a *working* likhit run would produce.

Once the pathological hang was root-caused and fixed (an unbounded GSUB ligature fixpoint in `kalimati.py` — bound the loop to `len(ligature_rules) + 1` passes), likhit completed on four of the five hung reports, and its output is **much better than markitdown's, not equal to it**:

| FY | Report | scramble markers, likhit → markitdown | `परिच्छेद` hits, likhit → markitdown |
|---|---|---:|---:|
| 2071/72 | 25th | **0** → 1,146 | 350 → 277 |
| 2076/77 | 30th | **16** → 7,685 | 322 → **0** |
| 2077/78 | 31st | **0** → 6,925 | 268 → **0** |
| 2078/79 | 32nd | **0** → 7,989 | 404 → **0** |

The markitdown text for three of those four cannot find the word "chapter" anywhere in a chapter-structured report, and the 32nd cannot find `पुनरावेदन` ("appeal") either — 140 hits in likhit, 0 in markitdown. This is not a cosmetic difference: **the 32nd report's Rule 30 / sting-operation passage, which is the primary source for the CIAA's own explanation of its falling bribery conviction rate, is searchable in the likhit output (`नियम ३०`, 2 hits) and absent from the markitdown one (0 hits).** A downstream analysis cited it and would have found nothing in what this directory published.

The likhit files are not truncated — Devanagari character counts land within a few percent of markitdown's and both reach the last printed page — and PUA-glyph counts are comparable (867 vs 881 on the 32nd), so likhit is no worse on the legacy-font cover it is known to struggle with.

**Current state — three of the four garbled reports are now repaired.** `.likhit.md` is the file to read for every report except the **26th**.

The plugin's converter *computes* a good repair and can then throw it away. When likhit flags any page as needing OCR it sets `force_ocr`; if OCR is unconfigured, the candidate selection can fall back to plain MarkItDown output, which for these reports is legacy-font garbage. `_tools/repair_direct.py` calls `FontBasedStrategy` directly and keeps the repaired text:

```bash
python _tools/repair_direct.py 2081-82/35th-annual-report-2081-82.pdf out.md
```

| FY | Report | scramble, before → after | `परिच्छेद` hits, before → after | pages dropped |
|---|---|---:|---:|---|
| 2079/80 | 33rd | 1,255 → **0** | 0 → **337** | 2 (cover, last) |
| 2080/81 | 34th | 1,340 → **0** | 0 → **458** | 2 (cover, last) |
| 2081/82 | 35th | 1,174 → **0** | 0 → **255** | 2 (cover, last) |

**The trade-off, stated plainly:** the repaired files drop the cover and final page, which likhit flags as needing OCR — about 1.5–2% of Devanagari characters. In exchange the entire body becomes searchable, where before none of it was. The PDF remains the ground truth for those two pages, and the dropped page numbers are printed by the script every run.

What this unlocked concretely: the 35th report's Rule 30 / sting-operation passage is now findable by text search, and with it the CIAA's own before-and-after magnitudes for its falling conviction rate (above 50% every year, then 38.51% and 33.43%, then a recovery to 52.67%). All of that was in the PDF the whole time and unreachable in the published markdown.

**The 26th (FY2072/73) is still garbled and the direct repair does not fix it** — 8,401 scramble markers before and after, with the same Devanagari character count, so the repair path runs and changes nothing that matters. Its font classification looks like the reports that do repair (`Himalb`/`Preeti` → `legacy_remap`, `Kalimati` → `broken_cmap`), but it carries 57 distinct fonts against the 33rd's 30, which is the most obvious difference and not yet a diagnosis. Treat the 26th with the digit-search note below.

### Working with a garbled report: search for digits, not words

For the 26th — the one report still garbled — a failed text search tells you nothing about the content. The same applies to the two pages the repaired reports drop, and to any future report that converts badly. Devanagari **digits survive** the mis-mapping intact while consonant clusters do not:

| correct | as it appears garbled |
|---|---|
| `नियम` (rule) | `तनयि` |
| `स्टिङ` (sting) | `ख्स्टङ` |
| `मुद्दा` (case) | `िद्दु ा` |
| `अनुसन्धान` (investigation) | `अनसुन्धान` |
| `दुरुपयोग` (abuse) | `दरुुपयोग` |

So **anchor on a number** — a percentage, a rupee amount, a BS date — then read the surrounding lines and de-garble by eye. Verify any reconstructed quote against the PDF page before publishing it verbatim.

This is the difference between finding a source and wrongly reporting that none exists. A downstream analysis searched the 35th report for `नियम ३०`, got zero hits, and wrote up the CIAA's own explanation of its falling bribery conviction rate as unverifiable. Searching `५२.६७` — the success rate printed immediately before it — landed on the passage at once, and the same paragraph also yielded the year's appeal counts. **Detect a garbled file first** (scramble markers `दरुु` / `अनसु` / `तनर्` / `ऩ` in the hundreds or thousands; a clean conversion scores under ~25), then search it accordingly. Do this before concluding anything from an absence, in any report.

## What the markdown can and cannot convert

- **Recovered in the `.md`/`.likhit.md`:** body text, headings, and the ruled statistical **tables** (verified — e.g. the FY2069/70 complaints table `११,२९८ | ३,१६८ | …` round-trips intact).
- **NOT recoverable from text, hence `figures/`:** every **chart/graph** (bar, pie, line, stacked) — raster/vector pictures with the numbers baked in as pixels. The detector (`_tools/find_figures.py`) flags chart pages by curve-density / coloured fills / embedded-image coverage (ruled tables, which have only ~8 decorative curves, are deliberately excluded); vision then reads the numbers off each chart, twice.

## Provenance & caveats

- **388 charts** were transcribed across the 13 reports. Chart values are a best-effort human-equivalent transcription; values not printed on a bar/point were read off the axis and marked `value_estimated` in `figures.json` (417 such values overall — concentrated in a few unlabeled trend charts).
- Each chart went through two independent vision reads with per-value reconciliation; `verify_note` in `figures.json` records corrections caught on the second read.
- The 36th report (FY 2082/83) is a placeholder — not published as of 2026-07-25.
