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
    for p in cfo cmo finmgr; do
      if [[ -d "$ROOT/.hermes/profiles/$p" ]]; then
        env_file="$ROOT/.hermes/profiles/$p/.env"
        if [[ -f "$env_file" ]] && grep -q '^TELEGRAM_BOT_TOKEN=' "$env_file" 2>/dev/null; then
          export HERMES_HOME="$ROOT/.hermes/profiles/$p"
          hermes gateway start
        elif [[ "$p" == "finmgr" ]]; then
          echo "Skip finmgr gateway (no TELEGRAM_BOT_TOKEN — Kanban worker only)"
        fi
      fi
    done
    echo "All gateways started."
    ;;
  apply-config)
    cp "$ROOT/config/hermes/default.config.yaml" "$ROOT/.hermes/config.yaml"
    cp "$ROOT/config/hermes/default.SOUL.md" "$ROOT/.hermes/SOUL.md"
    for p in cfo cmo finmgr; do
      if [[ -d "$ROOT/.hermes/profiles/$p" ]] && [[ -f "$ROOT/config/hermes/$p.config.yaml" ]]; then
        cp "$ROOT/config/hermes/$p.config.yaml" "$ROOT/.hermes/profiles/$p/config.yaml"
        cp "$ROOT/config/hermes/$p.SOUL.md" "$ROOT/.hermes/profiles/$p/SOUL.md"
      fi
    done
    echo "Config and SOUL applied to all profiles."
    ;;
  install-skills)
    "$ROOT/scripts/install-cfo-cmo-skills.sh" "$@"
    if [[ -d "$ROOT/.hermes/profiles/finmgr" ]]; then
      "$ROOT/scripts/install-finmgr-skills.sh" "$@"
    fi
    ;;
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
  gateways            Start Mini + CFO + CMO + FinMgr gateways
  apply-config        Copy config/SOUL templates to .hermes runtime
  install-skills      Install CFO/CMO/FinMgr skills
  verify              Run multi-agent verification script
  chat                Start Hermes CLI
  env                 Print environment variables
EOF
    ;;
esac