#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export HERMES_HOME="${HERMES_HOME:-$ROOT/.hermes}"
export PATH="$ROOT/hermes-agent/.venv/bin:${HOME}/.local/bin:$PATH"

PROFILE="coo"
SKILLS_SRC="$ROOT/config/hermes/skills"
SKILLS_DST="$HERMES_HOME/profiles/$PROFILE/skills"

CUSTOM_SKILLS=(
  ops-execution
  process-sop-mgmt
)

install_hub() {
  local skill="$1"
  echo "==> [$PROFILE] installing $skill"
  hermes -p "$PROFILE" skills install --yes "$skill" || echo "WARN: failed $skill (may retry later)"
}

echo "==> [$PROFILE] syncing custom COO skills"
mkdir -p "$SKILLS_DST"
for name in "${CUSTOM_SKILLS[@]}"; do
  src="$SKILLS_SRC/$name"
  [[ -f "$src/SKILL.md" ]] || { echo "WARN: missing $src"; continue; }
  rm -rf "$SKILLS_DST/$name"
  cp -R "$src" "$SKILLS_DST/$name"
  echo "  copied $name"
done

HUB_SKILLS=(
  anthropics/skills/docx
  anthropics/skills/internal-comms
  anthropics/skills/doc-coauthoring
  anthropics/skills/xlsx
  openai/skills/define-goal
)

OFFICIAL_SKILLS=(
  official/software-development/code-wiki
  official/software-development/subagent-driven-development
)

for skill in "${HUB_SKILLS[@]}"; do
  install_hub "$skill"
done

for skill in "${OFFICIAL_SKILLS[@]}"; do
  install_hub "$skill"
done

echo "Done. Verify: hermes -p $PROFILE skills list | grep -E 'ops-execution|process-sop|docx|define-goal|code-wiki'"