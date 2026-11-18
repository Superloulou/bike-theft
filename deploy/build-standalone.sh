#!/usr/bin/env bash
# Construit le site puis prépare un paquet déployable dans dist/.
# À lancer depuis le poste de développement (Git Bash sous Windows, ou bash sous Linux).
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$ROOT/dist"
STAGE="$OUT/stage"

echo "==> Compilation de production"
npm run build

if [ ! -f "$ROOT/.next/standalone/server.js" ]; then
  echo "ERREUR : .next/standalone/server.js est absent."
  echo "Vérifier que next.config.ts contient output: \"standalone\"."
  exit 1
fi

echo "==> Assemblage du paquet"
rm -rf "$STAGE"
mkdir -p "$STAGE/app"

# serveur autonome (node_modules réduits au strict nécessaire)
cp -R "$ROOT/.next/standalone/." "$STAGE/app/"
# assets statiques : le serveur standalone ne les contient pas
mkdir -p "$STAGE/app/.next"
cp -R "$ROOT/.next/static" "$STAGE/app/.next/static"
cp -R "$ROOT/public" "$STAGE/app/public"
# configuration documentée + unité systemd
mkdir -p "$STAGE/config"
cp "$ROOT/.env.example" "$STAGE/config/env.example"
cp "$ROOT/deploy/systemd/velosignale.service" "$STAGE/config/velosignale.service"

echo "==> Archivage"
mkdir -p "$OUT"
TARBALL="$OUT/velosignale-$STAMP.tar.gz"
tar -czf "$TARBALL" -C "$STAGE" app config
rm -rf "$STAGE"

echo
echo "Paquet : $TARBALL"
ls -lh "$TARBALL"
echo
echo "Ensuite : bash deploy/deploy-vm210.sh"
