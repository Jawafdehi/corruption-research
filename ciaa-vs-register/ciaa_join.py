"""Name matching between the CIAA's annual-report filing tables and the Special Court register.

The two sources share no key. The CIAA's per-case filing tables print the accused's name,
the decision date and the filing date; the early high-divergence years print no case number
at all. And a case number would not help anyway -- see the note on `-CR-` numbering below.
So the join is on names, and Nepali names are spelled inconsistently across the two records.

Two pieces live here:

  fold(s)          normalise a Devanagari name so spelling variants collapse to one form
  match(a, b)      the four-rule ladder, returning the rule that produced each pair

Both are deliberately separate from `corpus_data.py`: that module owns the API-derived
corpus, this one owns a PDF-extraction join. They share no state.

TRAP -- `-CR-` case numbers are shared across three tiers of court. The same
`NNN-CR-NNNN` format is used by the Special Court, the Supreme Court and the district
courts, so a number lifted out of its column in a report resolves to the wrong case. Of
1,636 distinct numbers printed across the 13 reports, 1,080 are Special Court, 404 are
Supreme Court and ~45 are district. A case number is never a join key here.

TRAP -- the register spells false-statement cases `झुठ्ठा विवरण पेश गरेको`, with `ठ्ठ`.
The obvious substring filter (`झुठा`) misses all 44 of them, and at least one is a case the
CIAA prints in its own fake-certificate table. Any category comparison that uses
`नक्कली प्रमाण पत्र` alone is working with an incomplete bucket.

TRAP -- count surplus per CASE, not per defendant row. A multi-defendant docket that
matched on one name is not a case the CIAA failed to list; counting rows invents one.
"""

from __future__ import annotations

import re
import unicodedata
from difflib import SequenceMatcher

# Devanagari letter pairs that Nepali records use interchangeably for the same name.
# Folding is deliberately aggressive: a false merge shows up as a duplicate match and gets
# caught by the serial-completeness check, whereas a missed merge silently becomes a
# "missing" case and corrupts the finding.
_EQUIV = (
    ("ी", "ि"), ("ू", "ु"), ("ब", "व"), ("ष", "श"), ("स", "श"), ("ई", "इ"), ("ऊ", "उ"),
    ("झ", "ज"), ("ढ", "द"), ("ड", "द"), ("ठ", "त"), ("थ", "त"), ("घ", "ग"), ("ख", "क"),
    ("छ", "च"), ("फ", "प"), ("भ", "व"), ("ण", "न"), ("ऋ", "रि"),
)

_PUNCT = re.compile(r"[\(\)।.,'\"‌‍​]")


def fold(s: str) -> str:
    """Collapse a Devanagari name to a spelling-insensitive form.

    Strips punctuation and zero-width joiners, folds the interchangeable letter pairs,
    drops the virama and the nasal marks, and removes all whitespace -- so
    `तुलसीराम ढुंगाना` and `तुलसीराम ढुङ्गाना` land on the same string.
    """
    s = unicodedata.normalize("NFC", s or "")
    s = _PUNCT.sub("", s)
    s = s.replace("ङ्", "ं").replace("न्", "ं").replace("्", "")
    for a, b in _EQUIV:
        s = s.replace(a, b)
    s = s.replace("ं", "").replace("ँ", "").replace("़", "")
    return re.sub(r"\s+", "", s)


def _tokens(s: str) -> list[str]:
    """Fold each name part separately.

    Punctuation is a SEPARATOR here, not something to delete. The register writes alternate
    caste names in parentheses -- `नन्दु कुमार सुमन(तेली)`, `पुरुषोत्तम के.सी.(कार्की क्षेत्री)` --
    so deleting the brackets glues the alternate onto the preceding token and the token-subset
    rule stops seeing that the CIAA's shorter name is contained in the register's longer one.
    """
    s = unicodedata.normalize("NFC", s or "")
    s = re.sub(r"[\(\)।.,'\"/-]+", " ", s)
    return [fold(t) for t in s.split() if fold(t)]


def _ratio(a: str, b: str) -> float:
    return SequenceMatcher(None, a, b).ratio()


# Rules are tried in order and the FIRST hit wins, so the name of the rule that matched is
# itself a confidence level: `exact` needs no review, `fuzzy` deserves a second look. Every
# published pair carries its rule in the `match_rule` column for exactly that reason.
SURNAME_GIVEN_MIN = 0.70
FUZZY_MIN = 0.82


def match(ciaa_name: str, register_name: str) -> str | None:
    """Return the rule that matches these two names, or None.

    exact          identical once folded
    subset         one name's tokens are a subset of the other's (a dropped middle name,
                   an added caste name, a title)
    surname_given  first token equal and last token close -- the common case where a caste
                   name is replaced by a clan or occupational alternate
    fuzzy          whole folded strings similar enough
    """
    a, b = fold(ciaa_name), fold(register_name)
    if not a or not b:
        return None
    if a == b:
        return "exact"

    ta, tb = set(_tokens(ciaa_name)), set(_tokens(register_name))
    if ta and tb and (ta <= tb or tb <= ta):
        return "subset"

    la, lb = _tokens(ciaa_name), _tokens(register_name)
    if len(la) >= 2 and len(lb) >= 2 and la[0] == lb[0] and _ratio(la[-1], lb[-1]) >= SURNAME_GIVEN_MIN:
        return "surname_given"

    if _ratio(a, b) >= FUZZY_MIN:
        return "fuzzy"
    return None


# What the ladder cannot do, and how the residue was actually settled.
#
# Three pairs across the three years matched on neither name nor ladder rule, because the
# differing token was a caste alternate that appears nowhere else in the report. They were
# resolved on the DATE: in every accepted pair the filing date the report prints equals the
# register's registration date to the day, and the alternate token appears nowhere else in
# that report, so there is no competing candidate. Those pairs are published as
# `manual_verified` so a reader who rejects the reasoning can drop them and re-derive the
# totals without them. Two further cases are `manual_verified_other_casetype`: the CIAA
# lists them as fake-certificate, the register files them under a different offence label.
#
# COMPLETENESS TEST for an extraction, and it is not optional: the serials must run 1..N
# with no gaps AND N must equal the category total the report publishes about itself
# (70, 96, 88 for the three years here). A plausible-looking extraction that fails either
# half is silently short, and a short CIAA side manufactures "surplus" register cases.
#
# PROVING A SURPLUS CASE IS GENUINELY UNLISTED needs the whole text of every report folded
# and searched for the full name and then each token separately -- common name components
# appear everywhere, so a naive substring test yields false positives (all six "hits" among
# the nine unexplained cases turned out to be different people). And absence proves nothing
# in a scrambled conversion: the 2079-80, 2080-81 and 2081-82 markdown carries 1,000-1,600
# scramble markers (`दरुु`, `अनसु`, `तनर्`, `ऩ`) because likhit silently fell back to plain
# MarkItDown for those reports.
