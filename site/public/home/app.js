/* Option 7: the funnel (main view) and the leaking pipe (second view). Same findings, same
   gap cards, same evidence drawer.

   The funnel is driven by native scrolling only. Everything on screen is a pure function of
   the scroll position: draw(P) reads window.scrollY, works out P (how far down the funnel
   the reader is), and sets the whole stage from P alone. No state is carried from one frame
   to the next, so fling scrolls, momentum, overscroll bounce and jumping straight to the end
   all land in the right place. Every count, rate and label comes from window.JW. */
(function () {
  const U = JWUI, { JW, t, tx, N, dev, dev2, esc, chip, gapCode, byKey, LOGO } = U;
  const F = JW.funnel, S = F.stages, V = F.values, LAST = S.length - 1;
  const qs = new URLSearchParams(location.search);
  const RM = matchMedia("(prefers-reduced-motion: reduce)");
  const AT = qs.get("at");
  const num = (s) => Number(String(s).replace(/,/g, ""));
  const inN = (s) => (U.lang === "ne" ? String(s).replace(/(\d+) in (\d+)/, (m, a, b) => `${dev(b)} मा ${dev(a)}`) : s);
  // Fill {key} from the funnel's computed values, with Nepali digits in Nepali.
  const fill = (s) => s.replace(/\{(\w+)\}/g, (m, k) => {
    if (k === "nLeaks") return N(JW.findings.length);
    if (k === "perK") return N(Math.floor(F.end.per10k / 10) + 1); // "fewer than N in 1,000", from the end figure
    if (k === "toInv") return N(byKey("shelved").viz.parts.find((p) => p.tone === "on").v);
    const v = V[k]; if (v == null) throw new Error("no value " + k);
    if (/ in /.test(v)) return inN(v);
    if (/%$/.test(v)) return dev2(v);
    if (/^[\d,]+$/.test(v)) return N(num(v));
    return dev2(v);
  });
  const T = (o) => fill(t(o));

  const C = {
    q: { en: "In {fy} the CIAA received {n} new complaints. How many end in a conviction that stands?", ne: "आ.व. {fy} मा अख्तियार दुरुपयोग अनुसन्धान आयोगमा {n} नयाँ उजुरी दर्ता भए। तीमध्ये कतिमा अन्तिमसम्म कायम रहने कसुर ठहर हुन्छ?" },
    sub: {
      en: "Follow one year of complaints from the CIAA to the Supreme Court, stage by stage. At each stage, red cards show where accountability leaks. Tap any card for the evidence.",
      ne: "एक वर्षका उजुरीलाई अख्तियारदेखि सर्वोच्च अदालतसम्म चरणगत रूपमा पछ्याउनुहोस्। हरेक चरणमा रातो कार्डहरूले जवाफदेहिता कहाँ चुहिन्छ भन्ने देखाउँछन्। प्रमाण हेर्न कुनै पनि कार्डमा थिच्नुहोस्।",
    },
    cue: { en: "Scroll down", ne: "तल स्क्रोल गर्नुहोस्" },
    // One line in the intro with the two figures that matter (both from the funnel's data).
    gist: { en: "{fy}: {complaints} complaints to the CIAA → about {supreme} cases with a conviction that stands", ne: "आ.व. {fy}: अख्तियारमा {complaints} उजुरी → कसुर ठहर कायम रहने करिब {supreme} मुद्दा" },
    skip: { en: "Without animation", ne: "एनिमेसनबिना" },
    skipShort: { en: "Static", ne: "स्थिर" },
    skipLong: { en: "Or read it all on one page, without animation", ne: "वा एनिमेसनबिना सबै एउटै पानामा पढ्नुहोस्" },
    animated: { en: "With animation", ne: "एनिमेसनसहित" },
    per: { en: "For every 10,000 complaints:", ne: "प्रति १०,००० उजुरी:" },
    est: { en: "Our estimate", ne: "हाम्रो अनुमान" },
    figSrc: { en: "How this figure was counted", ne: "यो अंक कसरी निकालियो" },
    leaks: { en: "Where it leaks at this stage", ne: "यस चरणमा कहाँ चुहिन्छ" },
    hint: { en: "Tap a card to see the evidence", ne: "प्रमाण हेर्न कार्डमा थिच्नुहोस्" },
    scale: { en: "Widths are not to scale, so that every stage can be read.", ne: "हरेक चरण पढ्न सकियोस् भनेर पट्टीहरूको चौडाइ अनुपातअनुसार राखिएको छैन।" },
    ciaa: { en: "CIAA", ne: "अख्तियार" },
    courts: { en: "Courts", ne: "अदालत" },
    endEyebrow: { en: "Where it ends", ne: "अन्त्यमा" },
    estLine: { en: "An estimate: each stage's rate applied in turn to one year's complaints, not one group of complaints followed to the end.", ne: "अनुमान: एक वर्षका उजुरीमा हरेक चरणको दर क्रमशः लागू गरेर निकालिएको, उजुरीको एउटै समूहलाई अन्त्यसम्म पछ्याएर होइन।" },
    squares: { en: "Each square is one complaint: 10,000 in all", ne: "हरेक वर्ग एउटा उजुरी हो (जम्मा १०,०००)।" },
    stands: { en: "End in a conviction that stands", ne: "अन्तिमसम्म कसुर ठहर कायम रहने" },
    leaked: { en: "Lost along the way", ne: "बीच बाटोमै छुटेका" },
    endLine: {
      en: "About {end} in every 10,000 complaints end in a conviction that still stands after the Supreme Court: fewer than {perK} in 1,000.",
      ne: "हरेक १०,००० उजुरीमध्ये करिब {end} मा मात्र सर्वोच्च अदालतपछि पनि कसुर ठहर कायम रहन्छ: १,००० मा {perK} भन्दा कम।",
    },
    money: { en: "And the money? No one publishes how much is recovered from corruption judgments.", ne: "अनि रकम? भ्रष्टाचारका फैसलाबाट कति रकम असुल भयो भन्ने कसैले प्रकाशित गर्दैन।" },
    how: { en: "How we counted", ne: "हामीले कसरी गन्यौं" },
    print: { en: "Print or save as PDF", ne: "प्रिन्ट गर्नुहोस् वा PDF मा सुरक्षित गर्नुहोस्" },
    printNote: { en: "The whole page, without animation, ready to print.", ne: "पूरा पाना, एनिमेसनबिना, प्रिन्टका लागि तयार।" },
    all: { en: "All {nLeaks} leaks, with evidence", ne: "सबै {nLeaks} चुहावट, प्रमाणसहित" },
    allNote: { en: "The report's {nLeaks} headline findings, in the order of the report's ranking: by how large each leak is and how sure we are. Findings the ranking does not cover come last.",
      ne: "प्रतिवेदनका {nLeaks} मुख्य निष्कर्ष, प्रतिवेदनको क्रमअनुसार: हरेक चुहावट कति ठूलो छ र हामी कत्तिको निश्चित छौं भन्ने आधारमा। क्रममा नपरेका निष्कर्ष अन्त्यमा छन्।" },
    ranked: { en: "The ranked list", ne: "क्रमबद्ध सूची" },
    tier: [{ en: "The biggest leaks, best evidenced", ne: "सबैभन्दा ठूला, सबैभन्दा बलियो प्रमाण भएका चुहावट" }, { en: "Also ranked in the report", ne: "प्रतिवेदनको क्रममा परेका अन्य चुहावट" }, { en: "Not in the report's ranking", ne: "प्रतिवेदनको क्रममा नपरेका" }],
    method: [
      { en: "No public record follows a complaint all the way from the CIAA to the Supreme Court. That is itself one of the gaps. So we take one year's complaints and apply the rate measured at each later stage.",
        ne: "कुनै उजुरीलाई अख्तियारदेखि सर्वोच्च अदालतसम्म पछ्याउने सार्वजनिक अभिलेख छैन। यो आफैंमा एउटा कमी हो। त्यसैले हामीले एक वर्षका उजुरी लिएर त्यसपछिका हरेक चरणमा नापिएको दर लागू गरेका छौं।" },
      { en: "{complaints} new complaints, {investigated} complaints sent on for full investigation and {filed} cases filed in court are the CIAA's own figures for {fy}, from the summary of its 36th annual report. They count different events in the same year; they do not follow one group of complaints.",
        ne: "{complaints} नयाँ उजुरी, विस्तृत अनुसन्धानका लागि पठाइएका {investigated} उजुरी र अदालतमा दायर {filed} मुद्दा अख्तियारकै ३६औं वार्षिक प्रतिवेदनको सारांशमा दिइएका {fy} का तथ्यांक हुन्। यिनले एउटै वर्षका फरक घटना गन्छन्; उजुरीको एउटै समूहलाई पछ्याउँदैनन्।" },
      { en: "Special Court: {lrConv} of {lrDec} decided CIAA cases ({convRate}) ended with at least one person convicted. Supreme Court: when a convicted person appealed, the conviction was not fully overturned in {apStand} of the {apDec} cases whose appeal has been decided ({standRate}). Both rates come from many years of court records.",
        ne: "विशेष अदालत: फैसला भएका अख्तियारका {lrDec} मुद्दामध्ये {lrConv} ({convRate}) मा कम्तीमा एक प्रतिवादीलाई कसुर ठहर भयो। सर्वोच्च अदालत: कसुरदार ठहरिएका प्रतिवादीले पुनरावेदन गर्दा पुनरावेदनको फैसला भएका {apDec} मुद्दामध्ये {apStand} ({standRate}) मा कसुर ठहर पूरै उल्टिएन। दुवै दर धेरै वर्षका अदालती अभिलेखबाट लिइएका हुन्।" },
      { en: "So the funnel shows the odds the system gives a complaint, not one group of complaints followed to the end. The court stages count cases, not people. If every conviction that nobody appealed also stands (about {appealedShare} convictions have an appeal on record), the end figure is about {endHi} in 10,000 ({endHiPct}) instead of {end}.",
        ne: "त्यसैले फनेलले प्रणालीमा आएको एउटा उजुरी हरेक चरण पार गर्ने सम्भावना देखाउँछ; उजुरीको एउटै समूहलाई अन्त्यसम्म पछ्याएको होइन। अदालतका चरणले मुद्दा गन्छन्, व्यक्ति होइन। पुनरावेदन नभएका सबै कसुर ठहर कायम रहन्छन् भनी मान्ने हो भने (करिब {appealedShare} कसुर ठहरमा पुनरावेदन अभिलेखमा छ), अन्तिम अंक {end} को सट्टा १०,००० मा करिब {endHi} ({endHiPct}) हुन्छ।" },
    ],
    latest: { en: "CIAA figures are for {fy}, from the summary of its 36th annual report (published 14 Kartik 2083). The full report is not yet online. Where the summary does not give a figure, the card uses {fyOld} (35th report) and says so.",
      ne: "अख्तियारका तथ्यांक {fy} का हुन्, ३६औं वार्षिक प्रतिवेदनको सारांशबाट (२०८३ कार्तिक १४ मा सार्वजनिक)। पूरा प्रतिवेदन अझै अनलाइन छैन। सारांशमा नभएका अंकका लागि कार्डमा {fyOld} (३५औं प्रतिवेदन) प्रयोग गरिएको छ र सोही कुरा उल्लेख छ।" },
    src: { en: "Sources: CIAA 36th annual report, summary ({fy}), and 35th annual report ({fyOld}); Special Court and Supreme Court case records.", ne: "स्रोत: अख्तियारको ३६औं वार्षिक प्रतिवेदनको सारांश ({fy}) र ३५औं वार्षिक प्रतिवेदन ({fyOld}); विशेष अदालत र सर्वोच्च अदालतका मुद्दाका अभिलेख।" },
  };

  // Each funnel stage, in the reader's words. Numbers are {placeholders} from the data.
  const STAGE = {
    complaints: {
      name: { en: "Complaints", ne: "उजुरी" },
      label: { en: "new complaints registered with the CIAA in {fy}", ne: "{fy} मा अख्तियारमा दर्ता भएका नयाँ उजुरी" },
      note: { en: "Counting complaints carried over from the year before, {onBooks} were on its books.", ne: "अघिल्लो वर्षबाट सरेका उजुरीसमेत गर्दा {onBooks} उजुरी थिए।" },
      how: { en: "The number of new complaints the CIAA registered in fiscal year {fy}. Counting complaints carried over from the year before, {onBooks} were on its books that year.",
        ne: "आर्थिक वर्ष {fy} मा अख्तियारमा दर्ता भएका नयाँ उजुरीको संख्या। अघिल्लो वर्षबाट सरेका उजुरीसमेत गर्दा सो वर्ष {onBooks} उजुरी थिए।" },
      src: { en: "CIAA 36th annual report, summary ({fy}), page 3 and the province table", ne: "अख्तियारको ३६औं वार्षिक प्रतिवेदनको सारांश ({fy}), पृष्ठ ३ र प्रदेशगत तालिका" },
      href: "https://research.jawafdehi.org/report#complaints",
    },
    investigated: {
      name: { en: "Full investigation", ne: "विस्तृत अनुसन्धान" },
      label: { en: "complaints the CIAA sent on for full investigation that year", ne: "सो वर्ष अख्तियारले विस्तृत अनुसन्धानका लागि पठाएका उजुरी" },
      note: { en: "Most complaints are closed at screening or sent elsewhere.", ne: "धेरैजसो उजुरी स्क्रिनिङ र प्रारम्भिक छानबिनमै तामेलीमा राखिन्छन् वा अन्यत्र पठाइन्छन्।" },
      how: { en: "Complaints the CIAA sent on for a full investigation during {fy}, from the screening table in the summary of its 36th annual report. The summary does not give the number of full investigations completed that year, so this stage counts the complaints sent on: the same year and the same report as the other two CIAA figures.",
        ne: "{fy} मा अख्तियारले विस्तृत अनुसन्धानका लागि पठाएका उजुरी, ३६औं वार्षिक प्रतिवेदनको सारांशको प्रारम्भिक छानबिन तालिकाबाट। सारांशमा सो वर्ष सम्पन्न विस्तृत अनुसन्धानको संख्या दिइएको छैन, त्यसैले यस चरणले पठाइएका उजुरी गन्छ: अख्तियारका अरू दुई अंककै वर्ष र प्रतिवेदन।" },
      src: { en: "CIAA 36th annual report, summary ({fy}), screening table, page 7", ne: "अख्तियारको ३६औं वार्षिक प्रतिवेदनको सारांश ({fy}), प्रारम्भिक छानबिन तालिका, पृष्ठ ७" },
      href: "https://research.jawafdehi.org/report#investigation",
    },
    charged: {
      name: { en: "Decision to charge", ne: "मुद्दा दायर गर्ने निर्णय" },
      label: { en: "cases the CIAA filed at the Special Court", ne: "अख्तियारले विशेष अदालतमा दायर गरेका मुद्दा" },
      note: { en: "The CIAA's own figures end here. The next two stages are our estimates.", ne: "अख्तियारको आफ्नै तथ्यांक यहीँ सकिन्छ। त्यसपछिका दुई चरण हाम्रो अनुमान हुन्।" },
      how: { en: "Cases the CIAA filed at the Special Court in {fy} after a full investigation, from the summary of its 36th annual report. The 75% card at this stage is from {fyOld}, as the summary does not give it, and counts something else: the CIAA's decisions after a full investigation, not investigations finished. One finished investigation can lead to more than one decision (for example, a case filed and advice given), so the 75% cannot be worked out from the funnel's counts. Counted by investigation, the share closed is even higher.",
        ne: "विस्तृत अनुसन्धानपछि {fy} मा अख्तियारले विशेष अदालतमा दायर गरेका मुद्दा, ३६औं वार्षिक प्रतिवेदनको सारांशबाट। यस चरणको ७५% भन्ने कार्ड {fyOld} को हो (सारांशमा यो छैन), र फरक कुरा गन्छ: विस्तृत अनुसन्धानपछिका अख्तियारका निर्णय, सकिएका अनुसन्धान होइन। एउटा सम्पन्न अनुसन्धानमा एकभन्दा बढी निर्णय हुन सक्छ (जस्तै मुद्दा दायर र सुझाव), त्यसैले ७५% लाई फनेलका अंकबाट निकाल्न मिल्दैन। अनुसन्धानका हिसाबले गन्दा तामेलीको अनुपात अझ बढी हुन्छ।" },
      src: { en: "CIAA 36th annual report, summary ({fy}), page 7, the case table", ne: "अख्तियारको ३६औं वार्षिक प्रतिवेदनको सारांश ({fy}), पृष्ठ ७, मुद्दा तालिका" },
      href: "https://research.jawafdehi.org/report#investigation",
    },
    special: {
      name: { en: "Special Court", ne: "विशेष अदालत" },
      label: { en: "of the {filed} cases taken to court this year are estimated to end with at least one person convicted", ne: "यस वर्ष दायर {filed} मुद्दामध्ये कम्तीमा एक प्रतिवादीलाई कसुर ठहर हुने अनुमानित मुद्दा" },
      note: { en: "{convRate} of decided CIAA cases ({lrConv} of {lrDec}) end with at least one conviction.", ne: "फैसला भएका अख्तियारका मुद्दामध्ये {convRate} ({lrDec} मध्ये {lrConv}) मा कम्तीमा एक प्रतिवादीलाई कसुर ठहर हुन्छ।" },
      how: { en: "Our estimate. In the Special Court's record, {lrConv} of {lrDec} decided CIAA cases ({convRate}) ended with at least one person convicted. Applied to the {filed} cases filed in {fy}, that gives about {special}. It counts cases, not people.",
        ne: "हाम्रो अनुमान। विशेष अदालतको अभिलेखमा फैसला भएका अख्तियारका {lrDec} मुद्दामध्ये {lrConv} ({convRate}) मा कम्तीमा एक प्रतिवादीलाई कसुर ठहर भयो। {fy} मा दायर {filed} मुद्दामा यो दर लागू गर्दा करिब {special} हुन्छ। यसले मुद्दा गन्छ, व्यक्ति होइन।" },
      src: { en: "Special Court case records (downloaded 8 October 2026)", ne: "विशेष अदालतका मुद्दाका अभिलेख (२०८३ असोज २२ मा लिइएको)" },
      href: "https://research.jawafdehi.org/report#trial",
    },
    supreme: {
      name: { en: "Supreme Court", ne: "सर्वोच्च अदालत" },
      label: { en: "of the ≈{special} cases with a conviction are estimated to keep it after a Supreme Court appeal", ne: "कसुर ठहर भएका ≈{special} मुद्दामध्ये सर्वोच्च अदालतमा पुनरावेदनपछि पनि कसुर ठहर कायम रहने अनुमानित मुद्दा" },
      note: { en: "When a convicted person appeals, the conviction is not fully overturned in {standRate} of cases whose appeal has been decided ({apStand} of {apDec}).", ne: "कसुरदार ठहरिएका प्रतिवादीले पुनरावेदन गर्दा पुनरावेदनको फैसला भएका मुद्दामध्ये {standRate} ({apDec} मध्ये {apStand}) मा कसुर ठहर पूरै उल्टिँदैन।" },
      how: { en: "Our estimate. When a convicted person appealed, the Supreme Court did not fully overturn the conviction in {apStand} of the {apDec} cases whose appeal has been decided ({standRate}); in {apPartial} of these it overturned part of it. Applied to the estimated ≈{special} convictions, that gives about {supreme}. This treats every conviction as appealed; about {appealedShare} convictions have an appeal on record. If every conviction that nobody appealed also stands, the end figure is about {endHi} in 10,000 complaints instead of {end}.",
        ne: "हाम्रो अनुमान। कसुरदार ठहरिएका प्रतिवादीले पुनरावेदन गर्दा पुनरावेदनको फैसला भएका {apDec} मुद्दामध्ये {apStand} ({standRate}) मा सर्वोच्च अदालतले कसुर ठहर पूरै उल्टाएन; तीमध्ये {apPartial} मा कसुर ठहरको केही अंश उल्टियो। अनुमानित करिब {special} कसुर ठहरमा यो दर लागू गर्दा करिब {supreme} हुन्छ। यसमा सबै कसुर ठहरमा पुनरावेदन भएको मानिएको छ; करिब {appealedShare} कसुर ठहरमा पुनरावेदन अभिलेखमा छ। पुनरावेदन नभएका सबै कसुर ठहर कायम रहन्छन् भनी मान्ने हो भने अन्तिम अंक {end} को सट्टा १०,००० उजुरीमा करिब {endHi} हुन्छ।" },
      src: { en: "Supreme Court case records, each appeal linked to its trial (as of 3 November 2026)", ne: "सर्वोच्च अदालतका मुद्दाका अभिलेख, हरेक पुनरावेदन सम्बन्धित मुद्दासँग जोडिएको (२०८३ कार्तिक १७ सम्म)" },
      href: "https://research.jawafdehi.org/appeals#appeal-asymmetry",
    },
    recovery: {
      name: { en: "Money recovered", ne: "रकम असुली" },
      label: { en: "No one publishes how much money is recovered from corruption judgments.", ne: "भ्रष्टाचारका फैसलाबाट कति रकम असुल भयो भन्ने कसैले प्रकाशित गर्दैन।" },
      note: { en: "", ne: "" },
    },
  };
  // The report's ranking of the leaks (report/02-ranked-leaks.md: size × how sure we are).
  // Each finding takes the rank of the ranked leak it supports; findings the ranking does not
  // cover come last. The same order runs inside each stage and in "All the leaks".
  const RANK = { afterInvestigation: 1, oneWay: 2, whyLost: 2, notAppealed: 3, duration: 4, hearings: 4, neverListed: 4, shelved: 5, recovery: 6, whoConvicted: 7, lossRate: 8, whyAcquitted: 8 };
  const rankOf = (k) => RANK[k] || 99;
  const byRank = (a, b) => rankOf(a) - rankOf(b) || JW.findings.findIndex((f) => f.key === a) - JW.findings.findIndex((f) => f.key === b);
  // Tier 1: the leading finding of ranks 1–5; tier 2: the rest of the ranking; tier 3: not ranked.
  const LEADS = new Set(); Object.keys(RANK).sort(byRank).forEach((k) => { if (![...LEADS].some((x) => RANK[x] === RANK[k]) && RANK[k] <= 5) LEADS.add(k); });
  const tierOf = (k) => (LEADS.has(k) ? 1 : RANK[k] ? 2 : 3);
  S.forEach((st) => st.gaps.sort(byRank));
  // The Supreme Court's eight leaks come in three parts, so each screen has one subject.
  const PART = { oneWay: 0, whyLost: 0, notAppealed: 0, duration: 1, hearings: 1, neverListed: 1, arson: 2, noLink: 2 };
  const PARTS = { supreme: [{ en: "The appeal and its outcome", ne: "पुनरावेदन र त्यसको नतिजा" }, { en: "Years of waiting", ne: "वर्षौंको पर्खाइ" }, { en: "Lost files, missing links", ne: "नष्ट मिसिल, नजोडिएका पुनरावेदन" }] };

  // One scroll step per group of gap cards: up to three on wide screens; two on phones, where
  // every card is full width and leads with its sentence.
  const NARROW = matchMedia("(max-width: 599px)");
  const SHORTWIDE = matchMedia("(min-width: 600px) and (max-height: 860px)"); // e.g. 1024×768: two cards fit, three do not
  const PER = NARROW.matches || SHORTWIDE.matches ? 2 : 3;
  const STEPS = [];
  S.forEach((st, i) => {
    const parts = PARTS[st.key] ? PARTS[st.key].map((p, j) => ({ p, gaps: st.gaps.filter((k) => PART[k] === j) })) : [{ p: null, gaps: st.gaps }];
    parts.forEach(({ p, gaps }) => {
      const n = Math.ceil(gaps.length / PER) || 1, per = Math.ceil(gaps.length / n);
      for (let j = 0; j < n; j++) STEPS.push({ s: i, gaps: gaps.slice(j * per, (j + 1) * per), part: p });
    });
  });
  const NST = STEPS.length, LASTSTEP = NST - 1;
  console.assert(STEPS.flatMap((x) => x.gaps).length === JW.findings.length, "every finding is on one step");

  /* ---------- the funnel's shape ---------- */
  // Widths on a log scale between the first stage and the narrowest counted stage, so the
  // court stages stay readable; the narrowest is still a fifth of the mouth. Not to scale:
  // the page says so under the funnel.
  const Y = [120, 330, 480, 610, 730, 860], H2 = 24, TOP = 36, H = 960;
  const SOLID = Y[4] + H2 + 18, END = 935;
  const BND = (Y[2] + Y[3]) / 2;
  const counted = S.filter((s) => s.count != null).map((s) => s.count);
  const cMax = Math.max(...counted), cMin = Math.min(...counted);
  let W = 400, widths = [];
  function geom(w) {
    W = w;
    const top = W - 40, min = top * 0.2;
    widths = S.map((s) => (s.count == null ? null : min + (top - min) * (Math.log(s.count / cMin) / Math.log(cMax / cMin))));
    widths[LAST] = widths[LAST - 1];
  }
  const sm = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  function wall(y) {
    if (y <= Y[0] + H2) return widths[0];
    for (let i = 0; i < LAST; i++) {
      const a = Y[i] + H2, b = Y[i + 1] - H2;
      if (y <= a) return widths[i];
      if (y < b) return widths[i] + (widths[i + 1] - widths[i]) * sm((y - a) / (b - a));
    }
    return widths[LAST];
  }
  const ys = (y0, y1) => { const o = []; for (let y = y0; y < y1; y += 4) o.push(y); o.push(y1); return o; };
  const side = (y0, y1, k) => ys(y0, y1).map((y) => `${(W / 2 + (k * wall(y)) / 2).toFixed(1)},${y}`).join("L");
  const body = (y0, y1) => `M${side(y0, y1, -1)}L${ys(y0, y1).reverse().map((y) => `${(W / 2 + wall(y) / 2).toFixed(1)},${y}`).join("L")}Z`;
  const DROP = "M0,-6C2.6,-2.6 4.3,0 4.3,2.2A4.3,4.3 0 1 1 -4.3,2.2C-4.3,0 -2.6,-2.6 0,-6Z";
  const approx = (st) => (st.est ? "≈" : "");
  const countTxt = (st) => (st.count == null ? "?" : approx(st) + N(st.count));

  function svgHTML() {
    const alt = S.map((x) => `${t(STAGE[x.key].name)}: ${x.count == null ? "?" : countTxt(x)}`).join(", ");
    let s = `<svg class="fsvg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="${esc(alt)}">
      <defs><clipPath id="fc"><rect id="fcr" x="0" y="0" width="${W}" height="${H}"/></clipPath></defs>
      <line class="bnd" x1="0" x2="${W}" y1="${BND}" y2="${BND}"/>
      <text class="bt" x="${W - 2}" y="${BND - 8}" text-anchor="end">${esc(t(C.ciaa))}</text><text class="bt" x="${W - 2}" y="${BND + 20}" text-anchor="end">${esc(t(C.courts))}</text>
      <path class="ghost" d="${body(TOP, SOLID)}"/>
      <g clip-path="url(#fc)"><path class="liq ciaa" d="${body(TOP, Math.min(SOLID, BND))}"/><path class="liq court" d="${body(BND, SOLID)}"/></g>
      <ellipse id="surf" cx="${W / 2}" cy="0" rx="0" ry="0"/>
      <path class="wall" d="M${side(TOP, SOLID, -1)}"/><path class="wall" d="M${side(TOP, SOLID, 1)}"/>
      <path class="dash" d="M${side(SOLID, END, -1)}"/><path class="dash" d="M${side(SOLID, END, 1)}"/>
      <ellipse class="rim" cx="${W / 2}" cy="${TOP}" rx="${widths[0] / 2}" ry="${Math.min(12, widths[0] * 0.05)}"/>
      <text class="q" id="q" x="${W / 2}" y="${Y[LAST] + 20}" text-anchor="middle">?</text>
      <line class="lead" id="lead" x1="0" y1="0" x2="0" y2="0"/>`;
    S.forEach((st, i) => {
      if (st.count != null) {
        const w = widths[i], inside = w > 70;
        s += `<text class="lvl${inside ? " in" : ""}" data-s="${i}" x="${inside ? W / 2 : W / 2 - w / 2 - 8}" y="${Y[i] + 6}" text-anchor="${inside ? "middle" : "end"}">${esc(countTxt(st))}</text>`;
      }
      const x0 = W / 2 + widths[i] / 2;
      st.gaps.forEach((k, j) => {
        const x = x0 + 12 + (j % 4) * 11, y = Y[i] + 4 + Math.floor(j / 4) * 13;
        s += `<path class="drop" data-s="${i}" transform="translate(${x.toFixed(1)},${y})" d="${DROP}"/>`;
      });
    });
    return s + "</svg>";
  }

  /* ---------- markup ---------- */
  const handSVG = `<span class="hand" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26"><path fill="#0e1f3b" stroke="#fff" stroke-width="1.2" paint-order="stroke" d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"/></svg></span>`;
  // A card leads with the gap, as a plain sentence; the figure is its evidence, underneath,
  // with its unit and base.
  const card = (k, first, tier) => {
    const f = byKey(k), g = gapCode(f.gap), v = f.pill || t(f.card || f.big.value);
    const ev = evHTML(f) || (f.pill ? esc(t(f.tag)) : `<b class="v num">${esc(v)}${f.big.unit.en ? ` ${esc(t(f.big.unit))}` : ""}</b> ${esc(t(f.tag))}`);
    return `<button type="button" class="card${tier ? " t" + tier : ""}" data-open="${k}"><span class="hl">${esc(t(f.headline))}</span><span class="ev">${ev}</span><span class="ft"><i class="kind" data-gap="${esc(g)}">${esc(t(KIND[f.gap]))}</i><span class="go">${esc(tx("evidence"))} →</span></span>${first ? handSVG : ""}</button>`;
  };
  // The honesty label (A / A→B / B) on each card, in plain words; the drawer gives the full meaning.
  const KIND = {
    A: { en: "Gap in the system", ne: "प्रणालीको कमी" },
    "leak+A": { en: "Measured leak", ne: "मापन गरिएको चुहावट" },
    "A→B": { en: "Gap in the system; also limits this research", ne: "प्रणालीको कमी; यस अनुसन्धानको पनि सीमा" },
    B: { en: "Limit of this research", ne: "यस अनुसन्धानको सीमा" },
  };
  // The evidence as one full sentence (evidence.js), its figure in bold.
  const evHTML = (f) => { if (!f.ev) return ""; const sn = t({ en: f.ev.en, ne: f.ev.ne }), fg = U.lang === "ne" ? f.ev.fig_ne : f.ev.fig_en; return fg ? esc(sn).replace(esc(fg), `<b class="v num">${esc(fg)}</b>`) : esc(sn); };
  // Tier 3: one line each, opens the drawer.
  const row3 = (k) => { const f = byKey(k), v = f.pill || t(f.card || f.big.value); return `<button type="button" class="row3" data-open="${k}"><span class="hl">${esc(t(f.headline))}</span> <span class="ev">${evHTML(f) || `<b class="num">${esc(v)}${f.big.unit.en && !f.pill ? " " + esc(t(f.big.unit)) : ""}</b> ${esc(t(f.tag))}`}</span> <span class="go">→</span></button>`; };
  const cm = (x) => esc(x).replace(/[,.]/g, (c) => `<span class="cm">${c}</span>`);
  const instDot = (st) => `<i class="dot ${st.inst}"></i>`;
  // The eyebrow names who holds the case, so it never repeats the stage name below it.
  const WHO = { ciaa: { en: "CIAA", ne: "अख्तियार" }, special: { en: "Courts", ne: "अदालत" }, supreme: { en: "Courts", ne: "अदालत" }, none: { en: "After the verdict", ne: "फैसलापछि" } };
  const eyebrowTxt = (st) => t(WHO[st.inst]);
  const perTxt = (st) => (st.per10k == null || st === S[0] ? "" : `${esc(t(C.per))} <b class="num">${approx(st)}${N(st.per10k)}</b>`);
  const skipHref = (on) => { const u = new URL(location.href); u.hash = ""; on ? u.searchParams.set("static", "1") : u.searchParams.delete("static"); u.searchParams.delete("at"); return u.pathname + u.search; };

  const printHref = () => { const u = new URL(skipHref(true), location.href); u.searchParams.set("view", "funnel"); u.searchParams.set("print", "1"); return u.pathname + u.search; };
  // Screens too short for the funnel beside its cards (landscape phones, 320×568, 200% zoom)
  // get the one-page version, which shows the same content.
  const SHORT = matchMedia("(max-height: 600px)");
  const isStatic = () => qs.has("static") || RM.matches || SHORT.matches;
  // The Funnel | Pipeline switch opens the middle part; it sticks while the reader is in it.
  const switchHTML = (live) => `<div class="switch" id="switch"><div class="swin"><span class="swl" id="swl">${esc(tx("viewLabel"))}</span><span data-viewtoggle></span>${U.view === "funnel" ? `<a class="skip" id="skip" href="${skipHref(live)}"><span class="lg">${esc(t(live ? C.skip : C.animated))}</span>${live ? `<span class="sh" aria-hidden="true">${esc(t(C.skipShort))}</span>` : ""}</a>` : ""}</div></div>`;

  function introHTML() {
    return `<section class="intro" id="intro"><div class="in">
      <p class="byname">${esc(t({ en: "Jawafdehi Initiative · जवाफदेही", ne: "जवाफदेही इनिशिएटिभ" }))}</p>
      <p class="eyebrow">${esc(tx("title"))}</p>
      <h1>${esc(t(C.q)).replace("{fy}", esc(dev2(V.fy))).replace("{n}", `<span class="num">${cm(N(S[0].count))}</span>`)}</h1>
      <p class="sub">${esc(t(C.sub))}</p>
      <p class="gist num">${esc(T(C.gist))}</p>
      <p class="cue" aria-hidden="true">${esc(t(C.cue))}<svg width="22" height="22" viewBox="0 0 22 22"><path d="M4 8l7 7 7-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></p>
    </div></section>`;
  }

  // Phones: the funnel as a ladder of full-width rows, one per stage, narrowing as it goes.
  function ladderHTML() {
    const counted = S.filter((s) => s.count != null).map((s) => s.count), mx = Math.max(...counted), mn = Math.min(...counted);
    const w = (c) => (c == null ? 18 : 18 + 82 * (Math.log(c / mn) / Math.log(mx / mn)));
    return `<nav class="ladder" id="ladder" aria-label="${esc(tx("stage"))}"><ol>${S.map((st, i) => `${i === 3 ? `<li class="lbnd" aria-hidden="true"><span>${esc(t(C.ciaa))} ↑</span><span>${esc(t(C.courts))} ↓</span></li>` : ""}<li data-s="${i}"><button type="button" data-jump="${i}"><span class="ln">${esc(t(STAGE[st.key].name))}</span><span class="lb"><i class="${st.inst}" style="width:${w(st.count).toFixed(0)}%"></i></span><span class="lc num">${countTxt(st)}</span></button></li>`).join("")}</ol></nav>`;
  }

  function stageHTML() {
    return `<section class="track" id="track" aria-label="${esc(tx("title"))}"><div class="stage" id="stage">
      <div class="read">
        <p class="eyebrow" id="eb"></p>
        <p class="sname" id="sname"></p>
        <div class="count num" id="cnt"></div>
        <p class="lab" id="lab"></p>
        <div class="row"><p class="per" id="per"></p></div>
        <p class="fnote" id="fnote"></p>
        <button type="button" class="srcbtn" id="srcbtn">${esc(t(C.figSrc))} →</button>
        <ol class="steps" id="steps" aria-label="${esc(tx("stage"))}">${S.map((st, i) => `<li data-s="${i}"><button type="button" data-jump="${i}"><span>${esc(t(STAGE[st.key].name))}</span><span class="num">${countTxt(st)}</span></button></li>`).join("")}</ol>
      </div>
      <div class="funcol"><div class="fun" id="fun"></div><p class="scale">${esc(t(C.scale))}</p></div>
      ${ladderHTML()}
      <div class="gaps" id="gaps">
        ${STEPS.map((x, k) => `<div class="grp" data-k="${k}" inert aria-hidden="true"><h2>${esc(t(C.leaks))}${x.part ? `<span>${esc(t(x.part))}</span>` : ""}</h2><p class="hint">${esc(t(C.hint))}</p><div class="cards">${x.gaps.map((g, j) => card(g, j === 0)).join("")}</div></div>`).join("")}
      </div>
    </div></section>`;
  }

  function staticHTML() {
    return `<section class="track static-list"><div class="swrap"><div class="funcol"><div class="fun" id="fun"></div><p class="scale">${esc(t(C.scale))}</p></div><ol class="slist">${S.map((st, i) => {
      const sc = STAGE[st.key];
      return `<li><div>
        <p class="eyebrow">${instDot(st)}${esc(eyebrowTxt(st))}</p>
        <h2 class="sname">${esc(t(sc.name))}</h2>
        <div class="count num${st.count == null ? " unknown" : ""}">${cm(countTxt(st))}</div>
        <p class="lab">${esc(T(sc.label))}</p>
        <div class="row"><p class="per">${perTxt(st)}</p></div>
        ${t(sc.note) ? `<p class="fnote">${esc(T(sc.note))}</p>` : ""}
        ${st.count != null ? `<button type="button" class="srcbtn" data-open="stage-${st.key}">${esc(t(C.figSrc))} →</button>` : ""}
      </div><div class="cards">${st.gaps.map((g) => card(g, false)).join("")}</div></li>`;
    }).join("")}</ol></div></section>`;
  }

  function endHTML() {
    return `<section class="end" id="end"><div class="in">
      <div class="grid2">
        <div><canvas id="dots" width="560" height="560" role="img" aria-label="${esc(T(C.endLine))}"></canvas>
          <ul class="legend"><li><i style="background:var(--navy)"></i>${esc(t(C.stands))}: <b class="num">${N(F.end.per10k)}</b></li><li><i style="background:#c9cfd8"></i>${esc(t(C.leaked))}</li><li>${esc(t(C.squares))}</li></ul></div>
        <div>
          <p class="eyebrow">${esc(t(C.endEyebrow))}</p>
          <p class="bigp num">${cm(t(F.end.pct))}</p>
          <p class="estline">${esc(t(C.estLine))}</p>
          <p class="endline">${esc(T(C.endLine))}</p>
          <div class="money"><p>${esc(t(C.money))}</p><button type="button" class="btn" data-open="recovery">${esc(tx("evidence"))}</button></div>
        </div>
      </div>
      <div class="method" id="how"><h2>${esc(t(C.how))}</h2>${C.method.map((p) => `<p>${esc(T(p))}</p>`).join("")}<p class="src">${esc(T(C.src))}</p><p class="src">${esc(T(C.latest))}</p>
        <p class="printl"><a class="btn" href="${printHref()}">${esc(t(C.print))}</a> <span>${esc(t(C.printNote))}</span></p></div>
      <div class="allg" id="leaks"><h2>${esc(T(C.all))}</h2><p class="allnote">${esc(T(C.allNote))} ${U.reportLink("https://research.jawafdehi.org/report#ranked-leaks", esc(t(C.ranked))).replace('class="btn"', 'class="tl"')}</p>${[1, 2, 3].map((tr) => { const ks = JW.findings.map((f) => f.key).filter((k) => tierOf(k) === tr).sort(byRank); return ks.length ? `<h3 class="tierh">${esc(t(C.tier[tr - 1]))}</h3><div class="g tier${tr}">${ks.map((k) => (tr === 3 ? row3(k) : card(k, false, tr))).join("")}</div>` : ""; }).join("")}</div>
    </div></section>`;
  }

  /* ---------- pipe view (option 1) ---------- */
  const LEAD = { complaint: "tracking", screening: "shelved", charge: "afterInvestigation", trial: "lossRate", lodged: "notAppealed", decided: "oneWay", recovery: "recovery" };
  const P = {
    head: { en: "The seven stages of a corruption case", ne: "भ्रष्टाचार मुद्दाका सात चरण" },
    sub: { en: "A corruption case in Nepal passes through seven stages, from the complaint to getting the money back. At each one, accountability leaks. Here is where, with the evidence.",
      ne: "नेपालमा भ्रष्टाचारको मुद्दा उजुरीदेखि रकम असुलीसम्म सात चरण पार गर्छ। हरेक चरणमा जवाफदेहिता चुहिन्छ। कहाँ चुहिन्छ, प्रमाणसहित यहाँ छ।" },
    hint: { en: "Each red card is a leak. Tap one to see the evidence.", ne: "हरेक रातो कार्ड एउटा चुहावट हो। प्रमाण हेर्न कुनै एकमा थिच्नुहोस्।" },
    end: { en: "The pipe ends open: no one publishes how much money is recovered.", ne: "पाइपको अन्त्य खुला छ: कति रकम असुल भयो भन्ने कसैले प्रकाशित गर्दैन।" },
    ic: { en: "CIAA", ne: "अख्तियार" }, is: { en: "Special Court", ne: "विशेष अदालत" }, iu: { en: "Supreme Court", ne: "सर्वोच्च अदालत" }, in: { en: "Not published", ne: "प्रकाशित छैन" },
    keyLeak: { en: "A leak, measured from the record", ne: "अभिलेखबाट मापन गरिएको चुहावट" },
    keyTitle: { en: "What the labels mean", ne: "लेबलको अर्थ" },
    more: { en: "Also at this stage", ne: "यस चरणमा थप" },
  };
  function pipeHTML() {
    return `<section class="hero"><h2>${esc(t(P.head))}</h2><p>${esc(t(P.sub))}</p><p class="hint">${esc(t(P.hint))}</p></section>
    <section class="route" aria-label="${esc(tx("title"))}">
      <div class="inst" aria-hidden="true"><span class="c">${esc(t(P.ic))}</span><span class="s">${esc(t(P.is))}</span><span class="u">${esc(t(P.iu))}</span><span class="n">${esc(t(P.in))}</span></div>
      <ol class="stops">${JW.stages.map((s, si) => {
        const lead = byKey(LEAD[s.key]);
        const rest = JW.findings.filter((f) => f.stage === s.key && f.key !== lead.key);
        const v = lead.pill || t(lead.card || lead.big.value); // recovery shows "?", as on the funnel
        return `<li class="stop" data-inst="${s.inst}">
          <span class="joint" aria-hidden="true">${N(s.n)}</span>
          <p class="who">${esc(t(JW.institutions[s.inst]))}</p>
          <h2 class="name"><span class="sr">${esc(tx("stage"))} ${N(s.n)}: </span>${esc(t(s))}</h2>
          <button type="button" class="drip" data-open="${lead.key}">
            <span class="v num${v.length > 6 ? " long" : ""}">${esc(v)}${lead.big.unit.en && !lead.pill ? ` <small>${esc(t(lead.big.unit))}</small>` : ""}</span>
            ${lead.pill ? "" : `<span class="u">${evHTML(lead) || esc(t(lead.tag))}</span>`}
            <span class="h">${esc(t(lead.headline))}</span>
            <span class="go">${tx("evidence")} →</span>${si === 0 ? handSVG : ""}
          </button>
          ${rest.length ? `<p class="morel">${esc(t(P.more))}</p><ul class="more">${rest.map((f) => `<li><button type="button" data-open="${f.key}"><span class="hl">${esc(t(f.headline))}</span> <span class="ev">${evHTML(f) || `<b class="num">${esc(f.pill || t(f.card || f.big.value))}${f.big.unit.en && !f.pill ? " " + esc(t(f.big.unit)) : ""}</b> ${esc(t(f.tag))}`}</span></button></li>`).join("")}</ul>` : ""}
        </li>`;
      }).join("")}</ol>
      <div class="pend"><span class="tap" aria-hidden="true">?</span><p>${esc(t(P.end))}</p></div>
    </section>
    <section class="key"><h2>${esc(t(P.keyTitle))}</h2><ul><li><span class="sw"></span>${esc(t(P.keyLeak))}</li>${["A", "leak+A", "A→B", "B"].map((g) => `<li>${chip(g)} <span class="note">${esc(t({ en: JW.gap[g].long_en, ne: JW.gap[g].long_ne }))}</span></li>`).join("")}</ul></section>`;
  }

  /* ---------- stage drawers: the source of each funnel figure ---------- */
  S.forEach((st, i) => {
    if (st.count == null) return;
    U.extra["stage-" + st.key] = () => {
      const sc = STAGE[st.key];
      return {
        eyebrow: esc(eyebrowTxt(st)),
        html: `${st.est ? `<span class="est">${esc(t(C.est))}</span>` : ""}
          <h2 id="jw-d-h">${esc(t(sc.name))}</h2>
          <div class="big num navy">${esc(countTxt(st))}</div>
          <p class="lbl">${esc(T(sc.label))}</p>
          <p class="note">${perTxt(st)}</p>
          <section><h3>${esc(tx("howCounted"))}</h3><p>${esc(T(sc.how))}</p></section>
          <section><h3>${esc(tx("source"))}</h3><p class="src">${esc(T(sc.src))}</p>
            <div class="acts">${U.reportLink(sc.href, esc(tx("readMore")))}</div></section>`,
      };
    };
  });

  /* ---------- live funnel ---------- */
  let el = {}, trackTop = 0, stepPx = 1, active = -1, raf = 0, mode = "";

  function layoutSvg() {
    const box = el.fun.getBoundingClientRect();
    geom(box.height > 0 ? Math.max(220, Math.min(520, (H * box.width) / box.height)) : 400);
    el.fun.innerHTML = svgHTML();
    el.rect = el.fun.querySelector("#fcr");
    el.surf = el.fun.querySelector("#surf");
    el.lead = el.fun.querySelector("#lead");
    el.q = el.fun.querySelector("#q");
    el.lvls = [...el.fun.querySelectorAll(".lvl")];
    el.drops = [...el.fun.querySelectorAll(".drop")];
    active = -1;
  }

  // P: 0 … NST-1, how far down the steps the reader is. A pure function of scrollY.
  const posFromScroll = () => Math.max(0, Math.min(LASTSTEP, (window.scrollY - trackTop) / stepPx));
  // Each step holds still for its first 40%, then the funnel flows to the next step's level.
  function levelAt(Pp) {
    const i = Math.min(LASTSTEP, Math.floor(Pp)), f = Pp - i;
    if (i >= LASTSTEP) return STEPS[LASTSTEP].s;
    const a = STEPS[i].s, b = STEPS[i + 1].s;
    return a + (b - a) * sm((f - 0.4) / 0.6);
  }
  const stepAt = (Pp) => { const i = Math.floor(Pp); return Math.min(LASTSTEP, Pp - i < 0.7 ? i : i + 1); };
  const frontY = (L) => {
    const top = Math.min(L, LAST - 1), i = Math.floor(top), f = top - i;
    return i >= LAST - 1 ? Y[LAST - 1] + H2 : Y[i] + H2 + (Y[i + 1] - Y[i]) * f;
  };

  function draw(Pp) {
    const L = levelAt(Pp), fy = frontY(L), rx = wall(fy) / 2;
    el.rect.setAttribute("height", fy.toFixed(1));
    el.surf.setAttribute("cy", fy.toFixed(1));
    el.surf.setAttribute("rx", rx.toFixed(1));
    el.surf.setAttribute("ry", Math.max(1.5, Math.min(10, rx * 0.1)).toFixed(1));
    el.surf.setAttribute("class", fy < BND ? "ciaa" : "court");
    setStep(stepAt(Pp));
    if (el.bar) el.bar.style.transform = `scaleX(${(Pp / LASTSTEP).toFixed(4)})`;
  }

  function setStep(k) {
    if (k === active) return;
    active = k;
    const x = STEPS[k], st = S[x.s], sc = STAGE[st.key];
    el.lvls.forEach((n) => n.classList.toggle("on", +n.dataset.s <= x.s));
    el.drops.forEach((n) => n.classList.toggle("on", +n.dataset.s <= x.s));
    el.q.classList.toggle("on", x.s === LAST);
    const x0 = W / 2 + widths[x.s] / 2 + 4;
    el.lead.setAttribute("x1", x0); el.lead.setAttribute("x2", W + 40);
    el.lead.setAttribute("y1", Y[x.s]); el.lead.setAttribute("y2", Y[x.s]);
    if (mode !== "live") return;
    el.eb.innerHTML = `${instDot(st)}${esc(eyebrowTxt(st))}`;
    el.sname.textContent = t(sc.name);
    el.cnt.innerHTML = cm(countTxt(st));
    el.cnt.classList.toggle("unknown", st.count == null);
    el.lab.textContent = T(sc.label);
    el.per.innerHTML = perTxt(st);
    el.fnote.textContent = T(sc.note);
    el.srcbtn.hidden = st.count == null;
    el.srcbtn.dataset.open = st.count == null ? "" : "stage-" + st.key;
    [...el.steps, ...el.ladder].forEach((li) => { const s = +li.dataset.s; li.classList.toggle("on", s === x.s); li.classList.toggle("done", s < x.s); });
    // Only the current group of cards can be seen, focused or tapped; the rest are inert.
    el.grps.forEach((g, i) => {
      const on = i === k;
      g.classList.toggle("on", on);
      g.inert = !on;
      on ? g.removeAttribute("aria-hidden") : g.setAttribute("aria-hidden", "true");
    });
    placeGaps();
    el.live.textContent = `${t(sc.name)}: ${st.count == null ? T(sc.label) : `${countTxt(st)} ${T(sc.label)}`}`;
  }

  // Slide the card column so the current group sits level with its stage.
  function placeGaps() {
    if (!el.gaps) return;
    if (NARROW.matches) { el.gaps.style.transform = ""; el.gaps.dataset.y = "0"; return; }
    const fb = el.fun.getBoundingClientRect(), sb = el.stage.getBoundingClientRect(), gb = el.gaps.getBoundingClientRect();
    const s = Math.min(fb.width / W, fb.height / H), oy = fb.height - H * s;
    const levelPx = fb.top - sb.top + oy + Y[STEPS[active].s] * s;
    const g = el.grps[active], gh = g.offsetHeight, home = gb.top - sb.top - (parseFloat(el.gaps.dataset.y) || 0);
    const c0 = g.querySelector(".card"), aim = c0 ? c0.offsetTop + c0.offsetHeight / 2 : 46;
    const y = Math.max(0, Math.min(levelPx - aim - home, sb.height - gh - home - 16));
    el.gaps.dataset.y = y.toFixed(0);
    el.gaps.style.transform = `translateY(${y.toFixed(0)}px)`;
  }

  function frame() { raf = 0; if (mode === "live" && el.rect) draw(posFromScroll()); }
  function onScroll() { if (!raf) raf = requestAnimationFrame(frame); }
  // The large viewport (100lvh) does not change when a phone's address bar shows or hides,
  // so neither does the size of a step.
  const lvh = () => { const m = document.createElement("div"); m.style.cssText = "position:absolute;visibility:hidden;height:100lvh;width:0"; document.body.append(m); const h = m.offsetHeight || window.innerHeight; m.remove(); return Math.max(h, window.innerHeight); };
  function measure() {
    stepPx = Math.max(420, lvh() * 0.8);
    el.track.style.height = `${Math.round(stepPx * (LASTSTEP + 0.5) + lvh())}px`;
    trackTop = el.track.getBoundingClientRect().top + window.scrollY;
  }

  /* ---------- the 10,000 squares ---------- */
  let dotsIO;
  function dots(animate) {
    const cv = document.getElementById("dots"); if (!cv) return;
    const css = cv.getBoundingClientRect().width || 560, dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = cv.height = Math.round(css * dpr);
    const g = cv.getContext("2d"), c = cv.width / 100, sq = Math.max(1, c * 0.74);
    const keep = 10000 - F.end.per10k;
    const NAVY = "#0e1f3b", GONE = "#c9cfd8", ALL = "#5d6b82";
    const cell = (i, col) => { g.fillStyle = col; g.fillRect((i % 100) * c, Math.floor(i / 100) * c, sq, sq); };
    const final = () => {
      g.clearRect(0, 0, cv.width, cv.height);
      for (let i = 0; i < 10000; i++) cell(i, i >= keep ? NAVY : GONE);
      const x0 = (keep % 100) * c, y0 = Math.floor(keep / 100) * c, pad = 3 * dpr, r = cv.width;
      g.strokeStyle = NAVY; g.lineWidth = 2 * dpr;
      g.strokeRect(x0 - pad, y0 - pad, r - x0 + pad - dpr, r - y0 + pad - dpr);
      const lab = N(F.end.per10k), fs = Math.round(15 * dpr);
      g.font = `700 ${fs}px "IBM Plex Mono", "Noto Sans Devanagari", monospace`;
      const tw = g.measureText(lab).width + 12 * dpr, bx = r - tw - 1, by = y0 - pad - fs - 12 * dpr;
      g.fillStyle = NAVY; g.fillRect(bx, by, tw, fs + 10 * dpr);
      g.fillStyle = "#fff"; g.textBaseline = "middle"; g.fillText(lab, bx + 6 * dpr, by + (fs + 10 * dpr) / 2);
    };
    if (!animate) { final(); return; }
    for (let i = 0; i < 10000; i++) cell(i, i >= keep ? NAVY : ALL);
    let done = 0; const t0 = performance.now(), dur = 1600;
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur), upto = Math.floor(keep * (1 - Math.pow(1 - p, 2.2)));
      for (let i = done; i < upto; i++) cell(i, GONE);
      done = upto;
      if (p < 1) requestAnimationFrame(step); else final();
    })(t0);
  }

  /* ---------- render ---------- */
  function render() {
    const main = document.getElementById("main");
    document.body.dataset.page = U.view;
    dotsIO && dotsIO.disconnect();
    el = {};
    // Same top and bottom for both views; only the middle part changes.
    mode = U.view === "pipe" ? "pipe" : isStatic() ? "static" : "live";
    document.body.classList.toggle("static", mode === "static");
    const middle = mode === "pipe" ? pipeHTML() : mode === "static" ? staticHTML() : stageHTML();
    main.innerHTML = introHTML() + `<div class="mid" id="mid" role="region" aria-labelledby="swl">${switchHTML(mode === "live")}${middle}</div>` + endHTML();
    if (mode === "pipe") {
      document.getElementById("bar").style.transform = "scaleX(0)";
      dots(false);
      endDots();
      return;
    }
    el = { fun: document.getElementById("fun"), bar: document.getElementById("bar"), live: document.getElementById("live"), track: document.querySelector(".track") };
    if (mode === "live") Object.assign(el, {
      stage: document.getElementById("stage"), eb: document.getElementById("eb"), sname: document.getElementById("sname"), cnt: document.getElementById("cnt"),
      lab: document.getElementById("lab"), per: document.getElementById("per"), fnote: document.getElementById("fnote"),
      srcbtn: document.getElementById("srcbtn"), steps: [...document.querySelectorAll("#steps li")], ladder: [...document.querySelectorAll("#ladder li[data-s]")], gaps: document.getElementById("gaps"), grps: [...document.querySelectorAll(".grp")],
    });
    layoutSvg();
    if (mode === "static") {
      el.rect.setAttribute("height", H); el.surf.setAttribute("rx", 0);
      el.lvls.forEach((n) => n.classList.add("on")); el.drops.forEach((n) => n.classList.add("on")); el.q.classList.add("on"); el.lead.remove();
      el.bar.style.transform = "scaleX(1)";
      dots(false);
      return;
    }
    measure();
    draw(posFromScroll());
    dots(false);
    endDots();
  }
  // The 10,000 squares drain once when they come into view (never with reduced motion).
  function endDots() {
    if (RM.matches || mode === "static") return;
    let done = false;
    dotsIO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !done) { done = true; dots(true); dotsIO.disconnect(); } }), { threshold: 0.35 });
    dotsIO.observe(document.getElementById("dots"));
  }

  // ?at=<step> (or intro / switch / end / method / leaks): scroll there on load, for
  // screenshots and links.
  function goAt() {
    if (AT == null || AT === "intro") return;
    const head = document.querySelector(".top").offsetHeight;
    const to = (id) => { const n = document.getElementById(id); if (n) window.scrollTo(0, n.getBoundingClientRect().top + window.scrollY - (id === "mid" ? head : head + 8)); };
    if (AT === "switch") return to("mid");
    if (["end", "method", "leaks"].includes(AT)) return to(AT === "method" ? "how" : AT);
    if (mode === "live") window.scrollTo(0, trackTop + Math.max(0, Math.min(LASTSTEP, parseFloat(AT) || 0)) * stepPx);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  let rz, lastBox = "";
  function relayout() {
    if (mode === "pipe") { dots(false); return; }
    if (mode !== "live" && mode !== "static") return;
    const b = el.fun.getBoundingClientRect(), key = `${Math.round(b.width)}x${Math.round(b.height)}x${window.innerHeight}`;
    if (key === lastBox) return; lastBox = key;
    if (mode === "live") { measure(); layoutSvg(); draw(posFromScroll()); }
    else { layoutSvg(); el.rect.setAttribute("height", H); el.lvls.forEach((n) => n.classList.add("on")); el.drops.forEach((n) => n.classList.add("on")); el.q.classList.add("on"); el.lead.remove(); }
    dots(false);
  }
  window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(relayout, 120); });
  RM.addEventListener?.("change", () => { if (U.view === "funnel") { render(); } });
  NARROW.addEventListener?.("change", () => location.reload()); // the steps differ (two cards a screen on phones)
  SHORTWIDE.addEventListener?.("change", () => location.reload());
  SHORT.addEventListener?.("change", () => { if (U.view === "funnel" && !qs.has("static") && !RM.matches) { lastBox = ""; render(); } });

  // The tap hint shows until the reader opens any evidence, then never again.
  const TAP = "jw7-tapped";
  const markTapped = () => { document.body.classList.add("tapped"); try { localStorage.setItem(TAP, "1"); } catch (e) {} };
  if (localStorage.getItem(TAP) === "1" && !qs.has("hint")) document.body.classList.add("tapped");
  document.addEventListener("jw:opened", markTapped);
  document.addEventListener("click", (e) => {
    const j = e.target.closest("[data-jump]");
    if (j) {
      const k = STEPS.findIndex((x) => x.s === +j.dataset.jump);
      window.scrollTo({ top: trackTop + k * stepPx, behavior: RM.matches ? "auto" : "smooth" });
    }
  });

  U.onRender(() => { lastBox = ""; render(); });
  // Fonts change the column sizes: lay out again once they are in, then honour ?at=.
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    lastBox = ""; relayout(); goAt();
    // ?print=1 (from "Print or save as PDF"): the one-page version, straight to the print dialog.
    if (qs.has("print") && mode === "static") setTimeout(() => window.print(), 300);
  });
})();
