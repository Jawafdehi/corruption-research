/* Option 7: reader-facing copy on top of shared/findings.js.
   - `src`: each finding's source as a reader can follow it (the research data names
     internal working files; those stay in findings.js, never on the page).
   - `caveat`: bilingual, in plain words.
   - Copy fixes: one Nepali term for "full investigation" (विस्तृत अनुसन्धान, as the
     funnel uses), "सन्" on Gregorian years in Nepali, and no jargon ("median", "sting").
   Every fix names the exact text it replaces and fails loudly if that text has changed,
   so a data correction upstream can't be silently overwritten. No figure is typed here. */
(function () {
  const JW = window.JW, F = (k) => JW.findings.find((f) => f.key === k);
  const bad = [];
  function fix(key, path, from, to) {
    const parts = path.split("."), last = parts.pop();
    const o = parts.reduce((a, p) => a[p], F(key));
    if (typeof o[last] !== "string" || !o[last].includes(from)) { bad.push(`${key}.${path}: "${from}"`); return; }
    o[last] = o[last].split(from).join(to);
  }

  const SRC = {
    tracking: ["CIAA website, checked on 7 November 2026 (screenshots kept)", "अख्तियारको वेबसाइट, ७ नोभेम्बर २०२६ मा जाँच गरिएको (स्क्रिनसट सुरक्षित)"],
    shelved: ["CIAA 35th annual report (2081/82), tables 2.13 and 2.14", "अख्तियारको ३५औं वार्षिक प्रतिवेदन (२०८१/८२), तालिका २.१३ र २.१४"],
    backlog: ["CIAA 35th annual report (2081/82), table 2.14 and report text", "अख्तियारको ३५औं वार्षिक प्रतिवेदन (२०८१/८२), तालिका २.१४ र प्रतिवेदनको पाठ"],
    afterInvestigation: ["CIAA annual reports, 2073/74 to 2081/82", "अख्तियारका वार्षिक प्रतिवेदन, २०७३/७४ देखि २०८१/८२"],
    lossRate: ["Special Court case records (downloaded 8 October 2026); CIAA 35th annual report, table 3.12", "विशेष अदालतका मुद्दाका अभिलेख (८ अक्टोबर २०२६ मा लिइएको); अख्तियारको ३५औं वार्षिक प्रतिवेदन, तालिका ३.१२"],
    whoConvicted: ["Special Court public case pages, checked on 7 November 2026", "विशेष अदालतका सार्वजनिक मुद्दा पाना, ७ नोभेम्बर २०२६ मा जाँच गरिएको"],
    whyAcquitted: ["Special Court acquittal judgments (a sample of 42, of which 31 could be used, and every judgment that mentions selective charging)", "विशेष अदालतका सफाइ फैसला (४२ को नमुना, जसमध्ये ३१ प्रयोग गर्न सकियो, र छानेर मुद्दा चलाएको उल्लेख भएका सबै फैसला)"],
    notAppealed: ["Special Court and Supreme Court case records; CIAA annual reports", "विशेष अदालत र सर्वोच्च अदालतका मुद्दाका अभिलेख; अख्तियारका वार्षिक प्रतिवेदन"],
    noLink: ["Supreme Court and Special Court case records and the CIAA's case register, linked by hand (3 November 2026)", "सर्वोच्च अदालत र विशेष अदालतका मुद्दाका अभिलेख र अख्तियारको मुद्दा दर्ता, हातैले जोडिएको (३ नोभेम्बर २०२६)"],
    oneWay: ["Supreme Court case records, each appeal linked to its trial (as of 3 November 2026)", "सर्वोच्च अदालतका मुद्दाका अभिलेख, हरेक पुनरावेदन सम्बन्धित मुद्दासँग जोडिएको (३ नोभेम्बर २०२६ सम्म)"],
    whyLost: ["Supreme Court judgments that overturned a conviction (a sample of 16), and every appeal judgment that cites the 2021 ruling", "दोषी ठहर उल्टाएका सर्वोच्च अदालतका फैसला (१६ को नमुना), र सन् २०२१ को फैसला उद्धृत गर्ने सबै पुनरावेदन फैसला"],
    duration: ["Supreme Court case records, appeals registered 2008–2018 (as of 2 November 2026)", "सर्वोच्च अदालतका मुद्दाका अभिलेख, सन् २००८–२०१८ मा दर्ता भएका पुनरावेदन (२ नोभेम्बर २०२६ सम्म)"],
    hearings: ["Supreme Court case pages for corruption appeals, read on 2–3 November 2026", "भ्रष्टाचार पुनरावेदनका सर्वोच्च अदालतका मुद्दा पाना, २–३ नोभेम्बर २०२६ मा हेरिएको"],
    neverListed: ["Supreme Court case pages for open corruption appeals, November 2026", "बाँकी भ्रष्टाचार पुनरावेदनका सर्वोच्च अदालतका मुद्दा पाना, नोभेम्बर २०२६"],
    arson: ["Supreme Court case pages, read on 1–2 November 2026", "सर्वोच्च अदालतका मुद्दा पाना, १–२ नोभेम्बर २०२६ मा हेरिएको"],
    recovery: ["Supreme Court annual reports, 2075/76 to 2081/82", "सर्वोच्च अदालतका वार्षिक प्रतिवेदन, २०७५/७६ देखि २०८१/८२"],
  };
  const CAVEAT = {
    lossRate: ["Counts cases, not people. Years are Nepali fiscal years. The amount claimed (बिगो) is a minimum, read from the judgments.", "मुद्दा गनिएको हो, व्यक्ति होइन। वर्ष नेपाली आर्थिक वर्ष हुन्। बिगो न्यूनतम रकम हो, फैसलाबाट पढिएको।"],
    whoConvicted: ["Counts defendant entries in the court record, not identified people.", "अदालतको अभिलेखमा प्रतिवादीका प्रविष्टि गनिएको हो, पहिचान भएका व्यक्ति होइन।"],
    whyAcquitted: ["Read with AI software, not yet reviewed by a lawyer. A sample: 42 judgments drawn, 31 could be used. Not a national rate.", "एआई सफ्टवेयरको सहायताले पढिएको, कानुन व्यवसायीले अझै समीक्षा गरेका छैनन्। नमुना: ४२ फैसला लिइयो, ३१ प्रयोग गर्न सकियो। राष्ट्रिय दर होइन।"],
    whyLost: ["Read with AI software, not yet reviewed by a lawyer. 16 judgments is a sample, not a national rate.", "एआई सफ्टवेयरको सहायताले पढिएको, कानुन व्यवसायीले अझै समीक्षा गरेका छैनन्। १६ फैसला नमुना मात्र हो, राष्ट्रिय दर होइन।"],
  };
  JW.findings.forEach((f) => {
    const s = SRC[f.key];
    if (!s) bad.push(`${f.key}: no reader-facing source`);
    f.src = s ? { en: s[0], ne: s[1] } : { en: "", ne: "" };
    const c = CAVEAT[f.key];
    if (f.caveat && !c) bad.push(`${f.key}: caveat not rewritten`);
    f.caveat = c ? { en: c[0], ne: c[1] } : "";
  });

  // One Nepali term for a full investigation, as on the funnel.
  fix("afterInvestigation", "headline.ne", "पूर्ण अनुसन्धानपछि", "विस्तृत अनुसन्धानपछि");
  fix("afterInvestigation", "short.ne", "पूर्ण अनुसन्धानपछिको", "विस्तृत अनुसन्धानपछिको");
  fix("afterInvestigation", "big.label.ne", "पूर्ण अनुसन्धानपछिका", "विस्तृत अनुसन्धानपछिका");
  fix("afterInvestigation", "tag.ne", "पूर्ण अनुसन्धानपछि", "विस्तृत अनुसन्धानपछि");
  fix("lossRate", "headline.ne", "पूर्ण अनुसन्धानपछि पनि", "विस्तृत अनुसन्धानपछि पनि");

  // Plain words.
  fix("lossRate", "short.en", "it rose from 1 in 4 to 1 in 2 of verdicts.", "the share rose from 1 in 4 verdicts to 1 in 2.");
  fix("lossRate", "short.ne", "यो ४ मा १ बाट २ मा १ पुग्यो।", "यो अनुपात ४ मा १ फैसलाबाट २ मा १ पुग्यो।");
  fix("lossRate", "explain", "when the sting-money ruling cleared", "when the 2021 ruling on bribe money supplied by the CIAA cleared");
  fix("lossRate", "explain", "a median 1.5 years", "a typical 1.5 years");
  fix("whyAcquitted", "short.en", "Selective charging relied on in 12 judgments.", "In 12 judgments the court relied partly on selective charging.");
  fix("whyAcquitted", "short.ne", "छानेर मुद्दा चलाएको आधार १२ फैसलामा।", "१२ फैसलामा अदालतले आंशिक रूपमा छानीछानी मुद्दा चलाएको आधार लियो।");
  fix("whyAcquitted", "viz.parts.3.en", "Sting-money ruling", "2021 ruling on bribe money supplied by the CIAA");
  fix("whyAcquitted", "viz.parts.3.ne", "स्टिङ रकमसम्बन्धी फैसला", "अख्तियारले दिएको घुस रकमसम्बन्धी सन् २०२१ को फैसला");
  fix("whyLost", "viz.foot.en", "Cites the 2021 sting ruling → overturned: 84%", "Where the appeal judgment cites the 2021 ruling, 84% of convictions were overturned");
  fix("whyLost", "viz.foot.ne", "२०२१ को स्टिङ फैसला उद्धृत → उल्टियो: ८४%", "पुनरावेदनको फैसलाले सन् २०२१ को फैसला उद्धृत गरेकामा ८४% ठहर उल्टिए");
  fix("neverListed", "short.en", "they have waited a median of 16 months.", "a typical one has waited about 16 months.");
  fix("neverListed", "short.ne", "औसत (मध्यिका) १६ महिनादेखि पर्खिरहेका।", "सामान्यतया करिब १६ महिनादेखि पर्खिरहेका छन्।");
  fix("neverListed", "explain", "They have waited a median of about 16 months", "A typical one has waited about 16 months");
  fix("hearings", "short.en", "77% of 27,855 listings ended without a hearing", "77% of 27,855 scheduled hearings ended without the appeal being heard");
  fix("hearings", "short.ne", "२७,८५५ पेशीमध्ये ७७% मा सुनुवाइ भएन", "तोकिएका २७,८५५ पेशीमध्ये ७७% मा पुनरावेदनको सुनुवाइ भएन");
  fix("hearings", "explain", "The next date was typically about two months later.", "The next hearing date was typically about two months later.");

  // Gregorian years are marked "सन्" in Nepali, so they can't be read as Bikram Sambat.
  fix("arson", "headline.ne", "सेप्टेम्बर २०२५ को आगजनीपछि", "सन् २०२५ सेप्टेम्बरको आगजनीपछि");
  fix("duration", "short.ne", "२००८–२०१८ मा दर्ता", "सन् २००८–२०१८ मा दर्ता");
  fix("duration", "big.label.ne", "२००८–२०१८ मा दर्ता", "सन् २००८–२०१८ मा दर्ता");


  // More plain-language fixes from the word-by-word pass (round 2).
  fix("oneWay", "big.label.en", "when the convicted appeal ·", "when the convicted person appeals ·");
  fix("neverListed", "explain", "since they were registered", "since it was registered");
  fix("duration", "viz.en", "Decided appeals by years taken; red: over six", "Decided appeals, by years taken to decide. Red: over six years.");
  fix("duration", "viz.ne", "फैसला भएका पुनरावेदन, लागेको वर्षअनुसार; रातो: छ वर्षभन्दा बढी", "फैसला भएका पुनरावेदन, फैसला हुन लागेको वर्षअनुसार। रातो: छ वर्षभन्दा बढी।");
  F("duration").viz.unit_en = F("duration").viz.unit_ne = ""; // now said in the caption
  fix("arson", "viz.rows.0.en", "Year before the drive", "The year before the clearance drive");
  fix("arson", "viz.rows.1.en", "14 months before the fire", "14 months before the fire (clearance drive)");
  fix("arson", "viz.rows.2.en", "14 months after", "14 months after the fire");
  fix("arson", "viz.rows.0.ne", "अभियानअघिको वर्ष", "फर्छ्यौट अभियानअघिको वर्ष");
  fix("arson", "viz.rows.1.ne", "आगजनीअघिका १४ महिना", "आगजनीअघिका १४ महिना (फर्छ्यौट अभियान)");
  fix("arson", "viz.rows.2.ne", "आगजनीपछिका १४ महिना", "आगजनीपछिका १४ महिना");
  // Standard spelling: फर्छ्यौट (फछ्र्यौट is an old font-conversion form).
  fix("recovery", "big.label.ne", "फछ्र्यौट", "फर्छ्यौट");
  fix("recovery", "short.ne", "फछ्र्यौट", "फर्छ्यौट");
  // Curly quotes in English running text.
  JW.findings.forEach((f) => { f.explain = f.explain.replace(/"([^"]+)"/g, "“$1”"); });

  // Arson chart: the "year before the drive" window overlaps the next one by two months
  // (figure audit, FIGURES.md), so the chart compares only the 14 months before and after the fire.
  (() => {
    const v = F("arson").viz;
    if (v.check[0] !== "yearBefore" || v.rows[0].v !== 17) { bad.push("arson.viz: first row is no longer the year before"); return; }
    v.rows.shift(); v.check.shift();
  })();
  fix("arson", "explain", " (and 17% the year before that)", "");
  fix("arson", "short.en", "865 files still destroyed;", "865 open appeals still have no case file;");
  fix("arson", "short.ne", "८६५ मिसिल अझै नष्ट;", "८६५ खुला पुनरावेदनको मिसिल अझै नष्ट;");

  // Card lines (round 3). Each card reads as one phrase: the big number, then what it counts,
  // so no number stands alone without its unit. The figure itself still comes from the data:
  // `v` is checked against the data's own value before the line is replaced.
  const CARD = {
    tracking: { v: ["None", "छैन"], from: "0", tag: ["Public way to look up a complaint's status", "उजुरीको स्थिति सार्वजनिक रूपमा हेर्ने उपाय"] },
    shelved: { tag: ["complaints closed without a full investigation, and no reason given", "उजुरी विस्तृत अनुसन्धान नगरी, कारण नखुलाई तामेलीमा"] },
    backlog: { tag: ["complaints still waiting; nobody says for how long", "उजुरी अझै पर्खिरहेका; कति समयदेखि, कसैले भन्दैन"] },
    afterInvestigation: { tag: ["of the CIAA's decisions after a full investigation closed the case", "विस्तृत अनुसन्धानपछिका अख्तियारका निर्णयमा मुद्दा तामेली"] },
    lossRate: { tag: ["of CIAA cases the Special Court decided: everyone acquitted", "विशेष अदालतले फैसला गरेका अख्तियारका मुद्दामा सबैलाई सफाइ"] },
    whoConvicted: { x: [/of ([\d,]+) /, /\(([०-९,]+) (?:अभियुक्त)?मध्ये\)/], tag: ["defendant records (of {x}) where the public page does not say who was convicted", "प्रतिवादी अभिलेख ({x} मध्ये): सार्वजनिक पानाले को दोषी ठहरियो भन्दैन"] },
    whyAcquitted: { tag: ["judgments we read (sample of 42): the evidence did not prove the charge", "हामीले पढेका फैसलामा (४२ को नमुना): प्रमाणले अभियोग पुष्टि गरेन"] },
    oneWay: { v: ["41%", "४१%"], from: "41% · 1%", x: [/· ([\d.]+%)$/, /· ([०-९.]+%)$/], xf: "value", tag: ["of convictions are overturned when the convicted person appeals, against {x} of acquittals when the government appeals", "दोषीले पुनरावेदन गर्दा ठहर उल्टिन्छ; सरकारले पुनरावेदन गर्दा सफाइ {x} मात्र उल्टिन्छ"] },
    whyLost: { tag: ["overturned convictions we read (a sample): the Supreme Court pointed to the investigation", "हामीले पढेका उल्टिएका ठहरमा (नमुना): सर्वोच्चले अनुसन्धानलाई औंल्यायो"] },
    notAppealed: { x: [/\(([\d,]+ of [\d,]+)\)/, /\(([०-९,]+ मध्ये [०-९,]+)\)/], tag: ["of acquittals ({x}) have no government appeal on record", "सफाइ ({x}) मा सरकारी पुनरावेदन अभिलेखमा छैन"] },
    duration: { tag: ["typical time for a Supreme Court appeal to be decided", "सर्वोच्चमा पुनरावेदनको फैसला हुन लाग्ने सामान्य समय"] },
    hearings: { tag: ["of scheduled hearings ended without the appeal being heard", "तोकिएका पेशीमा पुनरावेदनको सुनुवाइ नै भएन"] },
    neverListed: { tag: ["open appeals never once listed for a hearing", "खुला पुनरावेदन एक पटक पनि पेशीमा नचढेका"] },
    arson: { tag: ["open Supreme Court appeals whose case file is still missing after the 2025 arson", "सर्वोच्चका खुला पुनरावेदन जसको मिसिल सन् २०२५ को आगजनीपछि अझै फेला परेको छैन"] },
    noLink: { x: [/of ([\d,]+) /, /\(([०-९,]+) मध्ये\)/], tag: ["appeals (of {x}) that cannot be traced to their trial", "पुनरावेदन ({x} मध्ये) कुन मुद्दाको हो, जोड्न सकिएन"] },
    recovery: { tag: ["No one publishes what is recovered", "असुली कति भयो, कसैले प्रकाशित गर्दैन"] },
  };
  JW.findings.forEach((f) => {
    const c = CARD[f.key];
    if (!c) { bad.push(`${f.key}: no card line`); return; }
    if (c.v) {
      if (f.big.value.en !== c.from) bad.push(`${f.key}: card value "${c.from}" no longer matches the data`);
      f.card = { en: c.v[0], ne: c.v[1] };
    }
    // {x}: a number taken from the data's own label (never typed here); fails loudly if absent.
    const take = (re, text) => { const m = re && text.match(re); if (!m) bad.push(`${f.key}: card number not found in its label`); return m ? m[1] : "?"; };
    f.tag = c.x
      ? { en: c.tag[0].replace("{x}", take(c.x[0], f.big[c.xf || "label"].en)), ne: c.tag[1].replace("{x}", take(c.x[1], f.big[c.xf || "label"].ne)) }
      : { en: c.tag[0], ne: c.tag[1] };
  });
  // Units, from the figure audit (FIGURES.md, round 3).
  // 3,038 / 8,846 count defendant records, not identified people (someone charged twice counts twice).
  fix("whoConvicted", "short.en", "people prosecuted", "defendant records");
  fix("whoConvicted", "short.ne", "अभियुक्त", "प्रतिवादी अभिलेख");
  fix("whoConvicted", "big.label.en", "of 8,846 people prosecuted are in cases", "of 8,846 defendant records are in cases");
  fix("whoConvicted", "big.label.ne", "जना (८,८४६ अभियुक्तमध्ये)", "प्रतिवादी अभिलेख (८,८४६ मध्ये)");
  fix("whoConvicted", "explain", "the 8,846 people prosecuted (about 1 in 3).", "the 8,846 defendant records (about 1 in 3). A person charged in two cases counts twice.");
  // 31 judgments are the usable part of a sample of 42; some of them also convicted others.
  fix("whyAcquitted", "short.en", "Of 31 acquittals read:", "Of 31 judgments with acquittals that we read (from a sample of 42):");
  fix("whyAcquitted", "short.ne", "पढिएका ३१ सफाइमा:", "पढिएका सफाइसहितका ३१ फैसलामा (४२ को नमुनाबाट):");
  fix("whyAcquitted", "big.label.en", "acquittal judgments we read said", "judgments with acquittals that we read (a sample) said");
  fix("whyAcquitted", "big.label.ne", "हामीले पढेका सफाइ फैसलामा", "हामीले पढेका सफाइसहितका फैसलामा (नमुना)");
  fix("whyAcquitted", "explain", "In the 31 acquittal judgments we read,", "In 31 judgments with acquittals that we read (from a sample of 42; the other 11 could not be used),");
  // The 16 readings say where the Supreme Court placed the failure; they do not show the trial judge made no mistake.
  fix("whyLost", "headline.en", ", not on a trial judge's mistake", "");
  fix("whyLost", "headline.ne", ", तल्लो अदालतका न्यायाधीशको गल्तीले होइन", "");

  // Figure audit (FIGURES.md): "without any investigation" overstates; screening is a kind of inquiry.
  fix("shelved", "big.label.en", "closed without any investigation", "closed without a full investigation");
  fix("shelved", "big.label.ne", "कुनै अनुसन्धान नगरी", "विस्तृत अनुसन्धान नगरी");
  fix("shelved", "headline.en", "closed before any investigation", "closed before a full investigation");
  fix("shelved", "headline.ne", "कुनै अनुसन्धानै नगरी", "विस्तृत अनुसन्धान नगरी");
  fix("shelved", "short.en", "with no investigation;", "without a full investigation;");
  fix("shelved", "short.ne", "अनुसन्धान नगरी तामेलीमा", "विस्तृत अनुसन्धान नगरी तामेलीमा");
  fix("shelved", "explain", "without investigating them,", "without a full investigation,");
  fix("afterInvestigation", "explain", "The change came in one year and has not reversed. No reason is published for any of these closures.", "The change came within two years and has not reversed. No case-by-case reason is published for these closures.");

  // The drawer for "tracking" says the same as its card.
  fix("tracking", "big.value.en", "0", "None");
  fix("tracking", "big.value.ne", "०", "छैन");
  fix("tracking", "big.label.en", "ways to look up a complaint's status on the CIAA website", "public way to look up a complaint's status on the CIAA website");
  fix("tracking", "big.label.ne", "अख्तियारको वेबसाइटमा उजुरीको स्थिति हेर्ने उपाय", "अख्तियारको वेबसाइटमा उजुरीको स्थिति हेर्ने सार्वजनिक उपाय");

  if (bad.length) { console.error("copy.js: text no longer matches the data:\n" + bad.join("\n")); window.JW_COPY_ERRORS = bad; }
})();
