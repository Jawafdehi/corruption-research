// Nepali (ne) catalogue for the corruption-accountability dashboard.
//
// ─────────────────────────────────────────────────────────────────────────────
// UNREVIEWED FIRST PASS — NOT CLEARED FOR PUBLICATION
//
// This is a machine-authored translation that has NOT been read by a Nepali
// speaker. It carries the same status as the Nepali copy on the main site's
// research route, which is excluded from publication for exactly this reason.
// The language toggle surfaces it with a visible "unreviewed" marker.
//
// Before this ships without that marker, a Nepali-speaking reviewer needs to go
// through it — with particular attention to:
//   · the legal vocabulary (see below): are these the terms the court and the
//     Commission actually use in their own Nepali, or merely intelligible ones?
//   · register — the English is plain, declarative reporting prose, and the
//     Nepali should be too, not the heavier formal register of a court order;
//   · the caveats, which are the most load-bearing sentences on the site. A
//     caveat that is softened in translation is worse than no caveat.
//
// Terms below are lifted from the court's own records via `corpus_data.py`
// rather than translated, so they match what a reader sees on a cause list:
//   ठहर · आंशिक ठहर · सफाई — the three dispositions (full / partial / acquittal)
//   and the thirteen charge families in that file's `CHARGE_LABELS`.
// Keep it that way: these are quoted vocabulary, not free translation.
//
// Keys with no entry here fall back to the English default at the call site, so
// a partial catalogue degrades to mixed-language rather than to blanks.
// ─────────────────────────────────────────────────────────────────────────────

export const ne: Record<string, string> = {
  // --- chrome ---------------------------------------------------------------
  "research.corruption.site.eyebrow": "जवाफदेही अनुसन्धान",
  "research.corruption.site.title": "भ्रष्टाचारमा जवाफदेही",
  "research.corruption.site.lede":
    "नेपालमा भ्रष्टाचारको उजुरीको के हुन्छ — आयोगको दर्ता डेस्कदेखि विशेष अदालतको फैसला हुँदै सर्वोच्च अदालतसम्म। यहाँका हरेक अंक अदालतकै आफ्नै फौजदारी दर्ता किताब र आयोगका प्रकाशित वार्षिक प्रतिवेदनबाट गणना गरिएका हुन्।",

  "research.corruption.nav.overview": "सारांश",
  "research.corruption.nav.overviewBlurb": "जवाफदेही कहाँ हराउँछ",
  "research.corruption.nav.outcomes": "फैसला",
  "research.corruption.nav.outcomesBlurb": "अदालतले के निर्णय गर्छ",
  "research.corruption.nav.overTime": "समयक्रम",
  "research.corruption.nav.overTimeBlurb": "मुद्दाको चाप कसरी चल्यो",
  "research.corruption.nav.benches": "इजलास",
  "research.corruption.nav.benchesBlurb": "कसले निर्णय गर्छ, कति छिटो",
  "research.corruption.nav.appeals": "पुनरावेदन",
  "research.corruption.nav.appealsBlurb": "सर्वोच्चमा के टिक्छ",
  "research.corruption.nav.method": "विधि",
  "research.corruption.nav.methodBlurb": "स्रोत, सीमा र प्रमाण",
  "research.corruption.nav.aria": "प्रतिवेदनका खण्डहरू",
  "research.corruption.loading": "खण्ड लोड हुँदै",
  "research.corruption.fy": "आ.व. {{fy}}",
  "research.corruption.tile.ofDecided": "फैसला भएकामध्ये {{pct}}",

  "research.corruption.footer.snapshot":
    "अदालत दर्ता किताबको स्न्यापसट {{snapshot}} · पृष्ठ तयार भएको {{generated}}। यस साइटको हरेक अंक हातले नभरी प्रकाशित डेटासेटबाट निकालिएको हो।",
  "research.corruption.footer.pack": "पुनरुत्पादनयोग्य डेटा प्याक र नोटबुक:",
  "research.corruption.footer.records": "स्रोत अभिलेख:",
  "research.corruption.footer.licence":
    "© जवाफदेही इनिसिएटिभ। डेटा र पाठ CC BY-NC 4.0 अन्तर्गत। गणना गरिएको",
  "research.corruption.footer.casesNotPeople": "मुद्दाको हो, व्यक्तिको कहिल्यै होइन",
  "research.corruption.footer.licenceEnd": "— अदालतले मुद्दापिच्छे एउटा फैसला राख्छ।",

  "research.corruption.lang.aria": "भाषा",
  "research.corruption.lang.unreviewed": "अस्वीकृत अनुवाद",
  "research.corruption.lang.unreviewedTitle":
    "यो नेपाली अनुवाद मेसिनबाट तयार भएको पहिलो मस्यौदा हो र कुनै नेपाली भाषी समीक्षकले जाँचेको छैन। अंकहरू भने अदालतकै अभिलेखबाट गणना गरिएका हुन् र भाषा फेरिए पनि उस्तै रहन्छन्।",


  // --- प्रक्रिया चित्र (flowchart) -------------------------------------------
  // One language at a time: the English side reads English and romanises तामेली
  // as "Tameli"; this side is wholly Nepali. Wording follows the कार्यविधि, २०७८.
  "research.corruption.flow.title": "भ्रष्टाचारको उजुरी कुन बाटो हिँड्छ",
  "research.corruption.flow.exit": "तामेली",
  "research.corruption.flow.srIntro":
    "भ्रष्टाचारको उजुरीले लिने बाटो, क्रमैसँग। पहिलो पाँच चरण आयोगमा हुन्छन्; छैटौं र सातौं छुट्टै अदालत हुन्।",
  "research.corruption.flow.srExit": "यस चरणमा उजुरी तामेलीमा राख्न सकिन्छ।",
  "research.corruption.flow.exitMeaning":
    "भनेको उजुरी हाललाई तामेलीमा राखिएको हो। मिसिल र अभिलेख रहिरहन्छ, र पछि थप प्रमाण फेला परेमा सोही बखत कानूनबमोजिम कारबाही हुन्छ। त्यसैले तामेली भनेको मुद्दा सदाका लागि टुङ्गिएको भन्ने होइन।",
  "research.corruption.flow.exitCite":
    "अख्तियार दुरुपयोग अनुसन्धान आयोग ऐन, २०४८ को दफा १९(१३)।",
  "research.corruption.flow.s7Title": "सर्वोच्च अदालत पुनरावेदन",
  "research.corruption.hl.cdTitle": "आयोगमा रहेका सबै उजुरी, आ.व. २०८१/८२",
  "research.corruption.hl.cdTotal": "{{carried}} अघिल्लो वर्षबाट सरेका + {{fresh}} नयाँ दर्ता",
  "research.corruption.hl.cdTameli": "तामेलीमा राखिएका",
  "research.corruption.hl.cdOther": "अन्य कारबाही",
  "research.corruption.hl.cdInv": "विस्तृत अनुसन्धानमा पठाइएका",
  "research.corruption.hl.cdPending": "फर्छ्यौट हुन बाँकी, अर्को वर्षमा सरेका",
  "research.corruption.hl.cdInvTitle": "र सोही वर्ष सम्पन्न भएका {{n}} विस्तृत अनुसन्धानमध्ये",
  "research.corruption.hl.cdFiled": "अदालतमा मुद्दा दायर",
  "research.corruption.hl.cdInvTameli": "तामेलीमा राखिएका",
  "research.corruption.hl.cdHeld": "मुलतबीमा राखिएका",
  "research.corruption.hl.cdNote":
    "दुवै खण्ड एउटै आर्थिक वर्ष र एउटै प्रतिवेदनका हुन्, र प्रत्येकलाई आ-आफ्नै जम्माले भाग गरिएको छ। यी एउटै समूहलाई पछ्याएका होइनन्: यस वर्ष सम्पन्न भएका अनुसन्धान प्रायः अघिल्ला वर्षमा सुरु भएका हुन्, त्यसैले यी दुईलाई जोडेर रूपान्तरण दर निकाल्न मिल्दैन।",
  "research.corruption.flow.exitHere": "यहाँ तामेली हुन सक्छ",
  "research.corruption.flow.yes": "हुन्छ",
  "research.corruption.flow.no": "हुँदैन",
  "research.corruption.flow.dScreen": "अघि बढाउने?",
  "research.corruption.flow.dGrounds": "आधार भेटियो?",
  "research.corruption.flow.dProsecute": "मुद्दा चलाउने?",
  "research.corruption.flow.dAppeal": "पुनरावेदन पर्‍यो?",
  "research.corruption.flow.stands": "फैसला यथावत्",
  "research.corruption.flow.centreTitle": "उजुरीको बाटो",
  "research.corruption.flow.s1Title": "उजुरी दर्ता",
  "research.corruption.flow.s1": "आयोगमा प्राप्त उजुरी दर्ता गरिन्छ।",

  "research.corruption.flow.s2Title": "उजुरी परीक्षण",
  "research.corruption.flow.s2":
    "उजुरी परीक्षण समितिले उजुरीको प्रकृति र आवश्यक कारबाहीबारे मूल्याङ्कन गरी सिफारिस गर्छ। निर्णय आयुक्तबाट हुन्छ।",

  "research.corruption.flow.s3Title": "प्रारम्भिक छानबिन",
  "research.corruption.flow.s3":
    "आवश्यक कागजात, सम्बन्धित निकायको प्रतिक्रिया र उपलब्ध तथ्य जाँच गरिन्छ।",

  "research.corruption.flow.s4Title": "विस्तृत अनुसन्धान",
  "research.corruption.flow.s4":
    "भ्रष्टाचार भएको आधार देखिएमा अनुसन्धान अधिकृत तोकी विस्तृत अनुसन्धान अघि बढाइन्छ।",

  "research.corruption.flow.s5Title": "अभियोजनको निर्णय",
  "research.corruption.flow.s5":
    "अनुसन्धानबाट प्राप्त प्रमाणका आधारमा मुद्दा चलाउने वा नचलाउने निर्णय गरिन्छ।",

  "research.corruption.flow.s6Title": "विशेष अदालत",
  "research.corruption.flow.s6":
    "मुद्दा चलाउने निर्णय भएमा आरोपपत्र विशेष अदालतमा दायर गरिन्छ र अदालतले प्रमाणका आधारमा फैसला गर्छ।",

  "research.corruption.flow.s7":
    "फैसला चित्त नबुझेमा कानुनबमोजिम सर्वोच्च अदालतमा पुनरावेदन गर्न सकिन्छ।",

  // --- Overview -------------------------------------------------------------
  "research.corruption.funnel.stage.investigatedNote":
    "जम्मा {{pct}}% मात्र पूर्ण अनुसन्धानसम्म पुग्छन्",
  "research.corruption.funnel.stage.filedNote":
    "अनुसन्धान भएकामध्ये करिब {{k}} मा १ मा मुद्दा दायर हुन्छ",
  "research.corruption.funnel.stage.convictedNote":
    "दायर मुद्दामध्ये करिब {{pct}}% मा ठहर हुन्छ",
  "research.corruption.funnel.stage.complaints": "आयोगमा परेका उजुरी",
  "research.corruption.funnel.stage.investigated": "पूर्ण अनुसन्धान भएका उजुरी",
  "research.corruption.funnel.stage.filed": "दायर भएका मुद्दा",
  "research.corruption.funnel.stage.convicted": "ठहर (अनुमानित)",

  "research.corruption.stage.intake.owner": "अख्तियार दुरुपयोग अनुसन्धान आयोग",
  "research.corruption.stage.intake.title": "प्रारम्भिक छानबिनले नै लगभग सबै कुरा टुंग्याउँछ",
  "research.corruption.stage.intake.body":
    "एकै वर्षमा दर्ता भएका {{complaints}} उजुरीमध्ये {{investigated}} मात्र पूर्ण अनुसन्धानसम्म पुगे — {{pct}}%। यहीँ तामेलीमा गएको उजुरीलाई पछिको कुनै पनि चरणले फर्काउन सक्दैन, र तामेलीका कारण मुद्दापिच्छे सार्वजनिक गरिँदैन।",
  "research.corruption.stage.charging.owner": "अख्तियार दुरुपयोग अनुसन्धान आयोग",
  "research.corruption.stage.charging.title": "जे अभियोग लाग्छ, त्यो समग्र तस्बिर होइन",
  "research.corruption.stage.charging.body":
    "पूर्ण अनुसन्धान भएका करिब {{k}} उजुरीमध्ये १ मा मात्र मुद्दा दायर हुन्छ। दायर हुने अभियोगहरू प्रमाणित गर्न सहज कागजी प्रकृतिका अपराधतिर बढी ढल्किएका छन् — जसले ठहर दर त बढाउँछ, तर ठूलो स्तरको भ्रष्टाचारबारे खासै केही बताउँदैन।",
  "research.corruption.stage.trial.owner": "विशेष अदालत",
  "research.corruption.stage.trial.title": "अदालतले निर्णय गर्छ — मुद्दापिच्छे एउटा फैसला",
  "research.corruption.stage.trial.body":
    "स्पष्ट फैसला भएका {{decided}} मुद्दामध्ये {{rate}}% पूर्ण वा आंशिक रूपमा ठहर भए। अदालतले मुद्दापिच्छे एउटै फैसला प्रकाशित गर्छ, प्रतिवादीपिच्छेको छुट्टै नतिजा होइन — त्यसैले यहाँका हरेक दर मुद्दाको गणना हुन्, व्यक्तिको होइन।",
  "research.corruption.stage.appeal.owner": "सर्वोच्च अदालत",
  "research.corruption.stage.appeal.title": "नटिक्ने भाग भनेकै ठहर हो",
  "research.corruption.stage.appeal.body":
    "पुनरावेदनको फैसला भइसकेका मुद्दामा, ठहर भएका व्यक्तिले आफ्नो फैसला उल्ट्याउने दर आयोगले सफाइ उल्ट्याउने दरभन्दा धेरै बढी छ। विशेष अदालतको सफाइ लगभग अन्तिम हुन्छ; त्यहाँको ठहर भने हुँदैन।",
  "research.corruption.stage.recovery.owner": "कुनै पनि निकायले प्रकाशित गर्दैन",
  "research.corruption.stage.recovery.title": "कति असुल भयो भन्ने कसैले बताउँदैन",
  "research.corruption.stage.recovery.body":
    "आयोगले हरेक वर्ष दाबी गरेको बिगो प्रकाशित गर्छ। तर वास्तवमा कति असुल भयो भन्ने कुनै निकायले प्रकाशित गर्दैन, र अदालतको अभिलेखमा पनि त्यो हुँदैन — त्यसैले जवाफदेहीको अन्तिम चरण नाप्न नै सकिँदैन।",

  "research.corruption.overview.eyebrow": "समस्याको स्वरूप",
  "research.corruption.overview.title":
    "भ्रष्टाचारका अधिकांश उजुरी न्यायाधीशसम्म पुग्नुअघि नै टुंगिन्छन्",
  "research.corruption.overview.lede":
    "नेपालको भ्रष्टाचारविरुद्धको प्रणालीलाई प्रायः अदालतले के गर्‍यो भन्ने आधारमा हेरिन्छ। तर अदालत त्यसको सबैभन्दा सानो हिस्सा हो। एउटै प्रतिवेदन वर्षमा आयोगले {{complaints}} उजुरी दर्ता गर्‍यो र {{filed}} मुद्दा दायर गर्‍यो — अर्थात् निर्णायक छनोट अदालत पुग्नुभन्दा धेरै अघि, कसैले मुद्दापिच्छे देख्नै नसक्ने चरणमा हुन्छ।",
  "research.corruption.tile.complaints": "एक वर्षका उजुरी",
  "research.corruption.tile.complaintsNote": "नयाँ दर्ता, अघिल्लो वर्षको बाँकी नगनी",
  "research.corruption.tile.filed": "दायर भएका मुद्दा",
  "research.corruption.tile.filedNote": "सोही वर्ष, विशेष अदालतमा",
  "research.corruption.tile.corpus": "यस संग्रहका मुद्दा",
  "research.corruption.tile.corpusNote": "फौजदारी दर्ता किताबका {{years}} पूरा आर्थिक वर्ष",
  "research.corruption.tile.conviction": "पूर्ण वा आंशिक ठहर",
  "research.corruption.tile.convictionNote": "कडा मापदण्ड (पूर्ण ठहर मात्र) मा {{full}}%",
  "research.corruption.funnel.title": "उजुरीदेखि ठहरसम्म",
  "research.corruption.funnel.subtitle":
    "आयोगको एक प्रतिवेदन वर्ष, जसको अन्तिम चरण यस संग्रहको ठहर दरबाट अनुमान गरिएको हो।",
  "research.corruption.funnel.caption":
    "उजुरी, अनुसन्धान र मुद्दा दायरका अंक आयोगकै प्रकाशित तथ्यांक हुन्। ठहरको पट्टी भने प्रकाशित अंक होइन — यसले दायर मुद्दामा यस संग्रहबाट नापिएको दर लागू गर्छ, जसले {{filed}} मध्ये करिब {{convicted}} देखाउँछ। हरेक चरण मुद्दाको गणना हो, व्यक्तिको होइन।",
  "research.corruption.funnel.source": "आयोगको वार्षिक प्रतिवेदन",
  "research.corruption.funnel.of": "उजुरीको {{pct}}",
  "research.corruption.overview.caveat":
    "यो फनेलको साँघुरो फेद आफैंमा अदालत असफल भएको प्रमाण होइन। अधिकांश क्षति दर्ताकै चरणमा हुन्छ, जहाँ उजुरी पूर्ण अनुसन्धानबिनै तामेलीमा जान्छ। अदालतको आफ्नै प्रदर्शन हेर्न फैसला खण्ड पढ्नुहोस्, जहाँको भाजक वास्तवमै फैसलासम्म पुगेका मुद्दा हुन्।",
  "research.corruption.gaps.eyebrow": "कहाँ भाँचिन्छ",
  "research.corruption.gaps.title": "पाँच चरण, पाँच फरक जिम्मेवार निकाय",
  "research.corruption.gaps.body":
    "तलका हरेक चरणको जिम्मा कुनै न कुनै निकायले लिएको छ। अन्तिम चरणको जिम्मा भने कसैले लिएको छैन — यही कारण यो अनुसन्धानले अंक राख्न नसकेको एक मात्र चरण त्यही हो।",
  "research.corruption.gaps.noData": "प्रकाशित तथ्यांक छैन",
  "research.corruption.gaps.next":
    "यसपछिका खण्डहरूले नाप्न सकिने दुई चरण नाप्छन् —",
  "research.corruption.gaps.nextOutcomes": "अदालतले के निर्णय गर्छ",
  "research.corruption.gaps.nextAnd": "र",
  "research.corruption.gaps.nextAppeals": "पुनरावेदनपछि के बाँकी रहन्छ",
  "research.corruption.gaps.nextEnd": "।",

  // --- Outcomes -------------------------------------------------------------
  "research.corruption.outcome.convicted": "ठहर",
  "research.corruption.outcome.partial": "आंशिक ठहर",
  "research.corruption.outcome.acquitted": "सफाई",
  "research.corruption.outcomes.eyebrow": "अदालतले के निर्णय गर्छ",
  "research.corruption.outcomes.title":
    "ठहर दर कुन अभियोग लगाइयो भन्नेमा निर्भर छ",
  "research.corruption.outcomes.lede":
    "स्पष्ट फैसला भएका {{decided}} मुद्दामध्ये {{rate}}% पूर्ण वा आंशिक रूपमा ठहर भए। तर यो मुख्य अंकले बढी तीखो कथा लुकाउँछ: कागजी प्रकृतिको अभियोग लागेका लगभग सबैलाई अदालतले ठहर गर्छ, र प्रणाली जुन आर्थिक भ्रष्टाचार दण्डित गर्न बनेको हो, त्यसमा अभियुक्त हुनेमध्ये निकै कमलाई।",
  "research.corruption.tile.full": "पूर्ण ठहर",
  "research.corruption.tile.partial": "आंशिक ठहर",
  "research.corruption.tile.acquitted": "सफाई",
  "research.corruption.tile.ongoing": "फैसला कुरिरहेका",
  "research.corruption.tile.ongoingNote": "दर्ता किताबमा खुला रहेका मुद्दा",
  "research.corruption.donut.title": "फैसला भएका मुद्दा कसरी टुंगिन्छन्",
  "research.corruption.donut.subtitle":
    "अदालतले मुद्दापिच्छे एउटा फैसलालाई ठहर, आंशिक ठहर वा सफाईमा वर्गीकरण गर्छ। तीनै वर्ग परस्पर अनन्य हुन्।",
  "research.corruption.donut.caption":
    "मिश्रित इजलासको नतिजा आंशिक ठहरमा पर्छ — केही प्रतिवादी ठहर र अरू सफाई, वा केही अभियोगमा मात्र ठहर। प्रतिवादीपिच्छेको नतिजा कतै प्रकाशित नहुने भएकाले आंशिक ठहरलाई वास्तवमा कति जना ठहर भए भन्नेमा छुट्याउन सकिँदैन। त्यसैले यो साइटले पूर्ण ठहर मात्रको दर र पूर्ण-जोड-आंशिकको दर दुवै देखाउँछ, र कहिल्यै चुपचाप एउटा छान्दैन।",
  "research.corruption.donut.center": "फैसला भएका मुद्दा",
  "research.corruption.byCharge.title": "अभियोगअनुसार ठहर दर",
  "research.corruption.byCharge.subtitle":
    "अपराधको प्रकारअनुसार फैसला भएका मुद्दा, नतिजाअनुसार विभाजित र पूर्ण ठहर हुने दरका आधारमा क्रमबद्ध।",
  "research.corruption.byCharge.caption":
    "स्पष्ट फैसला भएका {{clean}} मुद्दामध्ये {{n}} लाई समेट्छ; बाँकीको अभियोग विवरण वर्गीकरण गर्न सकिएन। सम्पत्ति शुद्धीकरण मुख्य संग्रहभित्र नपरे पनि यहाँ छुट्टै पंक्ति पाउँछ, किनभने त्यो फरक ऐनअन्तर्गत चल्छ। हरेक दर मुद्दापिच्छेको हो, अभियुक्तपिच्छेको होइन।",
  "research.corruption.byCharge.source": "अभियोगपत्र",
  "research.corruption.byCharge.avg": "अदालतको औसत {{pct}}%",
  "research.corruption.byCharge.body":
    "नक्कली प्रमाण पत्रका मुद्दा — कसैले नक्कली प्रमाणपत्र पेस गरेको — {{fakePct}}% अवस्थामा पूर्ण ठहर हुन्छन्, र यस संग्रहका सम्पूर्ण पूर्ण ठहरमध्ये करिब {{fakeShare}}% एक्लै यिनले ओगट्छन्। दोस्रो ठूलो अभियोग रिसवतको ठहर दर {{briberyPct}}% छ। यी दुईलाई हटाइदिने हो भने बाँकी सबै — रकम हिनामिना, हानीनोक्सानी, गैरकानूनी सम्पत्ति, अनियमितता — मात्र {{restPct}}% अवस्थामा पूर्ण ठहर हुन्छन्।",
  "research.corruption.byCharge.caveat":
    "मुख्य अंकलाई कसरी पढ्ने भन्नेमा सबैभन्दा धेरै फरक पार्ने निष्कर्ष यही हो। ठहर दर बढ्नुको अर्थ अभियोजन सुध्रिएको पनि हुन सक्छ, वा त्यो वर्ष सजिलो अभियोग बढी लगाइएको पनि। समयक्रम खण्डले यी दुई व्याख्यालाई छुट्याउँछ, पाठकलाई अनुमान गर्न छोड्दैन।",
  "research.corruption.outcomes.derived":
    "अन्य {{n}} मुद्दाको फैसला कजलिस्टमा प्रकाशित नभई अदालतको लिखित फैसलाबाट पढेर निकालिएको हो। यस साइटका हरेक दरले तिनलाई बाहिरै राख्छ, र त्यो संख्या यहाँ देखाइएको छ — ताकि बहिष्करण लुकेको छानबिन नभई देखिने अंक होस्।",

  // --- Over time ------------------------------------------------------------
  "research.corruption.overTime.eyebrow": "मुद्दाको चाप कसरी चल्यो",
  "research.corruption.overTime.title": "ठहर दर बदलियो किनभने अभियोग बदलिए",
  "research.corruption.overTime.lede":
    "एक्लै हेर्दा फैसलाको प्रवृत्ति अदालत ठहर गर्न कम इच्छुक भएजस्तो देखिन्छ। तर यो धेरै हदसम्म अझ फिका तर महत्त्वपूर्ण कुरा हो: अदालतमा आइपुग्ने अभियोगको मिश्रण लगभग सधैं ठहर हुने कागजी अपराधबाट पर सर्‍यो।",
  "research.corruption.rateTrend.title": "फैसला वर्षअनुसार नतिजा दर",
  "research.corruption.rateTrend.subtitle":
    "पूर्ण ठहर र सफाईका दर, साथै नक्कली प्रमाण पत्रका मुद्दा हटाएर पुनः गणना गरिएको ठहर दर।",
  "research.corruption.rateTrend.caption":
    "मुद्दा दायर भएको होइन, फैसला सुनाइएको आर्थिक वर्षमा आधारित — त्यसैले एउटै मुद्दा यहाँ र तलका दायर-आधारित चार्टमा फरक पट्टीमा देखिन्छ। धर्के रेखा कागजी नक्कली प्रमाण पत्रका मुद्दा हटाएपछिको दर हो; दुई रेखाबीचको अन्तरले ती मुद्दाले मुख्य अंकलाई कति थामेका थिए भन्ने देखाउँछ।",
  "research.corruption.rateTrend.conv": "पूर्ण ठहर",
  "research.corruption.rateTrend.acq": "सफाई",
  "research.corruption.rateTrend.core": "पूर्ण ठहर, नक्कली प्रमाण पत्र बाहेक",
  "research.corruption.rateTrend.body":
    "{{firstYear}} मा अदालतले फैसला गरेका सबै मुद्दामध्ये {{firstShare}}% नक्कली प्रमाण पत्रका थिए। {{lastYear}} सम्म आउँदा तिनको हिस्सा {{lastShare}}% भयो। सजिलो अभियोग नै दर्ता किताबबाट हराउँदै जाँदा दर घट्नु र अदालत ठहर गर्न अनिच्छुक हुनु एउटै निष्कर्ष होइनन्, र त्यसरी रिपोर्ट गर्नु हुँदैन।",
  "research.corruption.mix.title": "आयोगले वर्षैपिच्छे के अभियोग लगायो",
  "research.corruption.mix.subtitle":
    "हरेक आर्थिक वर्ष दायर भएका मुद्दाको हिस्सा, अपराधको प्रकारअनुसार।",
  "research.corruption.mix.caption":
    "मुद्दा दायर भएको वर्षमा आधारित। यी पंक्तिले {{n}} मुद्दा समेट्छन् — मुख्य संग्रहभन्दा बढी, किनभने वर्गीकरण गर्न नसकिएका मुद्दा हटाइनुको सट्टा 'अन्य' भित्रै राखिएका छन्। गैरकानुनी लाभ सुरुका वर्षमा पूरै अनुपस्थित होइन; निकै कम प्रयोग भएको हो — यी दुई फरक दाबी हुन्।",
  "research.corruption.mix.bribery": "रिसवत / घुस",
  "research.corruption.mix.fake": "नक्कली प्रमाण पत्र",
  "research.corruption.mix.embezzlement": "रकम हिनामिना",
  "research.corruption.mix.benefit": "गैरकानुनी लाभ",
  "research.corruption.mix.loss": "हानीनोक्सानी",
  "research.corruption.mix.other": "अन्य",
  "research.corruption.mix.percent": "दायरको हिस्सा",
  "research.corruption.trend.title": "दायर भएका र फैसला भएका मुद्दा",
  "research.corruption.trend.subtitle":
    "दायर दर्ता भएको वर्षमा आधारित; फैसला सुनाइएको वर्षमा आधारित।",
  "research.corruption.trend.caption":
    "दुई रेखाले फरक घटना गन्छन्, त्यसैले कुनै पनि वर्ष तिनी भेटिनुपर्छ भन्ने अपेक्षा गरिँदैन — एक वर्ष दायर भएको मुद्दाको फैसला प्रायः दुई-तीन वर्षपछि हुन्छ। {{years}} आर्थिक वर्षका दायर जोड्दा पूरा {{corpus}} मुद्दाको संग्रह बन्छ।",
  "research.corruption.trend.filed": "दायर",
  "research.corruption.trend.decided": "फैसला",
  "research.corruption.month.title": "नेपाली महिनाअनुसार औसत दायर मुद्दा",
  "research.corruption.month.caption":
    "पूरा आर्थिक वर्षहरूको औसत। दायरी {{peak}} मा आर्थिक वर्षको अन्त्यतिर उच्च हुन्छ र {{trough}} मा चाडपर्वको समयमा घट्छ। विचलन यति फराकिलो छ कि कुनै एक वर्ष यो स्वरूपभन्दा बिल्कुलै फरक देखिन सक्छ।",
  "research.corruption.month.mean": "औसत दायरी",
  "research.corruption.month.average": "सबै महिनाको औसत",
  "research.corruption.month.sd": "±१ मा.वि.",
  "research.corruption.overTime.caveat":
    "पछिल्ला आर्थिक वर्ष संरचनागत रूपमै अपूर्ण छन्: भर्खर दायर भएका मुद्दाले फैसलासम्म पुग्न कम समय पाएका छन्, त्यसैले तिनका दर सानो संख्यामा अडेका छन् र पछि बदलिनेछन्। यहाँका हरेक चार्टका अन्तिम पट्टीलाई अस्थायी मान्नुहोस्।",

  // --- Benches --------------------------------------------------------------
  "research.corruption.benches.eyebrow": "कसले निर्णय गर्छ, कति छिटो",
  "research.corruption.benches.title":
    "अदालतको एउटै औसतले देखाउनेभन्दा इजलासहरूबीच धेरै फरक छ",
  "research.corruption.benches.lede":
    "अदालतको समग्र दर {{avg}}% हो। त्यो बनाउने इजलासहरू भने त्यसभन्दा निकै माथिदेखि निकै तलसम्म फैलिएका छन् — यो फैलावट यति फराकिलो छ कि मुद्दा कुन इजलासले हेर्‍यो भन्ने कुरा नै त्यसको नतिजाबारे महत्त्वपूर्ण तथ्य हो।",
  "research.corruption.justice.title": "न्यायाधीशअनुसार ठहर दर",
  "research.corruption.justice.subtitle":
    "हरेक बिन्दु एक न्यायाधीश हुन्; आकारले उनीहरू बसेका फैसलाको संख्या जनाउँछ। स्थानले ती इजलासहरूको दर देखाउँछ।",
  "research.corruption.justice.caption":
    "कम्तीमा {{min}} फैसला भएका मुद्दामा बसेका न्यायाधीश — जम्मा {{n}} जना; त्योभन्दा कममा दर केही फैसलामै अडिन्छ र खासै अर्थ राख्दैन। इजलासको नतिजा त्यसका हरेक सदस्यको खातामा जोडिने भएकाले यी {{n}} न्यायाधीशको खातामा मिलेर {{decisions}} फैसला पर्छन् — ती फैसला आएका {{cases}} मुद्दाभन्दा धेरै बढी।",
  "research.corruption.justice.bandHigh": "बढी ठहर ({{pct}}% भन्दा माथि)",
  "research.corruption.justice.bandMid": "औसतको हाराहारी",
  "research.corruption.justice.bandLow": "बढी सफाई ({{pct}}% भन्दा तल)",
  "research.corruption.justice.avgLine": "अदालतको औसत {{pct}}%",
  "research.corruption.justice.caveat":
    "यो इजलासको विशेषता हो, न्यायाधीशको होइन। अदालतले मुद्दापिच्छे एउटै फैसला राख्छ, व्यक्तिगत मत राख्दैन — त्यसैले फरक मत राख्ने न्यायाधीशको खातामा पनि इजलासकै नतिजा त्यसरी नै जोडिन्छ, मानौं उनैले लेखेका हुन्। यहाँका लगभग सबै मुद्दा दुई वा तीन जनाको इजलासले हेरेका हुन्। यसलाई न्यायाधीश बसेका इजलासका रूपमा पढ्नुहोस् — कहिल्यै ती न्यायाधीशको आफ्नै रेकर्ड वा उनले कसरी फैसला गर्छन् भन्ने मापनका रूपमा होइन।",
  "research.corruption.pipeline.title": "मुद्दाले कति समय लिन्छ, र कति बाँकी छ",
  "research.corruption.pipeline.subtitle":
    "मुद्दा दायर भएको आर्थिक वर्षअनुसार: पट्टीहरू फैसला कुरिरहेका मुद्दा हुन्, रेखा फैसलासम्मको मध्यक महिना।",
  "research.corruption.pipeline.caption":
    "{{complete}} सम्मका समूह लगभग पूर्ण रूपमा किनारा लागिसकेका छन्, त्यसैले तिनका मध्यक स्थिर छन्। पछिल्ला समूह अझै खुला छन् र धर्के रेखामा देखाइएका छन्: तिनका मध्यक सकिइसकेका मुद्दाबाट मात्र निकालिएका हुन्, जसले तिनलाई वास्तविकभन्दा छिटो देखाउँछ।",
  "research.corruption.pipeline.months": "फैसलासम्म मध्यक महिना",
  "research.corruption.pipeline.backlog": "फैसला कुरिरहेका",
  "research.corruption.pipeline.provisional": "अस्थायी",
  "research.corruption.pipeline.body":
    "किनारा लागेका समूहमा मध्यक {{fastYear}} मा दायर मुद्दाका लागि करिब {{fast}} महिनादेखि {{slowYear}} का लागि करिब {{slow}} महिनासम्म रह्यो। सबै समूह गरी {{backlog}} मुद्दा अझै पर्खिरहेका छन्।",

  // --- Appeals --------------------------------------------------------------
  "research.corruption.appeals.whoDefendant": "ठहर भएको व्यक्ति",
  "research.corruption.appeals.whoCommission": "आयोग",
  "research.corruption.appeals.eyebrow": "सर्वोच्चमा के टिक्छ",
  "research.corruption.appeals.title":
    "विशेष अदालतको सफाई लगभग अन्तिम हुन्छ। त्यहाँको ठहर हुँदैन।",
  "research.corruption.appeals.lede":
    "विशेष अदालतको फैसला मुद्दाको अन्त्य होइन। यीमध्ये {{appeals}} मुद्दामा सर्वोच्च अदालतमा पुनरावेदन भएको पुष्टि छ, र त्यहाँ पुगेपछि दुवै पक्षको नतिजा निकै फरक हुन्छ — अर्थात् सुरु अदालतको ठहर दरले वास्तवमा कति जवाफदेही टिक्छ भन्नेलाई बढाइचढाइ देखाउँछ।",
  "research.corruption.appeals.tileTotal": "पुष्टि भएका पुनरावेदन",
  "research.corruption.appeals.tileTotalNote": "न्यूनतम हो, पूर्ण गणना होइन",
  "research.corruption.appeals.tileDecided": "फैसला भएका पुनरावेदन",
  "research.corruption.appeals.tileDecidedNote": "दर बदल्ने यिनै मात्र हुन्",
  "research.corruption.appeals.tileDefendant": "प्रतिवादीले जितेका पुनरावेदन",
  "research.corruption.appeals.tileDefendantNote": "फैसला भएकामध्ये पूर्ण उल्टो",
  "research.corruption.appeals.tileCommission": "आयोगले जितेका पुनरावेदन",
  "research.corruption.appeals.tileCommissionNote": "फैसला भएकामध्ये पूर्ण उल्टो",
  "research.corruption.appeals.tableTitle": "कसले पुनरावेदन गर्छ, र कसले जित्छ",
  "research.corruption.appeals.tableSubtitle":
    "फैसला भइसकेका पुनरावेदनमध्ये पूर्ण उल्टो हुनेको हिस्सा।",
  "research.corruption.appeals.tableCaption":
    "दिशा महत्त्वपूर्ण छ: पुनरावेदन कसले गर्‍यो भन्नेअनुसार उल्टो हुनुको अर्थ फरक पर्छ। ठहर भएको व्यक्तिले पुनरावेदन गर्दा उल्टो हुनुको अर्थ ऊ सफाइ पाउनु हो; आयोगले सफाइविरुद्ध पुनरावेदन गर्दा उल्टो हुनुको अर्थ ठहर हुनु हो। नतिजा अभिलिखित नभएका पुनरावेदनलाई हारमा नगनी यी दरबाट बाहिरै राखिएको छ।",
  "research.corruption.appeals.colWho": "पुनरावेदक",
  "research.corruption.appeals.colFiled": "पुनरावेदन",
  "research.corruption.appeals.colDecided": "फैसला भएका",
  "research.corruption.appeals.colReversed": "पूर्ण उल्टो",
  "research.corruption.appeals.colRate": "दर",
  "research.corruption.appeals.body":
    "फैसला भएका {{cDecided}} पुनरावेदनमा आयोगले {{cRev}} पटक पूर्ण उल्टो नतिजा पायो। ठहर भएका व्यक्तिहरूले {{dDecided}} मध्ये {{dRev}} पटक। सिधा भाषामा: आयोगले सुरु अदालतमा हार्दा प्रायः त्यहीँ टुंगिन्छ; जित्दा भने फैसला देखिएभन्दा निकै कम सुरक्षित हुन्छ।",
  "research.corruption.appeals.effectTitle": "पुनरावेदन अघि र पछिको ठहर दर",
  "research.corruption.appeals.effectSubtitle":
    "फैसला भइसकेका पुनरावेदन मात्र लागू गरिएको — बाँकी रहेकामा कुनै अनुमान प्रक्षेपण गरिएको छैन।",
  "research.corruption.appeals.effectCaption":
    "{{lost}} ठहर पुनरावेदनमा गुमे र {{gained}} सफाई उल्टिएर ठहरमा बदलिए — खुद परिवर्तन {{net}} मुद्दा। दुवै पंक्तिले सुरु अदालतकै भाजक प्रयोग गर्छन्, त्यसैले तिनलाई सिधै तुलना गर्न सकिन्छ।",
  "research.corruption.appeals.colMeasure": "मापन",
  "research.corruption.appeals.colTrial": "सुरु अदालतमा",
  "research.corruption.appeals.colAfter": "पुनरावेदन फैसलापछि",
  "research.corruption.appeals.rowIncl": "पूर्ण वा आंशिक ठहर",
  "research.corruption.appeals.rowFull": "पूर्ण ठहर",
  "research.corruption.appeals.caveat":
    "यो अन्तिम प्रभावको न्यूनतम हो, टुंगिएको अंक होइन। नक्सांकन गरिएका {{total}} पुनरावेदनमध्ये {{no}} — अर्थात् {{pct}}% — मा अहिलेसम्म कुनै नतिजा अभिलिखित छैन, र माथिका अंकले तिनलाई छोडेका छन्। रिक्त स्थान पनि निष्कर्ष होइन: पुनरावेदन अभिलिखित नहुनुको अर्थ कुनै पुष्टि भएको छैन भन्ने हो, अस्तित्वमै छैन भन्ने होइन।",
  "research.corruption.appeals.mapping":
    "सुरु अदालत र पुनरावेदनका मुद्दा एकअर्कासँग कुनै सम्बन्धबिनै राखिन्छन्, त्यसैले जोडी आफैं बनाउनुपर्‍यो — आयोगकै दर्ता किताबबाट जहाँ दुवै मुद्दा नम्बर छापिएको हुन्छ, सुरु मुद्दाको नाम उल्लेख गर्ने सर्वोच्चका फैसलाबाट, र नभए प्रतिवादीको नाम मिलाएर। यो क्युरेट गरिएको पहिलो संस्करण हो, नमुनामा करिब ९८% शुद्धतामा परीक्षण गरिएको, र यहाँ कुनै अंक प्रकाशित गर्नुअघि हरेक उल्टो नतिजाको दिशा तीन फरक तरिकाले जाँचिएको छ।",

  // --- Method ---------------------------------------------------------------
  "research.corruption.method.eyebrow": "स्रोत, सीमा र प्रमाण",
  "research.corruption.method.title": "यी अंक कसरी तयार भए",
  "research.corruption.method.lede":
    "यस साइटका सबै कुरा दुई लिखित अभिलेखबाट गणना गरिएका हुन्: विशेष अदालतको फौजदारी दर्ता किताब, र आयोगका आफ्नै वार्षिक प्रतिवेदन। एउटा अर्काको प्रतिलिपि होइन, त्यसैले जहाँ दुवै मिल्छन् त्यहाँ अंक दुईपटक पुष्टि हुन्छ, र जहाँ फरक पर्छ त्यो भिन्नता मुद्दापिच्छे जाँच्न सकिन्छ।",
  "research.corruption.method.corpusTitle": "यहाँ मुद्दा भनेको के हो",
  "research.corruption.method.corpusBody":
    "यो संग्रह विशेष अदालतको फौजदारी दर्ता किताबका {{n}} पूरा आर्थिक वर्ष, {{first}} देखि {{last}} सम्मको हो — {{corpus}} मुद्दा। दर्ता किताब आफैं परिभाषा हो: मुद्दा कसले ल्यायो भन्नेमा कुनै छानबिन छैन, किनभने अदालतले यही अवधिको सुरुमै मुद्दा नम्बर प्रणाली बदलेको थियो, जसले दर्ता किताब र आर्थिक वर्षलाई एउटै स्पष्ट सीमा दिन्छ।",
  "research.corruption.method.substantiveBody":
    "अपराधसम्बन्धी चार्टहरूले {{substantive}} मुद्दाको साँघुरो हिस्सा प्रयोग गर्छन्: पूरा संग्रहबाट {{ml}} सम्पत्ति शुद्धीकरणका मुद्दा — जुन यहीँ चल्छन् तर फरक ऐनअन्तर्गत — र अभियोग विवरण वर्गीकरण गर्न नसकिएका {{other}} मुद्दा घटाएर। दायरी, फैसला र बाँकी मुद्दाको गणनाले भने पूरै {{corpus}} प्रयोग गर्छ, जुन वर्षको करिब {{avg}} नयाँ मुद्दा हुन आउँछ।",
  "research.corruption.method.crossTitle": "दुई अभिलेख एकअर्कासँग जाँच्दा",
  "research.corruption.method.crossBody":
    "{{years}} आर्थिक वर्षमा आयोगको प्रकाशित दायरी जम्मा र अदालतको दर्ता किताब करिब {{pct}}% मिल्छन् — {{ciaa}} दायरीविरुद्ध {{register}} तुलनायोग्य दर्ता मुद्दा। तुलना गर्न आयोगले दायरै नगर्ने प्रकारका {{excluded}} दर्ता मुद्दा हटाउनुपर्छ, जस्तै आयोगविरुद्ध नै परेका निवेदन।",
  "research.corruption.method.crossCase":
    "सबैभन्दा बढी भिन्नता देखिएका {{examined}} वर्षमा तुलना मुद्दापिच्छे गरियो, किनभने दुवै अभिलेखले अभियुक्तको नाम उल्लेख गर्छन्। आयोगले दायर गरेको भनेका सबै {{listed}} मुद्दा दर्ता किताबमा भेटिए। दर्ता किताबमा थप {{surplus}} मुद्दा छन् जुन आयोगका आफ्नै दायरी तालिकाले कहिल्यै सूचीबद्ध गर्दैनन्, र तीमध्ये अधिकांशको अभिलिखित व्याख्या छ।",
  "research.corruption.method.surplusTitle":
    "प्रतिवेदनले सूचीबद्ध नगरेका मुद्दा दर्ता किताबमा किन छन्",
  "research.corruption.method.surplusSubtitle": "मुद्दापिच्छे जाँचिएका तीन वर्षमा।",
  "research.corruption.method.surplusCaption":
    "{{n}} वास्तवमै अव्याख्यात रहन्छन्। त्यो अवशेषलाई अरू कुनै कारणभित्र मिलाउनुको सट्टा छुट्टै देखाइएको छ — अव्याख्यात अन्तर आफैंमा अभिलेखबारेको एउटा निष्कर्ष हो, र त्यसलाई मिलाइदिनु भनेको लुकाउनु हो।",
  "research.corruption.method.assumptionsTitle": "आयोगका प्रतिवेदनबाट लिइएका अंक",
  "research.corruption.method.assumptionsBody":
    "कति उजुरी प्राप्त भए वा कति अनुसन्धान भए भन्ने अदालतको अभिलेखले बताउन सक्दैन — त्यो आयोगले मात्र प्रकाशित गर्छ। ती अंक यहाँ स्पष्ट निवेशका रूपमा सूचीबद्ध छन्, हरेकसँग त्यो आएको प्रतिवेदनसहित, र अदालतको अभिलेखबाट नापिएका कुराबाट अलग राखिएका छन्।",
  "research.corruption.method.assumptionsFigure": "बाह्य निवेश",
  "research.corruption.method.assumptionsFigureSub":
    "यस साइटमा अदालतको दर्ता किताबबाट नगनिएका सबै कुरा।",
  "research.corruption.method.colValue": "मान",
  "research.corruption.method.colWhat": "के नाप्छ",
  "research.corruption.method.colSource": "स्रोत",
  "research.corruption.method.report": "प्रतिवेदन",
  "research.corruption.method.limitsTitle": "यसले के बताउन सक्दैन",
  "research.corruption.method.limitsCases":
    "हरेक अंकले मुद्दा गन्छ, व्यक्ति होइन। अदालतले मुद्दापिच्छे एउटा फैसला राख्छ र अभियुक्तपिच्छेको नतिजा प्रकाशित गर्दैन, त्यसैले आंशिक ठहरलाई कति जना अभियुक्त ठहर भए भन्नेमा छुट्याउन सकिँदैन। यस तथ्यांकबाट व्यक्तिपिच्छेको ठहर दर निकाल्न सकिँदैन, र त्यस्तो संकेत गर्ने जुनसुकै रिपोर्टिङ गलत हो।",
  "research.corruption.method.limitsResolution":
    "यो संग्रहमा {{rows}} प्रतिवादी अभिलेख छन्, जसले {{distinct}} छुट्टाछुट्टै नाम समेट्छन्, र तीमध्ये {{resolved}} कुनै ज्ञात व्यक्ति वा कार्यालयसँग मिलान गरिएका छन्। मिलान भनेको पहिचान मात्र हो — त्यो व्यक्ति ठहर भएको भन्ने कथन कहिल्यै होइन।",
  "research.corruption.method.limitsRecovery":
    "ठहरपछि असुल भएको रकम कुनै पनि निकायले प्रकाशित गर्दैन र अदालतको अभिलेखमा पनि देखिँदैन, त्यसैले जवाफदेहीको अन्तिम चरण यहाँ शून्य नापिएको नभई अनुपस्थित छ। दर्ताकै चरणमा उजुरी तामेली गर्नुका कारण पनि मुद्दापिच्छे प्रकाशित हुँदैनन्।",
  "research.corruption.method.provenanceTitle": "प्रमाण",
  "research.corruption.method.provenanceBody":
    "यस साइटसँग आफ्नै कुनै अंक छैन। हरेक अंक बिल्डकै समयमा प्रकाशित डेटा प्याकबाट उत्पन्न हुन्छ, त्यसैले पृष्ठ र डेटासेट बाझिन सक्दैनन्। पुनः बिल्ड गर्नुहोस्, अंकहरू डेटालाई नै पछ्याउँछन्।",
  "research.corruption.method.snapshotTitle": "यो बिल्ड",
  "research.corruption.method.snapshotSub": "यस साइटका अंक केबाट निकालिएका हुन्।",
  "research.corruption.method.generated": "पृष्ठ तयार भएको",
  "research.corruption.method.commit": "डेटा प्याक संस्करण",
  "research.corruption.method.rowsAt": "पंक्ति · {{date}}",
  "research.corruption.method.repo":
    "यस साइटपछाडिको डेटासेट, गणना गर्ने कोड र नोटबुक सार्वजनिक छन्:",
  "research.corruption.method.repoEnd":
    "। अदालतका मूल अभिलेख र आयोगका प्रतिवेदन यहाँ प्रकाशित छन्",
  "research.corruption.method.repoEnd2": "।",

  // --- Reading the chart ----------------------------------------------------
  "research.corruption.reading": "चार्ट कसरी पढ्ने",
  "research.corruption.pipeline.n1Stat": "{{fast}} → {{slow}} महिना",
  "research.corruption.pipeline.n1Title": "पर्खाइ वर्षैपिच्छे उस्तै छैन",
  "research.corruption.pipeline.n1Body":
    "लगभग किनारा लागिसकेका समूहमा मध्यक {{fastYear}} मा दायर मुद्दाका लागि करिब {{fast}} महिनादेखि {{slowYear}} का लागि करिब {{slow}} महिनासम्म रह्यो — मुद्दा कुन बेला आयो भन्ने आधारमा उही अदालतले {{times}} गुणा बढी समय लिएको।",
  "research.corruption.pipeline.n2Stat": "{{year}} देखि",
  "research.corruption.pipeline.n2Title": "पछिल्ला पट्टी सुध्रिने होइन, झन् लम्बिने हुन्",
  "research.corruption.pipeline.n2Body":
    "{{complete}} पछिका समूह अझै खुला छन्, र तिनका मध्यकले सकिइसकेका मुद्दा मात्र गन्छन्। ढिलो चल्नेहरू अझै टुंगिएका छैनन्, त्यसैले औसतमा नै परेका छैनन् — यिनै वर्ष वास्तविकभन्दा छिटो देखिन्छन्। त्यसैले यी धर्के रेखामा छन्।",
  "research.corruption.pipeline.n3Title": "अझै फैसला नभएका मुद्दा",
  "research.corruption.pipeline.n3Body":
    "सबै समूह गरी {{backlog}} मुद्दा अझै पर्खिरहेका छन्, र तीमध्ये {{heavy}} {{heavyYear}} मा दायर भएका हुन्। पुराना समूह खाली भइसके; बाँकी रहेका भर्खरका हुन्।",
  "research.corruption.trend.n1Title": "दायरी रेखाले के गन्छ",
  "research.corruption.trend.n1Body":
    "विशेष अदालतमा दर्ता भएको वर्षअनुसार गनिएका मुद्दा। चौध वर्ष जोड्दा संग्रहका पूरै {{filed}} अभियोजन बन्छन्।",
  "research.corruption.trend.n2Title": "फैसला रेखाले के गन्छ",
  "research.corruption.trend.n2Body":
    "मुद्दा जुनसुकै वर्ष आएको भए पनि त्यस वर्ष सुनाइएका फैसला। एक वर्ष दायर भई तीन वर्षपछि फैसला भएको मुद्दा चार्टमा दुई फरक ठाउँमा बस्छ, त्यसैले यी रेखा भेटिनुपर्ने होइन।",
  "research.corruption.trend.n3Stat": "{{lag}} वर्ष",
  "research.corruption.trend.n3Title": "फैसलाको शिखर दायरीभन्दा निकै पछि आउँछ",
  "research.corruption.trend.n3Body":
    "दायरी {{filedYear}} मा {{filed}} पुग्यो; फैसला {{decidedYear}} मा {{decided}}। त्यो दूरी नै थाती मुद्दा बिस्तारै किनारा लाग्दै गएको हो — माथिका मध्यकले नाप्ने उही ढिलाइ, पात्रोमा देखिएको।",
  "research.corruption.trend.foot":
    "दायरी दर्ता भएको वर्षमा, फैसला सुनाइएको वर्षमा आधारित।",

  // --- Charge calculation: which method the figure came from -----------------
  "research.corruption.gap.shows": "अभिलेखले के देखाउँछ",
  "research.corruption.gap.open": "खुला प्रश्न",
  "research.corruption.gap.gLabel": "जवाफदेहिता ग्याप · बिगो गणना",
  "research.corruption.gap.gCite2": "आयोगको वार्षिक प्रतिवेदन, आ.व. २०७६/७७",
  "research.corruption.gap.gTitle2":
    "सर्वोच्च अदालतले जाँच अवधि विधि लागू गर्‍यो। अख्तियारले गैरकानुनी सम्पत्तिको गणना अझै क्यास फ्लोबाटै किन गर्छ?",
  "research.corruption.gap.gIntro":
    "दाबी गरिएको गैरकानुनी सम्पत्ति कुन विधिले गणना गरिन्छ भन्ने कुराले कर्मचारीको आर्थिक अवस्था कसरी आँकलन हुन्छ भन्नेमा असर पार्न सक्छ। जाँच अवधि विधिले पूरै अवधिको आय र व्यय हेर्छ भने क्यास फ्लो विधिले आयले त्यति बेलाको खर्च र सम्पत्ति खरिद धान्यो कि धानेन भनी जाँच्छ। नेपाल सरकार वि. हरेकृष्ण भगत मुद्दामा सर्वोच्च अदालतको फैसलाले अख्तियारले गैरकानुनी सम्पत्तिका मुद्दाको अनुसन्धान र अभियोजन गर्दा अपनाउने विधिबारे प्रश्न उठाउँछ।",

  "research.corruption.calc.step1": "दुई विधि, एउटै आर्थिक विवरण",
  "research.corruption.calc.hypothetical":
    "तलको उदाहरण काल्पनिक हो। उही आय, खर्च र सम्पत्ति खरिदलाई पूरै अवधि एकमुष्ट हेर्दा र वर्षैपिच्छे हेर्दा कसरी फरक नतिजा आउन सक्छ भन्ने यसले देखाउँछ।",
  "research.corruption.calc.factsHeading": "एक कर्मचारीको दुई वर्षको आर्थिक विवरण",
  "research.corruption.calc.colActivity": "आर्थिक कारोबार",
  "research.corruption.calc.year1": "वर्ष १",
  "research.corruption.calc.year2": "वर्ष २",
  "research.corruption.calc.total": "जम्मा",
  "research.corruption.calc.lakh": "रू. {{v}} लाख",
  "research.corruption.calc.income": "वैध आय",
  "research.corruption.calc.living": "जीवन निर्वाह खर्च",
  "research.corruption.calc.property": "खरिद गरिएको सम्पत्ति",

  "research.corruption.calc.m1": "जाँच अवधि विधि",
  "research.corruption.calc.m1Lead": "पूरै अवधिको आर्थिक अवस्था एकमुष्ट आँकलन गर्ने।",
  "research.corruption.calc.colCalc": "गणना",
  "research.corruption.calc.colAmount": "रकम",
  "research.corruption.calc.m1Income": "कुल वैध आय",
  "research.corruption.calc.m1Living": "घटाउने: जीवन निर्वाह खर्च",
  "research.corruption.calc.m1Property": "घटाउने: खरिद गरिएको सम्पत्ति",
  "research.corruption.calc.m1Balance": "समग्र मौज्दात",
  "research.corruption.calc.m1Body":
    "दुवै वर्ष जोड्दा कुल आयले अभिलिखित खर्च र सम्पत्ति खरिद धान्छ। यो गणनाले समग्रमा कुनै न्यूनता देखाउँदैन।",

  "research.corruption.calc.m2": "क्यास फ्लो विधि",
  "research.corruption.calc.m2Lead":
    "आयलाई त्यति बेलाको खर्च र सम्पत्ति खरिदसँग दाँजेर जाँच्ने।",
  "research.corruption.calc.m2Outgoings": "खर्च र सम्पत्ति जम्मा",
  "research.corruption.calc.m2Balance": "वार्षिक मौज्दात",

  "research.corruption.calc.whyHeading": "नतिजा किन फरक देखिन्छ",
  "research.corruption.calc.whyBody":
    "वर्ष १ मा खर्च र सम्पत्ति खरिद त्यस वर्षको आयभन्दा {{short}} ले बढी छ। वर्ष २ मा {{surplus}} बचत देखिन्छ। जाँच अवधिको गणनाले समग्रमा {{balance}} मौज्दात निकाल्छ, तर वर्षैपिच्छेको गणनाले अघिल्लो वर्षको त्यो न्यूनता औंल्याउँछ, जसको स्पष्टीकरण चाहिन्छ।",
  "research.corruption.calc.whyCaveat":
    "यो उदाहरणले सुरुको बचत, ऋण वा अन्य उपलब्ध रकम केही नभएको मानेको छ। क्यास फ्लो गणनामा न्यूनता देखिनुले आफैंमा गैरकानुनी सम्पत्ति आर्जन भएको प्रमाणित गर्दैन। रकमको स्रोत र उपलब्धता तथा लागू हुने कानुनी सिद्धान्त पनि विचार गर्नुपर्छ।",

  "research.corruption.calc.step2": "सर्वोच्च अदालतले के ठहर गर्‍यो?",
  "research.corruption.calc.caseLabel": "सर्वोच्च अदालत · नि.नं. ९४३३ · २०७२",
  "research.corruption.calc.caseName": "नेपाल सरकार वि. हरेकृष्ण भगत",
  "research.corruption.calc.caseCite": "पूरा फैसला पढ्नुहोस्",
  "research.corruption.calc.caseBody1":
    "यस मुद्दाले दुई विधिबीचको भिन्नतालाई सिधै सर्वोच्च अदालतसामु ल्यायो। अख्तियारले मुद्दा क्यास फ्लो विधिबाट दर्ता गरेको थियो भने विशेष अदालतले जाँच अवधिभरको आर्थिक अवस्था आँकलन गरेको थियो।",
  "research.corruption.calc.caseBody2":
    "सर्वोच्च अदालतले जाँच अवधि अपनाएका आफ्ना अघिल्ला फैसलालाई आधार मानेर सोहीअनुसार अघि बढ्यो। कुन विधि बढी व्यावहारिक छ भन्ने मात्रै त्यसको आधार थिएन। अदालतले जाँच अवधिलाई आफ्ना अघिल्ला फैसलाबाट स्थापित सिद्धान्त मान्दै सम्बन्धित अवधिभरको आर्थिक अवस्था आँकलन गर्‍यो।",
  "research.corruption.calc.figuresHeading": "अदालतले विचार गरेका अंक",
  "research.corruption.calc.colMeasure": "आर्थिक विवरण",
  "research.corruption.calc.assets": "आर्जित सम्पत्ति",
  "research.corruption.calc.assetsV": "रू. ७४,५१,४२६",
  "research.corruption.calc.lawful": "वैध आय",
  "research.corruption.calc.lawfulV": "रू. ६८,४७,५३६",
  "research.corruption.calc.diff": "फरक",
  "research.corruption.calc.diffV": "रू. ६,०३,८९०",
  "research.corruption.calc.share": "आर्जित सम्पत्तिको तुलनामा फरकको हिस्सा",
  "research.corruption.calc.caseOutcome":
    "१० प्रतिशतभित्रको फरकलाई यस मुद्दाको परिस्थितिमा अमिल्दो वा अस्वाभाविक भन्न नमिल्ने आधार लिँदै अदालतले सफाइ कायम राख्यो। यो त्यस फैसलाकै मुद्दागत आधार हो, ऐनमा तोकिएको सामान्य सीमा होइन।",

  "research.corruption.calc.step3": "जवाफदेहिता ग्याप",
  "research.corruption.calc.gapLabel": "अख्तियारको अनुसन्धान र अभियोजन",
  "research.corruption.calc.gapQuestion":
    "सर्वोच्च अदालतले जाँच अवधि अपनायो भने अख्तियारले दाबी गरिएको गैरकानुनी सम्पत्ति सुरुमै क्यास फ्लोबाट किन गणना गर्‍यो?",
  "research.corruption.calc.gapBody1":
    "यो प्रश्न मुद्दाको सुरुमै उठ्छ — जति बेला अख्तियारले कर्मचारीको आर्थिक अवस्था अनुसन्धान गर्छ, स्रोत नखुलेको भनिएको सम्पत्ति गणना गर्छ र अभियोगपत्रमा दाबी गर्ने रकम निर्धारण गर्छ।",
  "research.corruption.calc.gapBody2":
    "हरेकृष्ण भगत मुद्दामा सर्वोच्च अदालतले अख्तियारले क्यास फ्लो प्रयोग गरी मुद्दा दायर गरेको र विशेष अदालतले जाँच अवधिभरको आर्थिक अवस्था आँकलन गरेको कुरा उल्लेख गर्‍यो। फैसलाले जाँच अवधि अपनाएका सर्वोच्चका अघिल्ला फैसलालाई आधार बनायो।",
  "research.corruption.calc.chartTotal": "रू. २,५४,६९,८८७",
  "research.corruption.calc.gapBody3":
    "यसपछिको एउटा उदाहरण अख्तियारको आ.व. २०७६/७७ को वार्षिक प्रतिवेदनमा देखिन्छ। रामबाबु अधिकारी र मालती शर्मा अधिकारीसम्बन्धी पुनरावेदनमा अख्तियारले २०४६।४७ देखि २०७३।१२।३१ सम्मको क्यास फ्लो तालिका प्रस्तुत गर्‍यो। त्यो तालिकाले {{amount}} स्रोत नखुलेको सम्पत्ति गणना गरेको थियो, जबकि विशेष अदालतले जाँच अवधिलाई समग्रमा आँकलन गरी व्ययभन्दा आय बढी भएको ठहर गरेको थियो।",
  "research.corruption.calc.gapBody4":
    "यी अभिलेखले अख्तियारले सुरुमै गैरकानुनी सम्पत्ति गणना गर्दा र अभियोजन गर्दा अपनाउने विधिबारे प्रश्न उठाउँछन्। सबै मुद्दामा क्यास फ्लो गणना कति पटक प्रयोग हुन्छ, वा त्यस्तो हरेक गणना लागू हुने कानुन र नजिरसँग बाझिन्छ भन्ने चाहिँ यिनले स्थापित गर्दैनन्।",

  "research.corruption.calc.step4": "सार्वजनिक अभिलेखमा के छैन?",
  "research.corruption.calc.missingLead":
    "यो समस्या कति फैलिएको छ भनी आँकलन गर्न मुद्दाको अभिलेखमा निरन्तर यी कुरा खुल्नुपर्छ:",
  "research.corruption.calc.missing1": "अनुसन्धानका क्रममा अख्तियारले प्रयोग गरेको गणना विधि।",
  "research.corruption.calc.missing2": "अभियोगपत्रमा दाबी गरिएको गैरकानुनी सम्पत्तिको रकम।",
  "research.corruption.calc.missing3":
    "विशेष अदालतले त्यो गणना स्वीकार गर्‍यो कि आर्थिक अवस्था फरक ढंगले आँकलन गर्‍यो।",
  "research.corruption.calc.missing4": "गणना स्वीकार वा अस्वीकार गर्नुका अदालतका आधार।",
  "research.corruption.calc.missingEnd":
    "मुद्दैपिच्छे यी विवरण नभई अख्तियारको सुरुको गणना अदालतले अपनाएको दृष्टिकोणसँग कति मिल्छ भनी निर्धारण गर्न कठिन हुन्छ।",
  // --- Highlights: two findings that needed their period attached ------------
  "research.corruption.hl.f3b": "नक्कली प्रमाणपत्रका मुद्दाले कुनै बेला अदालत भरिएको थियो। अहिले त्यस्तो छैन।",
  "research.corruption.hl.f3Stat2": "{{first}} → {{last}}",
  "research.corruption.hl.f3Caption2":
    "{{firstYear}} र {{lastYear}} मा दायर भएका कुल मुद्दामध्ये नक्कली प्रमाणपत्रका मुद्दाको हिस्सा। संख्या पनि घट्यो — {{firstN}} बाट {{lastN}} मुद्दामा।",
  "research.corruption.hl.f3Body2":
    "यस्ता मुद्दा करिब {{conv}} पूर्ण ठहर हुन्छन् — कुनै पनि अभियोगमध्ये सबैभन्दा उच्च — त्यसैले सुरुका वर्षको ठहर दर यिनले नै बोकेका छन्। घटाइ सीधा रेखामा भएको होइन: {{bumpYear}} मा हिस्सा फेरि बढेर पछि घट्यो। त्यसैले {{first}} लाई एउटा कालखण्डको स्वरूप मान्नुहोस्, पूरै अभिलेखको होइन।",
  "research.corruption.hl.f3Aria":
    "आर्थिक वर्षअनुसार कुल दायर मुद्दामा नक्कली प्रमाणपत्रका मुद्दाको हिस्सा",
  "research.corruption.hl.f3Link2": "वर्षैपिच्छेको अभियोग मिश्रण",

  "research.corruption.hl.f3c2": "समग्र मध्यकले देखाउनेभन्दा छिटो फैसला आउन थालेको छ",
  "research.corruption.hl.f3cStat2": "{{slow}} → {{fast}} महिना",
  "research.corruption.hl.f3cCaption2":
    "सबैभन्दा ढिलो वर्ष {{slowYear}} मा दायर मुद्दा र {{fastYear}} मा दायर मुद्दाको दायरीदेखि फैसलासम्मको मध्यक समय — {{fastYear}} भनेको लगभग सबै मुद्दा किनारा लागिसकेको पछिल्लो वर्ष हो।",
  "research.corruption.hl.f3cBody2":
    "फैसला भएका सबै {{m}} मुद्दामा मध्यक {{med}} महिना हो। त्यो अंकले चौधै वर्ष एकसाथ समेट्छ, त्यसैले यसले अभिलेख देखाउँछ, अदालतको हालको गति होइन। पछिल्ला दुई वर्ष धर्के रेखामा छन् किनभने ती अझै खुला छन्: तिनका मध्यकले सकिइसकेका मुद्दा मात्र गन्छन्, र ढिलो चल्नेहरू टुंगिँदै जाँदा ती बढ्नेछन्।",
  "research.corruption.hl.f3cAria":
    "मुद्दा दायर भएको आर्थिक वर्षअनुसार फैसलासम्मको मध्यक महिना",
  "research.corruption.hl.durMonths": "{{v}} म.",
  "research.corruption.hl.durMedian": "सबै वर्षको मध्यक {{m}} म.",
  // --- The complaint's route, and the Supreme Court delay --------------------
  "research.corruption.flow.s8Title": "सर्वोच्च अदालतको फैसला",
  "research.corruption.route.open": "यो चरणको अनुसन्धान हेर्नुहोस्",
  "research.corruption.route.close": "यो चरणको अनुसन्धान लुकाउनुहोस्",
  "research.corruption.route.finding": "अभिलेखले के देखाउँछ",
  "research.corruption.route.gap": "अभिलेखले जवाफ दिन नसक्ने कुरा",
  "research.corruption.route.srIntro":
    "भ्रष्टाचारको उजुरीले लिने बाटो, क्रमैसँग। पहिलो देखि पाँचौं चरण आयोगअन्तर्गत पर्छन्; छैठौंदेखि आठौं अदालत हुन्। हरेक उजुरी हरेक चरणसम्म पुग्दैन: परीक्षणपछि, प्रारम्भिक छानबिनपछि वा अनुसन्धान प्रतिवेदनमा आयोगले निर्णय गर्दा उजुरी तामेलीमा जान सक्छ, र पुनरावेदन नपरेको फैसला त्यसै कायम रहन्छ। अनुसन्धान भएका चरणमा त्यो खोल्ने बटन छ।",

  "research.corruption.route.i1Title": "जम्मा संख्या प्रकाशित हुन्छ। एउटा उजुरी हुँदैन।",
  "research.corruption.route.i1Body":
    "{{fy}} मा आयोगको अभिलेखमा जम्मा {{all}} उजुरी थिए — {{carried}} अघिल्लो वर्षबाट सरेका र {{fresh}} नयाँ दर्ता भएका। प्रकाशित हुने भनेको वार्षिक जम्मा हो: कुनै एक उजुरी कहाँ पुग्यो भन्ने देखाउने सार्वजनिक अभिलेख छैन।",
  "research.corruption.route.i1Link": "आयोगको वार्षिक प्रतिवेदन, {{fy}}",

  "research.corruption.route.i2Title": "धेरै उजुरी तामेलीमै टुंगिन्छन्",
  "research.corruption.route.i2Body":
    "{{fy}} मा आयोगले किनारा लगाएका उजुरीमध्ये {{pct}} तामेलीमा राखिए। प्रतिवेदनले वार्षिक संख्या दिन्छ, कुनै एक मुद्दाको कारण कहिल्यै दिँदैन — त्यसैले उजुरी किन पन्छियो भन्ने बाहिरबाट जाँच्न मिल्दैन।",
  "research.corruption.route.i2Link": "वर्षैपिच्छे तामेली",

  "research.corruption.route.i4Title": "अनुसन्धान भनेको के हो, र के होइन",
  "research.corruption.route.i4Body":
    "स्टिङ अपरेसनसम्बन्धी फैसलामा सर्वोच्च अदालतले अनुसन्धानलाई जे भयो त्यसको प्रमाण संकलन गर्ने काम भन्यो — नभएको कुरा सिर्जना गर्ने होइन। चार वर्षपछि त्यही विधि ऐनमै फेरि लेखियो।",
  "research.corruption.route.i4Link": "स्टिङ अपरेसनको फैसला",

  "research.corruption.route.i5Title": "कसलाई अभियोग लाग्यो र कसलाई लागेन भनी अदालतले सोध्यो",
  "research.corruption.route.i5Body":
    "पशुपतिनाथको जलहरी मुद्दामा विशेष अदालतले छनौटपूर्ण अभियोजनको प्रश्न उठायो — अभियोगपत्रले कसलाई समेट्यो र कसलाई छाड्यो। त्यो प्रश्न मुद्दैपिच्छे सोध्न दिने कुनै प्रकाशित अभिलेख छैन।",
  "research.corruption.route.i5Link": "जलहरी मुद्दामा छनौटपूर्ण अभियोजन",

  "research.corruption.route.i6Title": "अभियोगले नै फैसला निर्धारण गर्छ",
  "research.corruption.route.i6Body":
    "फैसला भएका {{d}} मुद्दामध्ये {{rate}} पूर्ण वा आंशिक ठहर भए। तर दर कसुरअनुसार फरक पर्छ: नक्कली प्रमाणपत्रका अभियोग करिब {{top}} पूर्ण ठहर हुन्छन्, अरू सबै मिलाउँदा त्यो अंक निकै तल झर्छ।",
  "research.corruption.route.i6Link": "अदालतले के निर्णय गर्छ",

  "research.corruption.route.i7Title": "दुवै पक्षको अवस्था उस्तै छैन",
  "research.corruption.route.i7Body":
    "ठहर भएका व्यक्तिका फैसला भइसकेका पुनरावेदनमध्ये {{dp}} सफल भए। आयोगका {{cp}}। यसको तुलनामा, खोजिएका सबै पुनरावेदनमध्ये {{untraced}} को कुनै नतिजा नै अभिलिखित छैन।",
  "research.corruption.route.i7Link": "पुनरावेदनको अभिलेख",

  "research.corruption.route.s8Figure": "{{y}} वर्ष",
  "research.corruption.route.s8FigureLabel":
    "पुनरावेदन दर्तादेखि फैसलासम्मको सामान्य प्रतीक्षा",
  "research.corruption.route.i8Title": "एक तिहाइभन्दा बढी पुनरावेदनमा छ वर्षभन्दा बढी लाग्छ",
  "research.corruption.route.i8Body":
    "{{from}} देखि {{to}} सम्म सर्वोच्च अदालतमा दर्ता भई फैसला भइसकेका {{n}} भ्रष्टाचार पुनरावेदनमा मध्यक प्रतीक्षा {{median}} वर्ष रह्यो; {{over}} मा छ वर्षभन्दा बढी लाग्यो, र {{slowest}} मा दर्ता भएकाको मध्यक {{slowestYears}} वर्ष पुग्यो। पछिल्ला वर्ष छाडिएका छन् किनभने तिनका थोरै पुनरावेदनमा मात्र फैसला भएको छ — अनि दर्ता भएका {{all}} मध्ये {{open}} मा कुनै फैसला नै अभिलिखित छैन, त्यसैले वास्तविक प्रतीक्षा यसभन्दा लामो मात्र हुन सक्छ।",
  "research.corruption.route.i8Link": "सर्वोच्च अदालतका मुद्दा अभिलेख",
  // --- Route redesign: phases, named indicators, the screening split ---------
  "research.corruption.route.pCiaa": "आयोगमा",
  "research.corruption.route.pSpecial": "विशेष अदालत",
  "research.corruption.route.pSupreme": "सर्वोच्च अदालत",
  "research.corruption.flow.s6Title2": "सुनुवाइ र फैसला",
  "research.corruption.flow.s7Title2": "पुनरावेदन दर्ता",

  "research.corruption.route.i1Tag": "अनुगमन",
  "research.corruption.route.i1Title2": "उजुरीकर्ताले आफ्नो उजुरीको के भयो भनी थाहा पाउन सक्छन्?",
  "research.corruption.route.i1Body2":
    "आयोगले अनलाइन, फोन र इमेलबाट उजुरी लिन्छ, र {{fy}} मा त्यसको अभिलेखमा {{all}} उजुरी थिए। उजुरीकर्ताले आफ्नो उजुरीको के भयो भनी हेर्न सक्ने पृष्ठ आयोगको वेबसाइटमा छैन: प्रकाशित हुने भनेको वार्षिक जम्मा हो। सोध्नका लागि देखाइएको बाटो सूचनाको हक अन्तर्गतको निवेदन हो — त्यो सामान्य कानुनी हक हो, अवस्था हेर्ने सुविधा होइन। निजी रूपमा उजुरीकर्तालाई केही जानकारी दिइन्छ कि दिइँदैन भन्ने प्रकाशित अभिलेखले टुंग्याउँदैन।",

  "research.corruption.route.i2Tag2": "कहाँ जान्छन्",
  "research.corruption.route.i2Title2": "कुन आधारमा उजुरी तामेलीमा जान्छ र कुन आधारमा अगाडि?",
  "research.corruption.route.i2Body3":
    "तामेली भनेको खारेजी होइन: फाइल राखिन्छ र प्रमाण आएमा विषय पुनः उठाउन सकिन्छ। तर प्रतिवेदनले यी वार्षिक संख्या मात्र प्रकाशित गर्छ — कुनै एक मुद्दाको कारण कहिल्यै होइन — त्यसैले यी निर्णय एकनासले लागू भएका छन् कि छैनन् भनी बाहिरबाट मूल्यांकन गर्न मिल्दैन।",
  "research.corruption.route.splitTameli2": "तामेलीमा राखिए",
  "research.corruption.route.splitOther2": "अन्य कारबाही",
  "research.corruption.route.splitOn2": "विस्तृत अनुसन्धानमा",
  "research.corruption.route.splitCaption2":
    "{{fy}} मा विस्तृत अनुसन्धानअघि नै आयोगले किनारा लगाएका {{n}} उजुरीमध्ये। ३५औं प्रतिवेदनको तालिका २.१४, जसले परीक्षण र प्रारम्भिक छानबिनलाई छुट्याउँदैन।",

  "research.corruption.route.i4Tag": "प्रमाणको सीमा",
  "research.corruption.route.i4Title2": "अपराधको प्रमाण संकलन गर्ने, कि प्रमाण सिर्जना गर्ने",
  "research.corruption.route.i4Body2":
    "अनुसन्धान भनेको भइसकेको आचरणको प्रमाण जुटाउने काम हो। स्टिङमा घुसको रकम आयोग आफैंले उपलब्ध गराएको थियो, त्यसैले अभिलिखित भएको कसुर आफ्नै अपरेसनले खडा गरेको थियो। २०७८।०१।०८ मा सर्वोच्च अदालतले आयोगले अपनाएको नियम बदर गर्दै अनुसन्धानलाई वास्तवमा के भयो भन्ने खोज्ने काम भन्यो — नभएको कुरा बनाउने होइन। त्यसपछि दफा ६२(घ) ले स्टिङ अपरेसनलाई ऐनमै राखेको छ। त्यसले अधिकार कहाँ लेखिएको हो भन्ने टुंग्याउँछ; राज्यले नै कसुरको परिस्थिति सिर्जना गर्ने कुरामा अदालतले उठाएको आपत्तिको जवाफ दिन्छ कि दिँदैन भन्ने छुट्टै प्रश्न हो।",

  "research.corruption.route.i5Tag": "कसलाई अभियोग",
  "research.corruption.route.i5Title2": "कसैलाई अभियोग लाग्ने र कसैलाई नलाग्ने किन?",
  "research.corruption.route.i5Body2":
    "अभियोजनको निर्णय भनेको हरेक व्यक्तिविरुद्धको प्रमाण तौलेर अभियोगपत्रमा कसको नाम राख्ने भन्ने छनोट हो। फरक व्यक्तिको फरक नतिजा आउनु आफैंमा छनौटपूर्ण अभियोजन होइन — तिनीहरूविरुद्धको प्रमाण नै फरक हुन सक्छ। प्रश्न त्यो तर्क जाँच्न सकिन्छ कि सकिँदैन भन्ने हो, र पशुपतिनाथको जलहरी मुद्दामा विशेष अदालत आफैंले अभियोगपत्रले कसलाई समेट्यो र कसलाई छाड्यो भन्ने उठायो। त्यो प्रश्न मुद्दैपिच्छे सोध्न दिने कुनै प्रकाशित अभिलेख छैन।",

  "research.corruption.route.i6Tag": "नतिजा",
  "research.corruption.route.i6Title2": "दुई होइन, तीन नतिजा",
  "research.corruption.route.i6Body2":
    "स्पष्ट फैसला भएका {{d}} मुद्दामध्ये {{full}} पूर्ण ठहर भए, {{part}} आंशिक — केही प्रतिवादी ठहर र केही सफाइ, वा केही अभियोगमा मात्र ठहर — र {{acq}} सफाइमा टुंगिए। एउटै ठहर दर भन्दा त्यो बीचको पत्र लुक्छ, र सफाइ आफैंमा अनुसन्धान असफल भएको प्रमाण होइन।",

  "research.corruption.route.i7Tag": "कसले जित्छ",
  "research.corruption.route.i7Title2": "दुवै पक्षको अवस्था उस्तै छैन",
  "research.corruption.route.i7Body2":
    "ठहर भएका व्यक्तिका फैसला भइसकेका पुनरावेदनमध्ये {{dp}} सफल भए; आयोगका {{cp}}। यसको विपरीत, खोजिएका हरेक पुनरावेदनमध्ये {{untraced}} को कुनै नतिजा नै अभिलिखित छैन, त्यसैले यो तुलना पछ्याउन सकिने आधा अभिलेखमा मात्र अडेको छ।",

  "research.corruption.route.i8Tag": "प्रतीक्षा",
  "research.corruption.route.i8Title2":
    "पुनरावेदन दर्तादेखि फैसलासम्म मध्यक {{median}} वर्ष",
  "research.corruption.route.i8Body2":
    "{{from}} देखि {{to}} सम्म सर्वोच्च अदालतमा दर्ता भई फैसला भइसकेका {{n}} भ्रष्टाचार पुनरावेदनमध्ये आधामा {{median}} वर्षभन्दा बढी लाग्यो र {{over}} मा छ वर्षभन्दा बढी। पछिल्ला वर्ष छाडिएका छन् किनभने तिनका थोरै पुनरावेदनमा मात्र फैसला भएको छ, र दर्ता भएका {{all}} मध्ये {{open}} मा कुनै फैसला नै अभिलिखित छैन — त्यसैले वास्तविक प्रतीक्षा यसभन्दा लामो मात्र हुन सक्छ।",

  // --- Highlight 07 and the appeal-duration section --------------------------
  "research.corruption.hl.f6": "विशेष अदालतमा जित्नु नै अन्त्य होइन। पुनरावेदनमा वर्षौं लाग्छ।",
  "research.corruption.hl.f6Stat": "{{v}} वर्ष",
  "research.corruption.hl.f6Caption":
    "सर्वोच्च अदालतमा पुनरावेदन दर्ता भएको दिनदेखि फैसला भएको दिनसम्मको मध्यक समय — पूरै मुद्दाको अवधि होइन।",
  "research.corruption.hl.f6Body":
    "{{from}} देखि {{to}} सम्म दर्ता भई फैसला भइसकेका {{n}} भ्रष्टाचार पुनरावेदनमध्ये आधामा {{median}} वर्षभन्दा बढी लाग्यो र {{over}} मा छ वर्षभन्दा बढी। यो अंक न्यूनतम हो: दर्ता भएका {{all}} पुनरावेदनमध्ये {{open}} मा कुनै फैसला नै अभिलिखित छैन, र अझै खुला रहेको पुनरावेदन परिभाषाले नै ढिलो हो।",
  "research.corruption.hl.f6Band": "{{from}}–{{to}} वर्ष",
  "research.corruption.hl.f6BandOpen": "{{from}} वर्ष+",
  "research.corruption.hl.f6SpreadCaption":
    "फैसला भएका {{n}} पुनरावेदनमध्ये कति समय लाग्यो। प्रतीक्षा मध्यकको वरिपरि जम्मा भएको छैन: सबैभन्दा ठूला दुई समूह सबैभन्दा छिटो र छ–आठ वर्षको पत्र हुन्।",
  "research.corruption.hl.f6Src": "सर्वोच्च अदालतका मुद्दा अभिलेख",
  "research.corruption.hl.f6Link": "पुनरावेदनमा कति समय लाग्छ",

  "research.corruption.delay.eyebrow": "अन्तिम चरणमा कति समय लाग्छ",
  "research.corruption.delay.title": "पुनरावेदन फैसला हुन मध्यक {{median}} वर्ष लाग्छ",
  "research.corruption.delay.lede":
    "सर्वोच्च अदालतमा पुनरावेदन दर्ता भएको दिनदेखि फैसला भएको दिनसम्म नापिएको — उजुरीदेखि होइन, सुनुवाइदेखि पनि होइन। {{from}} देखि {{to}} सम्म दर्ता भई फैसला भइसकेका {{n}} भ्रष्टाचार पुनरावेदनमध्ये आधामा {{median}} वर्षभन्दा बढी लाग्यो।",
  "research.corruption.delay.tileMedian": "{{v}} वर्ष",
  "research.corruption.delay.tileMedianLabel": "मध्यक प्रतीक्षा",
  "research.corruption.delay.tileMedianNote": "आधा पुनरावेदनमा यसभन्दा बढी लाग्यो",
  "research.corruption.delay.tileOverLabel": "छ वर्षभन्दा बढी लागेका",
  "research.corruption.delay.tileOverNote": "फैसला भएका {{n}} पुनरावेदनमध्ये",
  "research.corruption.delay.tileOpenLabel": "कुनै फैसला अभिलिखित छैन",
  "research.corruption.delay.tileOpenNote": "दर्ता भएका {{all}} पुनरावेदनमध्ये",
  "research.corruption.delay.caveat":
    "यहाँका हरेक अंक वास्तविक प्रतीक्षाको अनुमान नभई न्यूनतम हुन्। दर्ता भएका पुनरावेदनमध्ये मुस्किलले आधामा मात्र फैसला अभिलिखित छ, र अझै खुला रहेको पुनरावेदन परिभाषाले नै ढिलो हो — त्यसैले तिनलाई छाड्दा मध्यक तल झर्छ। {{to}} पछिका दर्ता वर्ष पनि त्यही कारणले छाडिएका छन्: तिनका यति थोरै पुनरावेदनमा फैसला भएको छ कि मध्यकको अर्थ रहँदैन। नापिएकामध्ये सबैभन्दा ढिलो {{slowest}} को दर्ता थियो, {{slowestYears}} वर्ष।",
  // --- Rewritten stage copy, in-text links and the appeal-wait trend ---------
  "research.corruption.route.i1Body4":
    "आयोग अनलाइन, फोन र इमेलबाट उजुरी लिन्छ। {{fy}} मा त्यसको अभिलेखमा {{all}} उजुरी थिए। तर उजुरी दिने व्यक्तिले आफ्नो उजुरीको के भयो भनी उजुरी-अनुगमन प्रणालीमार्फत सार्वजनिक रूपमा हेर्न सक्दैन। आयोगले हरेक वर्ष प्राप्त उजुरीको कुल संख्या प्रकाशित गर्छ, छुट्टाछुट्टै उजुरीको अवस्था होइन। जानकारी खोज्नेले सूचनाको हक अन्तर्गत निवेदन दिन सक्छन्, तर त्यो सामान्य कानुनी प्रक्रिया हो, उजुरी पछ्याउने उपाय होइन। उजुरीकर्ताले अन्य कुनै माध्यमबाट जानकारी पाउँछन् कि पाउँदैनन् भन्ने सार्वजनिक अभिलेखले देखाउँदैन।",

  "research.corruption.route.i4BodyA":
    "अनुसन्धान भनेको के भयो भन्ने पत्ता लगाउने काम हो, कसुरको परिस्थिति सिर्जना गर्ने होइन। स्टिङ अपरेसनमा घुसको रकम आयोग आफैंले उपलब्ध गरायो। यसले एउटा आधारभूत प्रश्न उठायो: पहिले नै भइसकेको कसुर उदाङ्गो पारिएको थियो, कि कसुर अभिलिखित हुने परिस्थिति नै बनाइएको थियो?",
  "research.corruption.route.i4BodyB":
    "२०७८।०१।०८ मा सर्वोच्च अदालतले आयोगले अपनाएको नियम बदर गर्‍यो। अदालतले अनुसन्धानले वास्तवमा के भयो भन्ने स्थापित गर्नुपर्छ, अन्यथा नहुने घटना सिर्जना गर्नु हुँदैन भन्ने स्पष्ट पार्‍यो। त्यसपछि दफा ६२(घ) ले स्टिङ अपरेसनलाई ऐनमै ल्याएको छ। तर अधिकारलाई कानुनमा राख्दैमा अदालतको फैसलाले उठाएको गहिरो प्रश्न आफैं टुंगिँदैन: ",
  "research.corruption.route.i4Inline":
    "के राज्यले कसुरको परिस्थिति सिर्जना गरेर त्यसैका आधारमा कसैलाई अभियोग लगाउन सक्छ?",

  "research.corruption.route.i5BodyA":
    "आयोगले भ्रष्टाचारको मुद्दा अनुसन्धान गर्दा हरेक व्यक्तिविरुद्धको प्रमाणका आधारमा कसलाई अभियोग लगाउने भन्ने निर्णय गर्नुपर्छ। कहिलेकाहीँ एउटै मुद्दामा संलग्न कोहीलाई अभियोग लाग्छ, कोहीलाई लाग्दैन। त्यति हुँदैमा त्यो छनौटपूर्ण अभियोजन हुँदैन, किनभने हरेक व्यक्तिविरुद्धको प्रमाण फरक हुन सक्छ। चासोको विषय भनेको कसैलाई अभियोग लगाउने र कसैलाई छाड्ने स्पष्ट आधार छ कि छैन, र ती आधार जाँच्न सकिन्छ कि सकिँदैन भन्ने हो। ",
  "research.corruption.route.i5Case": "पशुपतिनाथ जलहरी मुद्दामा",
  "research.corruption.route.i5BodyB":
    " विशेष अदालत आफैंले अभियोगपत्रमा कसको नाम राखियो र कसलाई छाडियो भनी प्रश्न उठायो। तर यो प्रवृत्ति भ्रष्टाचारका मुद्दाभरि जाँचेर उस्तै निर्णय एकनासले भइरहेका छन् कि छैनन् भनी हेर्न दिने कुनै सार्वजनिक अभिलेख छैन।",

  "research.corruption.route.i6Gap":
    "फैसला अभिलिखित हुन्छ; रकम हुँदैन। आयोगले मुद्दा दायर गर्दा बिगो तोक्छ र अदालतले त्यो फिर्ता गराउने आदेश दिन सक्छ, तर कुन अदालतले दाबीको कति अंश कायम गर्‍यो भन्ने कुनै प्रकाशित अभिलेखले भन्दैन — त्यसैले अभियोगपत्रको अंकलाई वास्तवमा स्थापित भएको कुरासँग दाँज्न मिल्दैन। ",
  "research.corruption.route.i6GapLink": "दाबी गरिएका रकमको के हुन्छ",

  "research.corruption.route.i7Title3": "पुनरावेदनका दुई फरक कथा",
  "research.corruption.route.i7Body3":
    "ठहर भएका व्यक्तिले पुनरावेदन गर्दा, फैसला भइसकेका तिनका पुनरावेदनमध्ये {{dp}} सफल भएका छन्। आयोगले पुनरावेदन गर्दा त्यो अंक जम्मा {{cp}} छ। तर एउटा महत्त्वपूर्ण सीमा छ: खोजिएका सबै पुनरावेदनमध्ये {{untraced}} को कुनै नतिजा अभिलिखित छैन। त्यसैले यी अंकले नतिजा थाहा भएका पुनरावेदनमा के भयो भन्ने देखाउँछन्, पूरा चित्र होइन।",

  "research.corruption.route.i8Title3":
    "सामान्यतया सर्वोच्च अदालतको पुनरावेदन फैसला हुन {{median}} वर्ष लाग्यो",
  "research.corruption.route.i8BodyA":
    "{{from}} देखि {{to}} सम्म सर्वोच्च अदालतमा दर्ता भई फैसला भइसकेका {{n}} भ्रष्टाचार पुनरावेदनमध्ये आधामा कम्तीमा {{median}} वर्ष लाग्यो, र {{over}} मा छ वर्षभन्दा बढी। औसत {{mean}} वर्ष हो, त्यसैले जसरी हेरे पनि अंक उस्तै रहन्छ।",
  "research.corruption.route.i8BodyB":
    "प्रतीक्षा घट्दै होइन, बढ्दै गएको छ। {{eFrom}}–{{eTo}} मा फैसला भएका पुनरावेदनले मध्यक {{eMed}} वर्ष कुरेका थिए; {{rFrom}}–{{rTo}} मा फैसला भएकाले {{rMed}} वर्ष। यसले अहिले किनारा लाग्दै गरेका पुनरावेदन कति पुराना हुन् भन्ने नाप्छ, आज दर्ता हुने पुनरावेदनलाई कति लाग्छ भन्ने होइन।",
  "research.corruption.route.i8Gap":
    "पछिल्ला दर्ता वर्ष छाडिएका छन् किनभने तिनका यति थोरै पुनरावेदनमा फैसला भएको छ कि प्रतीक्षा अवधि भरपर्दो गरी नाप्न सकिँदैन। अनि दर्ता भएका {{all}} पुनरावेदनमध्ये {{open}} को कुनै फैसला अभिलिखित छैन — त्यसैले यी अंकले फैसला भएका पुनरावेदनमा कति समय लाग्यो भन्ने देखाउँछन्, पूरा चित्र होइन।",

  "research.corruption.delay.lede2":
    "सर्वोच्च अदालतमा पुनरावेदन दर्ता भएको दिनदेखि फैसला भएको दिनसम्म नापिएको — उजुरीदेखि होइन, सुनुवाइदेखि पनि होइन। {{from}} देखि {{to}} सम्म दर्ता भई फैसला भइसकेका {{n}} भ्रष्टाचार पुनरावेदनमध्ये आधामा कम्तीमा {{median}} वर्ष लाग्यो, र {{over}} मा छ वर्षभन्दा बढी। औसत {{mean}} वर्ष हो, त्यसैले जसरी हेरे पनि अंक उस्तै रहन्छ।",
  "research.corruption.delay.trend":
    "प्रतीक्षा घट्दै होइन, बढ्दै गएको छ। {{eFrom}}–{{eTo}} मा फैसला भएका पुनरावेदनले मध्यक {{eMed}} वर्ष कुरेका थिए; {{rFrom}}–{{rTo}} मा फैसला भएकाले {{rMed}} वर्ष। दर्ता वर्षमा नभई फैसला वर्षमा आधारित — अझै बाँकी रहेका पुनरावेदनले नकाट्ने एक मात्र झ्याल यही हो, किनभने फैसला मिति भएको हरेक पुनरावेदनको अवधि ज्ञात छ। यसले अहिले किनारा लाग्दै गरेका पुनरावेदन कति पुराना हुन् भन्ने नाप्छ, आज दर्ता हुनेलाई कति लाग्छ भन्ने होइन।",

  "research.corruption.hl.f6Caption2":
    "फैसला भएका आधा पुनरावेदनमा कम्तीमा यति समय लाग्यो — सर्वोच्च अदालतमा पुनरावेदन दर्ता भएको दिनदेखि फैसला भएको दिनसम्म, पूरै मुद्दाको अवधि होइन।",
  "research.corruption.hl.f6Body2":
    "{{from}} देखि {{to}} सम्म दर्ता भई फैसला भइसकेका {{n}} भ्रष्टाचार पुनरावेदनमध्ये आधामा कम्तीमा {{median}} वर्ष लाग्यो र {{over}} मा छ वर्षभन्दा बढी; औसत {{mean}} वर्ष। अनि प्रतीक्षा बढ्दै छ: {{rFrom}}–{{rTo}} मा फैसला भएका पुनरावेदनले मध्यक {{rMed}} वर्ष कुरेका थिए भने {{eFrom}}–{{eTo}} मा फैसला भएकाले {{eMed}} वर्ष। यी अंक न्यूनतम हुन् — दर्ता भएका {{all}} पुनरावेदनमध्ये {{open}} को कुनै फैसला अभिलिखित छैन।",
  // --- Screening/preliminary split and the Special Court outcomes, reworded ---
  "research.corruption.route.i2Title3":
    "आयोगले कुन उजुरीको अनुसन्धान गर्ने र कुनको नगर्ने भनी किन निर्णय गर्छ?",
  "research.corruption.route.i2Body4":
    "प्रतिवेदनले संख्या त दिन्छ, तर छुट्टाछुट्टै निर्णयपछाडिका कारण दिँदैन। एउटा उजुरी विस्तृत अनुसन्धानमा पठाइयो र अर्को किन पठाइएन भन्ने यसले बताउँदैन। ती कारणबिना उस्तै प्रकृतिका उजुरीलाई एकनासले व्यवहार गरिएको छ कि छैन भनी आयोगबाहिरका कसैले आँकलन गर्न कठिन हुन्छ।",
  "research.corruption.route.splitTameli3": "तामेलीमा राखिए: {{n}} उजुरी",
  "research.corruption.route.splitOther3": "अन्य कारबाही भयो: {{n}} उजुरी",
  "research.corruption.route.splitOn3": "विस्तृत अनुसन्धानमा पठाइए: {{n}} उजुरी",
  "research.corruption.route.splitCaption3":
    "{{fy}} मा विस्तृत अनुसन्धानअघि नै आयोगले हेरेका {{n}} उजुरीमध्ये झन्डै दस मा छ वटा तामेलीमा राखिए भने सय मा करिब तीन वटा मात्र विस्तृत अनुसन्धानमा पुगे। यी अंक आयोगको ३५औं वार्षिक प्रतिवेदनको तालिका २.१४ बाट लिइएका हुन्, जसले सुरुको परीक्षण र प्रारम्भिक छानबिनलाई छुट्याउँदैन।",

  "research.corruption.route.i6BodyA":
    "स्पष्ट फैसला भएका {{d}} मुद्दामध्ये {{full}} पूर्ण ठहर, {{part}} आंशिक ठहर र {{acq}} सफाइमा टुंगिए। आंशिक ठहर भनेको अदालतले कुनै अभियोगमा ठहर गरी अरूमा नगरेको, वा एउटै मुद्दामा केही प्रतिवादीलाई ठहर गरी केहीलाई सफाइ दिएको हो।",
  "research.corruption.route.i6BodyB":
    "एउटै ठहर दरले यी भिन्नता समेट्दैन। अनुसन्धान कसरी भयो भन्ने पूरा कथा पनि यसले भन्दैन। सफाइको अर्थ अदालतले अभियुक्तलाई दोषी ठहर गरेन भन्ने हो, तर त्यसले अनुसन्धान नै त्रुटिपूर्ण थियो भन्ने स्वतः जनाउँदैन।",
  "research.corruption.route.i6Gap2":
    "फैसला अभिलिखित हुन्छ; रकम हुँदैन। आयोगले मुद्दा दायर गर्दा बिगो तोक्छ र अदालतले त्यो फिर्ता गराउने आदेश दिन सक्छ, तर कुन अदालतले दाबीको कति अंश कायम गर्‍यो भन्ने कुनै प्रकाशित अभिलेखले भन्दैन — त्यसैले अभियोगपत्रको अंकलाई वास्तवमा स्थापित भएको कुरासँग दाँज्न मिल्दैन।",
  // --- In-text cross-references and linked case names ------------------------
  "research.corruption.investigation.closeA2":
    "प्रतिवेदनले यी निर्णय एक-एक उजुरीसम्म गन्छ तर एउटाको पनि कारण दिँदैन। कतिलाई पुनः उठाइयो भन्ने पनि भन्दैन, र नयाँ प्रमाण आएमा तामेली उल्ट्याउन सकिन्छ — त्यसैले पुनः उठाइएका फाइलको गणनाले यी फाइल थन्क्याइएका हुन् कि सफा गरिएका भन्ने देखाउँथ्यो। कुनै प्रतिवेदनले त्यो प्रकाशित गरेको छैन। बरु अदालतसम्म पुगेको चाहिँ ",
  "research.corruption.investigation.closeA2Ref": "साँघुरिँदै र बदलिँदै गएको अभियोगको समूह हो",
  "research.corruption.investigation.closeA2End": "।",

  "research.corruption.byCharge.body3":
    "नक्कली प्रमाणपत्रका मुद्दाले डेटासेटका सबै पूर्ण ठहरमध्ये करिब {{fakeShare}} ओगट्छन्। अरू सबै कसुर मिलाउँदा — रकम हिनामिना, हानिनोक्सानी, गैरकानुनी सम्पत्ति र अनियमितता समेत — पूर्ण ठहर दर {{restPct}} मा झर्छ। ती मुद्दा दायरीको कति हिस्सा थिए भन्ने ",
  "research.corruption.byCharge.body3Ref": "अवधिभर उल्लेख्य रूपमा बदलियो",
  "research.corruption.byCharge.body3End": "।",

  "research.corruption.gap.bEstablishesA": "",
  "research.corruption.gap.bCaseName": "पशुपति जलहरी मुद्दामा",
  "research.corruption.gap.bEstablishesB":
    " विशेष अदालतले छनौटपूर्ण अभियोजनबारे चासो उठाउँदै उस्तै जिम्मेवार मानिएका अरूलाई छाडेर केही व्यक्तिमाथि मात्र किन अभियोग लगाइयो भनी प्रश्न गर्‍यो। अदालतको टिप्पणीले अख्तियारका अभियोजन निर्णयको एकरूपतालाई जाँचको घेरामा ल्यायो। तर सफाइलाई छनौटपूर्ण अभियोजनकै कारण मात्र भन्न भने मिल्दैन।",

  "research.corruption.delay.trend2":
    "प्रतीक्षा घट्दै होइन, बढ्दै गएको छ। {{eFrom}}–{{eTo}} मा फैसला भएका पुनरावेदनले मध्यक {{eMed}} वर्ष कुरेका थिए; {{rFrom}}–{{rTo}} मा फैसला भएकाले {{rMed}} वर्ष। दर्ता वर्षमा नभई फैसला वर्षमा आधारित — अझै बाँकी रहेका पुनरावेदनले नकाट्ने एक मात्र झ्याल यही हो, किनभने फैसला मिति भएको हरेक पुनरावेदनको अवधि ज्ञात छ। यसले अहिले किनारा लाग्दै गरेका पुनरावेदन कति पुराना हुन् भन्ने नाप्छ, आज दर्ता हुनेलाई कति लाग्छ भन्ने होइन। यसअघिको चरण भने उल्टो दिशामा गएको छ: विशेष अदालतको फैसलासम्मको समय घट्दै आएको छ।",
  "research.corruption.delay.trendRef": "विशेष अदालतको गति",
  // --- Masthead and the About Jawafdehi section ------------------------------
  "research.corruption.site.logoAlt": "जवाफदेही",
  "research.corruption.site.eyebrow2": "रिसर्च",
  "research.corruption.site.title2":
    "नेपालको जवाफदेहिता प्रणाली कसरी चल्छ, र कहाँ चुहिन्छ",
  "research.corruption.site.lede3":
    "जवाफदेही एउटा खुला डेटा पोर्टल हो, जसले नेपालका भ्रष्टाचार मुद्दा सबैका लागि खोज्न र बुझ्न सजिलो बनाउँछ। यो अनुसन्धान त्यही कामको त्यो भाग हो जसले कुनै एक मुद्दालाई होइन, प्रणालीलाई हेर्छ।",

  "research.corruption.about.label2": "जवाफदेहीबारे",
  "research.corruption.about.heading2":
    "नेपालका भ्रष्टाचार मुद्दाको खुला अभिलेख, र तिनलाई हेर्ने प्रणाली वास्तवमा कसरी चल्छ भन्ने",
  "research.corruption.about.a1":
    "जवाफदेही एउटा खुला डेटा पोर्टल हो, जसले नेपालका भ्रष्टाचार मुद्दा सबैका लागि खोज्न र बुझ्न सजिलो बनाउँछ। छरिएर रहेका सूचनालाई एकै ठाउँमा ल्याउँछ, र सयौं पृष्ठका अदालती कागजात पढिरहनु नपर्ने गरी के भयो भन्ने बुझ्न सघाउने सरल मुद्दा सारांश राख्छ। नेपालको २०८२ को जेन-जी आन्दोलनको भावनामा आधारित भई जवाफदेहीले जवाफदेहिता आम नागरिकका लागि थप पहुँचयोग्य बनाउन खोज्छ।",
  "research.corruption.about.a2":
    "छुट्टाछुट्टै मुद्दा अभिलेख गर्नुभन्दा पर गएर जवाफदेहीले ठूलो तस्बिर पनि हेर्छ। यस अनुसन्धानमार्फत हामी अख्तियार, सर्वोच्च अदालत र अन्य स्रोतका १४ वर्षका अभिलेख अध्ययन गरेर नेपालको जवाफदेहिता प्रणालीका ग्याप पत्ता लगाउन र पुनः पत्ता लगाउन खोज्छौं। भ्रष्टाचारका उजुरी प्रणालीभित्र कसरी अघि बढ्छन्, मुद्दा किनारा लाग्न कति समय लाग्छ, र उपलब्ध अभिलेखले जवाफदेहिताको प्रक्रियाका बलिया पक्ष र ग्याप के देखाउँछन् भन्ने हेर्छौं। जहाँ सूचना छैन, त्यहाँ अनुमान गर्नुको सट्टा त्यही अभाव औंल्याउँछौं।",
  "research.corruption.about.a3":
    "यो काममा फरक-फरक क्षेत्रका मानिस जोडिएका छन् — कानुनका विज्ञ, कानुनका विद्यार्थी, प्रविधिकर्मी, सफ्टवेयर इन्जिनियर, अवकाशप्राप्त कर्मचारी र पत्रकार। हाम्रो उद्देश्य सार्वजनिक अभिलेखलाई पहुँच, बुझाइ र जाँचका लागि सहज बनाउनु हो, ताकि जोसुकैले प्रमाण हेरेर आफ्नै निष्कर्ष निकाल्न सकून्।",
  "research.corruption.about.a4":
    "यस पृष्ठका हरेक अंक पुनः गणना गर्न सकिन्छ। डेटासेट, हरेक अंक निकाल्ने कोड र कुन स्रोतले के पुष्टि गर्छ र के गर्दैन भन्ने टिप्पणी प्रकाशित छन्, त्यसैले अंकमाथि शंका गर्ने पाठकले विश्वासमा मात्र भर पर्नु पर्दैन।",
  "research.corruption.about.pack": "यस पृष्ठपछाडिको डेटा र कोड",
  "research.corruption.about.fYears": "{{n}} वर्ष",
  "research.corruption.about.fYearsLabel": "अख्तियार र अदालतका अभिलेख, {{from}} देखि {{to}}",
  "research.corruption.about.fCases": "दायरीदेखि अन्तिम पुनरावेदनसम्म पछ्याइएका अभियोजन",
  "research.corruption.about.fAppeals": "नापिएका सर्वोच्च अदालतका भ्रष्टाचार पुनरावेदन",
  "research.corruption.about.fOpen": "खुला",
  "research.corruption.about.fOpenLabel": "हरेक अंक तपाईं जाँच्न सक्ने सार्वजनिक स्रोतसम्म पुग्छ",
  // --- Masthead, About links, the oval, and Tameli at first use --------------
  "research.corruption.site.lede4":
    "अख्तियार र अदालतका चौध वर्षका अभिलेख सँगै पढ्दा: भ्रष्टाचारको उजुरी कति टाढासम्म पुग्छ, हरेक चरणमा कति समय लाग्छ, अदालतसम्म पुगेका मुद्दाको के हुन्छ, र बाटोमा कुन-कुन निर्णय कारण नखुलाई गरिन्छन्।",
  "research.corruption.hl.title2": "भ्रष्टाचारको उजुरी कसरी अघि बढ्छ, र कहाँ रोकिन्छ",

  "research.corruption.about.b1a": "जवाफदेही एउटा ",
  "research.corruption.about.b1Portal": "खुला डेटा पोर्टल",
  "research.corruption.about.b1b":
    " हो, जसले नेपालका भ्रष्टाचार मुद्दा सबैका लागि खोज्न र बुझ्न सजिलो बनाउँछ। छरिएर रहेका सूचनालाई एकै ठाउँमा ल्याउँछ, र ",
  "research.corruption.about.b1Cases": "सरल मुद्दा सारांश",
  "research.corruption.about.b1c":
    " राख्छ, जसले सयौं पृष्ठका अदालती कागजात पढिरहनु नपर्ने गरी के भयो भन्ने बुझ्न सघाउँछ। नेपालको २०८२ को जेन-जी आन्दोलनको भावनामा आधारित भई जवाफदेहीले जवाफदेहिता आम नागरिकका लागि थप पहुँचयोग्य बनाउन खोज्छ।",
  "research.corruption.about.b2a":
    "छुट्टाछुट्टै मुद्दा अभिलेख गर्नुभन्दा पर गएर जवाफदेहीले ठूलो तस्बिर पनि हेर्छ। यस अनुसन्धानमार्फत हामी ",
  "research.corruption.about.b2Ciaa": "अख्तियारका वार्षिक प्रतिवेदन",
  "research.corruption.about.b2b": ", ",
  "research.corruption.about.b2Court": "सर्वोच्च र विशेष अदालतका अभिलेख",
  "research.corruption.about.b2c":
    " र अन्य स्रोतका १४ वर्षका अभिलेख अध्ययन गरेर नेपालको जवाफदेहिता प्रणालीका ग्याप पत्ता लगाउन र पुनः पत्ता लगाउन खोज्छौं। भ्रष्टाचारका उजुरी प्रणालीभित्र कसरी अघि बढ्छन्, मुद्दा किनारा लाग्न कति समय लाग्छ, र उपलब्ध अभिलेखले जवाफदेहिताका बलिया पक्ष र ग्याप के देखाउँछन् भन्ने हेर्छौं। जहाँ सूचना छैन, त्यहाँ अनुमान गर्नुको सट्टा त्यही अभाव औंल्याउँछौं — र यस पृष्ठका हरेक अंक ",
  "research.corruption.about.b2Pack": "प्रकाशित डेटा र कोडबाट पुनः गणना गर्न सकिन्छ",
  "research.corruption.about.b2d": "।",

  "research.corruption.route.pCiaa2": "अख्तियार",
  "research.corruption.route.ovalCentre": "उजुरीको बाटो",
  "research.corruption.route.ovalHint":
    "कुनै चरण छान्नुहोस् — अभिलेखले के देखाउँछ र के देखाउँदैन, त्यो खुल्छ।",

  "research.corruption.flow.s1Title2": "कसैले उजुरी दिन्छ",
  "research.corruption.flow.tameliDef":
    "को अर्थ उजुरी हाललाई थाती राखिएको हो। फाइल र त्यसको अभिलेख राखिन्छ, र पछि थप प्रमाण आएमा त्यही बखतको कानुनबमोजिम कारबाही हुन्छ — त्यसैले तामेलीको अर्थ मुद्दा सदाका लागि टुंगियो भन्ने होइन।",
  "research.corruption.flow.tameliLost":
    "व्यवहारमा भने सार्वजनिक पदचाप यहीँ टुंगिन्छ। कुनै एक तामेली निर्णयको कारण प्रकाशित हुँदैन, र कति फाइल पुनः उठाइए भन्ने कुनै प्रतिवेदनले अभिलेख गर्दैन — त्यसैले उजुरी तामेलीमा गएपछि त्यसको के भयो भन्ने बाहिरबाट पछ्याउने कुनै बाटो रहँदैन।",
  "research.corruption.flow.tameliCite": "अख्तियार ऐन २०४८, दफा १९(१३)।",

  "research.corruption.route.i1Tag2": "कसैले पछ्याउन सक्दैन",
  "research.corruption.route.i1Title3": "उजुरी भित्र जान्छ, र केही बाहिर आउँदैन",
  "research.corruption.route.i1Link2": "उजुरी दर्ता भएपछि के हुन्छ",
  "research.corruption.route.i2Title4":
    "दस मा छ उजुरी तामेलीमा टुंगिन्छन्, र कुनैको पनि कारण प्रकाशित हुँदैन",
  "research.corruption.route.i4Title3":
    "आयोगले आफैं घुसको रकम दियो, अनि त्यसैमा अभियोग लगायो",
  "research.corruption.route.i5Tag2": "कसलाई अभियोग, र कति थोरैलाई",
  "research.corruption.route.i5Title3":
    "कसैलाई अभियोग र कसैलाई किन होइन भनी अदालतले सोध्यो, अभिलेखले जवाफ दिन सक्दैन",
  "research.corruption.route.i5Gap":
    "यहाँसम्म निकै थोरै मात्र बाँच्छ। {{fy}} मा आयोगको अभिलेखमा रहेका {{all}} उजुरीमध्ये {{filed}} अदालतमा दायर भए — {{pct}}। त्यही वर्ष सकिएका अनुसन्धान मात्र गन्दा पनि {{share}} मा अभियोगपत्र बन्यो। बाँकी अघि नै रोकिन्छन्, र धेरैजसोको कारण प्रकाशित हुँदैन।",
  "research.corruption.route.i5GapPct": "{{v}}%",
  "research.corruption.route.i6Gap3":
    "आयोगले दायर गरेका धेरैजसो मुद्दा जित्दैन। फैसला भएका मध्ये {{acq}} सफाइमा टुंगिन्छन् र {{less}} पूर्ण ठहरभन्दा कम हुन्छन् — त्यो पनि अभियोग आफैं छानेको, प्रमाण आफैं जुटाएको र संवैधानिक आयोगको अधिकार भएको निकायबाट। मुद्दा किन असफल भयो भन्ने कुनै प्रकाशित अभिलेख छैन, त्यसैले यो प्रवृत्तिलाई त्यसका निर्णयसँग जोडेर पढ्न मिल्दैन। रकम पनि हराएको छ: मुद्दा दायर गर्दा बिगो तोकिन्छ, तर त्यसको कति अंश अदालतले कायम गर्‍यो भन्ने कतै अभिलिखित हुँदैन।",
  "research.corruption.route.i7Body4":
    "आयोगले हारलाई चुपचाप स्वीकार गर्दैन: आफूविरुद्धका सफाइमध्ये {{share}}, अर्थात् जम्मा {{n}} मा पुनरावेदन गर्‍यो। तीमध्ये फैसला भइसकेका {{decided}} मा {{won}} को नतिजा बदलियो। उल्टो दिशाबाट, ठहर भएका व्यक्तिका फैसला भइसकेका पुनरावेदनमध्ये {{dp}} सफल हुन्छन्। दुवै अंकविरुद्ध, खोजिएका हरेक पुनरावेदनमध्ये {{untraced}} को कुनै नतिजा अभिलिखित छैन, त्यसैले यो पछ्याउन सकिने आधा अभिलेखमा मात्र अडेको छ।",
};
