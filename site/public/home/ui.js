/* Option 7: language, numbers, charts, the view toggle and the evidence drawer.
   Forked from shared/jw.js so the page that will ship owns its copy and behaviour;
   options 1–6 keep the shared file unchanged. All figures still come from window.JW
   (shared/findings.js, built from the research branch). copy.js runs first and puts
   reader-facing sources and copy fixes onto each finding. */
(function () {
  const JW = window.JW;
  const DEV = "०१२३४५६७८९";
  const params = new URLSearchParams(location.search);
  const pick = (v, ok, d) => (ok.includes(v) ? v : d);
  let lang = pick(params.get("lang") || localStorage.getItem("jw-lang"), ["en", "ne"], "en");
  let view = pick(params.get("view") || localStorage.getItem("jw7-view"), ["funnel", "pipe"], "funnel");
  const renderers = [];
  // Closing the drawer goes back one history entry; the browser must not restore an old
  // scroll position when it does (Firefox jumped to the top).
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  // The one launch flag: the review build says "draft"; the launch build (the site sets
  // window.JW_LAUNCH = true, or ?launch=1) does not.
  const LAUNCH = !!window.JW_LAUNCH || params.get("launch") === "1";

  const UI = {
    title: { en: "Where accountability leaks", ne: "जवाफदेहिता कहाँ चुहिन्छ" },
    site: { en: "Jawafdehi Initiative", ne: "जवाफदेही इनिशिएटिभ" },
    research: { en: "Research", ne: "अनुसन्धान" },
    byline: { en: "A research report by Jawafdehi Initiative · jawafdehi.org", ne: "जवाफदेही इनिशिएटिभको अनुसन्धान प्रतिवेदन · jawafdehi.org" },
    draft: { en: "Draft for review, not yet published.", ne: "समीक्षाका लागि मस्यौदा, अहिलेसम्म प्रकाशित गरिएको छैन।" },
    checked: { en: "Figures recalculated from the source data on {d}. Sources: court records collected 8 October to 3 November 2026, and the CIAA's 35th annual report (2081/82).", ne: "अंक {d} मा स्रोत तथ्यांकबाट पुनः गणना गरी जाँचिएका। स्रोत: २०८३ असोज २२ देखि कार्तिक १७ सम्म सङ्कलित अदालतका अभिलेख, र अख्तियारको ३५औं वार्षिक प्रतिवेदन (२०८१/८२)।" },
    evidence: { en: "Show evidence", ne: "प्रमाण हेर्नुहोस्" },
    close: { en: "Close", ne: "बन्द गर्नुहोस्" },
    whatWeFound: { en: "What we found", ne: "हामीले के भेट्यौं" },
    howSure: { en: "How sure we are", ne: "हामी कत्तिको निश्चित छौं" },
    howCounted: { en: "How we counted", ne: "हामीले कसरी गन्यौं" },
    source: { en: "Source", ne: "स्रोत" },
    cite: { en: "Cite or share this finding", ne: "यो निष्कर्ष उद्धृत वा सेयर गर्नुहोस्" },
    copyLink: { en: "Copy link", ne: "लिंक कपी गर्नुहोस्" },
    copyCite: { en: "Copy citation", ne: "उद्धरण कपी गर्नुहोस्" },
    share: { en: "Share", ne: "सेयर गर्नुहोस्" },
    print: { en: "Print", ne: "प्रिन्ट गर्नुहोस्" },
    readMore: { en: "Read the full section", ne: "पूरा खण्ड पढ्नुहोस्" },
    copied: { en: "Copied", ne: "कपी भयो" },
    stage: { en: "Stage", ne: "चरण" },
    of: { en: "of", ne: "मध्ये" },
    neNote: {
      en: "",
      ne: "",
    },
    view: { en: "View", ne: "दृश्य" },
    funnel: { en: "Funnel", ne: "फनेल" },
    pipe: { en: "Pipeline", ne: "पाइपलाइन" },
    skipTo: { en: "Skip to content", ne: "मुख्य सामग्रीमा जानुहोस्" },
    settings: { en: "Language", ne: "भाषा" },
    viewLabel: { en: "Show the stages as", ne: "चरणहरू यसरी हेर्नुहोस्" },
  };

  const t = (o) => (o == null ? "" : typeof o === "string" ? o : o[lang] ?? o.en);
  const tx = (k) => t(UI[k]);
  const dev = (s) => String(s).replace(/[0-9]/g, (d) => DEV[d]);
  const N = (x) => (lang === "ne" ? dev(Number(x).toLocaleString("en-IN")) : Number(x).toLocaleString("en-US"));
  const dev2 = (x) => (lang === "ne" ? dev(x) : String(x));
  const pctNum = (s) => parseFloat(String(s).replace(/[^\d.]/g, ""));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const stageOf = (key) => JW.stages.find((s) => s.key === key);
  const byKey = (k) => JW.findings.find((f) => f.key === k);
  const gapCode = (g) => (g === "leak+A" ? "A" : g);
  // "230 of 567" / "५६७ मध्ये २३०": Nepali puts the whole first.
  const ofTxt = (part, whole) => (lang === "ne" ? `${N(whole)} मध्ये ${N(part)}` : `${N(part)} of ${N(whole)}`);

  const TONE = { leak: "var(--leak)", leak2: "var(--leak-dark)", leak3: "var(--leak-light)", mute: "var(--mute)", on: "var(--on)" };

  /* ---------- charts (same as the shared set) ---------- */
  function hundreds(parts, total) {
    const raw = parts.map((p) => (p.v / total) * 100);
    const fl = raw.map(Math.floor);
    let left = 100 - fl.reduce((a, b) => a + b, 0);
    raw.map((r, i) => [r - fl[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { fl[i]++; left--; } });
    return fl;
  }
  const legend = (parts, total) => '<ul class="legend">' + parts.map((p) =>
    `<li><i style="background:${TONE[p.tone]}"></i>${esc(t(p))}: <b class="num">${N(p.v)}${total === 100 ? "%" : ""}</b>${total && total !== 100 ? ` <span class="num">(${dev2(Math.round((p.v / total) * 1000) / 10)}%)</span>` : ""}</li>`).join("") + "</ul>";
  const VIZ = {
    waffle(v, o) {
      const cells = hundreds(v.parts, v.total), s = 12, g = 3, cols = 10;
      let i = 0, out = "";
      v.parts.forEach((p, pi) => { for (let c = 0; c < cells[pi]; c++, i++) out += `<rect x="${(i % cols) * (s + g)}" y="${Math.floor(i / cols) * (s + g)}" width="${s}" height="${s}" rx="2" fill="${TONE[p.tone]}"/>`; });
      const w = cols * (s + g) - g;
      return `<svg class="viz" viewBox="0 0 ${w} ${w}" style="max-width:${o.max || w}px" role="img" aria-label="${esc(v.parts.map((p) => `${t(p)} ${N(p.v)}${v.total === 100 ? "%" : ""}`).join(", "))}">${out}</svg>` + legend(v.parts, v.total) + (v.sub ? `<p class="note">${esc(t(v.sub))}</p>` : "");
    },
    stack(v) {
      const W = 600, H = 34; let x = 0, out = "";
      v.parts.forEach((p) => {
        const w = (p.v / v.total) * W;
        out += `<rect x="${x + 1}" y="0" width="${Math.max(w - 2, 1)}" height="${H}" rx="3" fill="${TONE[p.tone]}"/>`;
        if (w > 34) out += `<text x="${x + 10}" y="23" font-size="16" font-weight="700" style="fill:#fff">${N(p.v)}</text>`;
        x += w;
      });
      return `<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(v.parts.map((p) => `${t(p)} ${N(p.v)}`).join(", ") + ` (${N(v.total)})`)}">${out}</svg>` + legend(v.parts) + (v.foot ? `<p class="note">${esc(t(v.foot))}</p>` : "");
    },
    bars(v) {
      return '<div class="hbars">' + v.rows.map((r) => {
        const p = (r.v / r.of) * 100;
        return `<div class="hb"><div class="hl">${esc(t(r))}</div><div class="ht"><i style="width:${Math.max(p, 0.8)}%;background:${TONE[r.tone]}"></i></div><div class="hv"><b>${dev2(Math.round(p))}%</b> · ${ofTxt(r.v, r.of)}</div></div>`;
      }).join("") + "</div>";
    },
    slope(v) {
      const W = 380, H = 190, a = pctNum(v.from.v), b = pctNum(v.to.v), y = (p) => H - 30 - (p / 100) * (H - 60);
      const L = lang === "ne" ? [v.from.label_ne, v.to.label_ne] : [v.from.label, v.to.label];
      const out = `<line x1="0" x2="${W}" y1="${H - 30}" y2="${H - 30}" stroke="var(--line)"/>` +
        `<line x1="60" y1="${y(a)}" x2="${W - 60}" y2="${y(b)}" stroke="var(--leak)" stroke-width="3"/>` +
        `<circle cx="60" cy="${y(a)}" r="7" fill="var(--mute)" stroke="var(--paper)" stroke-width="2"/><circle cx="${W - 60}" cy="${y(b)}" r="8" fill="var(--leak)" stroke="var(--paper)" stroke-width="2"/>` +
        `<text x="60" y="${y(a) - 16}" text-anchor="middle" font-size="22" font-weight="700" style="fill:var(--ink)">${dev2(v.from.v)}</text>` +
        `<text x="${W - 60}" y="${y(b) - 16}" text-anchor="middle" font-size="26" font-weight="700" style="fill:var(--leak)">${dev2(v.to.v)}</text>` +
        `<text x="60" y="${H - 8}" text-anchor="middle" font-size="15">${esc(L[0])}</text><text x="${W - 60}" y="${H - 8}" text-anchor="middle" font-size="15">${esc(L[1])}</text>`;
      return `<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(`${L[0]}: ${dev2(v.from.v)}. ${L[1]}: ${dev2(v.to.v)}.`)}">${out}</svg>` + (v.sub ? `<p class="note">${esc(t(v.sub))}</p>` : "");
    },
    histo(v) {
      const W = 380, H = 190, max = Math.max(...v.bands.map((b) => b.v)), bw = W / v.bands.length;
      let out = "";
      v.bands.forEach((b, i) => {
        const h = (b.v / max) * (H - 60), x = i * bw;
        out += `<rect x="${x + 4}" y="${H - 30 - h}" width="${bw - 8}" height="${h}" rx="3" fill="${TONE[b.tone]}"/>`;
        out += `<text x="${x + bw / 2}" y="${H - 36 - h}" text-anchor="middle" font-size="15" font-weight="700" style="fill:var(--ink)">${N(b.v)}</text>`;
        out += `<text x="${x + bw / 2}" y="${H - 8}" text-anchor="middle" font-size="15">${dev2(b.label)}</text>`;
      });
      const cap = t({ en: v.en, ne: v.ne });
      return `<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(cap.replace(/[.।]$/, "") + ": " + v.bands.map((b) => `${dev2(b.label)}: ${N(b.v)}`).join(", "))}">${out}</svg><p class="note">${esc(cap)}${v.unit_en ? ` (${esc(t({ en: v.unit_en, ne: v.unit_ne }))})` : ""}</p>`;
    },
    columns(v) {
      const W = 380, H = 200, max = Math.max(...v.rows.map((r) => r.v)), bw = W / v.rows.length;
      let out = "";
      v.rows.forEach((r, i) => {
        const h = (r.v / max) * (H - 70), x = i * bw;
        out += `<rect x="${x + 14}" y="${H - 44 - h}" width="${bw - 28}" height="${h}" rx="4" fill="${TONE[r.tone]}"/>`;
        out += `<text x="${x + bw / 2}" y="${H - 50 - h}" text-anchor="middle" font-size="18" font-weight="700" style="fill:var(--ink)">${dev2(r.v)}%</text>`;
      });
      const cap = t({ en: v.en, ne: v.ne });
      // Column names as HTML under the chart, so they wrap at phone width instead of overlapping.
      return `<svg class="viz" viewBox="0 0 ${W} ${H - 34}" role="img" aria-label="${esc(cap + ": " + v.rows.map((r) => `${t(r)} ${dev2(r.v)}%`).join(", "))}">${out}</svg>` +
        `<div class="collab" style="grid-template-columns:repeat(${v.rows.length},1fr)">${v.rows.map((r) => `<span>${esc(t(r))}</span>`).join("")}</div><p class="note">${esc(cap)}</p>`;
    },
    absent(v) {
      return `<div class="absent" role="img" aria-label="${esc(t(v))}"><svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" stroke-width="3"/><path d="M7 29 29 7" stroke="currentColor" stroke-width="3"/></svg><span>${esc(t(v))}</span></div>`;
    },
  };
  const viz = (f, o = {}) => VIZ[f.viz.type](f.viz, o);

  const chip = (gap) => `<span class="chip" data-gap="${esc(gap)}"><b aria-hidden="true">${esc(gapCode(gap))}</b>${esc(t(JW.gap[gap]))}</span>`;
  const bigHTML = (f) => `<div class="big num">${esc(t(f.big.value))}${f.big.unit.en ? ` <small>${esc(t(f.big.unit))}</small>` : ""}</div>`;

  /* ---------- brand ---------- */
  const LOGO = { light: "/home/brand/jawafdehi-logo-navy-for-light-bg.svg", dark: "/home/brand/jawafdehi-logo-white-for-dark-bg.svg" };
  const TAGLINE = "जवाफदेहिताको कहिल्यै म्याद सकिँदैन।";
  const brand = () => `<a class="jw-brand" href="https://jawafdehi.org" aria-label="${esc(tx("site"))} · jawafdehi.org"><img src="${LOGO.light}" alt="" width="66" height="30"><span aria-hidden="true"><b>${esc(tx("site"))}</b>${esc(tx("research"))}</span></a>`;
  const CHECKED = { en: "7–10 November 2026", ne: "२०८३ कार्तिक २१–२४" }; // dates of the recomputations (FIGURES.md, Q9)
  const brandFoot = () => `<div class="in"><img src="${LOGO.dark}" alt="${esc(tx("site"))}" width="75" height="34"><div><p class="tag" lang="ne">${TAGLINE}</p><small>${esc(tx("byline"))}</small><small>${esc(tx("checked").replace("{d}", t(CHECKED)))}</small>${LAUNCH ? "" : `<small class="draftfoot">${esc(tx("draft"))}</small>`}</div></div>`;

  /* ---------- header controls ---------- */
  const seg = (name, cur, opts, label) =>
    `<div class="seg" role="group" aria-label="${esc(label)}">${opts.map(([v, txt, l]) => `<button type="button" data-${name}="${v}" aria-pressed="${cur === v}"${l ? ` lang="${l}"` : ""}>${txt}</button>`).join("")}</div>`;
  const ICON = {
    funnel: '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="M1.5 2h13l-5 6v5.5l-3-1.6V8z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    pipe: '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="M1 5h14M1 9h14" stroke="currentColor" stroke-width="1.6"/><path d="M5 9v3M11 9v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  };
  const viewToggle = () => seg("view", view, [["funnel", ICON.funnel + `<span>${esc(tx("funnel"))}</span>`], ["pipe", ICON.pipe + `<span>${esc(tx("pipe"))}</span>`]], tx("view"));
  const langToggle = () => seg("lang", lang, [["en", "English", "en"], ["ne", "नेपाली", "ne"]], "Language / भाषा");

  function setParam(k, v) {
    const u = new URL(location.href);
    u.searchParams.set(k, v);
    history.replaceState(history.state, "", u.pathname + u.search + u.hash);
  }

  /* ---------- the evidence drawer ----------
     A bottom sheet on phones, a side panel on wide screens. Opens on tap; closes on the X,
     a tap on the backdrop, a swipe down (phones), Esc, or the browser's back button.
     The page underneath never moves: it is locked in place while the drawer is open. */
  // Inside the real site (window.JW_IN_SITE), report links stay on this site, in this tab;
  // in the mockup they open research.jawafdehi.org in a new tab. Citations keep the full URL.
  const reportLink = (h, label) => window.JW_IN_SITE
    ? `<a class="btn" href="${esc(h.replace(/^https:\/\/research\.jawafdehi\.org\//, window.JW_BASE || "/"))}">${label} →</a>`
    : `<a class="btn" href="${esc(h)}" target="_blank" rel="noopener">${label} →</a>`;
  const linkFor = (k) => { const u = new URL(location.href); u.hash = "f=" + k; return u.href; };
  const citation = (f) =>
    lang === "ne"
      ? `जवाफदेही इनिशिएटिभ, "जवाफदेहिता कहाँ चुहिन्छ" (${LAUNCH ? "" : "मस्यौदा, "}कार्तिक २०८३)। निष्कर्ष: ${f.headline.ne}। ${f.href}। स्रोत: ${f.src.ne}।`
      : `Jawafdehi Initiative, "Where accountability leaks" (${LAUNCH ? "" : "draft, "}November 2026). Finding: ${f.headline.en}. ${f.href}. Source: ${f.src.en}.`;

  let drawer, scrim, lastFocus, pushed = false, lockY = 0;
  const extra = {}; // other drawers (e.g. a funnel stage's own figure), by key

  function findingBody(f) {
    const st = stageOf(f.stage), inst = JW.institutions[f.inst];
    return {
      // Where the leak is: the stage, and who holds the case unless the stage already says it.
      eyebrow: esc(t(st).includes(t(inst)) || f.inst === "none" ? t(st) : `${t(st)} · ${t(inst)}`),
      html: `
        ${chip(f.gap)}
        <h2 id="jw-d-h">${esc(t(f.headline))}</h2>
        ${bigHTML(f)}
        <p class="lbl">${esc(t(f.big.label))}</p>
        <div class="dviz">${viz(f, { max: 300 })}</div>
        <section><h3>${tx("whatWeFound")}</h3>
          ${lang !== "ne" ? `<p>${esc(f.explain)}</p>` : f.explain_ne ? `<p>${esc(f.explain_ne)}</p>` : `<p>${esc(f.short.ne)}</p><p class="note">${tx("neNote")}</p><p lang="en">${esc(f.explain)}</p>`}
        </section>
        <section><h3>${tx("howSure")}</h3>
          <p>${chip(f.gap)}</p><p class="note">${esc(t({ en: JW.gap[f.gap].long_en, ne: JW.gap[f.gap].long_ne }))}</p>
          ${f.caveat ? `<p class="note">${esc(t(f.caveat))}</p>` : ""}
          <h3 class="h3b">${tx("source")}</h3><p class="src">${esc(t(f.src))}</p>
        </section>
        <section class="no-print"><h3>${tx("cite")}</h3>
          <div class="cite">${esc(citation(f))}</div>
          <div class="acts">
            <button type="button" class="btn solid" data-a="link">${tx("copyLink")}</button>
            <button type="button" class="btn" data-a="cite">${tx("copyCite")}</button>
            ${navigator.share ? `<button type="button" class="btn" data-a="share">${tx("share")}</button>` : ""}
            <button type="button" class="btn" data-a="print">${tx("print")}</button>
            ${reportLink(f.href, tx("readMore"))}
          </div>
        </section>`,
      act: (a) => {
        if (a === "link") copy(linkFor(f.key));
        if (a === "cite") copy(citation(f));
        if (a === "share") navigator.share({ title: t(f.headline), text: t(f.short), url: linkFor(f.key) }).catch(() => {});
        if (a === "print") window.print();
      },
    };
  }

  // overflow:hidden on <html> stops the page scrolling without moving it (a fixed-position
  // body would unstick the funnel). If a browser still scrolls underneath, put it back.
  function lock(on) {
    const de = document.documentElement;
    if (on) { lockY = window.scrollY; de.classList.add("locked"); }
    else if (de.classList.contains("locked")) { de.classList.remove("locked"); if (Math.abs(window.scrollY - lockY) > 1) window.scrollTo(0, lockY); }
  }

  function openFinding(k, opts = {}) {
    const f = byKey(k), x = extra[k];
    if (!f && !x) return false;
    if (drawer) closeNow();
    const body = f ? findingBody(f) : x(k);
    lastFocus = opts.focusBack || document.activeElement;
    scrim = document.createElement("div"); scrim.className = "jw-scrim";
    drawer = document.createElement("div");
    drawer.className = "jw-drawer"; drawer.setAttribute("role", "dialog"); drawer.setAttribute("aria-modal", "true"); drawer.setAttribute("aria-labelledby", "jw-d-h");
    drawer.innerHTML = `<div class="grab" aria-hidden="true"><i></i></div>
      <div class="top"><img class="dlogo" src="${LOGO.light}" alt="" width="48" height="22"><p class="note dtop">${body.eyebrow}</p><button type="button" class="x" aria-label="${tx("close")}"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3 3 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div>
      <div class="in">${body.html}</div>`;
    lock(true);
    document.body.append(scrim, drawer);
    document.getElementById("app")?.setAttribute("aria-hidden", "true");
    const sc = scrim, dr = drawer; // a fast open-then-close must not touch a removed drawer
    requestAnimationFrame(() => { sc.classList.add("on"); dr.classList.add("on"); });
    scrim.addEventListener("click", () => closeFinding());
    drawer.querySelector(".x").addEventListener("click", () => closeFinding());
    drawer.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => body.act && body.act(b.dataset.a)));
    swipe(drawer);
    drawer.querySelector(".x").focus({ preventScroll: true });
    // The back button closes the drawer: it gets its own history entry.
    if (opts.fromLoad) { pushed = false; }
    else { history.pushState({ jwDrawer: k }, "", location.pathname + location.search + "#f=" + k); pushed = true; }
    return true;
  }
  function closeNow() {
    if (!drawer) return;
    const d = drawer, s = scrim; drawer = scrim = null;
    d.remove(); s.remove();
    document.getElementById("app")?.removeAttribute("aria-hidden");
    lock(false);
  }
  function closeFinding() {
    if (!drawer) return;
    if (pushed) { pushed = false; history.back(); return; } // popstate finishes the close
    closeNow();
    history.replaceState(null, "", location.pathname + location.search);
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  window.addEventListener("popstate", () => {
    if (drawer) { pushed = false; closeNow(); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); }
  });

  // Swipe down to close, on the bottom sheet only, and only when its content is at the top.
  function swipe(d) {
    let y0 = null, dy = 0, t0 = 0;
    const sheet = () => !matchMedia("(min-width: 900px)").matches;
    d.addEventListener("touchstart", (e) => {
      if (!sheet() || e.touches.length !== 1) return;
      const onGrab = e.target.closest(".grab, .top");
      if (!onGrab && d.scrollTop > 0) return;
      y0 = e.touches[0].clientY; dy = 0; t0 = performance.now();
    }, { passive: true });
    d.addEventListener("touchmove", (e) => {
      if (y0 == null) return;
      dy = e.touches[0].clientY - y0;
      if (dy > 0) { d.classList.add("drag"); d.style.transform = `translateY(${dy}px)`; if (e.cancelable) e.preventDefault(); }
      else if (d.classList.contains("drag")) { d.style.transform = ""; }
    }, { passive: false });
    const end = () => {
      if (y0 == null) return;
      const fast = dy > 40 && performance.now() - t0 < 250;
      d.classList.remove("drag");
      if (dy > Math.min(140, d.offsetHeight * 0.25) || fast) { d.style.transform = "translateY(100%)"; setTimeout(closeFinding, 160); }
      else d.style.transform = "";
      y0 = null; dy = 0;
    };
    d.addEventListener("touchend", end);
    d.addEventListener("touchcancel", end);
  }

  function copy(text) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).catch(() => {}).finally(() => {
      const el = document.createElement("div"); el.className = "jw-toast"; el.setAttribute("role", "status"); el.textContent = tx("copied");
      document.body.append(el); setTimeout(() => el.remove(), 1400);
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!drawer) return;
    if (e.key === "Escape") { e.preventDefault(); closeFinding(); return; }
    if (e.key === "Tab") { // keep focus inside the open drawer
      const f = [...drawer.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])")].filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });

  document.addEventListener("click", (e) => {
    const l = e.target.closest("button[data-lang]"); if (l) { setLang(l.dataset.lang); return; }
    const v = e.target.closest("button[data-view]"); if (v) { setView(v.dataset.view); return; }
    const o = e.target.closest("[data-open]");
    if (o && !o.closest("[inert]")) { e.preventDefault(); openFinding(o.dataset.open); document.dispatchEvent(new CustomEvent("jw:opened")); }
  });

  function fillChrome() {
    document.querySelectorAll("[data-brand]").forEach((el) => (el.innerHTML = brand()));
    document.querySelectorAll("[data-brandfoot]").forEach((el) => { el.classList.add("jw-foot"); el.innerHTML = brandFoot(); });
    document.querySelectorAll("[data-langtoggle]").forEach((el) => (el.innerHTML = langToggle()));
    document.querySelectorAll("[data-viewtoggle]").forEach((el) => (el.innerHTML = viewToggle()));
    document.title = `${tx("title")} · ${tx("site")}`;
    document.querySelectorAll(".skiplink").forEach((el) => (el.textContent = tx("skipTo")));
    document.querySelectorAll("nav.ctl").forEach((el) => el.setAttribute("aria-label", tx("settings")));
  }
  function rerender(keepFocus) {
    const open = drawer && location.hash.startsWith("#f=") ? location.hash.slice(3) : null;
    if (open) closeNow();
    document.documentElement.lang = lang;
    renderers.forEach((r) => r());
    fillChrome();
    if (keepFocus) document.querySelector(`button[data-${keepFocus[0]}="${keepFocus[1]}"]`)?.focus({ preventScroll: true });
    if (open) { pushed = false; openFinding(open, { fromLoad: true }); }
  }
  function setLang(l) {
    if (l === lang) return;
    lang = l; localStorage.setItem("jw-lang", l); setParam("lang", l);
    rerender(["lang", l]);
  }
  function setView(v) {
    if (v === view) return;
    view = v; localStorage.setItem("jw7-view", v); setParam("view", v);
    // The intro and the end are the same in both views: only the middle changes. A reader
    // who was already in the middle lands at its start, under the switch.
    const mid = document.getElementById("mid"), head = document.querySelector(".top");
    const inMid = mid && window.scrollY + (head ? head.offsetHeight : 0) >= mid.offsetTop;
    rerender(["view", v]);
    const m2 = document.getElementById("mid");
    if (inMid && m2) window.scrollTo(0, m2.offsetTop - (head ? head.offsetHeight : 0));
  }
  function onRender(fn) {
    renderers.push(fn);
    document.documentElement.lang = lang;
    fn();
    fillChrome();
    const m = location.hash.match(/^#f=(\w+)/);
    if (m) openFinding(m[1], { fromLoad: true });
  }

  window.JWUI = { reportLink, LAUNCH, ofTxt, LOGO, TAGLINE, JW, t, tx, N, dev, dev2, esc, viz, chip, gapCode, bigHTML, stageOf, byKey, openFinding, closeFinding, extra, onRender, UI, TONE,
    get lang() { return lang; }, get view() { return view; } };
})();
