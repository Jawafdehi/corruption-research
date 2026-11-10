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
    // Already fixed upstream (the site's data carries the same correction): the new text is
    // there, or, for a deletion, the old text is gone.
    if (typeof o[last] === "string" && !o[last].includes(from) && (to ? o[last].includes(to) : true)) return;
    if (typeof o[last] !== "string" || !o[last].includes(from)) { bad.push(`${key}.${path}: "${from}"`); return; }
    o[last] = o[last].split(from).join(to);
  }

  const SRC = {
    tracking: ["CIAA website, checked on 7 and 10 November 2026 (screenshots kept); CIAA notice on online complaints, 17 Kartik 2083", "अख्तियारको वेबसाइट, सन् २०२६ नोभेम्बर ७ र १० मा जाँच गरिएको (स्क्रिनसट सुरक्षित); अनलाइन उजुरीसम्बन्धी अख्तियारको सूचना, २०८३ कात्तिक १७"],
    shelved: ["CIAA 35th annual report (2081/82), tables 2.13 and 2.14", "अख्तियारको ३५औं वार्षिक प्रतिवेदन (२०८१/८२), तालिका २.१३ र २.१४"],
    backlog: ["CIAA 35th annual report (2081/82), table 2.14 and report text", "अख्तियारको ३५औं वार्षिक प्रतिवेदन (२०८१/८२), तालिका २.१४ र प्रतिवेदनको पाठ"],
    afterInvestigation: ["CIAA annual reports, 2073/74 to 2081/82", "अख्तियारका वार्षिक प्रतिवेदन, २०७३/७४ देखि २०८१/८२"],
    lossRate: ["Special Court case records (downloaded 8 October 2026); CIAA 35th annual report, table 3.12", "विशेष अदालतका मुद्दाका अभिलेख (८ अक्टोबर २०२६ मा लिइएको); अख्तियारको ३५औं वार्षिक प्रतिवेदन, तालिका ३.१२"],
    whoConvicted: ["Special Court case pages on its website (cases filed 2069/70–2082/83, verdicts to 8 October 2026), checked on 7 November 2026", "विशेष अदालतको वेबसाइटका मुद्दा पाना (२०६९/७० देखि २०८२/८३ सम्म दायर, सन् २०२६ अक्टोबर ८ सम्मका फैसला), सन् २०२६ नोभेम्बर ७ मा जाँच गरिएको"],
    whyAcquitted: ["Special Court acquittal judgments (a sample of 42, of which 31 could be used, and every judgment that mentions selective charging)", "विशेष अदालतका सफाइ फैसला (४२ को नमुना, जसमध्ये ३१ प्रयोग गर्न सकियो, र छानेर मुद्दा चलाएको उल्लेख भएका सबै फैसला)"],
    notAppealed: ["Special Court and Supreme Court case records; CIAA annual reports", "विशेष अदालत र सर्वोच्च अदालतका मुद्दाका अभिलेख; अख्तियारका वार्षिक प्रतिवेदन"],
    noLink: ["Supreme Court and Special Court case records and the CIAA's case register, linked by hand (3 November 2026)", "सर्वोच्च अदालत र विशेष अदालतका मुद्दाका अभिलेख र अख्तियारको मुद्दा दर्ता, हातैले जोडिएको (३ नोभेम्बर २०२६)"],
    oneWay: ["Supreme Court case records, each appeal linked to its trial (as of 3 November 2026)", "सर्वोच्च अदालतका मुद्दाका अभिलेख, हरेक पुनरावेदन सम्बन्धित मुद्दासँग जोडिएको (३ नोभेम्बर २०२६ सम्म)"],
    whyLost: ["Supreme Court judgments that fully overturned a conviction: 16 drawn at random from 146 with a judgment text (decided 2075–2083 BS), and every appeal judgment that cites the 2021 ruling", "दोषी ठहर पूरै उल्टाएका सर्वोच्च अदालतका फैसला: फैसलाको पाठ भएका १४६ मध्ये जथाभावी छानिएका १६ (२०७५–२०८३ मा फैसला भएका), र सन् २०२१ को फैसला उद्धृत गर्ने सबै पुनरावेदन फैसला"],
    duration: ["Supreme Court case records, appeals registered 2064–2075 BS (2008–2018), as of 2 November 2026", "सर्वोच्च अदालतका मुद्दाका अभिलेख, २०६४–२०७५ (सन् २००८–२०१८) मा दर्ता भएका पुनरावेदन, सन् २०२६ नोभेम्बर २ सम्म"],
    hearings: ["Supreme Court case pages for corruption appeals, read on 2–3 November 2026", "भ्रष्टाचार पुनरावेदनका सर्वोच्च अदालतका मुद्दा पाना, २–३ नोभेम्बर २०२६ मा हेरिएको"],
    neverListed: ["Supreme Court case pages for open corruption appeals, November 2026", "बाँकी भ्रष्टाचार पुनरावेदनका सर्वोच्च अदालतका मुद्दा पाना, नोभेम्बर २०२६"],
    arson: ["Supreme Court case pages, read on 1–2 November 2026", "सर्वोच्च अदालतका मुद्दा पाना, १–२ नोभेम्बर २०२६ मा हेरिएको"],
    recovery: ["Supreme Court annual reports 2080/81 and 2081/82, appendix 65(क) (series from 2075/76)", "सर्वोच्च अदालतका वार्षिक प्रतिवेदन २०८०/८१ र २०८१/८२, अनुसूची ६५(क) (२०७५/७६ देखिको शृङ्खला)"],
  };
  const CAVEAT = {
    lossRate: ["Counts cases, not people. Years are Nepali fiscal years. The amount claimed (बिगो) is a minimum, read from the judgments.", "मुद्दा गनिएको हो, व्यक्ति होइन। वर्ष नेपाली आर्थिक वर्ष हुन्। बिगो न्यूनतम रकम हो, फैसलाबाट पढिएको।"],
    whoConvicted: ["Counts defendant entries in the court record, not identified people.", "अदालतको अभिलेखमा प्रतिवादीका प्रविष्टि गनिएको हो, पहिचान भएका व्यक्ति होइन।"],
    whyAcquitted: ["Read with AI software, not yet reviewed by a lawyer. A sample: 42 judgments drawn, 31 could be used. Not a national rate.", "एआई सफ्टवेयरको सहायताले पढिएको, कानुन व्यवसायीले अझै समीक्षा गरेका छैनन्। नमुना: ४२ फैसला लिइयो, ३१ प्रयोग गर्न सकियो। राष्ट्रिय दर होइन।"],
    whyLost: ["Read with AI software, not yet reviewed by a lawyer. 16 judgments drawn at random from 146: a sample, not a national rate.", "एआई सफ्टवेयरको सहायताले पढिएको, कानुन व्यवसायीले अझै समीक्षा गरेका छैनन्। १४६ मध्ये जथाभावी छानिएका १६ फैसला: नमुना मात्र, राष्ट्रिय दर होइन।"],
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
    if (!v.check.includes("yearBefore")) return; // already removed upstream
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
    tracking: { v: ["None", "छैन"], from: "0", tag: ["There is no public way to look up a complaint's status", "उजुरीको स्थिति सार्वजनिक रूपमा हेर्ने कुनै उपाय छैन"] },
    shelved: { tag: ["of the complaints the CIAA decided that year were closed without a full investigation, with no reason given", "सो वर्ष अख्तियारले निर्णय गरेका उजुरी विस्तृत अनुसन्धान नगरी, कारण नखुलाई तामेलीमा"] },
    backlog: { tag: ["complaints still waiting; nobody says for how long", "उजुरी अझै पर्खिरहेका; कति समयदेखि, कसैले भन्दैन"] },
    afterInvestigation: { tag: ["of the CIAA's decisions after a full investigation closed the case", "विस्तृत अनुसन्धानपछिका अख्तियारका निर्णयमा मुद्दा तामेली"] },
    lossRate: { tag: ["of CIAA cases the Special Court decided: everyone acquitted", "विशेष अदालतले फैसला गरेका अख्तियारका मुद्दामा सबैलाई सफाइ"] },
    whoConvicted: { x: [/of ([\d,]+) /, /\(([०-९,]+) (?:अभियुक्त)?मध्ये\)/], tag: ["defendant records (of {x}) where the court's website does not say who was convicted", "प्रतिवादी अभिलेख ({x} मध्ये): अदालतको वेबसाइटले को दोषी ठहरियो भन्दैन"] },
    whyAcquitted: { tag: ["judgments we read (sample of 42): the evidence did not prove the charge", "हामीले पढेका फैसलामा (४२ को नमुना): प्रमाणले अभियोग पुष्टि गरेन"] },
    oneWay: { v: ["41%", "४१%"], from: "41% · 1%", x: [/· ([\d.]+%)$/, /· ([०-९.]+%)$/], xf: "value", tag: ["of convictions are overturned when the convicted person appeals, against {x} of acquittals when the government appeals", "दोषीले पुनरावेदन गर्दा ठहर उल्टिन्छ; सरकारले पुनरावेदन गर्दा सफाइ {x} मात्र उल्टिन्छ"] },
    whyLost: { tag: ["overturned convictions we read (a sample): the Supreme Court pointed to the investigation", "हामीले पढेका उल्टिएका ठहरमा (नमुना): सर्वोच्चले अनुसन्धानलाई औंल्यायो"] },
    notAppealed: { x: [/\(([\d,]+ of [\d,]+)\)/, /\(([०-९,]+ मध्ये [०-९,]+)\)/], tag: ["of acquittals ({x}) have no government appeal on record", "सफाइ ({x}) मा सरकारी पुनरावेदन अभिलेखमा छैन"] },
    duration: { tag: ["median time for a Supreme Court appeal to be decided: half take longer", "सर्वोच्चमा पुनरावेदनको फैसला हुन लाग्ने मध्यिका समय: आधाभन्दा बढीमा योभन्दा लामो"] },
    hearings: { tag: ["of scheduled hearings ended without the appeal being heard", "तोकिएका पेशीमा पुनरावेदनको सुनुवाइ नै भएन"] },
    neverListed: { tag: ["pending appeals never once listed for a hearing", "विचाराधीन पुनरावेदन एक पटक पनि पेशीमा नचढेका"] },
    arson: { tag: ["pending Supreme Court appeals whose case file is still missing after the 2025 arson", "सर्वोच्चका विचाराधीन पुनरावेदन जसको मिसिल २०८२ भदौ २४ को आगजनीपछि अझै फेला परेको छैन"] },
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
  fix("whoConvicted", "explain", "people prosecuted", "defendant records");
  fix("whoConvicted", "explain", "(about 1 in 3).", "(about 1 in 3). A person charged in two cases counts twice.");
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

  // Board review, 11:25 PT (facts). Numbers stay the data's own; only words change.
  const num = (x, ne) => (ne ? Number(x).toLocaleString("en-IN").replace(/[0-9]/g, (d) => "०१२३४५६७८९"[d]) : Number(x).toLocaleString("en-US"));
  const decided = F("shelved").viz.total; // complaints the CIAA decided in 2081/82 (table 2.14)
  // 1–2. "6 in 10" is of the complaints decided, not of the new ones; and 927 sent vs 947 finished.
  fix("shelved", "short.en", "17,716 complaints closed in 2081/82", `17,716 of the ${num(decided)} complaints decided in 2081/82 were`);
  fix("shelved", "short.en", "only 927 went on to a full one.", "only 927 were sent on for one.");
  fix("shelved", "short.ne", "२०८१/८२ मा १७,७१६ उजुरी", `२०८१/८२ मा निर्णय भएका ${num(decided, 1)} उजुरीमध्ये १७,७१६`);
  fix("shelved", "big.label.en", "complaints closed without a full investigation in 2081/82.", "of the complaints the CIAA decided in 2081/82 were closed without a full investigation.");
  fix("shelved", "big.label.ne", "उजुरी २०८१/८२ मा", "२०८१/८२ मा अख्तियारले निर्णय गरेका उजुरी");
  fix("shelved", "explain", "(6 in 10 of those it dealt with)", `(6 in 10 of the ${num(decided)} complaints it decided that year)`);
  fix("shelved", "explain", "so nobody outside the CIAA can tell why.", "so nobody outside the CIAA can tell why. The funnel above shows 947 instead: full investigations completed that year, a different count from the 927 sent on.");
  // 3. "1 in 4 to 1 in 2" with the unusual year said in the same line.
  fix("lossRate", "short.en", "the share rose from 1 in 4 verdicts to 1 in 2.", "the share was about 1 in 4 before 2077/78 and about 1 in 2 since (about 4 in 10 leaving out the unusual year 2078/79).");
  fix("lossRate", "short.ne", "यो अनुपात ४ मा १ फैसलाबाट २ मा १ पुग्यो।", "यो अनुपात २०७७/७८ अघि करिब ४ मा १ थियो, त्यसयता करिब २ मा १ छ (असामान्य वर्ष २०७८/७९ छाडेर करिब १० मा ४)।");
  fix("lossRate", "viz.sub.en", "1 in 2 in 2077/78–2081/82", "1 in 2 in 2077/78–2081/82 (about 4 in 10 leaving out 2078/79)");
  fix("lossRate", "viz.sub.ne", "२०७७/७८–२०८१/८२ मा २ मा १", "२०७७/७८–२०८१/८२ मा २ मा १ (२०७८/७९ छाडेर करिब १० मा ४)");
  // 5–6. Arson: the date of the data, and the periods behind 33% and 15%.
  fix("arson", "big.label.en", "14 months after the Supreme Court fire", "when the court's pages were read on 1–2 November 2026, almost 14 months after the fire of 9 September 2025");
  fix("arson", "big.label.ne", "खुला पुनरावेदन सर्वोच्चमा आगजनी भएको १४ महिनापछि पनि", "विचाराधीन पुनरावेदन, सर्वोच्चमा २०८२ भदौ २४ मा आगजनी भएको करिब १४ महिनापछि पनि");
  fix("arson", "short.en", "Decisions fell from 33% to 15% of pending appeals.", "The court decided 33% of pending appeals in the 14 months before the fire, and 15% from the fire to November 2026.");
  fix("arson", "short.ne", "फैसला ३३% बाट १५% मा झर्‍यो।", "आगजनीअघिका १४ महिनामा अदालतले विचाराधीन पुनरावेदनमध्ये ३३% को फैसला गर्‍यो, आगजनीदेखि सन् २०२६ नोभेम्बरसम्म १५% को मात्र।");
  fix("arson", "explain", "Fourteen months later, 865", "When we read the court's pages on 1–2 November 2026, almost 14 months later, 865");
  fix("arson", "explain", "In the 14 months after the fire the court decided 15% of the appeals pending; in the 14 months before, during a drive to clear old cases, 33%.", "From the fire to November 2026 the court decided 15% of the corruption appeals pending on the day of the fire. In the 14 months before the fire (9 July 2024 to 9 September 2025), during a drive to clear old cases, it decided 33% of those pending.");
  F("arson").viz.rows[1].en = "From the fire to November 2026"; F("arson").viz.rows[1].ne = "आगजनीदेखि सन् २०२६ नोभेम्बरसम्म";
  fix("arson", "headline.en", "865 open appeals", "865 pending appeals");
  // 7. Recovery: by amount, which years, which courts left out.
  fix("recovery", "short.en", "about 1 in 9 of it is cleared in a year.", "in 2080/81 and 2081/82, outside one or two courts, about 1 in 9 rupees of it was disposed of in a year.");
  fix("recovery", "short.ne", "त्यसको करिब ९ मा १ भाग वर्षमा फर्छ्यौट हुन्छ।", "२०८०/८१ र २०८१/८२ मा, एक-दुई अदालत बाहेक, त्यसको करिब ९ मा १ रुपैयाँ वर्षमा फर्छ्यौट भयो।");
  fix("recovery", "big.label.en", "of the courts' fine ledger (all kinds of case) is cleared in a year.", "of the rupees in the courts' fine ledger (all kinds of case) were disposed of in a year (2080/81–2081/82).");
  fix("recovery", "big.label.ne", "अदालतको दण्ड-जरिवाना लगत (सबै मुद्दा) वर्षमा फर्छ्यौट हुन्छ।", "अदालतको दण्ड-जरिवाना लगतको रकम (सबै मुद्दा) वर्षमा फर्छ्यौट भयो (२०८०/८१–२०८१/८२)।");
  fix("recovery", "explain", "Outside one or two courts, about 1 in 9 of that ledger is disposed of in a year.", "In 2080/81 and 2081/82, about 1 in 9 rupees of that ledger was disposed of in a year, down from about 1 in 6 before. That leaves out the Kathmandu District Court, where Special Court fines are recorded, and in 2081/82 Syangja: their one-off disposals made up most of the national total.");
  // 8. Tracking: checked again on launch week; the CIAA's own notice says the portal is being upgraded.
  fix("tracking", "big.label.en", "(checked 7 November 2026)", "(checked 10 November 2026)");
  fix("tracking", "big.label.ne", "(७ नोभेम्बर २०२६ मा जाँच गरिएको)", "(सन् २०२६ नोभेम्बर १० मा जाँच गरिएको)");
  fix("tracking", "short.en", "and the complaint portal was offline.", "and the online complaint portal is down for an upgrade.");
  fix("tracking", "short.ne", "र उजुरी पोर्टल बन्द थियो।", "र अनलाइन उजुरी पोर्टल स्तरोन्नतिका लागि बन्द छ।");
  fix("tracking", "viz.en", "Portal offline.", "Portal down for an upgrade.");
  fix("tracking", "viz.ne", "पोर्टल बन्द।", "पोर्टल स्तरोन्नतिका लागि बन्द।");
  fix("tracking", "explain", "When we checked the CIAA's website on 7 November 2026, it gave no complaint number and no way to look up a complaint's status. Its online complaint portal was offline for an upgrade.", "When we checked the CIAA's website on 7 November 2026, and again on 10 November 2026, it gave no complaint number and no way to look up a complaint's status. A CIAA notice dated 17 Kartik 2083 says its online complaint portal is being upgraded, and asks people to complain by email, phone, post or in person.");
  // 9. whoConvicted: the period, and what the "public page" is.
  fix("whoConvicted", "short.en", "the court's public page", "the court's website");
  fix("whoConvicted", "short.ne", "अदालतको सार्वजनिक पानाले", "अदालतको वेबसाइटले");
  fix("whoConvicted", "big.label.en", "where the public page does not say", "where the court's website does not say");
  fix("whoConvicted", "big.label.ne", "जहाँ सार्वजनिक पानाले", "जहाँ अदालतको वेबसाइटले");
  fix("whoConvicted", "explain", "The court's public case page gives", "For CIAA cases filed from 2069/70 to 2082/83 and decided by 8 October 2026, the court's case page on its website gives");
  // 10. One calendar: BS, with AD in brackets where the data are in AD.
  fix("duration", "short.en", "registered 2008–2018", "registered 2064–2075 BS (2008–2018)");
  fix("duration", "short.ne", "सन् २००८–२०१८ मा दर्ता", "२०६४–२०७५ (सन् २००८–२०१८) मा दर्ता");
  fix("duration", "big.label.en", "typical wait for a Supreme Court appeal (registered 2008–2018, counting those still open)", "median wait for a Supreme Court appeal: half wait longer (registered 2064–2075 BS, i.e. 2008–2018, counting those still pending)");
  fix("duration", "big.label.ne", "सर्वोच्चमा पुनरावेदनको सामान्य पर्खाइ (सन् २००८–२०१८ मा दर्ता, बाँकी समेत गन्दा)", "सर्वोच्चमा पुनरावेदनको मध्यिका पर्खाइ: आधाभन्दा बढीले योभन्दा लामो पर्खन्छन् (२०६४–२०७५, अर्थात् सन् २००८–२०१८ मा दर्ता, विचाराधीनसमेत गन्दा)");
  fix("duration", "explain", "registered 2008–2018", "registered 2064–2075 BS (2008–2018)");
  // Nepali terms (11:25 items 14–16, 18, 24); English to match where the meaning was off.
  fix("neverListed", "short.en", "a typical one has waited about 16 months.", "half have waited about 16 months or more.");
  fix("neverListed", "short.ne", "सामान्यतया करिब १६ महिनादेखि पर्खिरहेका छन्।", "आधाभन्दा बढी करिब १६ महिना वा बढीदेखि पर्खिरहेका छन्।");
  fix("neverListed", "explain", "A typical one has waited about 16 months", "Half have waited about 16 months or more");
  fix("neverListed", "headline.en", "730 open appeals", "730 pending appeals");
  fix("neverListed", "big.label.en", "open appeals have never", "pending appeals have never");
  fix("neverListed", "short.en", "730 of 1,890 open appeals", "730 of 1,890 pending appeals");
  fix("notAppealed", "short.en", "acquittals old enough to judge", "acquittals old enough for an appeal to have been filed");
  fix("notAppealed", "explain", "acquittals old enough to judge", "acquittals old enough for an appeal to have been filed");
  fix("notAppealed", "short.ne", "हेर्न मिल्ने १,०१० सफाइमध्ये", "पुनरावेदन गर्ने समय नाघिसकेका १,०१० सफाइमध्ये");
  fix("notAppealed", "viz.parts.1.en", "Appealed (or weak link)", "Appealed (or linked on weaker evidence)");
  fix("notAppealed", "viz.parts.1.ne", "पुनरावेदन भएको (वा कमजोर लिंक)", "पुनरावेदन भएको (वा कमजोर आधारमा जोडिएको)");
  fix("hearings", "headline.ne", "तोकिएका ४ मध्ये करिब ३ पेशी हुँदैनन्", "पेशी तोकिएका ४ मध्ये करिब ३ पटक सुनुवाइ हुँदैन");
  fix("whyAcquitted", "short.en", "Of 31 judgments with acquittals that we read (from a sample of 42):", "Of 31 judgments with acquittals that we read (from a random sample of 42):");

  // The drawer for "tracking" says the same as its card.
  fix("tracking", "big.value.en", "0", "None");
  fix("tracking", "big.value.ne", "०", "छैन");
  fix("tracking", "big.label.en", "ways to look up a complaint's status on the CIAA website", "public way to look up a complaint's status on the CIAA website");
  fix("tracking", "big.label.ne", "अख्तियारको वेबसाइटमा उजुरीको स्थिति हेर्ने उपाय", "अख्तियारको वेबसाइटमा उजुरीको स्थिति हेर्ने सार्वजनिक उपाय");

  // One Nepali term for each thing, in every Nepali string (11:25 items 12–14, 17, 23).
  const NE_FIXES = [ [ "निर्णयमा मुद्दा तामेली", "निर्णयमध्ये तामेली" ], [ "मा कम्तीमा एक जना दोषी ठहरिए।", "मा कम्तीमा एक प्रतिवादी दोषी ठहरियो।" ], [ "मुद्दामा कम्तीमा एक जना दोषी ठहर", "मुद्दामा कम्तीमा एक प्रतिवादी दोषी ठहर" ], [ "(२,६४९ मध्ये १,६१४) मा ठहर हुन्छ।", "(२,६४९ मध्ये १,६१४) मा कम्तीमा एक प्रतिवादी दोषी ठहरिन्छ।" ], [ "अदालतको वेबसाइटले को दोषी ठहरियो भन्दैन", "अदालतको वेबसाइटले कसलाई दोषी ठहर गरियो भनेर देखाउँदैन" ], [ "सर्वोच्चले अनुसन्धानलाई", "सर्वोच्च अदालतले अनुसन्धानलाई" ], [ "सर्वोच्चमा पुनरावेदनको", "सर्वोच्च अदालतमा पुनरावेदनको" ], [ "आधाभन्दा बढीमा योभन्दा लामो", "आधामा योभन्दा लामो" ], [ "आधाभन्दा बढीले योभन्दा लामो पर्खन्छन्", "आधाले योभन्दा लामो पर्खन्छन्" ], [ "आधाभन्दा बढी करिब १६ महिना वा बढीदेखि", "आधा करिब १६ महिना वा सोभन्दा बढी समयदेखि" ], [ "कहिल्यै पेशीमा चढेनन्;", "कहिल्यै पेशीमा चढेका छैनन्;" ], [ "दोषीले पुनरावेदन गर्दा ठहर उल्टिन्छ; सरकारले पुनरावेदन गर्दा सफाइ १% मात्र उल्टिन्छ", "दोषीले पुनरावेदन गर्दा ठहर पूरै उल्टिन्छ; सरकारले पुनरावेदन गर्दा सफाइ १% मा मात्र उल्टिन्छ" ], [ "पुनरावेदन एकतर्फी: दोषी ठहर प्रायः उल्टिन्छ,", "पुनरावेदनको नतिजा एकतर्फी: दोषी ठहर धेरै उल्टिन्छन्," ], [ "उल्टिएका ठहर प्रायः अनुसन्धान र प्रमाणका कारण असफल हुन्छन्", "उल्टिएका दोषी ठहरमा प्रायः अनुसन्धान र प्रमाणकै कमजोरी कारण देखिन्छ" ], [ "पुनरावेदनको फैसलाले सन् २०२१ को फैसला उद्धृत गरेकामा ८४% ठहर उल्टिए", "पुनरावेदनको फैसलामा सन् २०२१ को फैसला उद्धृत भएका मुद्दामध्ये ८४% मा ठहर उल्टियो" ], [ "सफाइ (१,०१० मध्ये २१९) मा सरकारी पुनरावेदन अभिलेखमा छैन", "सफाइमा (१,०१० मध्ये २१९) सरकारी पुनरावेदन अभिलेखमा भेटिएन" ], [ "पुनरावेदन (४,४३० मध्ये) कुन मुद्दाको हो, जोड्न सकिएन", "पुनरावेदन (४,४३० मध्ये) विशेष अदालतको कुन मुद्दाबाट आएको हो, जोड्न सकिएन" ], [ "प्रायः अभियोग पुष्टि भएन वा अपराध नै होइन भन्छ; कहिलेकाहीँ अख्तियारले छानीछानी मुद्दा चलायो भन्छ", "प्रायः अभियोग पुष्टि नभएको वा कसुर नै नभएको भन्छ; कहिलेकाहीँ अख्तियारले छानीछानी मुद्दा चलाएको भन्छ" ], [ "कसुर नै होइन ११", "कसुर नै नभएको ११" ], [ "१२ फैसलामा अदालतले आंशिक रूपमा छानीछानी मुद्दा चलाएको आधार लियो।", "छानीछानी मुद्दा चलाएको उल्लेख भएका सबै फैसला पढ्दा १२ मा अदालतले त्यसलाई पनि सफाइको एउटा आधार बनायो।" ], [ "तल्लो अदालतलाई दोष: ०", "सुनुवाइ प्रक्रियालाई दोष: ०" ], [ "व्यक्तिगत फैसला नदेखिने", "प्रतिवादीगत नतिजा नदेखिने" ], [ "मुद्दाबाटै फैसला स्पष्ट", "मुद्दाको नतिजाबाटै स्पष्ट" ], [ "बिगो न्यूनतम रकम हो, फैसलाबाट पढिएको।", "बिगो फैसलाबाट पढिएको न्यूनतम रकम हो।" ], [ "तोकिएका पेशीमा पुनरावेदनको सुनुवाइ नै भएन", "पेशी तोकिएका पटकमध्ये पुनरावेदनको सुनुवाइ नै भएन" ], [ "तोकिएका २७,८५५ पेशीमध्ये इजलासले पुनरावेदन नहेरी सकिए", "पेशी तोकिएका २७,८५५ पटकमध्ये इजलासले पुनरावेदन नहेरिकनै पेशी सकियो" ], [ "तोकिएका २७,८५५ पेशीमध्ये ७७% मा पुनरावेदनको सुनुवाइ भएन; तीमध्ये ४ मा ३ मा कारण अदालतकै तर्फबाट थियो।", "पेशी तोकिएका २७,८५५ पटकमध्ये ७७% मा पुनरावेदनको सुनुवाइ भएन; तीमध्ये ४ मा ३ पटक कारण अदालतकै तर्फको थियो।" ], [ "सन् २०२५ सेप्टेम्बरको आगजनीपछि", "२०८२ भदौ २४ को आगजनीपछि" ], [ "र फैसला आधाभन्दा बढीले घटेको छ", "र फैसला हुने दर आधाभन्दा बढीले घटेको छ" ], [ "पुनरावेदन, सर्वोच्चमा २०८२", "पुनरावेदन, सर्वोच्च अदालतमा २०८२" ], [ "पुनरावेदनको मिसिल अझै नष्ट;", "पुनरावेदनको मिसिल नष्ट भई अझै फेला परेको छैन;" ], [ "सर्वोच्चका विचाराधीन पुनरावेदन जसको", "सर्वोच्च अदालतमा विचाराधीन पुनरावेदन, जसको" ], [ "र अख्तियारको मुद्दा दर्ता, हातैले", "र अख्तियारको मुद्दा दर्ता अभिलेख, हातैले" ], [ "मात्र सर्वोच्च अदालतपछि पनि कायम रहने ठहरमा पुग्छन्।", "मा मात्र सर्वोच्च अदालतपछि पनि दोषी ठहर कायम रहन्छ।" ], [ "पुनरावेदन नभएका सबै ठहर पनि कायम रहन्छन् भने", "पुनरावेदन नभएका सबै ठहर कायम रहन्छन् भनी मान्ने हो भने" ], [ "त्यसले हामीबाट लुकाएको कुरा", "त्यस कमीका कारण हामीले हेर्न नसकेको कुरा" ], [ "सीमाका रूपमा उल्लेख छ।", "सीमाका रूपमा उल्लेख गरिएको छ।" ], [ "अदालत लगिएका मुद्दा", "दायर गरिएका मुद्दा" ], [ "अख्तियारले विशेष अदालतमा लगेका मुद्दा", "अख्तियारले विशेष अदालतमा दायर गरेका मुद्दा" ], [ "अख्तियारले अदालत लगेका करिब १० मा ४ मुद्दा पूर्ण सफाइमा टुंगिन्छन्, विस्तृत अनुसन्धानपछि पनि", "विस्तृत अनुसन्धानपछि अख्तियारले दायर गरेका करिब १० मा ४ मुद्दामा सबै प्रतिवादीले सफाइ पाउँछन्" ], [ "कुन प्रतिवादी दोषी ठहरिए र कुन सफाइ पाए", "कुन प्रतिवादी दोषी ठहरिए र कसले सफाइ पाए" ], [ "भ्रष्टाचारका फैसलाबाट कति रकम फिर्ता आयो", "भ्रष्टाचारका फैसलाबाट कति रकम असुल भयो" ], [ "अदालतको दण्ड-जरिवाना लगतको रकम (सबै मुद्दा) वर्षमा फर्छ्यौट भयो", "अदालतको दण्ड-जरिवाना लगतको रकम (सबै प्रकारका मुद्दा) मध्ये वर्षमा फर्छ्यौट भएको अंश" ], [ "एक-दुई अदालत बाहेक", "एक-दुई अदालतबाहेक" ], [ "सन् २०२६ नोभेम्बर ७ र १० मा", "२०८३ कार्तिक २१ र २४ मा" ], [ "(सन् २०२६ नोभेम्बर १० मा", "(२०८३ कार्तिक २४ मा" ], [ "सन् २०२६ अक्टोबर ८ सम्मका", "२०८३ असोज २२ सम्मका" ], [ "सन् २०२६ नोभेम्बर ७ मा जाँच", "२०८३ कार्तिक २१ मा जाँच" ], [ "(८ अक्टोबर २०२६ मा लिइएको)", "(२०८३ असोज २२ मा लिइएको)" ], [ "(३ नोभेम्बर २०२६ सम्म)", "(२०८३ कार्तिक १७ सम्म)" ], [ "(३ नोभेम्बर २०२६)", "(२०८३ कार्तिक १७)" ], [ "१–२ नोभेम्बर २०२६ मा", "२०८३ कार्तिक १५–१६ मा" ], [ "२–३ नोभेम्बर २०२६ मा", "२०८३ कार्तिक १६–१७ मा" ], [ "पाना, नोभेम्बर २०२६", "पाना, कार्तिक २०८३" ], [ "सन् २०२६ नोभेम्बर २ सम्म", "२०८३ कार्तिक १६ सम्म" ], [ "आगजनीदेखि सन् २०२६ नोभेम्बरसम्म", "आगजनीदेखि २०८३ कार्तिकसम्म" ] ]; // from test/ne-fixes.json (NEPALI.md §2)
  const NE_TERMS = [
    [/खुला पुनरावेदन/g, "विचाराधीन पुनरावेदन"], [/पूर्ण अनुसन्धान/g, "विस्तृत अनुसन्धान"], [/अभियुक्त/g, "प्रतिवादी"], [/फछ्र्यौट/g, "फर्छ्यौट"],
    [/अख्तियारले (?:नै )?दिएको घुस रकम/g, "अख्तियारले नै उपलब्ध गराएको घुस रकम"], [/सार्वजनिक (?:मुद्दा )?पाना/g, "अदालतको वेबसाइटको मुद्दा पाना"],
  ];
  const walkNe = (o, isNe) => {
    if (!o || typeof o !== "object") return;
    for (const k of Object.keys(o)) {
      const v = o[k], ne = isNe || k === "ne" || /_ne$/.test(k);
      if (typeof v === "string" && ne) o[k] = NE_FIXES.reduce((x, [a, b]) => x.split(a).join(b), NE_TERMS.reduce((x, [a, b]) => x.replace(a, b), v));
      else if (typeof v === "object") walkNe(v, ne && k !== "en");
    }
  };
  // The CIAA's own terms for its stages (35th report, table 2.14).
  JW.stages.forEach((st) => { st.ne = st.ne.replace("छानबिन र प्रारम्भिक अनुसन्धान", "स्क्रिनिङ र प्रारम्भिक छानबिन").replace("मुद्दा चलाउने निर्णय", "मुद्दा दायर गर्ने निर्णय"); });
  JW.findings.forEach((f) => walkNe(f, false));
  JW.stages.forEach((st) => walkNe(st, false));

  if (bad.length) { console.error("copy.js: text no longer matches the data:\n" + bad.join("\n")); window.JW_COPY_ERRORS = bad; }
})();
