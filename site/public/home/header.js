/* The site header: one component for every page (damo, 10 November). The home page (this
   mockup, and the site's "/") and the site's report pages (React, Layout.tsx) both call
   JWHeader.mount(), so the logo, the name, the report sections and English | नेपाली are the
   same markup, the same styles (header.css) and the same behaviour everywhere.

   Wide screens: the sections in one row. Phones and tablets: a ☰ button opens them as a
   full-screen sheet (rows of at least 44 px, focus kept inside, Esc or Back closes); the
   language toggle stays outside the sheet, always visible.

   JWHeader.mount(el, { lang, path, base, onLang, inSite })
     el      the <header> element; its contents are replaced, except a child .bar (the
             home page's progress line), which is kept.
     lang    "en" | "ne"
     path    the current route ("/", "/highlights", …), marked aria-current
     base    the site's base URL ("/"); outside the site the links go to research.jawafdehi.org
     onLang  called with "en" | "ne" when a language button is pressed (the home page
             handles its own buttons through [data-lang], so it passes nothing) */
(function () {
  const SECTIONS = [
    { path: "/highlights", en: "Highlights", ne: "मुख्य निष्कर्ष" },
    { path: "/report", en: "Full report", ne: "पूरा प्रतिवेदन" },
    { path: "/investigation", en: "Investigation", ne: "अनुसन्धान" },
    { path: "/prosecution", en: "Prosecution", ne: "अभियोजन" },
    { path: "/court-outcomes", en: "Court outcomes", ne: "अदालतको फैसला" },
    { path: "/appeals", en: "Appeals", ne: "पुनरावेदन" },
    { path: "/method", en: "Method", ne: "विधि" },
  ];
  const T = {
    site: { en: "Jawafdehi Initiative", ne: "जवाफदेही इनिशिएटिभ" },
    research: { en: "Research", ne: "अनुसन्धान" },
    home: { en: "Home: Where accountability leaks", ne: "गृहपृष्ठ: जवाफदेहिता कहाँ चुहिन्छ" },
    homeShort: { en: "Home", ne: "गृहपृष्ठ" },
    sections: { en: "Report sections", ne: "प्रतिवेदनका खण्ड" },
    menu: { en: "Menu", ne: "मेनु" },
    close: { en: "Close the menu", ne: "मेनु बन्द गर्नुहोस्" },
    lang: { en: "Language", ne: "भाषा" },
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const logoSrc = (o) => (o.inSite ? `${o.base}home/brand/` : "/home/brand/") + "jawafdehi-logo-navy-for-light-bg.svg";

  let sheetOpen = null; // the open sheet's close function, if any

  function href(o, p) {
    const root = o.inSite ? o.base.replace(/\/$/, "") : "https://research.jawafdehi.org";
    return `${root}${p}${o.lang === "ne" ? "?lang=ne" : ""}`;
  }
  const isCur = (o, p) => (p === "/" ? o.path === "/" : o.path.startsWith(p));

  function html(o) {
    const t = (x) => x[o.lang] || x.en;
    const links = (cls) => SECTIONS.map((s) => `<li><a class="${cls}" href="${esc(href(o, s.path))}"${isCur(o, s.path) ? ' aria-current="page"' : ""}>${esc(t(s))}</a></li>`).join("");
    return `<div class="jw-hd-in">
      <a class="jw-brand" href="${esc(href(o, "/"))}" aria-label="${esc(t(T.site))} · ${esc(t(T.home))}"${o.path === "/" ? ' aria-current="page"' : ""}><img src="${esc(logoSrc(o))}" alt="" width="66" height="30"><span aria-hidden="true"><b>${esc(t(T.site))}</b><span class="rs">${esc(t(T.research))}</span></span></a>
      <nav class="jw-hd-nav" aria-label="${esc(t(T.sections))}"><ul>${links("jw-hd-a")}</ul></nav>
      <div class="jw-hd-lang"><div class="seg" role="group" aria-label="${esc(t(T.lang))}"><button type="button" data-lang="en" lang="en" aria-pressed="${o.lang === "en"}">English</button><button type="button" data-lang="ne" lang="ne" aria-pressed="${o.lang === "ne"}">नेपाली</button></div></div>
      <button type="button" class="jw-hd-menu" aria-expanded="false" aria-controls="jw-hd-sheet"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>${esc(t(T.menu))}</span></button>
    </div>
    <div class="jw-hd-sheet" id="jw-hd-sheet" role="dialog" aria-modal="true" aria-label="${esc(t(T.sections))}" hidden>
      <div class="jw-hd-sheet-top"><span>${esc(t(T.sections))}</span><button type="button" class="jw-hd-x" aria-label="${esc(t(T.close))}"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3 3 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div>
      <ul><li><a class="jw-hd-row" href="${esc(href(o, "/"))}"${o.path === "/" ? ' aria-current="page"' : ""}>${esc(t(T.homeShort))}</a></li>${links("jw-hd-row")}</ul>
    </div>`;
  }

  function wire(el, o) {
    const btn = el.querySelector(".jw-hd-menu"), sheet = document.getElementById("jw-hd-sheet");
    const focusables = () => [...sheet.querySelectorAll("a[href], button")];
    let pushed = false;
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key !== "Tab") return;
      const f = focusables(), a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    const onPop = () => { if (!sheet.hidden) { pushed = false; close(true); } };
    function open() {
      sheet.hidden = false; btn.setAttribute("aria-expanded", "true");
      document.documentElement.classList.add("jw-hd-locked");
      document.addEventListener("keydown", onKey, true);
      window.addEventListener("popstate", onPop);
      // Back closes the sheet: it gets its own history entry.
      history.pushState(Object.assign({}, history.state, { jwMenu: 1 }), "", location.href); pushed = true;
      sheetOpen = () => close();
      (sheet.querySelector('[aria-current="page"]') || sheet.querySelector(".jw-hd-x")).focus({ preventScroll: true });
    }
    function close(fromPop) {
      if (sheet.hidden) return;
      sheet.hidden = true; btn.setAttribute("aria-expanded", "false");
      document.documentElement.classList.remove("jw-hd-locked");
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("popstate", onPop);
      sheetOpen = null;
      if (pushed && !fromPop) { pushed = false; history.back(); }
      btn.focus({ preventScroll: true });
    }
    btn.addEventListener("click", () => (sheet.hidden ? open() : close()));
    sheet.querySelector(".jw-hd-x").addEventListener("click", () => close());
    // A link in the sheet leaves the page; close first so Back from the next page is clean.
    sheet.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { pushed = false; sheet.hidden = true; document.documentElement.classList.remove("jw-hd-locked"); }));
    if (o.onLang) el.querySelectorAll("button[data-lang]").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); o.onLang(b.dataset.lang); }));
  }

  function mount(el, opts) {
    const o = Object.assign({ lang: "en", path: "/", base: "/", inSite: !!window.JW_IN_SITE }, opts);
    if (sheetOpen) sheetOpen();
    const bar = el.querySelector(":scope > .bar");
    el.classList.add("jw-hd");
    document.querySelectorAll("body > .jw-hd-sheet").forEach((x) => x.remove());
    el.innerHTML = html(o);
    if (bar) el.append(bar);
    // The sheet lives on <body>: a fixed element inside the header (which has a backdrop
    // filter) would be placed against the header, not the screen.
    document.body.append(el.querySelector(".jw-hd-sheet"));
    wire(el, o);
  }

  // The site footer, also one component for every page: the white logo, the tagline, the
  // byline, then each page's own lines (plain text or trusted markup from the page itself).
  const TAGLINE = "जवाफदेहिताको कहिल्यै म्याद सकिँदैन।";
  const BYLINE = { en: "A research report by Jawafdehi Initiative · jawafdehi.org", ne: "जवाफदेही इनिशिएटिभको अनुसन्धान प्रतिवेदन · jawafdehi.org" };
  function footer(el, opts) {
    const o = Object.assign({ lang: "en", base: "/", inSite: !!window.JW_IN_SITE, lines: [] }, opts);
    const src = (o.inSite ? `${o.base}home/brand/` : "/home/brand/") + "jawafdehi-logo-white-for-dark-bg.svg";
    el.classList.add("jw-foot");
    el.innerHTML = `<div class="in"><img src="${esc(src)}" alt="${esc(T.site[o.lang] || T.site.en)}" width="75" height="34"><div><p class="tag" lang="ne">${TAGLINE}</p><small>${esc(BYLINE[o.lang] || BYLINE.en)}</small>${o.lines.map((l) => `<small${l.cls ? ` class="${esc(l.cls)}"` : ""}>${l.html != null ? l.html : esc(l.text)}</small>`).join("")}</div></div>`;
  }

  window.JWHeader = { mount, footer, SECTIONS, TAGLINE };
})();
