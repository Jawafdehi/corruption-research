#!/usr/bin/env bash
# Phase 1: for every downloaded report, produce (a) the likhit Markdown of the full report
# and (b) the rendered chart pages + figure_pages.json manifest. CPU-bound; runs 3-wide.
set -u
BASE="$(cd "$(dirname "$0")/.." && pwd)"
# Needs a venv with `likhit` installed. Defaults to one inside the repo so this script is
# runnable by anyone who checks it out; override with LIKHIT_VENV to point at your own.
#   uv venv "$BASE/../.venv-likhit" --python 3.12 && uv pip install --python "$BASE/../.venv-likhit/bin/python" likhit
VENV="${LIKHIT_VENV:-$BASE/../.venv-likhit}"
PY="$VENV/bin/python"
if [ ! -x "$PY" ]; then
  echo "no likhit venv at $VENV — create it (see comment above) or set LIKHIT_VENV" >&2
  exit 1
fi
LOG="$BASE/build.log"
: > "$LOG"

one_report() {
  local pdf="$1"
  local dir; dir="$(dirname "$pdf")"
  local base; base="$(basename "$pdf" .pdf)"
  local md="$dir/${base}.likhit.md"
  local ts; ts() { date '+%H:%M:%S'; }
  echo "[$(ts)] START $base" >>"$LOG"
  # (a) likhit markdown
  if "$PY" "$BASE/_tools/convert_likhit.py" "$pdf" "$md" >>"$LOG" 2>&1; then
    echo "[$(ts)]   md OK  $(wc -c <"$md") bytes  $base" >>"$LOG"
  else
    echo "[$(ts)]   md FAIL $base" >>"$LOG"
  fi
  # (b) chart pages + manifest
  if "$PY" "$BASE/_tools/find_figures.py" "$pdf" "$dir/figures" >>"$LOG" 2>&1; then
    echo "[$(ts)]   figs OK $base" >>"$LOG"
  else
    echo "[$(ts)]   figs FAIL $base" >>"$LOG"
  fi
  echo "[$(ts)] DONE  $base" >>"$LOG"
}
export -f one_report
export BASE PY LOG

# 3-wide pool over all report PDFs.
find "$BASE" -mindepth 2 -maxdepth 2 -name '*-annual-report-*.pdf' | sort \
  | xargs -I{} -P 3 bash -c 'one_report "$@"' _ {}

echo "[$(date '+%H:%M:%S')] ALL DONE" >>"$LOG"
