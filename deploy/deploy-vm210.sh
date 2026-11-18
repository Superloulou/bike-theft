#!/usr/bin/env bash
# Déploie le paquet le plus récent sur la VM de recette (VM 210).
# À lancer depuis le poste de développement (Git Bash sous Windows).
#
#   bash deploy/build-standalone.sh
#   bash deploy/deploy-vm210.sh
#
# Aucune règle réseau, aucun DNS, aucun certificat, aucun reverse proxy existant
# n'est modifié : le service écoute sur un port haut, l'exposition publique
# reste à la main de l'exploitant.
set -euo pipefail

cd "$(dirname "$0")/.."

VM_HOST="${VM_HOST:-192.168.50.60}"      # VM 210 (recette)
VM_USER="${VM_USER:-muret}"              # utilisateur SSH existant
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519}"
APP_DIR="${APP_DIR:-/opt/velosignale}"
HEALTH_PORT="${HEALTH_PORT:-3100}"

SSH_OPTS=(-o BatchMode=yes -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new -i "$SSH_KEY")

TARBALL="$(ls -1t dist/velosignale-*.tar.gz 2>/dev/null | head -n 1 || true)"
if [ -z "$TARBALL" ]; then
  echo "ERREUR : aucun paquet dans dist/. Lancer d'abord : bash deploy/build-standalone.sh"
  exit 1
fi
echo "==> Paquet : $TARBALL"

echo "==> Transfert vers $VM_USER@$VM_HOST"
scp "${SSH_OPTS[@]}" "$TARBALL" "$VM_USER@$VM_HOST:/tmp/$(basename "$TARBALL")"

echo "==> Provisionnement (idempotent)"
REMOTE_TARBALL="/tmp/$(basename "$TARBALL")"
ssh "${SSH_OPTS[@]}" "$VM_USER@$VM_HOST" \
  "sudo -n RUN_TARBALL=$REMOTE_TARBALL APP_DIR=$APP_DIR PORT=$HEALTH_PORT HEALTH_PORT=$HEALTH_PORT HOSTNAME_BIND=0.0.0.0 bash -l" \
  < deploy/provision-vm.sh \
  || { echo "ERREUR : le provisionnement a échoué"; exit 1; }

echo
echo "==> Vérification depuis le poste de développement"
for path in / /declarer /guide /tarification /dossier/VS-DEMO-2401; do
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "http://$VM_HOST:$HEALTH_PORT$path" || echo 000)"
  echo "  $code  http://$VM_HOST:$HEALTH_PORT$path"
done
code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 -X POST "http://$VM_HOST:$HEALTH_PORT/api/reports" || echo 000)"
echo "  $code  POST /api/reports (410 attendu)"
