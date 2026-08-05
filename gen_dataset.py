#!/usr/bin/env python3
"""CLI: (re)build the Special Court `-CR-` dataset from the live API.

Thin wrapper over corpus_data. Forces a fresh paginated pull of the raw `-CR-` tables,
scopes them to the corpus (FY2069/70–2082/83), and rewrites the source-of-truth
files dataset/{cases,hearings,entities}.csv.

Only maintainers need this, and only to move the snapshot forward — running the notebook
needs no credentials at all. It prints a short code to approve at auth.jawafdehi.org/device
(any browser); your account needs the `ReadOnly` role. Set JAWAFDEHI_JWT to skip the prompt.

    python3 gen_dataset.py
"""
from corpus_data import build_frames

frames = build_frames(refresh=True)
print(f"rebuilt dataset from {frames['_source']} in {frames['_elapsed']:.1f}s")
ct = {r.metric: r.value for r in frames["corpus_totals"].itertuples(index=False)}
print(f"corpus={ct['corpus_in_window']} substantive={ct['substantive']} "
      f"avg/yr={ct['avg_filed_per_year']} decided={ct['outcome_decided']} ongoing={ct['outcome_ongoing']} "
      f"conv/part/acq={ct['outcome_convicted']}/{ct['outcome_partial']}/{ct['outcome_acquitted']}")
