#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export HERMES_HOME="${HERMES_HOME:-$ROOT/.hermes}"
export PATH="$ROOT/hermes-agent/.venv/bin:${HOME}/.local/bin:$PATH"

PASS=0
FAIL=0

ok()   { echo "✅ $1"; PASS=$((PASS+1)); }
bad()  { echo "❌ $1"; FAIL=$((FAIL+1)); }

PROFILES=(default cfo cmo finmgr)
NAMED=(cfo cmo finmgr)

echo "=== V1: hermes doctor ==="
for p in "${PROFILES[@]}"; do
  if [[ "$p" == "default" ]]; then
    if hermes doctor >/dev/null 2>&1; then ok "doctor default"; else bad "doctor default"; fi
  elif [[ -d "$ROOT/.hermes/profiles/$p" ]]; then
    if hermes -p "$p" doctor >/dev/null 2>&1; then ok "doctor $p"; else bad "doctor $p"; fi
  else
    bad "profile dir missing: $p"
  fi
done

echo "=== V2: profile list ==="
LIST="$(hermes profile list 2>&1)"
for p in "${NAMED[@]}"; do
  if echo "$LIST" | grep -qE "\b$p\b"; then ok "profile $p"; else bad "profile $p"; fi
done

echo "=== V6: notion/figma blocklist ==="
BLOCKED='notion|figma'
for p in "${PROFILES[@]}"; do
  [[ "$p" == "finmgr" && ! -d "$ROOT/.hermes/profiles/finmgr" ]] && continue
  if hermes -p "$p" skills list 2>/dev/null | grep -qiE "$BLOCKED"; then
    bad "blocked skill in $p"
  else
    ok "no blocked skills in $p"
  fi
done

echo "=== config dispatch flags ==="
python3 - <<'PY'
import yaml
from pathlib import Path
root = Path("/Users/hyunjoong/hyunjoong/startup/.hermes")
checks = [
    ("default", root/"config.yaml", True),
    ("cfo", root/"profiles/cfo/config.yaml", False),
    ("cmo", root/"profiles/cmo/config.yaml", False),
    ("finmgr", root/"profiles/finmgr/config.yaml", False),
]
for name, path, want in checks:
    if not path.exists():
        raise SystemExit(f"missing config: {path}")
    d = yaml.safe_load(path.read_text()).get("kanban",{}).get("dispatch_in_gateway")
    assert d is want, f"{name}: got {d}, want {want}"
print("dispatch flags OK")
PY
ok "kanban dispatch config"

echo "=== finmgr custom + finance skills ==="
if [[ -d "$ROOT/.hermes/profiles/finmgr" ]]; then
  FLIST="$(hermes -p finmgr skills list 2>/dev/null || true)"
  for s in finance-data-analys budget-cashflow-mgmt xlsx jupyter-live-kernel excel-author; do
    if echo "$FLIST" | grep -qi "$s"; then ok "finmgr skill $s"; else bad "finmgr skill $s"; fi
  done
else
  bad "finmgr profile not created"
fi

echo "=== workspace dirs ==="
for d in finance finance/analytics finance/budget finance/cashflow marketing; do
  if [[ -d "$ROOT/workspace/$d" ]]; then ok "workspace/$d"; else bad "workspace/$d"; fi
done

echo "=== finmgr telegram gateway ==="
if [[ -f "$ROOT/.hermes/profiles/finmgr/.env" ]] && grep -q '^TELEGRAM_BOT_TOKEN=' "$ROOT/.hermes/profiles/finmgr/.env" 2>/dev/null; then
  ok "finmgr telegram token configured"
  if HERMES_HOME="$ROOT/.hermes/profiles/finmgr" hermes -p finmgr gateway status 2>&1 | grep -q 'Gateway service is loaded'; then
    ok "finmgr gateway service loaded"
  else
    bad "finmgr gateway service not loaded"
  fi
else
  bad "finmgr telegram token missing"
fi

echo "=== kanban.db ==="
if [[ -f "$ROOT/.hermes/kanban.db" ]]; then ok "kanban.db"; else bad "kanban.db"; fi

echo "=== browser + computer_use deps ==="
if command -v agent-browser >/dev/null 2>&1; then ok "agent-browser installed"; else bad "agent-browser missing"; fi
if command -v cua-driver >/dev/null 2>&1; then ok "cua-driver installed"; else bad "cua-driver missing"; fi
if hermes doctor 2>&1 | grep -q '✓ browser$'; then ok "doctor browser"; else bad "doctor browser"; fi
if hermes doctor 2>&1 | grep -q '✓ computer_use'; then ok "doctor computer_use"; else bad "doctor computer_use"; fi

echo "=== platform_toolsets include browser/computer_use ==="
for p in default cfo cmo finmgr; do
  [[ "$p" != "default" && ! -d "$ROOT/.hermes/profiles/$p" ]] && continue
  cfg="$ROOT/.hermes/config.yaml"
  [[ "$p" != "default" ]] && cfg="$ROOT/.hermes/profiles/$p/config.yaml"
  if grep -q 'browser' "$cfg" && grep -q 'computer_use' "$cfg"; then
    ok "toolsets $p has browser+computer_use"
  else
    bad "toolsets $p missing browser/computer_use"
  fi
done

echo ""
echo "Results: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]