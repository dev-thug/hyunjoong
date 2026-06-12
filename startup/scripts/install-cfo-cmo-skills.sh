#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export HERMES_HOME="${HERMES_HOME:-$ROOT/.hermes}"
export PATH="$ROOT/hermes-agent/.venv/bin:${HOME}/.local/bin:$PATH"

install() {
  local profile="$1"
  shift
  local skill
  for skill in "$@"; do
    echo "==> [$profile] installing $skill"
    hermes -p "$profile" skills install --yes "$skill"
  done
}

CFO_SKILLS=(
  anthropics/skills/xlsx
  anthropics/skills/pdf
  anthropics/skills/docx
  anthropics/skills/doc-coauthoring
  openai/skills/define-goal
)

CMO_SKILLS=(
  anthropics/skills/brand-guidelines
  anthropics/skills/internal-comms
  anthropics/skills/pptx
  anthropics/skills/canvas-design
  anthropics/skills/theme-factory
  anthropics/skills/frontend-design
  openai/skills/screenshot
)

install cfo "${CFO_SKILLS[@]}"
install cmo "${CMO_SKILLS[@]}"

echo "Done. Verify with: ./scripts/verify-multi-agent.sh"