#!/usr/bin/env bash
# Hermes Agent — startup project helper
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export HERMES_HOME="${HERMES_HOME:-$ROOT/.hermes}"
export PATH="$ROOT/hermes-agent/.venv/bin:${HOME}/.local/bin:${PATH}"

cmd="${1:-help}"
shift || true

case "$cmd" in
  doctor)   hermes doctor "$@" ;;
  auth)     hermes auth "$@" ;;
  model)    hermes model "$@" ;;
  gateway)  hermes gateway "$@" ;;
  chat)     hermes "$@" ;;
  profiles) hermes profile list "$@" ;;
  gateways)
    export HERMES_HOME="$ROOT/.hermes"
    hermes gateway start
    export HERMES_HOME="$ROOT/.hermes/profiles/cfo"
    hermes gateway start
    export HERMES_HOME="$ROOT/.hermes/profiles/cmo"
    hermes gateway start
    echo "All gateways started."
    ;;
  apply-config)
    cp "$ROOT/config/hermes/default.config.yaml" "$ROOT/.hermes/config.yaml"
    cp "$ROOT/config/hermes/default.SOUL.md" "$ROOT/.hermes/SOUL.md"
    cp "$ROOT/config/hermes/cfo.config.yaml" "$ROOT/.hermes/profiles/cfo/config.yaml"
    cp "$ROOT/config/hermes/cfo.SOUL.md" "$ROOT/.hermes/profiles/cfo/SOUL.md"
    cp "$ROOT/config/hermes/cmo.config.yaml" "$ROOT/.hermes/profiles/cmo/config.yaml"
    cp "$ROOT/config/hermes/cmo.SOUL.md" "$ROOT/.hermes/profiles/cmo/SOUL.md"
    echo "Config and SOUL applied to all profiles."
    ;;
  install-skills) "$ROOT/scripts/install-cfo-cmo-skills.sh" "$@" ;;
  verify)         "$ROOT/scripts/verify-multi-agent.sh" "$@" ;;
  env)
    echo "HERMES_HOME=$HERMES_HOME"
    echo "PATH=$PATH"
    ;;
  *)
    cat <<EOF
Usage: ./setup-hermes.sh <command>

Commands:
  doctor              Run hermes doctor
  auth add openai-codex   Codex browser OAuth
  model               Configure model provider
  gateway [setup|status|start]
  profiles            List Hermes profiles
  gateways            Start Mini + CFO + CMO gateways
  apply-config        Copy config/SOUL templates to .hermes runtime
  install-skills      Install CFO/CMO official skills
  verify              Run multi-agent verification script
  chat                Start Hermes CLI
  env                 Print environment variables
EOF
    ;;
esac