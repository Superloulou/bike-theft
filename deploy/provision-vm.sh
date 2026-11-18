#!/usr/bin/env bash
# Prépare la VM de recette (VM 210) pour Vélo Signalé.
# Ce script est exécuté À DISTANCE, pipé par ssh sur un shell root :
#   ssh muret@192.168.50.60 'sudo -n bash -l' < deploy/provision-vm.sh
# Il est idempotent : relançable sans écraser ce qui existe déjà.
set -euo pipefail

NODE_VERSION="${NODE_VERSION:-22.14.0}"
APP_DIR="${APP_DIR:-/opt/velosignale}"
SERVICE_USER="${SERVICE_USER:-velosignale}"
RUN_TARBALL="${RUN_TARBALL:-}"

echo "==> VM : $(hostname) / $(. /etc/os-release && echo "$PRETTY_NAME")"

# ---------------------------------------------------------------- Node.js
if command -v node >/dev/null 2>&1; then
  echo "==> Node déjà présent : $(node --version)"
else
  echo "==> Installation de Node ${NODE_VERSION} (binaire officiel, dans /usr/local)"
  TMP="$(mktemp -d)"
  curl -fsSL -o "$TMP/node.tar.xz" \
    "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz"
  tar -xJf "$TMP/node.tar.xz" -C "$TMP"
  DIR="$(find "$TMP" -maxdepth 1 -type d -name 'node-v*')"
  # /usr/local/bin et /usr/local/lib sont déjà dans le PATH et ld.so.conf
  cp -r "$DIR/bin/"* /usr/local/bin/
  cp -r "$DIR/lib/"* /usr/local/lib/ 2>/dev/null || true
  cp -r "$DIR/share/"* /usr/local/share/ 2>/dev/null || true
  rm -rf "$TMP"
  echo "Node installé : $(node --version)"
fi

# ---------------------------------------------------------------- utilisateur dédié
if ! id "$SERVICE_USER" >/dev/null 2>&1; then
  echo "==> Création de l'utilisateur système $SERVICE_USER"
  useradd --system --home-dir "$APP_DIR" --shell /usr/sbin/nologin "$SERVICE_USER"
else
  echo "==> Utilisateur $SERVICE_USER déjà présent"
fi

# ---------------------------------------------------------------- arborescence applicative
mkdir -p "$APP_DIR/releases" "$APP_DIR/shared" "$APP_DIR/data" "$APP_DIR/logs"

# ---------------------------------------------------------------- déploiement du paquet
if [ -n "$RUN_TARBALL" ] && [ -f "$RUN_TARBALL" ]; then
  STAMP="$(basename "$RUN_TARBALL" .tar.gz)"
  echo "==> Déploiement de la version $STAMP"
  mkdir -p "$APP_DIR/releases/$STAMP"
  tar -xzf "$RUN_TARBALL" -C "$APP_DIR/releases/$STAMP"
  # configuration : on ne l'écrase pas si elle existe déjà
  if [ ! -f "$APP_DIR/shared/env" ]; then
    # le port d'écoute est celui choisi par le déploiement, pas celui du dev local
    {
      echo "PORT=${PORT:-3100}"
      echo "HOSTNAME=${HOSTNAME_BIND:-0.0.0.0}"
      echo "NODE_ENV=production"
      echo "DATABASE_FILE=$APP_DIR/data/reports.db"
    } > "$APP_DIR/shared/env"
    echo "==> Configuration créée : $APP_DIR/shared/env (port ${PORT:-3100})"
  fi
  ln -sfn "$APP_DIR/releases/$STAMP" "$APP_DIR/current"
  chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_DIR"
  # on ne garde que les 3 dernières versions
  ls -1dt "$APP_DIR/releases/"*/ 2>/dev/null | tail -n +4 | xargs -r rm -rf
  rm -f "$RUN_TARBALL"
else
  echo "==> Aucun paquet à déployer (RUN_TARBALL vide)"
fi

# ---------------------------------------------------------------- unité systemd
UNIT_SRC="$APP_DIR/current/config/velosignale.service"
[ -f "$UNIT_SRC" ] || UNIT_SRC="$(find "$APP_DIR/releases" -name velosignale.service 2>/dev/null | sort | tail -n 1)"
if [ -n "$UNIT_SRC" ] && [ -f "$UNIT_SRC" ]; then
  echo "==> Installation de l'unité systemd velosignale"
  cp "$UNIT_SRC" /etc/systemd/system/velosignale.service
  systemctl daemon-reload
  systemctl enable velosignale >/dev/null 2>&1 || true
  systemctl restart velosignale
else
  echo "ATTENTION : unité velosignale.service introuvable, service non (re)démarré"
fi

# ---------------------------------------------------------------- vérification
sleep 3
systemctl --no-pager --full status velosignale 2>&1 | head -n 8 || true
CODE="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${HEALTH_PORT:-3100}/" || echo 000)"
echo "==> Santé HTTP locale : $CODE"
[ "$CODE" = "200" ] && echo "OK" || echo "ECHEC : le service ne répond pas sur le port ${HEALTH_PORT:-3100}"
