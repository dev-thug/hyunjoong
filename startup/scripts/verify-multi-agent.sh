#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export HERMES_HOME="${HERMES_HOME:-$ROOT/.hermes}"
export PATH="$ROOT/hermes-agent/.venv/bin:${HOME}/.local/bin:$PATH"

PASS=0
FAIL=0

ok()   { echo "✅ $1"; PASS=$((PASS+1)); }
bad()  { echo "❌ $1"; FAIL=$((FAIL+1)); }

echo "=== V1: hermes doctor ==="
if hermes doctor >/dev/null 2>&1; then ok "doctor default"; else bad "doctor default"; fi
if hermes -p cfo doctor >/dev/null 2>&1; then ok "doctor cfo"; else bad "doctor cfo"; fi
if hermes -p cmo doctor >/dev/null 2>&1; then ok "doctor cmo"; else bad "doctor cmo"; fi

echo "=== V2: profile list ==="
if hermes profile list 2>&1 | rg -q '\bcfo\b' && hermes profile list 2>&1 | rg -q '\bcmo\b'; then
  ok "profiles cfo+cmo"
else
  bad "profiles cfo+cmo"
fi

echo "=== V6: notion/figma blocklist ==="
BLOCKED='notion|figma'
for p in default cfo cmo; do
  if hermes -p "$p" skills list 2>/dev/null | rg -qi "$BLOCKED"; then
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
]
for name, path, want in checks:
    d = yaml.safe_load(path.read_text()).get("kanban",{}).get("dispatch_in_gateway")
    assert d is want, f"{name}: got {d}, want {want}"
print("dispatch flags OK")
PY
ok "kanban dispatch config"

echo "=== workspace dirs ==="
for d in finance marketing; do
  if [[ -d "$ROOT/workspace/$d" ]]; then ok "workspace/$d"; else bad "workspace/$d"; fi
done

echo "=== kanban.db ==="
if [[ -f "$ROOT/.hermes/kanban.db" ]]; then ok "kanban.db"; else bad "kanban.db"; fi

echo ""
echo "Results: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]