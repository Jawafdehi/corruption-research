# Copied from options/shared/build_data.py by scripts/sync-home.sh and patched. Do not edit.
#!/usr/bin/env python3
"""Build shared/findings.js for the home-page mockups.

Every figure comes from the research branch at a fixed commit, read with `git show`, so
the mockups cannot drift from the site:

  site/src/data/headline-findings.json   sentences, hand-checked figures, gap labels
  site/src/data/report.generated.json    the generated appeal / duration figures, and the
                                         counts behind a few charts (complaint disposal,
                                         duration bands, appeal outcomes)

What this file adds is the *design layer* only: which stage of the route a finding sits
on, the one big number (always a reference to a figure key, never a typed number), the
chart spec (built from the same data), and the Nepali headline and short line.

Run:  python3 build_data.py      (writes findings.js next to this file)
"""

import json
import re
import subprocess
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]  # repo root (site/scripts/..)
COMMIT = subprocess.run(["git", "-C", str(REPO), "log", "-1", "--format=%h", "--", "site/src/data/headline-findings.json", "site/src/data/report.generated.json"], capture_output=True, text=True).stdout.strip() or "working-tree"
HERE = Path(__file__).resolve().parent


def show(path):
    # Patched by sync-home.sh: read the checked-out file, not `git show`.
    return json.loads((REPO / path).read_text(encoding="utf-8"))


HF = show("site/src/data/headline-findings.json")
RG = show("site/src/data/report.generated.json")

ap, sd = RG["appeals"], RG["supremeDelay"]
cd = RG["complaintDisposal"][0]

# The CIAA's 36th annual report (2082/83). Its 10-page summary is the latest published
# source (work/2026-11-08-research-site-design/ciaa-2082-83/FIGURES-2082-83.md, converted with
# likhit). Where it gives a figure, the page uses it. It does not give the number of full
# investigations completed, so the funnel's second stage counts complaints sent on for full
# investigation: same year, same report. Findings the summary cannot cover keep 2081/82 and
# say so on the card.
NEW = next((p for p in [HERE.parent.parent / "ciaa-2082-83" / "figures-2082-83.json",
                        HERE.parent / "src" / "data" / "ciaa-2082-83.json"] if p.exists()), None)
# Fail loudly rather than quietly fall back to the 35th report's year: the copy in
# site/src/data/ is committed, so CI always has it.
assert NEW, "home_build_data: CIAA 2082/83 figures not found (site/src/data/ciaa-2082-83.json)"
CD_OLD = cd
if NEW:
    nw = json.loads(NEW.read_text())
    assert nw["total_complaints"] == (cd["pending_out"] + nw["registered_new"]), "36th: carried in + new = on the books"
    assert nw["disposed"] + nw["backlog_end"] == nw["total_complaints"], "36th: decided + waiting = on the books"
    cd = dict(cd, fy=nw["fy"], registered_new=nw["registered_new"], total_complaints=nw["total_complaints"],
              carried_in=nw["total_complaints"] - nw["registered_new"], disposed=nw["disposed"],
              tameli=nw["shelved"], tameli_with_advice=0, to_investigation=nw["to_investigation"],
              other_action=nw["disposed"] - nw["shelved"] - nw["to_investigation"], pending_out=nw["backlog_end"],
              investigations_completed=None, inv_filed=nw["inv_filed"], source="CIAA 36th annual report summary (2082/83)")
    def _set(key, **kv):
        f = next(f for st in HF["stages"] for f in st["findings"] if f["key"] == key)
        f["figures"].update(kv)
    _set("shelved", fy=nw["fy"], shelved=f'{nw["shelved"]:,}', shelvedPct=f'{round(nw["shelved"] / nw["disposed"] * 10)} in 10',
         toInv=f'{nw["to_investigation"]:,}', toInvPct=f'{round(nw["to_investigation"] / nw["disposed"] * 100)} in 100')
    _set("backlog", fy=nw["fy"], carried=f'{nw["backlog_end"]:,}', share=f'1 in {round(nw["total_complaints"] / nw["backlog_end"])}')


def n(x):
    return f"{x:,}"


# Same formatting as HeadlineFindings.tsx (n, pct1, toFixed(1)).
GENERATED = {
    "oneWay": {
        "defRev": n(ap["convictedVsConviction"]["reversed"]),
        "defDec": n(ap["convictedVsConviction"]["decided"]),
        "govRev": n(ap["governmentVsAcquittal"]["reversed"]),
        "govDec": n(ap["governmentVsAcquittal"]["decided"]),
        "defPct": f'{round(ap["convictedVsConviction"]["pct"])}%',
        "govPct": f'{round(ap["governmentVsAcquittal"]["pct"])}%',
    },
    "notAppealed": {
        "none": n(ap["acquittals"]["noAppeal"]),
        "judgeable": n(ap["acquittals"]["judgeable"]),
        "pct": f'{ap["acquittals"]["noAppealPct"]:.1f}%',
    },
    "duration": {
        "from": str(sd["fromYear"]),
        "to": str(sd["toYear"]),
        "km": f'{(sd.get("kmMedianYears") or sd["medianYears"]):.1f}',
        "over6": f'{sd["overSixPct"]:.1f}%',
        "person": f'{(sd["bySide"]["person"].get("kmMedianYears") or sd["bySide"]["person"]["medianYears"]):.1f}',
    },
}

# The route, in the order a case travels. Seven stops: the report groups screening with
# the preliminary inquiry (one CIAA table) and investigation with the decision to charge.
STAGES = [
    {"key": "complaint", "n": 1, "inst": "ciaa",
     "en": "A complaint is filed", "ne": "उजुरी दर्ता हुन्छ"},
    {"key": "screening", "n": 2, "inst": "ciaa",
     "en": "Screening and first inquiry", "ne": "छानबिन र प्रारम्भिक अनुसन्धान"},
    {"key": "charge", "n": 3, "inst": "ciaa",
     "en": "Full investigation and decision to charge", "ne": "विस्तृत अनुसन्धान र मुद्दा चलाउने निर्णय"},
    {"key": "trial", "n": 4, "inst": "special",
     "en": "Special Court trial", "ne": "विशेष अदालतमा मुद्दा"},
    {"key": "lodged", "n": 5, "inst": "supreme",
     "en": "Appeal to the Supreme Court", "ne": "सर्वोच्च अदालतमा पुनरावेदन"},
    {"key": "decided", "n": 6, "inst": "supreme",
     "en": "Supreme Court decides", "ne": "सर्वोच्च अदालतको फैसला"},
    {"key": "recovery", "n": 7, "inst": "none",
     "en": "Getting the money back", "ne": "रकम असुली"},
]

INSTITUTIONS = {
    "ciaa": {"en": "CIAA", "ne": "अख्तियार", "long_en": "Commission for the Investigation of Abuse of Authority", "long_ne": "अख्तियार दुरुपयोग अनुसन्धान आयोग"},
    "special": {"en": "Special Court", "ne": "विशेष अदालत"},
    "supreme": {"en": "Supreme Court", "ne": "सर्वोच्च अदालत"},
    "none": {"en": "No one publishes it", "ne": "कसैले प्रकाशित गर्दैन"},
}

# Design layer per finding. `big.value` names a figure key ({{key}}) or a literal
# computed below from the data; `viz` holds numbers taken from the JSON files only.
D = {
    "tracking": dict(
        stage="complaint",
        big={"value": "0", "en": "ways to look up a complaint's status on the CIAA website (checked {{checked}})",
             "ne": "अख्तियारको वेबसाइटमा उजुरीको स्थिति हेर्ने उपाय ({{checked}} मा जाँच गरिएको)"},
        viz={"type": "absent", "en": "No complaint number. No status lookup. Portal offline.",
             "ne": "उजुरी नम्बर छैन। स्थिति हेर्ने सुविधा छैन। पोर्टल बन्द।"},
        ne="उजुरी गर्ने व्यक्तिले आफ्नो उजुरीको के भयो भनेर पछ्याउन सक्दैन",
        short_en="No complaint number, no status lookup, and the complaint portal was offline.",
        short_ne="उजुरी नम्बर छैन, स्थिति हेर्ने उपाय छैन, र उजुरी पोर्टल बन्द थियो।",
    ),
    "shelved": dict(
        stage="screening",
        big={"value": "{{shelvedPct}}", "en": "complaints closed without any investigation in {{fy}}. No reason given.",
             "ne": "उजुरी {{fy}} मा कुनै अनुसन्धान नगरी तामेलीमा। कारण खुलाइएको छैन।"},
        viz={"type": "waffle", "parts": [
            {"v": cd["tameli"] + cd["tameli_with_advice"], "tone": "leak", "en": "Closed, no reason", "ne": "तामेली, कारण नखुलाई"},
            {"v": cd["other_action"], "tone": "mute", "en": "Other action", "ne": "अन्य कारबाही"},
            {"v": cd["to_investigation"], "tone": "on", "en": "Sent to full investigation", "ne": "विस्तृत अनुसन्धानमा"},
        ], "total": cd["disposed"]},
        ne="धेरैजसो उजुरी कुनै अनुसन्धानै नगरी तामेलीमा राखिन्छन्, र कारण खुलाइँदैन",
        short_en="{{shelved}} complaints closed in {{fy}} with no investigation; only {{toInv}} went on to a full one.",
        short_ne="{{fy}} मा {{shelved}} उजुरी अनुसन्धान नगरी तामेलीमा; विस्तृत अनुसन्धानमा गए {{toInv}} मात्र।",
    ),
    "backlog": dict(
        stage="screening",
        big={"value": "{{carried}}", "en": "complaints still waiting at the end of {{fy}}. How long they have waited is not published.",
             "ne": "उजुरी {{fy}} को अन्त्यसम्म पनि पर्खिरहेका। कति समयदेखि भन्ने प्रकाशित छैन।"},
        viz={"type": "waffle", "parts": [
            {"v": cd["pending_out"], "tone": "leak", "en": "Carried into next year", "ne": "अर्को वर्षमा सरेका"},
            {"v": cd["disposed"], "tone": "mute", "en": "Dealt with in the year", "ne": "वर्षभित्र टुंगिएका"},
        ], "total": cd["total_complaints"]},
        ne="हजारौं उजुरी पर्खिरहेका छन्, कति समयदेखि भनेर कसैले बताउँदैन",
        short_en="{{carried}} complaints carried into the next year; the waiting time is not published.",
        short_ne="{{carried}} उजुरी अर्को वर्षमा सरे; कति पर्खिए भन्ने प्रकाशित छैन।",
    ),
    "afterInvestigation": dict(
        stage="charge",
        big={"value": "{{shelvedNowPct}}", "en": "of decisions after a full investigation were to close the case ({{fyNow}}), up from {{shelvedThenPct}} in {{fyThen}}",
             "ne": "पूर्ण अनुसन्धानपछिका निर्णयमध्ये मुद्दा तामेली ({{fyNow}}); {{fyThen}} मा {{shelvedThenPct}} थियो"},
        viz={"type": "slope", "unit": "%", "from": {"label": "{{fyThen}}", "v": "{{shelvedThenPct}}"}, "to": {"label": "{{fyNow}}", "v": "{{shelvedNowPct}}"},
             "sub": {"en": "Cases taken to court: {{filedThen}} → {{filedNow}}", "ne": "अदालत लगिएका मुद्दा: {{filedThen}} → {{filedNow}}"}},
        ne="पूर्ण अनुसन्धानपछि पनि अख्तियारले अहिले धेरैजसो मुद्दा चलाउनुको सट्टा तामेलीमा राख्छ",
        short_en="Closures after a full investigation went from {{shelvedThenPct}} to {{shelvedNowPct}}; cases taken to court fell from {{filedThen}} to {{filedNow}}.",
        short_ne="पूर्ण अनुसन्धानपछिको तामेली {{shelvedThenPct}} बाट {{shelvedNowPct}} पुग्यो; अदालत लगिएका मुद्दा {{filedThen}} बाट {{filedNow}} मा झरे।",
    ),
    "lossRate": dict(
        stage="trial",
        big={"value": "{{acqPct}}", "en": "of CIAA cases decided by the Special Court end with every defendant acquitted",
             "ne": "विशेष अदालतले फैसला गरेका अख्तियारका मुद्दामा सबै प्रतिवादीले सफाइ पाए"},
        viz={"type": "waffle", "parts": [
            {"v": 1035, "tone": "leak", "en": "Everyone acquitted", "ne": "सबैलाई सफाइ"},
            {"v": 2649 - 1035, "tone": "mute", "en": "At least one convicted", "ne": "कम्तीमा एक दोषी"},
        ], "total": 2649, "check": ["acq", "decided"],
            "sub": {"en": "Was {{earlyShare}} in {{earlyYears}}; {{lateShare}} in {{lateYears}}", "ne": "{{earlyYears}} मा {{earlyShare}}; {{lateYears}} मा {{lateShare}}"}},
        ne="अख्तियारले अदालत लगेका करिब १० मा ४ मुद्दा पूर्ण सफाइमा टुंगिन्छन्, पूर्ण अनुसन्धानपछि पनि",
        short_en="{{acq}} of {{decided}} decided CIAA cases ended with everyone acquitted; it rose from {{earlyShare}} to {{lateShare}} of verdicts.",
        short_ne="फैसला भएका {{decided}} मध्ये {{acq}} मुद्दामा सबैले सफाइ पाए; यो {{earlyShare}} बाट {{lateShare}} पुग्यो।",
    ),
    "whoConvicted": dict(
        stage="trial",
        big={"value": "{{people}}", "en": "of {{all}} people prosecuted are in cases where the public page does not say who was convicted",
             "ne": "जना ({{all}} अभियुक्तमध्ये) यस्ता मुद्दामा छन् जहाँ सार्वजनिक पानाले को दोषी ठहरियो भन्दैन"},
        viz={"type": "waffle", "parts": [
            {"v": 3038, "tone": "leak", "en": "Outcome per person not shown", "ne": "व्यक्तिगत फैसला नदेखिने"},
            {"v": 8846 - 3038, "tone": "mute", "en": "Outcome clear from the case", "ne": "मुद्दाबाटै फैसला स्पष्ट"},
        ], "total": 8846, "check": ["people", "all"]},
        ne="कुन प्रतिवादी दोषी ठहरिए र कुन सफाइ पाए, जनताले हेर्न सक्दैनन्",
        short_en="For {{people}} of {{all}} people prosecuted ({{share}}), the court's public page gives one outcome for the whole case.",
        short_ne="{{all}} मध्ये {{people}} अभियुक्त ({{share}}) को हकमा अदालतको सार्वजनिक पानाले पूरै मुद्दाको एउटै नतिजा देखाउँछ।",
        caveat_add="Counted as defendant entries in the court record, not identified people.",
    ),
    "whyAcquitted": dict(
        stage="trial",
        big={"value": "{{evid}} of {{read}}", "value_ne": "{{read}} मा {{evid}}",
             "en": "acquittal judgments we read said the evidence did not prove the charge",
             "ne": "हामीले पढेका सफाइ फैसलामा प्रमाणले अभियोग पुष्टि गरेन भनियो"},
        viz={"type": "stack", "total": 31, "check": ["read"], "parts": [
            {"v": 13, "tone": "leak", "en": "Evidence did not prove it", "ne": "प्रमाणले पुष्टि गरेन"},
            {"v": 11, "tone": "leak2", "en": "Not the offence charged", "ne": "अभियोग लगाएको कसुर नै होइन"},
            {"v": 5, "tone": "leak3", "en": "CIAA investigation flaw", "ne": "अख्तियारको अनुसन्धानमा त्रुटि"},
            {"v": 2, "tone": "mute", "en": "Sting-money ruling", "ne": "स्टिङ रकमसम्बन्धी फैसला"},
        ], "foot": {"en": "Trial court blamed: 0", "ne": "तल्लो अदालतलाई दोष: ०"}},
        ne="अदालतले सफाइ दिँदा प्रायः अभियोग पुष्टि भएन वा अपराध नै होइन भन्छ; कहिलेकाहीँ अख्तियारले छानीछानी मुद्दा चलायो भन्छ",
        short_en="Of {{read}} acquittals read: evidence not enough {{evid}}, not the offence {{charge}}, CIAA investigation flaw {{inv}}. Selective charging relied on in {{selective}} judgments.",
        short_ne="पढिएका {{read}} सफाइमा: प्रमाण अपुग {{evid}}, कसुर नै होइन {{charge}}, अनुसन्धानमा त्रुटि {{inv}}। छानेर मुद्दा चलाएको आधार {{selective}} फैसलामा।",
    ),
    "notAppealed": dict(
        stage="lodged",
        big={"value": "{{pct}}", "en": "of acquittals ({{none}} of {{judgeable}}) have no government appeal on record. No reason published.",
             "ne": "सफाइ ({{judgeable}} मध्ये {{none}}) मा सरकारी पुनरावेदन भेटिएन। कारण प्रकाशित छैन।"},
        viz={"type": "waffle", "parts": [
            {"v": ap["acquittals"]["noAppeal"], "tone": "leak", "en": "No appeal found", "ne": "पुनरावेदन भेटिएन"},
            {"v": ap["acquittals"]["judgeable"] - ap["acquittals"]["noAppeal"], "tone": "mute", "en": "Appealed (or weak link)", "ne": "पुनरावेदन भएको (वा कमजोर लिंक)"},
        ], "total": ap["acquittals"]["judgeable"]},
        ne="करिब ५ मा १ सफाइमा सरकारले पुनरावेदन नै गर्दैन, र कारण सार्वजनिक गरिँदैन",
        short_en="{{none}} of {{judgeable}} acquittals old enough to judge ({{pct}}) have no government appeal in any record.",
        short_ne="हेर्न मिल्ने {{judgeable}} सफाइमध्ये {{none}} ({{pct}}) मा कुनै सरकारी पुनरावेदन भेटिएन।",
    ),
    "noLink": dict(
        stage="lodged",
        big={"value": "{{unlinked}}", "en": "of {{all}} appeals could not be linked to any trial, even by hand",
             "ne": "पुनरावेदन ({{all}} मध्ये) कुनै पनि मुद्दासँग जोड्न सकिएन, हातैले खोज्दा पनि"},
        viz={"type": "waffle", "parts": [
            {"v": 726, "tone": "leak", "en": "Not linked to a trial", "ne": "मुद्दासँग नजोडिएका"},
            {"v": 4430 - 726, "tone": "mute", "en": "Linked by hand", "ne": "हातैले जोडिएका"},
        ], "total": 4430, "check": ["unlinked", "all"]},
        ne="जनताले कुनै मुद्दालाई विशेष अदालतदेखि पुनरावेदनसम्म पछ्याउन सक्दैनन्",
        short_en="No public record says which trial an appeal comes from; {{unlinked}} of {{all}} appeals stay unlinked.",
        short_ne="कुन पुनरावेदन कुन मुद्दाबाट आयो भन्ने सार्वजनिक अभिलेख छैन; {{all}} मध्ये {{unlinked}} जोडिएनन्।",
    ),
    "oneWay": dict(
        stage="decided",
        big={"value": "{{defPct}} · {{govPct}}", "en": "convictions overturned when the convicted appeal · acquittals overturned when the government appeals",
             "ne": "दोषीले पुनरावेदन गर्दा ठहर उल्टियो · सरकारले पुनरावेदन गर्दा सफाइ उल्टियो"},
        viz={"type": "bars", "rows": [
            {"v": 230, "of": 567, "tone": "leak", "en": "Convicted person appeals: conviction overturned", "ne": "दोषीको पुनरावेदन: ठहर उल्टियो"},
            {"v": 4, "of": 420, "tone": "leak", "en": "Government appeals: acquittal overturned", "ne": "सरकारको पुनरावेदन: सफाइ उल्टियो"},
        ], "check": [["defRev", "defDec"], ["govRev", "govDec"]]},
        ne="पुनरावेदन एकतर्फी: दोषी ठहर प्रायः उल्टिन्छ, सफाइ लगभग कहिल्यै उल्टिँदैन",
        short_en="Convictions fully overturned in {{defRev}} of {{defDec}} trials; government wins {{govRev}} of {{govDec}} acquittal appeals.",
        short_ne="{{defDec}} मध्ये {{defRev}} मुद्दामा ठहर पूरै उल्टियो; सफाइविरुद्ध सरकारले {{govDec}} मध्ये {{govRev}} मा मात्र जित्यो।",
    ),
    "whyLost": dict(
        stage="decided",
        big={"value": "{{inv}} of {{read}}", "value_ne": "{{read}} मा {{inv}}",
             "en": "overturned convictions we read: the Supreme Court pointed to the investigation",
             "ne": "हामीले पढेका उल्टिएका ठहरमा सर्वोच्चले अनुसन्धानलाई औंल्यायो"},
        viz={"type": "stack", "total": 16, "check": ["read"], "parts": [
            {"v": 7, "tone": "leak", "en": "The investigation", "ne": "अनुसन्धान"},
            {"v": 6, "tone": "leak2", "en": "CIAA-supplied bribe money", "ne": "अख्तियारले नै दिएको घुस रकम"},
            {"v": 3, "tone": "leak3", "en": "The charge", "ne": "अभियोग"},
        ], "foot": {"en": "Cites the 2021 sting ruling → overturned: {{stingPct}}", "ne": "२०२१ को स्टिङ फैसला उद्धृत → उल्टियो: {{stingPct}}"}},
        ne="उल्टिएका ठहर प्रायः अनुसन्धान र प्रमाणका कारण असफल हुन्छन्, तल्लो अदालतका न्यायाधीशको गल्तीले होइन",
        short_en="Of {{read}} overturned convictions read: investigation {{inv}}, CIAA-supplied bribe money {{sting}}, the charge {{charge}}.",
        short_ne="पढिएका {{read}} उल्टिएका ठहरमा: अनुसन्धान {{inv}}, अख्तियारले दिएको घुस रकम {{sting}}, अभियोग {{charge}}।",
    ),
    "duration": dict(
        stage="decided",
        big={"value": "{{km}}", "unit_en": "years", "unit_ne": "वर्ष",
             "en": "typical wait for a Supreme Court appeal (registered {{from}}–{{to}}, counting those still open)",
             "ne": "सर्वोच्चमा पुनरावेदनको सामान्य पर्खाइ ({{from}}–{{to}} मा दर्ता, बाँकी समेत गन्दा)"},
        viz={"type": "histo", "unit_en": "years to decide", "unit_ne": "फैसला हुन लागेको वर्ष",
             "bands": [{"label": ("8+" if b["to"] >= 99 else f'{b["from"]}–{b["to"]}'), "v": b["cases"], "tone": ("leak" if b["from"] >= 6 else "mute")} for b in sd["bands"]],
             "en": "Decided appeals by years taken; red: over six", "ne": "फैसला भएका पुनरावेदन, लागेको वर्षअनुसार; रातो: छ वर्षभन्दा बढी"},
        ne="पुनरावेदनमा करिब चार वर्ष लाग्छ, र चारमा एकभन्दा बढीमा छ वर्षभन्दा बढी",
        short_en="Half of appeals registered {{from}}–{{to}} took over {{km}} years; {{over6}} of decided ones took over six.",
        short_ne="{{from}}–{{to}} मा दर्ता पुनरावेदनमध्ये आधामा {{km}} वर्षभन्दा बढी लाग्यो; फैसला भएकामध्ये {{over6}} मा छ वर्षभन्दा बढी।",
    ),
    "hearings": dict(
        stage="decided",
        big={"value": "{{notPct}}", "en": "of {{listings}} scheduled hearings ended without the bench taking up the appeal",
             "ne": "तोकिएका {{listings}} पेशीमध्ये इजलासले पुनरावेदन नहेरी सकिए"},
        viz={"type": "waffle", "parts": [
            {"v": 77, "tone": "leak", "en": "Not taken up", "ne": "नहेरिएका"},
            {"v": 23, "tone": "mute", "en": "Taken up", "ne": "हेरिएका"},
        ], "total": 100, "check": ["notPct"]},
        ne="तोकिएका ४ मध्ये करिब ३ पेशी हुँदैनन्, प्रायः अदालतकै कारणले",
        short_en="{{notPct}} of {{listings}} listings ended without a hearing; in {{courtShare}} of those the reason was on the court's side.",
        short_ne="{{listings}} पेशीमध्ये {{notPct}} मा सुनुवाइ भएन; तीमध्ये {{courtShare}} मा कारण अदालतकै तर्फबाट थियो।",
    ),
    "neverListed": dict(
        stage="decided",
        big={"value": "{{never}}", "en": "open appeals have never once been listed for a hearing ({{pct}} of {{pending}})",
             "ne": "खुला पुनरावेदन एक पटक पनि पेशीमा चढेका छैनन् ({{pending}} को {{pct}})"},
        viz={"type": "waffle", "parts": [
            {"v": 730, "tone": "leak", "en": "Never listed", "ne": "कहिल्यै पेशी नचढेका"},
            {"v": 1890 - 730, "tone": "mute", "en": "Listed at least once", "ne": "कम्तीमा एक पटक पेशी"},
        ], "total": 1890, "check": ["never", "pending"]},
        ne="७३० खुला पुनरावेदन एक पटक पनि पेशीमा चढेका छैनन्",
        short_en="{{never}} of {{pending}} open appeals have never been listed; they have waited a median of {{months}} months.",
        short_ne="{{pending}} खुला पुनरावेदनमध्ये {{never}} कहिल्यै पेशीमा चढेनन्; औसत (मध्यिका) {{months}} महिनादेखि पर्खिरहेका।",
    ),
    "arson": dict(
        stage="decided",
        big={"value": "{{lost}}", "en": "open appeals still marked “file destroyed, not recovered” 14 months after the Supreme Court fire",
             "ne": "खुला पुनरावेदन सर्वोच्चमा आगजनी भएको १४ महिनापछि पनि “मिसिल नष्ट, फेला नपरेको”"},
        viz={"type": "columns", "unit": "%", "rows": [
            {"v": 17, "en": "Year before the drive", "ne": "अभियानअघिको वर्ष", "tone": "mute"},
            {"v": 33, "en": "14 months before the fire", "ne": "आगजनीअघिका १४ महिना", "tone": "mute"},
            {"v": 15, "en": "14 months after", "ne": "आगजनीपछिका १४ महिना", "tone": "leak"},
        ], "check": ["yearBefore", "before", "after"],
            "en": "Share of pending appeals decided", "ne": "बाँकी पुनरावेदनमध्ये फैसला भएको अंश"},
        ne="सेप्टेम्बर २०२५ को आगजनीपछि ८६५ खुला पुनरावेदनको मिसिल छैन, र फैसला आधाभन्दा बढीले घटेको छ",
        short_en="{{lost}} files still destroyed; {{notListedPct}} of them not listed since. Decisions fell from {{before}} to {{after}} of pending appeals.",
        short_ne="{{lost}} मिसिल अझै नष्ट; तीमध्ये {{notListedPct}} त्यसयता पेशीमा चढेनन्। फैसला {{before}} बाट {{after}} मा झर्‍यो।",
    ),
    "recovery": dict(
        stage="recovery",
        big={"value": "{{share}}", "en": "of the courts' fine ledger (all kinds of case) is cleared in a year. For corruption, no figure exists.",
             "ne": "अदालतको दण्ड-जरिवाना लगत (सबै मुद्दा) वर्षमा फछ्र्यौट हुन्छ। भ्रष्टाचारको तथ्यांक नै छैन।"},
        viz={"type": "absent", "en": "Recovered from corruption judgments: not published by anyone.",
             "ne": "भ्रष्टाचारका फैसलाबाट असुली: कसैले प्रकाशित गर्दैन।"},
        ne="भ्रष्टाचारका फैसलाबाट कति रकम असुल भयो, कसैले प्रकाशित गर्दैन",
        short_en="The courts publish one fine ledger for every kind of case; about {{share}} of it is cleared in a year.",
        short_ne="अदालतले सबै मुद्दाको एउटै दण्ड-जरिवाना लगत प्रकाशित गर्छ; त्यसको करिब {{share}} भाग वर्षमा फछ्र्यौट हुन्छ।",
    ),
}

# Plain Nepali for the fraction-style figures, so "6 in 10" reads naturally.
NE_PHRASE = {"6 in 10": "१० मा ६", "3 in 100": "१०० मा ३", "1 in 5": "५ मा १", "1 in 4": "४ मा १",
             "1 in 2": "२ मा १", "1 in 3": "३ मा १", "3 in 4": "४ मा ३", "1 in 9": "९ मा १",
             "two months": "दुई महिना", "7 November 2026": "७ नोभेम्बर २०२६", "865 crore": "८६५ करोड"}

DEV = str.maketrans("0123456789", "०१२३४५६७८९")


def ne_val(s):
    s = NE_PHRASE.get(s, s)
    return s.translate(DEV)


def fill(text, values, key, ne=False):
    def sub(m):
        k = m.group(1)
        if k not in values:
            raise KeyError(f"{key}: no figure for {{{{{k}}}}}")
        return ne_val(values[k]) if ne else values[k]
    out = re.sub(r"\{\{(\w+)\}\}", sub, text)
    return out.translate(DEV) if ne else out


GAP = {
    "A": {"en": "Gap in the system", "ne": "प्रणालीको कमी",
          "long_en": "The institution does not record, publish, act or explain. Checked at the original source.",
          "long_ne": "संस्थाले अभिलेख राख्दैन, प्रकाशित गर्दैन, कदम चाल्दैन वा कारण बताउँदैन। मूल स्रोतमै जाँचिएको।"},
    "A→B": {"en": "Gap in the system, which also limits this research", "ne": "प्रणालीको कमी, जसले यो अनुसन्धानलाई पनि सीमित गर्छ",
            "long_en": "The institutional gap is the finding; what it hides from us is stated as a limit of this research.",
            "long_ne": "संस्थागत कमी नै निष्कर्ष हो; त्यसले हामीबाट लुकाएको कुरा यस अनुसन्धानको सीमाका रूपमा उल्लेख छ।"},
    "leak+A": {"en": "Measured leak; what it costs is not published", "ne": "मापन गरिएको चुहावट; यसको लागत प्रकाशित छैन",
               "long_en": "The leak is measured from the court record. Its cost is not published, which is a gap in the system.",
               "long_ne": "चुहावट अदालतको अभिलेखबाट मापन गरिएको हो। यसको लागत प्रकाशित छैन, जुन प्रणालीको कमी हो।"},
    "B": {"en": "Limit of this research", "ne": "यस अनुसन्धानको सीमा",
          "long_en": "A limit of our data, tools, time, sample or reading. Never a failing of the CIAA, the courts or the government.",
          "long_ne": "हाम्रो तथ्यांक, औजार, समय, नमुना वा पढाइको सीमा। यो अख्तियार, अदालत वा सरकारको कमजोरी होइन।"},
}


# Option 6, the funnel. No public record follows one complaint to the Supreme Court, so
# the funnel takes one year's complaints (CIAA 35th annual report, FY2081/82) and applies
# each later stage's measured rate: the Special Court's conviction rate for CIAA cases
# (lossRate) and the rate at which a conviction survives the convicted person's appeal
# (oneWay). Court stages count cases, not people. Estimates are flagged `est`.
def _hf_fig(key, name):
    f = next(f for st in HF["stages"] for f in st["findings"] if f["key"] == key)
    return int(f["figures"][name].replace(",", ""))


def _split(parts, per, stands):
    raw = [per(v) for _, v, _ in parts]
    fl = [int(x) for x in raw]
    for i in sorted(range(len(raw)), key=lambda i: raw[i] - fl[i], reverse=True)[: 10000 - sum(fl)]:
        fl[i] += 1
    assert sum(fl) == 10000 and fl[-1] == stands, (fl, stands)
    return [{"key": k, "per10k": n, "est": est} for (k, _, est), n in zip(parts, fl)]


def build_funnel():
    cv = ap["convictedVsConviction"]
    lr_dec, lr_acq = _hf_fig("lossRate", "decided"), _hf_fig("lossRate", "acq")
    conv_rate = (lr_dec - lr_acq) / lr_dec
    stand_rate = (cv["decided"] - cv["reversed"]) / cv["decided"]
    convicted_cases = RG["outcome"]["convicted"] + RG["outcome"]["partial"]
    appealed_share = cv["trials"] / convicted_cases
    c0, c1, c2 = cd["registered_new"], cd["investigations_completed"] or cd["to_investigation"], cd["inv_filed"]
    # The site's own funnel (AccountabilityFunnel) uses the same three CIAA counts (2081/82).
    if not NEW: assert [c0, c1, c2] == [s["count"] for s in RG["funnel"][:3]]
    c3 = c2 * conv_rate
    c4 = c3 * stand_rate
    c4_hi = c3 * (1 - appealed_share * (1 - stand_rate))  # if unappealed convictions all stand
    fys = RG["corpus"]["fiscalYears"]
    assert fys == list(range(min(fys), max(fys) + 1)), "the court data's filing years are one unbroken run"
    per = lambda c: c / c0 * 10000
    pct = lambda c: f"{c / c0 * 100:.2f}%"
    v = {
        "fy": cd["fy"], "fyOld": CD_OLD["fy"], "sent": "1" if NEW else "", "complaints": n(c0), "onBooks": n(cd["total_complaints"]),
        "investigated": n(c1), "filed": n(c2),
        "lrDec": n(lr_dec), "lrConv": n(lr_dec - lr_acq), "convRate": f"{round(conv_rate * 100)}%",
        "apDec": n(cv["decided"]), "apStand": n(cv["decided"] - cv["reversed"]), "apPartial": n(cv["partialOnly"]), "standRate": f"{round(stand_rate * 100)}%",
        "special": n(round(c3)), "supreme": n(round(c4)),
        "end": n(round(per(c4))), "endPct": pct(c4), "endHi": n(round(per(c4_hi))), "endHiPct": pct(c4_hi),
        "appealedShare": f"{round(appealed_share * 10)} in 10",
        # The period of the court data behind both court rates: the fiscal years of filing.
        "courtFrom": f"{min(fys)}/{(min(fys) + 1) % 100:02d}", "courtYears": str(len(fys)),
    }
    S = [
        ("complaints", "ciaa", c0, False, ["tracking"],
         "Complaint", "उजुरी",
         "new complaints registered with the CIAA in one year ({{fy}})", "एक वर्ष ({{fy}}) मा अख्तियारमा दर्ता भएका नयाँ उजुरी",
         "With last year's backlog, {{onBooks}} were on its books.", "अघिल्लो वर्षको बाँकीसहित {{onBooks}} उजुरी थिए।"),
        ("investigated", "ciaa", c1, False, ["shelved", "backlog"],
         "Full investigation", "विस्तृत अनुसन्धान",
         "full investigations the CIAA finished that year", "सो वर्ष अख्तियारले सकेको विस्तृत अनुसन्धान",
         "The rest were closed at screening, sent elsewhere, or are still waiting.", "बाँकी छानबिनमै तामेली भए, अन्यत्र पठाइए, वा अझै पर्खिरहेका छन्।"),
        ("charged", "ciaa", c2, False, ["afterInvestigation"],
         "Decision to charge", "मुद्दा चलाउने निर्णय",
         "cases the CIAA took to the Special Court", "अख्तियारले विशेष अदालतमा लगेका मुद्दा",
         "The CIAA's own figures stop here.", "अख्तियारको आफ्नै तथ्यांक यहीँ सकिन्छ।"),
        ("special", "special", c3, True, ["lossRate", "whyAcquitted", "whoConvicted"],
         "Special Court", "विशेष अदालत",
         "cases end with at least one person convicted", "मुद्दामा कम्तीमा एक जना दोषी ठहर",
         "{{convRate}} of decided CIAA cases ({{lrConv}} of {{lrDec}}) end with a conviction.", "फैसला भएका अख्तियारका मुद्दामध्ये {{convRate}} ({{lrDec}} मध्ये {{lrConv}}) मा ठहर हुन्छ।"),
        ("supreme", "supreme", c4, True, ["notAppealed", "noLink", "oneWay", "whyLost", "duration", "hearings", "neverListed", "arson"],
         "Supreme Court", "सर्वोच्च अदालत",
         "convictions still stand after appeal", "ठहर पुनरावेदनपछि पनि कायम",
         "When the convicted person appeals, the conviction stands in {{standRate}} ({{apStand}} of {{apDec}}).", "दोषीले पुनरावेदन गर्दा {{standRate}} ({{apDec}} मध्ये {{apStand}}) मा ठहर कायम रहन्छ।"),
        ("recovery", "none", None, False, ["recovery"],
         "Money recovered", "रकम असुली",
         "No one publishes how much money comes back from corruption judgments.", "भ्रष्टाचारका फैसलाबाट कति रकम फिर्ता आयो, कसैले प्रकाशित गर्दैन।",
         "", ""),
    ]
    stages = []
    for key, inst, count, est, gaps, name_en, name_ne, lab_en, lab_ne, note_en, note_ne in S:
        stages.append({
            "key": key, "inst": inst, "count": None if count is None else round(count), "est": est, "gaps": gaps,
            "per10k": None if count is None else round(per(count)),
            "name": {"en": name_en, "ne": name_ne},
            "label": {"en": fill(lab_en, v, key), "ne": fill(lab_ne, v, key, ne=True)},
            "note": {"en": fill(note_en, v, key), "ne": fill(note_ne, v, key, ne=True)},
        })
    placed = [g for s in stages for g in s["gaps"]]
    assert sorted(placed) == sorted(D) and len(placed) == len(set(placed)), "every finding sits on exactly one funnel stage"
    T = lambda en, ne: {"en": fill(en, v, "funnel"), "ne": fill(ne, v, "funnel", ne=True)}
    return {
        "values": v,
        "stages": stages,
        "end": {"per10k": round(per(c4)), "per10kHi": round(per(c4_hi)), "pct": {"en": v["endPct"], "ne": ne_val(v["endPct"])}},
        # The end grid's 10,000 squares, split by where each complaint drops out (largest
        # remainder, so the parts add up to exactly 10,000 and "stands" matches the end figure).
        "split": _split([("never", c0 - c1, False), ("noCase", c1 - c2, False), ("trial", c2 - c3, True), ("overturned", c3 - c4, True), ("stands", c4, True)], per, round(per(c4))),
        "copy": {
            "endLine": T("About {{end}} in every 10,000 complaints end in a conviction that still stands after the Supreme Court. That is fewer than 2 in 1,000.",
                         "हरेक १०,००० उजुरीमध्ये करिब {{end}} मात्र सर्वोच्च अदालतपछि पनि कायम रहने ठहरमा पुग्छन्। अर्थात् १,००० मा २ भन्दा कम।"),
            "method": [
                T("No public record lets anyone follow one complaint all the way to the Supreme Court. That is one of the gaps. So we take one year's complaints and apply each stage's measured rate.",
                  "कुनै एक उजुरीलाई सर्वोच्च अदालतसम्म पछ्याउन मिल्ने सार्वजनिक अभिलेख छैन। यो आफैंमा एउटा कमी हो। त्यसैले हामीले एक वर्षका उजुरी लिएर हरेक चरणको नापिएको दर लागू गरेका छौं।"),
                T("{{complaints}} new complaints, {{investigated}} full investigations finished and {{filed}} cases taken to court are the CIAA's own figures for {{fy}} (35th annual report).",
                  "{{complaints}} नयाँ उजुरी, {{investigated}} सकिएका विस्तृत अनुसन्धान र अदालत लगिएका {{filed}} मुद्दा अख्तियारकै {{fy}} का तथ्यांक हुन् (३५औं वार्षिक प्रतिवेदन)।"),
                T("Special Court: {{lrConv}} of {{lrDec}} decided CIAA cases ({{convRate}}) ended with at least one person convicted. Supreme Court: when a convicted person appealed, the conviction stood in {{apStand}} of {{apDec}} decided appeals ({{standRate}}). Both come from the court record over many years.",
                  "विशेष अदालत: फैसला भएका अख्तियारका {{lrDec}} मुद्दामध्ये {{lrConv}} ({{convRate}}) मा कम्तीमा एक जना दोषी ठहरिए। सर्वोच्च अदालत: दोषीले पुनरावेदन गर्दा फैसला भएका {{apDec}} मध्ये {{apStand}} ({{standRate}}) मा ठहर कायम रह्यो। दुवै धेरै वर्षको अदालती अभिलेखबाट।"),
                T("So this shows the system's odds, not one group of complaints followed through: complaints and finished investigations in a year are different events, and the court rates come from earlier cases. Court stages count cases, not people. If every conviction that nobody appealed also stands (about {{appealedShare}} convictions have an appeal on record), the end figure is about {{endHi}} in 10,000 ({{endHiPct}}).",
                  "त्यसैले यसले प्रणालीको सम्भावना देखाउँछ, उजुरीको एउटै समूह अन्त्यसम्म पछ्याएको होइन: एक वर्षका उजुरी र सकिएका अनुसन्धान फरक घटना हुन्, र अदालतका दर पहिलेका मुद्दाबाट लिइएका हुन्। अदालतका चरणले मुद्दा गन्छन्, व्यक्ति होइन। पुनरावेदन नभएका सबै ठहर पनि कायम रहन्छन् भने (करिब {{appealedShare}} ठहरमा पुनरावेदन अभिलेखमा छ), अन्तिम अंक १०,००० मा करिब {{endHi}} ({{endHiPct}}) हुन्छ।"),
            ],
        },
    }


# Two-to-five-word names for the funnel's side cards; `pill` overrides the big number
# where it would mislead out of context (recovery's 1 in 9 is the all-case fine ledger).
TAGS = {
    "tracking": ("No way to track a complaint", "उजुरी पछ्याउने उपाय छैन"),
    "shelved": ("Closed with no reason given", "कारण नखुलाई तामेली"),
    "backlog": ("Waiting, nobody says how long", "कति समयदेखि पर्खिरहेका, कसैले भन्दैन"),
    "afterInvestigation": ("Closed even after a full investigation", "पूर्ण अनुसन्धानपछि पनि तामेली"),
    "lossRate": ("Everyone acquitted", "सबैलाई सफाइ"),
    "whyAcquitted": ("Evidence did not prove the charge", "प्रमाणले अभियोग पुष्टि गरेन"),
    "whoConvicted": ("Who was convicted is not shown", "को दोषी ठहरियो, देखाइँदैन"),
    "notAppealed": ("Acquittal never appealed", "सफाइमा पुनरावेदन नै भएन"),
    "noLink": ("Appeal can't be traced to its trial", "पुनरावेदन कुन मुद्दाको, पत्ता लाग्दैन"),
    "oneWay": ("Appeals go one way", "पुनरावेदन एकतर्फी"),
    "whyLost": ("Overturned over the investigation", "अनुसन्धानकै कारण उल्टियो"),
    "duration": ("Years of waiting", "वर्षौंको पर्खाइ"),
    "hearings": ("Hearings that don't happen", "नहुने पेशी"),
    "neverListed": ("Never once listed for a hearing", "कहिल्यै पेशीमा नचढेका"),
    "arson": ("Files lost in the court fire", "आगजनीमा मिसिल नष्ट"),
    "recovery": ("No one publishes what is recovered", "असुली कसैले प्रकाशित गर्दैन"),
}
PILL = {"recovery": "?"}


def main():
    findings = []
    stage_inst = {s["key"]: s["inst"] for s in STAGES}
    for st in HF["stages"]:
        for f in st["findings"]:
            k = f["key"]
            d = D[k]
            values = {**f.get("figures", {}), **GENERATED.get(k, {})}
            big = d["big"]
            rec = {
                "key": k,
                "stage": d["stage"],
                "inst": stage_inst[d["stage"]],
                "gap": f["gap"],
                "headline": {"en": f["headline"], "ne": d["ne"]},
                "short": {"en": fill(d["short_en"], values, k), "ne": fill(d["short_ne"], values, k, ne=True)},
                "big": {
                    "value": {"en": fill(big["value"], values, k),
                              "ne": fill(big.get("value_ne", big["value"]), values, k, ne=True)},
                    "unit": {"en": big.get("unit_en", ""), "ne": big.get("unit_ne", "")},
                    "label": {"en": fill(big["en"], values, k), "ne": fill(big["ne"], values, k, ne=True)},
                },
                "viz": json.loads(fill(json.dumps(d["viz"], ensure_ascii=False), values, k)),
                "explain": fill(f["explain"], values, k),
                "caveat": " ".join(x for x in [f.get("caveat", ""), d.get("caveat_add", "")] if x),
                "source": f["source"],
                "href": "https://research.jawafdehi.org" + f["href"],
                "tag": {"en": TAGS[k][0], "ne": TAGS[k][1]},
            }
            if k in PILL:
                rec["pill"] = PILL[k]
            # Nepali copies of the viz strings that carry figures.
            for part in ("sub", "foot"):
                if part in d["viz"]:
                    rec["viz"][part]["ne"] = fill(d["viz"][part]["ne"], values, k, ne=True)
            if d["viz"]["type"] == "slope":
                for end in ("from", "to"):
                    rec["viz"][end]["label_ne"] = fill(d["viz"][end]["label"], values, k, ne=True)
            findings.append(rec)

    # Sanity checks: chart counts that restate a figure must match it.
    by = {f["key"]: f for f in findings}
    assert by["oneWay"]["viz"]["rows"][0]["v"] == ap["convictedVsConviction"]["reversed"]
    assert by["oneWay"]["viz"]["rows"][0]["of"] == ap["convictedVsConviction"]["decided"]
    assert by["oneWay"]["viz"]["rows"][1]["v"] == ap["governmentVsAcquittal"]["reversed"]
    assert by["oneWay"]["viz"]["rows"][1]["of"] == ap["governmentVsAcquittal"]["decided"]
    figs = {f["key"]: f.get("figures", {}) for st in HF["stages"] for f in st["findings"]}
    num = lambda s: int(s.replace(",", "").replace("%", ""))
    assert by["lossRate"]["viz"]["parts"][0]["v"] == num(figs["lossRate"]["acq"])
    assert by["lossRate"]["viz"]["total"] == num(figs["lossRate"]["decided"])
    assert by["whoConvicted"]["viz"]["parts"][0]["v"] == num(figs["whoConvicted"]["people"])
    assert by["whoConvicted"]["viz"]["total"] == num(figs["whoConvicted"]["all"])
    assert by["noLink"]["viz"]["total"] == num(figs["noLink"]["all"])
    assert by["neverListed"]["viz"]["parts"][0]["v"] == num(figs["neverListed"]["never"])
    assert by["neverListed"]["viz"]["total"] == num(figs["neverListed"]["pending"])
    assert by["hearings"]["viz"]["parts"][0]["v"] == num(figs["hearings"]["notPct"])
    wa = figs["whyAcquitted"]
    assert [p["v"] for p in by["whyAcquitted"]["viz"]["parts"][:3]] == [num(wa["evid"]), num(wa["charge"]), num(wa["inv"])]
    wl = figs["whyLost"]
    assert [p["v"] for p in by["whyLost"]["viz"]["parts"]] == [num(wl["inv"]), num(wl["sting"]), num(wl["charge"])]
    ar = figs["arson"]
    assert [r["v"] for r in by["arson"]["viz"]["rows"]] == [num(ar["yearBefore"]), num(ar["before"]), num(ar["after"])]
    assert num(figs["shelved"]["shelved"]) == cd["tameli"] + cd["tameli_with_advice"]
    assert num(figs["backlog"]["carried"]) == cd["pending_out"]

    out = {
        "source": {"repo": "Jawafdehi/corruption-research", "branch": "research/where-accountability-leaks",
                   "commit": COMMIT, "files": ["site/src/data/headline-findings.json", "site/src/data/report.generated.json"],
                   "status": HF["status"]},
        "stages": STAGES,
        "institutions": INSTITUTIONS,
        "gap": GAP,
        "findings": findings,
        "funnel": build_funnel(),
    }
    js = "/* Generated by build_data.py from %s@%s. Do not edit by hand. */\nwindow.JW = %s;\n" % (
        out["source"]["branch"], COMMIT, json.dumps(out, ensure_ascii=False, indent=1))
    (REPO / "site/public/home/findings.js").write_text(js, encoding="utf-8")
    print(f"wrote findings.js: {len(findings)} findings, {len(STAGES)} stages")


if __name__ == "__main__":
    main()
