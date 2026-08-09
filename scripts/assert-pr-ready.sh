#!/usr/bin/env bash
set -euo pipefail

PR_NUMBER="${1:-}"
if [[ -z "$PR_NUMBER" ]]; then
  PR_NUMBER="$(gh pr view --json number --jq '.number')"
fi

REPOSITORY="$(gh repo view --json nameWithOwner --jq '.nameWithOwner')"
STATE="$(gh pr view "$PR_NUMBER" --json state --jq '.state')"
IS_DRAFT="$(gh pr view "$PR_NUMBER" --json isDraft --jq '.isDraft')"
BASE_REF="$(gh pr view "$PR_NUMBER" --json baseRefName --jq '.baseRefName')"
HEAD_SHA="$(gh pr view "$PR_NUMBER" --json headRefOid --jq '.headRefOid')"
MERGEABLE="$(gh pr view "$PR_NUMBER" --json mergeable --jq '.mergeable')"

if [[ "$STATE" != "OPEN" ]]; then
  printf 'PR %s is not open (state=%s).\n' "$PR_NUMBER" "$STATE" >&2
  exit 1
fi
if [[ "$IS_DRAFT" != "false" ]]; then
  printf 'PR %s is still a draft.\n' "$PR_NUMBER" >&2
  exit 1
fi
if [[ "$BASE_REF" != "develop" ]]; then
  printf 'PR %s targets %s, not develop.\n' "$PR_NUMBER" "$BASE_REF" >&2
  exit 1
fi
if [[ "$MERGEABLE" != "MERGEABLE" ]]; then
  printf 'PR %s is not mergeable (mergeable=%s).\n' "$PR_NUMBER" "$MERGEABLE" >&2
  exit 1
fi

# Wait for all currently attached checks, then require the exact production gate
# on this immutable head SHA. An empty check set never passes.
gh pr checks "$PR_NUMBER" --watch --fail-fast >/dev/null
SUCCESSFUL_GATE_COUNT="$(
  gh api "repos/$REPOSITORY/commits/$HEAD_SHA/check-runs" \
    --jq '[.check_runs[] | select(.name == "Verify production build" and .status == "completed" and .conclusion == "success")] | length'
)"
if [[ "$SUCCESSFUL_GATE_COUNT" -lt 1 ]]; then
  printf 'Required check Verify production build is not successful for %s.\n' "$HEAD_SHA" >&2
  exit 1
fi

CURRENT_HEAD_SHA="$(gh pr view "$PR_NUMBER" --json headRefOid --jq '.headRefOid')"
if [[ "$CURRENT_HEAD_SHA" != "$HEAD_SHA" ]]; then
  printf 'PR head changed during verification (%s -> %s).\n' "$HEAD_SHA" "$CURRENT_HEAD_SHA" >&2
  exit 1
fi

printf '%s\n' "$HEAD_SHA"
