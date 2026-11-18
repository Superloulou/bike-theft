#!/usr/bin/env bash
# Déploie le paquet le plus récent sur la VM de production (VMID 211, velosignale-prod).
# À lancer depuis le poste de développement (Git Bash sous Windows).
#
#   bash deploy/build-standalone.sh
#   bash deploy/deploy-prod.sh
#
# Le service écoute sur un port haut (3100). Le port 80 de la VM est géré séparément
# (vhost Apache « velosignale.conf », reverse proxy vers 127.0.0.1:3100) : ce script
# ne touche ni au DNS, ni aux certificats, ni aux autres VM du cluster.
set -euo pipefail

cd "$(dirname "$0")/.."

VM_HOST="${VM_HOST:-192.168.50.63}"      # VMID 211 (production, velosignale-prod)
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

# Le lien vers les VM est sujet à des corruptions intermittantes : un envoi de
# quelques mégaoctets peut se terminer avec un code 0 en écrivant un paquet
# tronqué. On compare donc les empreintes sha256 des deux côtés, et au-delà d'un
# échec on découpe le paquet en morceaux vérifiés un par un.
REMOTE_TARBALL="/tmp/$(basename "$TARBALL")"
if command -v sha256sum >/dev/null 2>&1; then
  LOCAL_SHA="$(sha256sum "$TARBALL" | cut -d' ' -f1)"
elif command -v shasum >/dev/null 2>&1; then
  LOCAL_SHA="$(shasum -a 256 "$TARBALL" | cut -d' ' -f1)"
else
  LOCAL_SHA=""
fi

send_whole() {
  for attempt in 1 2 3; do
    scp "${SSH_OPTS[@]}" "$TARBALL" "$VM_USER@$VM_HOST:$REMOTE_TARBALL"
    REMOTE_SHA="$(ssh "${SSH_OPTS[@]}" "$VM_USER@$VM_HOST" \
      "sha256sum '$REMOTE_TARBALL' 2>/dev/null | cut -d' ' -f1" || true)"
    [ "$REMOTE_SHA" = "$LOCAL_SHA" ] && return 0
    echo "    envoi complet $attempt : empreinte différente (${REMOTE_SHA:0:12}...)"
    sleep 2
  done
  return 1
}

# Envoi par morceaux : chaque morceau est haché côté VM, seul un morceau
# différent déclenche un nouvel envoi. C'est lent, mais ça passe là où le
# fichier entier est systématiquement abîmé.
send_chunked() {
  local chunk_dir tmp_dir i part total
  chunk_size="${CHUNK_SIZE:-262144}"
  tmp_dir="$(mktemp -d)"
  part="$tmp_dir/part"
  split -b "$chunk_size" "$TARBALL" "$part"
  total=0
  ssh "${SSH_OPTS[@]}" "$VM_USER@$VM_HOST" "rm -rf /tmp/vs-chunks && mkdir -p /tmp/vs-chunks"
  for f in "$part"*; do
    i="$(basename "$f" | sed 's/^part//')"
    want="$(sha256sum "$f" | cut -d' ' -f1)"
    ok=0
    for attempt in 1 2 3 4; do
      scp "${SSH_OPTS[@]}" "$f" "$VM_USER@$VM_HOST:/tmp/vs-chunks/$i"
      got="$(ssh "${SSH_OPTS[@]}" "$VM_USER@$VM_HOST" \
        "sha256sum '/tmp/vs-chunks/$i' 2>/dev/null | cut -d' ' -f1" || true)"
      if [ "$got" = "$want" ]; then ok=1; break; fi
      sleep 1
    done
    if [ "$ok" -ne 1 ]; then
      echo "ERREUR : morceau $i irrémédiablement corrompu après 4 envois."
      rm -rf "$tmp_dir"
      return 1
    fi
    total=$((total + 1))
    printf '    morceau %s OK (%s/%s)\n' "$i" "$total" "$(ls "$part"* | wc -l | tr -d ' ')"
  done
  rm -rf "$tmp_dir"
  ssh "${SSH_OPTS[@]}" "$VM_USER@$VM_HOST" \
    "cat /tmp/vs-chunks/* > '$REMOTE_TARBALL' && rm -rf /tmp/vs-chunks"
  REMOTE_SHA="$(ssh "${SSH_OPTS[@]}" "$VM_USER@$VM_HOST" \
    "sha256sum '$REMOTE_TARBALL' | cut -d' ' -f1")"
  [ "$REMOTE_SHA" = "$LOCAL_SHA" ]
}

if [ -n "$LOCAL_SHA" ]; then
  echo "==> Transfert vérifié vers $VM_USER@$VM_HOST (sha256 ${LOCAL_SHA:0:12}...)"
  if ! send_whole; then
    echo "==> Envoi par morceaux de ${CHUNK_SIZE:-262144} octets"
    if ! send_chunked; then
      echo "ERREUR : le paquet arrivé sur la VM ne correspond pas à celui construit en local."
      echo "         local=$LOCAL_SHA"
      echo "         distant=$REMOTE_SHA"
      exit 1
    fi
    echo "    reconstitution vérifiée"
  else
    echo "    paquet intègre"
  fi
else
  echo "==> Transfert vers $VM_USER@$VM_HOST (contrôle sha256 indisponible)"
  scp "${SSH_OPTS[@]}" "$TARBALL" "$VM_USER@$VM_HOST:$REMOTE_TARBALL"
fi

echo "==> Provisionnement (idempotent)"
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
