#!/usr/bin/env bash
# Protege o ramo main. Requer `gh` autenticado com permissões de administrador no repositório
# (e repositório público, ou plano pago no GitHub, para proteção de ramos).
#   scripts/protect-main.sh <dono>/<repo> [aprovações=0]
# Com 1 pessoa a manter o projeto use 0 aprovações (PR e testes obrigatórios); com mais, use 1.
set -euo pipefail
REPO="${1:?uso: protect-main.sh <dono>/<repo> [aprovações]}"
APPROVALS="${2:-0}"
gh api -X PUT "repos/${REPO}/branches/main/protection" --input - <<JSON
{
  "required_status_checks": { "strict": true, "contexts": ["ci"] },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": ${APPROVALS},
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": $([ "$APPROVALS" -gt 0 ] && echo true || echo false)
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true
}
JSON
# Pull requests de forks não recebem segredos; exigir aprovação para correr workflows de contribuidores novos:
gh api -X PUT "repos/${REPO}/actions/permissions/fork-pr-contributor-approval" -f approval_policy=all_external_contributors || true
echo "main protegido em ${REPO}"
