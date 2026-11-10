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
    shelved: ["CIAA 35th annual report (2081/82), table 2.14", "अख्तियारको ३५औं वार्षिक प्रतिवेदन (२०८१/८२), तालिका २.१४"],
    backlog: ["CIAA 35th annual report (2081/82), table 2.14 and report text", "अख्तियारको ३५औं वार्षिक प्रतिवेदन (२०८१/८२), तालिका २.१४ र प्रतिवेदनको पाठ"],
    afterInvestigation: ["CIAA annual reports, 2073/74 to 2081/82", "अख्तियारका वार्षिक प्रतिवेदन, २०७३/७४ देखि २०८१/८२"],
    lossRate: ["Special Court case records (downloaded 8 October 2026); CIAA 35th annual report, table 3.12", "विशेष अदालतका मुद्दाका अभिलेख (८ अक्टोबर २०२६ मा लिइएको); अख्तियारको ३५औं वार्षिक प्रतिवेदन, तालिका ३.१२"],
    whoConvicted: ["Special Court public case pages, checked on 7 November 2026", "विशेष अदालतका सार्वजनिक मुद्दा पाना, ७ नोभेम्बर २०२६ मा जाँच गरिएको"],
    whyAcquitted: ["Special Court acquittal judgments (a sample of 31, and every judgment that mentions selective charging)", "विशेष अदालतका सफाइ फैसला (३१ को नमुना, र छानेर मुद्दा चलाएको उल्लेख भएका सबै फैसला)"],
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
    whyAcquitted: ["Read with AI software, not yet reviewed by a lawyer. 31 judgments is a sample.", "एआई सफ्टवेयरको सहायताले पढिएको, कानुन व्यवसायीले अझै समीक्षा गरेका छैनन्। ३१ फैसला नमुना मात्र हो।"],
    whyLost: ["Read with AI software, not yet reviewed by a lawyer. 16 judgments is a sample.", "एआई सफ्टवेयरको सहायताले पढिएको, कानुन व्यवसायीले अझै समीक्षा गरेका छैनन्। १६ फैसला नमुना मात्र हो।"],
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

  if (bad.length) { console.error("copy.js: text no longer matches the data:\n" + bad.join("\n")); window.JW_COPY_ERRORS = bad; }
})();
