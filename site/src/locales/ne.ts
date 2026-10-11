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
    "भनेको उजुरी हाललाई मात्र तामेलीमा राखिएको हो, सदाका लागि बन्द गरिएको होइन। मिसिल र अभिलेख रहिरहन्छ, र आयोगकै सूचनाले भन्छ — पछि थप प्रमाण फेला परेमा सोही बखत कानूनबमोजिम कारबाही हुन्छ।",
  "research.corruption.flow.exitCite":
    "अख्तियार दुरुपयोग अनुसन्धान आयोग ऐन, २०४८ को दफा १९(१३); कार्यविधि २०७८ को अनुसूची-११ को ढाँचा।",
  "research.corruption.flow.start": "उजुरी प्राप्त",
  "research.corruption.flow.yes": "हुन्छ",
  "research.corruption.flow.no": "हुँदैन",
  "research.corruption.flow.dScreen": "अघि बढाउने?",
  "research.corruption.flow.dGrounds": "आधार भेटियो?",
  "research.corruption.flow.dProsecute": "मुद्दा चलाउने?",
  "research.corruption.flow.dAppeal": "पुनरावेदन पर्‍यो?",
  "research.corruption.flow.chargeSheet": "आरोपपत्र दायर",
  "research.corruption.flow.stands": "फैसला यथावत्",
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
  "research.corruption.month.title": "वर्षको कुन समयमा मुद्दा दायर हुन्छन्",
  "research.corruption.month.subtitle":
    "नेपाली महिनाअनुसार औसत दायर मुद्दा, दुवैतिर एक मानक विचलनसहित।",
  "research.corruption.month.caption":
    "पूरा आर्थिक वर्षहरूको औसत। दायरी {{peak}} मा आर्थिक वर्षको अन्त्यतिर उच्च हुन्छ र {{trough}} मा चाडपर्वको समयमा घट्छ। विचलन यति फराकिलो छ कि कुनै एक वर्ष यो स्वरूपभन्दा बिल्कुलै फरक देखिन सक्छ।",
  "research.corruption.month.mean": "औसत दायरी",
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
};
