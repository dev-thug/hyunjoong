#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export HERMES_HOME="${HERMES_HOME:-$ROOT/.hermes}"
export PATH="$ROOT/hermes-agent/.venv/bin:${HOME}/.local/bin:$PATH"

PROFILE="finmgr"
SKILLS_SRC="$ROOT/config/hermes/skills"
SKILLS_DST="$HERMES_HOME/profiles/$PROFILE/skills"

install_hub() {
  local skill="$1"
  echo "==> [$PROFILE] installing $skill"
  hermes -p "$PROFILE" skills install --yes "$skill" || echo "WARN: failed $skill (may retry later)"
}

echo "==> [$PROFILE] syncing custom skills from config/hermes/skills/"
mkdir -p "$SKILLS_DST"
for skill_dir in "$SKILLS_SRC"/*/; do
  [[ -f "${skill_dir}SKILL.md" ]] || continue
  name="$(basename "$skill_dir")"
  rm -rf "$SKILLS_DST/$name"
  cp -R "$skill_dir" "$SKILLS_DST/$name"
  echo "  copied $name"
done

HUB_SKILLS=(
  anthropics/skills/xlsx
  openai/skills/jupyter-notebook
  openai/skills/define-goal
)

OFFICIAL_SKILLS=(
  official/finance/excel-author
  official/finance/3-statement-model
  official/finance/stocks
  official/finance/comps-analysis
)

for skill in "${HUB_SKILLS[@]}"; do
  install_hub "$skill"
done

for skill in "${OFFICIAL_SKILLS[@]}"; do
  install_hub "$skill"
done

echo "Done. Verify: hermes -p $PROFILE skills list | grep -E 'finance-data|budget-cashflow|xlsx|jupyter'"