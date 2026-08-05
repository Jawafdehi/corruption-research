export const meta = {
  name: 'ciaa-chart-vision-extract',
  description: 'Double-pass vision extraction of CIAA report chart data (likhit cannot read charts)',
  phases: [
    { title: 'Pass 1' },
    { title: 'Pass 2' },
    { title: 'Reconcile' },
  ],
}

// args = { work: [ {year, report, page, png, signals}, ... ], batch?: number }
const WORK = (args && args.work) || []
const BATCH = (args && args.batch) || 4

// ---- structured-output schema for one extraction pass over a batch of pages ----
const PASS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    pages: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          page: { type: 'integer', description: '1-based PDF page number, copied from the input' },
          has_chart: { type: 'boolean', description: 'true if the page contains a data chart/graph/figure (bar, line, pie, stacked, or a chart rendered as an image). false for photos, covers, decorative art, or plain ruled tables.' },
          figures: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                figure_label: { type: 'string', description: 'Figure caption as printed, e.g. "चित्र २.१४" (empty string if unlabeled)' },
                title_ne: { type: 'string', description: 'Figure title in Nepali as printed (empty string if none)' },
                chart_type: { type: 'string', enum: ['bar', 'stacked_bar', 'line', 'pie', 'area', 'table_image', 'other'] },
                x_axis: { type: 'string' },
                y_axis: { type: 'string' },
                unit: { type: 'string', description: 'unit of the values, e.g. संख्या, प्रतिशत, रु. करोड (empty if none)' },
                data: {
                  type: 'array',
                  description: 'the underlying data points read off the chart',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      label: { type: 'string', description: 'category / x-value / slice label, verbatim Nepali' },
                      series: { type: 'string', description: 'series name for multi-series charts (empty otherwise)' },
                      value: { type: 'number', description: 'value in Western digits (convert Devanagari numerals)' },
                      value_estimated: { type: 'boolean', description: 'true if the value was read off the axis (not printed on the mark)' },
                    },
                    required: ['label', 'value'],
                  },
                },
                notes: { type: 'string', description: 'anything unreadable, ambiguous, or noteworthy' },
              },
              required: ['figure_label', 'chart_type', 'data'],
            },
          },
        },
        required: ['page', 'has_chart', 'figures'],
      },
    },
  },
  required: ['pages'],
}

const TIEBREAK_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: { figures: PASS_SCHEMA.properties.pages.items.properties.figures },
  required: ['figures'],
}

function extractPrompt(batch, passName) {
  const lines = batch.map(w => `  - PDF page ${w.page}: ${w.png}`).join('\n')
  const year = batch[0].year
  return [
    `You are extracting the DATA behind chart images in the CIAA (Nepal anti-corruption commission) annual report for fiscal year ${year} (Bikram Sambat).`,
    `The report's charts are images that text extraction (likhit) cannot read, so you must read them by eye. This is ${passName} of an independent double pass — work only from the images, do not guess to match anyone else.`,
    ``,
    `Read EACH of these page images with the Read tool, then transcribe every data chart/graph on them:`,
    lines,
    ``,
    `Rules:`,
    `- Convert all Devanagari numerals (०१२३४५६७८९ and separators like , ।) to Western integers/decimals.`,
    `- Copy category / axis / slice labels VERBATIM in Nepali (Devanagari).`,
    `- Read the printed data label on each bar/point/slice. If a value is not printed, estimate it from the axis and set value_estimated=true.`,
    `- Capture the figure caption (e.g. "चित्र ३.३") and title exactly as printed.`,
    `- has_chart=false for a page that is a photo, cover, decorative graphic, or a PLAIN RULED TABLE (those are handled elsewhere). Only real charts/graphs/figures count. A table drawn as a bare grid of numbers is NOT a chart; a bar/line/pie/stacked graphic IS.`,
    `- Include one object in "pages" for EVERY page listed above, echoing its page number, even if has_chart=false (then figures=[]).`,
    `- Be exact. This feeds a public accountability dataset; a wrong digit is worse than a noted uncertainty.`,
  ].join('\n')
}

// ---- numeric reconciliation helpers (deterministic, in-script) ----
const norm = s => (s || '').replace(/\s+/g, ' ').trim()
function valEq(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') return a === b
  return Math.abs(a - b) <= Math.max(0.5, 0.01 * Math.abs(a))
}
function figKey(f) { return norm(f.figure_label) || norm(f.title_ne) }
function dataAgree(d1, d2) {
  if (!Array.isArray(d1) || !Array.isArray(d2)) return false
  if (d1.length !== d2.length) return false
  const m2 = new Map(d2.map(p => [norm(p.label) + '|' + norm(p.series), p]))
  for (const p of d1) {
    const q = m2.get(norm(p.label) + '|' + norm(p.series))
    if (!q || !valEq(p.value, q.value)) return false
  }
  return true
}

phase('Pass 1')
// batch the work-list, keeping each batch within a single (year) so prompts stay coherent
const batches = []
let cur = []
for (const w of WORK) {
  if (cur.length && (cur.length >= BATCH || cur[0].year !== w.year)) { batches.push(cur); cur = [] }
  cur.push(w)
}
if (cur.length) batches.push(cur)
log(`${WORK.length} chart pages -> ${batches.length} batches (size <=${BATCH})`)

const results = await pipeline(
  batches,
  // stage 1: two independent vision passes in parallel
  (batch, _orig, i) => parallel([
    () => agent(extractPrompt(batch, 'PASS 1'), { label: `p1:${batch[0].year}:${batch[0].page}`, phase: 'Pass 1', schema: PASS_SCHEMA, agentType: 'general-purpose' }),
    () => agent(extractPrompt(batch, 'PASS 2'), { label: `p2:${batch[0].year}:${batch[0].page}`, phase: 'Pass 2', schema: PASS_SCHEMA, agentType: 'general-purpose' }),
  ]).then(([p1, p2]) => ({ batch, p1, p2, i })),
  // stage 2: reconcile per page/figure; tie-break only the disagreements
  async ({ batch, p1, p2 }) => {
    const byPage = new Map(batch.map(w => [w.page, w]))
    const p1p = new Map(((p1 && p1.pages) || []).map(x => [x.page, x]))
    const p2p = new Map(((p2 && p2.pages) || []).map(x => [x.page, x]))
    const out = []
    for (const w of batch) {
      const a = p1p.get(w.page) || { has_chart: false, figures: [] }
      const b = p2p.get(w.page) || { has_chart: false, figures: [] }
      const aFigs = a.figures || [], bFigs = b.figures || []
      const bByKey = new Map(bFigs.map(f => [figKey(f), f]))
      const figures = []
      for (const fa of aFigs) {
        const fb = bByKey.get(figKey(fa))
        if (fb && dataAgree(fa.data, fb.data)) {
          figures.push({ ...fa, status: 'confirmed', confidence: 'high' })
        } else {
          // disagreement (or figure missing in pass 2) -> tie-break with a 3rd read
          const tb = await agent(
            [`Third, authoritative read of ONE chart from the CIAA FY ${w.year} report.`,
             `Read this page image: ${w.png}`,
             `Focus on the figure captioned "${fa.figure_label || fa.title_ne || '(the chart on this page)'}".`,
             `Two prior independent passes disagreed on its numbers. Transcribe the figure's data EXACTLY off the image (Devanagari numerals -> Western digits, labels verbatim Nepali). Be meticulous.`].join('\n'),
            { label: `tb:${w.year}:${w.page}`, phase: 'Reconcile', schema: TIEBREAK_SCHEMA, agentType: 'general-purpose' })
          const tbFig = tb && tb.figures && tb.figures[0]
          figures.push({
            ...(tbFig || fa),
            status: 'tie_broken',
            confidence: tbFig ? 'medium' : 'low',
            pass1_data: fa.data, pass2_data: fb ? fb.data : null,
          })
        }
      }
      // figures only pass 2 saw -> keep, flagged
      for (const fb of bFigs) {
        if (!aFigs.some(fa => figKey(fa) === figKey(fb))) {
          figures.push({ ...fb, status: 'pass2_only', confidence: 'low' })
        }
      }
      out.push({
        page: w.page, png: w.png, signals: w.signals,
        has_chart: !!(a.has_chart || b.has_chart) || figures.length > 0,
        figures,
      })
    }
    return { year: batch[0].year, report: batch[0].report, pages: out }
  },
)

// group flattened results by year for easy file-writing by the caller
const byYear = {}
for (const r of results.filter(Boolean)) {
  const y = byYear[r.year] || (byYear[r.year] = { year: r.year, report: r.report, pages: [] })
  y.pages.push(...r.pages)
}
for (const y of Object.values(byYear)) y.pages.sort((m, n) => m.page - n.page)

const nFigs = Object.values(byYear).reduce((s, y) => s + y.pages.reduce((t, p) => t + p.figures.length, 0), 0)
const nReview = Object.values(byYear).reduce((s, y) => s + y.pages.reduce((t, p) => t + p.figures.filter(f => f.status !== 'confirmed').length, 0), 0)
log(`extracted ${nFigs} figures; ${nReview} needed tie-break/flag`)
return { years: byYear, stats: { chart_pages: WORK.length, batches: batches.length, figures: nFigs, flagged: nReview } }
