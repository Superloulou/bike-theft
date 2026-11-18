# Déploiement de Vélo Signalé

Document de maintenance : comment compiler, publier, déployer, vérifier et revenir en
arrière. La maquette n'enregistre aucune donnée : redéployer ne risque aucune perte.

## 1. Architecture retenue

| Élément | Choix | Pourquoi |
| --- | --- | --- |
| Format livré | Build Next.js **`output: "standalone"`** archivé en `.tar.gz` | La VM de recette n'a ni compilateur, ni Docker, que ~1,4 Go de disque libre et 967 Mo de RAM sans swap : `npm ci` + `next build` sur place est impossible |
| Runtime | Node.js 22 LTS binaire officiel installé dans `/usr/local` | `better-sqlite3` n'est pas embarqué dans le bundle standalone (le back-end qui l'importait n'est référencé par aucune page), donc aucun module natif à compiler |
| Lancement | Unité systemd `velosignale.service`, `Restart=always` | Redémarrage automatique, logs dans `journalctl` |
| Configuration | `/opt/velosignale/shared/env` (lu via `EnvironmentFile`) | Les valeurs ne sont pas codées en dur ; modèle documenté dans `.env.example` |
| Versionnage | `/opt/velosignale/releases/<horodatage>` + lien `current` | Retour arrière immédiat |
| Port | `3100` en écoute | Le port 80 de la VM est déjà occupé par Apache (devant un reverse proxy BunkerWeb) : il n'est **pas** touché |

> Le sujet demandait « une méthode reproductible (ex. Docker Compose) ». Docker n'est pas
> installable sur la VM 210 dans ses conditions actuelles (aucun démon Docker, 1,4 Go de
> disque libre, pas de compilateur pour les modules natifs, pas de swap). Le déploiement
> systemd + archive standalone ci-dessous est l'équivalent reproductible retenu, avec les
> mêmes garanties : configuration externalisée, redémarrage automatique, logs, test de
> santé.

## 2. Environnement cible

| VM | Rôle | Accès |
| --- | --- | --- |
| 210 | recette | `muret@192.168.50.60` (hôte `muret-recette`), Debian 13, `sudo` sans mot de passe |
| 211 | production | **n'existe pas sur le cluster** — voir l'inventaire ci-dessous |

Contraintes mesurées sur la VM 210 : disque racine 2,8 Go (1,4 Go libres), 967 Mo de RAM,
aucun swap, Apache déjà actif sur le port 80, aucun service Node.js.

### Inventaire réel du cluster (relevé via l'API Proxmox du nœud `proxmox2`, PVE 9.2.2)

Le numéro de machine attendu ne correspond pas au VMID réel : la machine de recette déclarée
« VM 210 » est en réalité le **VMID 101**. Aucun VMID 211 n'est présent, et l'API renvoie
`211` comme identifiant **libre** (`cluster/nextid`), ce qui confirme qu'aucune machine de
production n'a encore été créée.

| VMID | Nom | IP | Rôle constaté |
| --- | --- | --- | --- |
| 100 | `villarceau` | `192.168.50.50` | site « Projet remplacement du muret de Villarceau » |
| 101 | `muret-recette` | `192.168.50.60` | **recette Vélo Signalé** (déploiement en cours) |
| 200 | `tor-gateway` | `192.168.50.61` | passerelle Tor — ne pas toucher |
| 201 | `lbc-alertes` | `192.168.50.62` | alertes Leboncoin — ne pas toucher |

Autres hôtes joignables sur le réseau qui ne sont **pas** des VM du cluster : `192.168.50.56`
(Home Assistant), `192.168.50.55` et `192.168.50.57` (SSH ouvert, aucune identité connue),
`192.168.50.58` (le nœud Proxmox lui-même).

Conséquence : la production ne peut pas être déployée tant que la machine n'existe pas. Deux
options, à trancher par l'exploitant — créer la VM 211 (le token d'automatisation dispose des
droits `VM.Allocate`/`VM.Clone`), ou désigner une VM existante. Le déploiement n'est pas
lancé à l'aveugle.

### État de la recette (déployé)

| Élément | Valeur relevée sur la VM |
| --- | --- |
| Service | `velosignale.service`, `active`, `enabled` (démarré au boot), `Restart=always` |
| Écoute | `0.0.0.0:3100` — le port 80 d'Apache n'est pas touché |
| Node.js | v22.14.0 installé dans `/usr/local` (115 Mo) |
| Application | `/opt/velosignale/current` → `releases/velosignale-<horodatage>` (76 Mo pour deux versions) |
| Utilisateur | `velosignale` (système, sans shell de connexion) |
| Données | `/opt/velosignale/data` — vide, la maquette n'écrit rien |
| Mémoire du service | ~40 Mo |
| Redémarrage automatique | vérifié : le processus tué est réapprovisionné par systemd en quelques secondes et le test de santé repasse à 200 |

Accès de vérification : `http://192.168.50.60:3100/`.

## 3. Déroulé d'une mise à jour

```bash
# 1. Compiler et préparer le paquet (poste de développement)
npm install
npm run lint
npm run build
bash deploy/build-standalone.sh      # -> dist/velosignale-<horodatage>.tar.gz

# 2. Déployer sur la VM de recette
bash deploy/deploy-vm210.sh
```

Le script de déploiement transfère l'archive par SSH puis applique
`deploy/provision-vm.sh` (idempotent) : installation de Node si absent, création de
l'utilisateur système `velosignale`, extraction dans `releases/`, bascule du lien
`current`, installation et redémarrage de l'unité systemd, test de santé local.

## 4. Vérifications après déploiement

```bash
# depuis le poste de développement
curl -i http://192.168.50.60:3100/                 # 200, bannière de démonstration
curl -i http://192.168.50.60:3100/declarer         # 200, formulaire 4 étapes
curl -i http://192.168.50.60:3100/dossier/VS-DEMO-2401   # 200, dossier d'exemple
curl -i http://192.168.50.60:3100/dossier/INVALID-1      # 404
curl -i -X POST http://192.168.50.60:3100/api/reports    # 410, aucune donnée enregistrée
```

Depuis la VM :

```bash
sudo systemctl status velosignale
sudo journalctl -u velosignale -n 50 --no-pager
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3100/
```

## 5. Configuration

Fichier : `/opt/velosignale/shared/env` (créé une seule fois, jamais écrasé par un
déploiement).

```
PORT=3100
HOSTNAME=0.0.0.0
NODE_ENV=production
DATABASE_FILE=/opt/velosignale/data/reports.db
```

Après modification : `sudo systemctl restart velosignale`.

## 6. Retour arrière

```bash
ls -1t /opt/velosignale/releases          # versions disponibles
ln -sfn /opt/velosignale/releases/<nom> /opt/velosignale/current
sudo systemctl restart velosignale
```

Les 3 versions les plus récentes sont conservées automatiquement.

## 7. Exposition au navigateur

Le service écoute sur le port 3100 de la VM. Pour un accès public, l'exploitant doit
côté reverse proxy existant (BunkerWeb/Apache) ajouter une règle de transmission vers
`192.168.50.60:3100`, plus un certificat. **Ces modifications ne sont pas faites par ce
projet** : elles nécessitent une validation explicite.

## 8. Passer en production (VM 211)

**Aucune VM de production n'existe à ce jour** (voir l'inventaire de la section 2 : le VMID 211
est libre, les seules machines du cluster sont les VMID 100, 101, 200 et 201). Cette étape est
donc en attente, et elle n'est pas exécutée sans accord explicite de l'exploitant.

Une fois la machine cible créée (ou une VM existante désignée), le script de recette sert tel
quel, il suffit de changer la cible :

```bash
VM_HOST=<ip-de-la-vm-de-production> VM_USER=<utilisateur> bash deploy/deploy-vm210.sh
```

Préalables à vérifier sur la machine cible avant d'écrire quoi que ce soit : accessibilité SSH,
OS et architecture, services déjà en place (ports en écoute, reverse proxy), espace disque
et RAM disponibles. Aucun service existant ne doit être écrasé. Sur la recette, ces contrôles
ont été faits avant installation ; ils sont reconduits à chaque déploiement.

## 9. Ce qui ne doit jamais être déployé

- Aucune donnée personnelle : la maquette n'enregistre rien, le dossier `data/` reste vide.
- Aucun fichier `.env` réel dans le dépôt (ignoré par `.gitignore`, seul `.env.example` est
  publié).
- Aucun `git push --force`.
