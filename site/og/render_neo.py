#!/usr/bin/env python3
"""Render og/build/*.html (written by og/cards.mjs) to public/og/*.png, 1200 x 630, in BrowserOS neo.

No browser is launched here: neo is the agents' own browser, reached over its MCP endpoint
(NEO_MCP, default http://127.0.0.1:9010/mcp). One tab is opened for the whole run and closed at
the end, also on failure. Each card page is self-contained (fonts and logo inlined), so neo
needs no access to this machine.

Checks per card, as on justice.jawafdehi.org: every font face it uses has loaded; no text is set
below 24 px (the logo lockup aside); no text overflows its box or the card; the PNG, reduced to
256 colours, is under 300 KB. A card that fails is not written.

    node og/cards.mjs && python3 og/render_neo.py [name ...]
"""
import base64, hashlib, io, json, os, sys, urllib.request
from pathlib import Path

from PIL import Image

SITE = Path(__file__).resolve().parents[1]
BUILD, OUT = SITE / "og/build", SITE / "public/og"
URL = os.environ.get("NEO_MCP", "http://127.0.0.1:9010/mcp")
MAX_BYTES = 300_000


def _post(body, sid=None):
    h = {"Content-Type": "application/json", "Accept": "application/json, text/event-stream"}
    if sid: h["mcp-session-id"] = sid
    with urllib.request.urlopen(urllib.request.Request(URL, data=json.dumps(body).encode(), headers=h), timeout=120) as r:
        sid2, raw = r.headers.get("mcp-session-id"), r.read().decode()
    out = None
    for line in raw.splitlines():
        if line.startswith("data:") and line[5:].strip():
            d = json.loads(line[5:]); out = d if "id" in d else out
    if out is None and raw.strip().startswith("{"): out = json.loads(raw)
    return sid2, out


SID = None
def run(code):
    """Run a neo `run` script; return its JSON return value."""
    global SID
    if SID is None:
        SID, _ = _post({"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-03-26", "capabilities": {}, "clientInfo": {"name": "og-cards", "version": "1"}}})
        _post({"jsonrpc": "2.0", "method": "notifications/initialized"}, SID)
    _, o = _post({"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "run", "arguments": {"code": code}}}, SID)
    r = o.get("result", o)
    txt = "".join(c.get("text", "") for c in r.get("content", []))
    if r.get("isError") or "return:" not in txt: raise RuntimeError(txt[:2000])
    v, _ = json.JSONDecoder().raw_decode(txt[txt.index("return:") + 7:].strip())
    return v


# Runs in the card page: fit each title to its box, then list what fails the checks.
CHECK = r"""return (async () => {
await document.fonts.ready;
// A box with a set height carries data-box; text must fit inside it (a long title is shrunk to fit).
const over = (e) => e.scrollWidth > e.clientWidth + 1 || (e.hasAttribute('data-box') && e.scrollHeight > e.clientHeight + 1);
for (const t of document.querySelectorAll('.title')) {
  let s = parseFloat(getComputedStyle(t).fontSize);
  const box = t.closest('[data-box]');
  while ((over(t) || (box && over(box))) && s > 36) { s -= 2; t.style.fontSize = s + 'px'; }
}
const bad = [];
for (const f of [...document.fonts]) if (f.status === 'error') bad.push('font failed: ' + f.family + ' ' + f.weight);
const used = new Set();
const walk = (n) => { for (const c of n.childNodes) { if (c.nodeType === 3 && c.textContent.trim()) { const e = c.parentElement;
  if (!e.closest('.lockup')) { const cs = getComputedStyle(e); used.add(cs.fontFamily.split(',')[0].replace(/"/g,'') + ' ' + cs.fontWeight);
    if (parseFloat(cs.fontSize) < 24) bad.push('under 24 px: ' + c.textContent.trim().slice(0, 40)); }
  const r = document.createRange(); r.selectNodeContents(c); for (const q of r.getClientRects()) if (q.right > 1200.5 || q.bottom > 630.5 || q.left < -0.5) bad.push('off the card: ' + c.textContent.trim().slice(0, 40)); }
  else if (c.nodeType === 1) walk(c); } };
walk(document.body);
for (const e of document.querySelectorAll('.wrap,.title,.lede,.pct,.end,.note,.kicker,.sec,.cols .k,.fig')) {
  if (over(e)) bad.push('overflows: ' + e.className + ' ' + e.textContent.trim().slice(0, 40)); }
const row = document.querySelector('.row'); if (row) for (const c of row.children) if (c.getBoundingClientRect().bottom > row.getBoundingClientRect().bottom + 1) bad.push('overflows its row: ' + c.className);
const loaded = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight);
for (const u of used) if (!loaded.some(l => l.startsWith(u.split(' ').slice(0, -1).join(' ')))) bad.push('font not loaded: ' + u);
return { bad, used: [...used], loaded: [...new Set(loaded)] };
})();
"""


def main(names):
    cards = sorted(BUILD.glob("*.html"))
    if names: cards = [c for c in cards if c.stem in names]
    OUT.mkdir(parents=True, exist_ok=True)
    pid = run('const p = await browser.open("about:blank"); await p.cdp("Emulation.setDeviceMetricsOverride", JSON.stringify({width:1200,height:630,deviceScaleFactor:1,mobile:false})); return p.id;')
    failed = []
    rec = SITE / "og/rendered.json"   # which version of each card's page its PNG was rendered from
    done = json.loads(rec.read_text()) if rec.exists() else {}
    try:
        for c in cards:
            html = c.read_text()
            # Three calls (load, check, capture): together they can pass neo's 30 s cap per run.
            run(f"const p = browser.page({pid}); const h = {json.dumps(html)};\n"
                "await p.evaluate('document.open(); document.write(' + JSON.stringify(h) + '); document.close(); return 1;'); return 1;")
            chk = run(f"const r = await browser.page({pid}).evaluate({json.dumps(CHECK)}); return r.value;")
            png = run(f"const s = await browser.page({pid}).cdp('Page.captureScreenshot', JSON.stringify({{format:'png'}})); return s.data;")
            im = Image.open(io.BytesIO(base64.b64decode(png))).convert("RGB")
            if im.size != (1200, 630): chk["bad"].append(f"size {im.size}")
            q = im.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
            buf = io.BytesIO(); q.save(buf, "PNG", optimize=True)
            if buf.tell() > MAX_BYTES: chk["bad"].append(f"{buf.tell()} bytes (> {MAX_BYTES})")
            if chk["bad"]:
                failed.append(c.stem); print(f"FAIL {c.stem}: {chk['bad']}"); continue
            (OUT / f"{c.stem}.png").write_bytes(buf.getvalue())
            done[f"{c.stem}.png"] = hashlib.sha1(html.encode()).hexdigest()[:12]
            print(f"ok   {c.stem}.png  {buf.tell() // 1024} KB  fonts: {', '.join(sorted(chk['used']))}")
    finally:
        run(f"await browser.page({pid}).close(); return 1;")
        rec.write_text(json.dumps(dict(sorted(done.items())), indent=1) + "\n")
    if failed: sys.exit(f"share cards failed: {', '.join(failed)}")


if __name__ == "__main__":
    main(sys.argv[1:])
