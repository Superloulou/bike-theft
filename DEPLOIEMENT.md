# Déploiement de Vélo Signalé

Document de maintenance : comment compiler, publier, déployer, vérifier et revenir en
arrière. La maquette n'enregistre aucune donnée : redéployer ne risque aucune perte.

**Une seule machine : la production (VMID 211).** Il n'y a plus d'environnement de recette ;
l'installation qui avait été tentée sur la VM 101 a été retirée.

## 1. Architecture retenue

| Élément | Choix | Pourquoi |
| --- | --- | --- |
| Format livré | Build Next.js **`output: "standalone"`** archivé en `.tar.gz` | La VM n'a ni compilateur ni Docker, ~1,1 Go de disque libre et 967 Mo de RAM sans swap : `npm ci` + `next build` sur place est impossible |
| Runtime | Node.js 22 LTS binaire officiel installé dans `/usr/local` | `better-sqlite3` n'est pas embarqué dans le bundle standalone (le back-end qui l'importait n'est référencé par aucune page), donc aucun module natif à compiler |
| Lancement | Unité systemd `velosignale.service`, `Restart=always` | Redémarrage automatique, logs dans `journalctl` |
| Configuration | `/opt/velosignale/shared/env` (lu via `EnvironmentFile`) | Les valeurs ne sont pas codées en dur ; modèle documenté dans `.env.example` |
| Versionnage | `/opt/velosignale/releases/<horodatage>` + lien `current` | Retour arrière immédiat |
| Ports | `3100` (application) et `80` (Apache, reverse proxy) | Apache est déjà présent sur l'image clonée ; il transmet à l'application au lieu de servir un autre site |

> Le sujet demandait « une méthode reproductible (ex. Docker Compose) ». Docker n'est pas
> installable sur la VM dans ses conditions actuelles (aucun démon Docker, ~1,1 Go de disque
> libre, pas de compilateur pour les modules natifs, pas de swap). Le déploiement
> systemd + archive standalone ci-dessous est l'équivalent reproductible retenu, avec les
> mêmes garanties : configuration externalisée, redémarrage automatique, logs, test de santé.

## 2. Environnement cible

| VM | Rôle | Accès |
| --- | --- | --- |
| 211 `velosignale-prod` | **production** | `muret@192.168.50.63`, Debian 13 (trixie), `sudo` sans mot de passe, tag Proxmox `velosignale` |

Contraintes mesurées sur la VM : disque racine 2,8 Go (1,1 Go libres après déploiement),
967 Mo de RAM, aucun swap, Apache 2.4 actif sur le port 80.

### Inventaire du cluster (relevé via l'API Proxmox du nœud `proxmox2`, PVE 9.2.2)

| VMID | Nom | IP | Rôle constaté |
| --- | --- | --- | --- |
| 100 | `villarceau` | `192.168.50.50` | site « Projet remplacement du muret de Villarceau » — ne pas toucher |
| 101 | `muret-recette` | `192.168.50.60` | image de base (clonée pour la production) ; l'installation Vélo Signalé y a été **retirée** |
| 200 | `tor-gateway` | `192.168.50.61` | passerelle Tor — ne pas toucher |
| 201 | `lbc-alertes` | `192.168.50.62` | alertes Leboncoin — ne pas toucher |
| 211 | `velosignale-prod` | `192.168.50.63` | **production Vélo Signalé** |

Autres hôtes joignables qui ne sont **pas** des VM du cluster : `192.168.50.56`
(Home Assistant), `192.168.50.55` et `192.168.50.57` (SSH ouvert, identité inconnue),
`192.168.50.22` (NAS Synology), `192.168.50.58` (le nœud Proxmox lui-même).

### Stockage : ne pas utiliser `local-lvm`

La VM 211 a été reconstruite après une panne matérielle, et le diagnostic a désigné le pool
**`local-lvm`** (LVM-Thin, 5,84 To, jusqu'ici jamais utilisé) comme responsable : un clone
intègre de la VM 101 y démarrait sans jamais écrire un octet (statistiques de bloc figées,
agent inactive), alors que le même disque redémarre normalement dès qu'il est replacé sur
**`ssd-vm`**. Tant que le pool n'est pas vérifié, les VM doivent rester sur `ssd-vm`
(`scsi0 = ssd-vm:vm-211-disk-0`).

Conséquence pratique après un changement de disque : l'empreinte SSH de `192.168.50.63` a
changé, il faut `ssh-keygen -R 192.168.50.63` avant le premier accès.

### État de la production (relevé sur la VM)

| Élément | Valeur |
| --- | --- |
| Service | `velosignale.service`, `active`, `enabled`, `Restart=always` |
| Écoute | `0.0.0.0:3100` (application) et `0.0.0.0:80` (Apache) |
| Apache | `sites-enabled/velosignale.conf` : `ServerName velosignale-prod`, `ServerAlias volvelo.neuvytech.fr`, `ProxyPass / http://127.0.0.1:3100/` ; modules `proxy`, `proxy_http`, `headers` ; l'ancien vhost hérité `muret-villarceau.conf` est désactivé |
| Node.js | v22.14.0 dans `/usr/local` |
| Application | `/opt/velosignale/current` → `releases/velosignale-<horodatage>` (3 versions conservées) |
| Utilisateur | `velosignale` (système, sans shell de connexion) |
| Données | `/opt/velosignale/data` — vide, la maquette n'écrit rien |
| Mémoire du service | ~40 Mo |
| Redémarrage automatique | vérifié : le processus tué est réapprovisionné par systemd et le test de santé repasse à 200 |

Accès : `http://192.168.50.63/` (via Apache) ou `http://192.168.50.63:3100/` (direct).

## 3. Déroulé d'une mise à jour

```bash
# 1. Compiler et préparer le paquet (poste de développement)
npm install
npm run lint
npm run build
bash deploy/build-standalone.sh      # -> dist/velosignale-<horodatage>.tar.gz

# 2. Déployer sur la VM de production
bash deploy/deploy-prod.sh
```

Le script de déploiement transfère l'archive par SSH **en contrôlant l'empreinte sha256 des
deux côtés** (le lien vers les VM produit parfois des fichiers tronqués acceptés sans erreur
par `scp`) ; en cas d'échec il redécoupe le paquet en morceaux vérifiés un par un. Il applique
ensuite `deploy/provision-vm.sh` (idempotent) : installation de Node si absent, création de
l'utilisateur système `velosignale`, extraction dans `releases/`, bascule du lien `current`,
installation et redémarrage de l'unité systemd, test de santé local.

Sans Git Bash sur le poste, les deux étapes se font en PowerShell :

```powershell
scp dist\velosignale-<horodatage>.tar.gz muret@192.168.50.63:/tmp/
$s = (Get-Content deploy\provision-vm.sh -Raw) -replace "`r",""
$s | ssh muret@192.168.50.63 'sudo -n RUN_TARBALL=/tmp/velosignale-<horodatage>.tar.gz APP_DIR=/opt/velosignale PORT=3100 HEALTH_PORT=3100 HOSTNAME_BIND=0.0.0.0 bash -l'
```

## 4. Vérifications après déploiement

```bash
# depuis le poste de développement
curl -i http://192.168.50.63/                        # 200 (Apache -> application)
curl -i http://192.168.50.63:3100/declarer           # 200, formulaire 4 étapes
curl -i http://192.168.50.63:3100/dossier/VS-DEMO-2401   # 200, dossier d'exemple
curl -i http://192.168.50.63:3100/dossier/INVALID-1      # 404
curl -i -X POST http://192.168.50.63:3100/api/reports    # 410, aucune donnée enregistrée
```

Depuis la VM :

```bash
sudo systemctl status velosignale
sudo journalctl -u velosignale -n 50 --no-pager
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3100/
sudo apache2ctl configtest && sudo systemctl status apache2
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

Les 3 versions les plus récentes sont conservées automatiquement. En dernier recours, la VM
peut être reconstruite par clonage complet de la VM 101 puis redéploiement : aucune donnée
n'est à récupérer.

## 7. Nom de domaine

Le vhost Apache est déjà prêt (`ServerAlias volvelo.neuvytech.fr`). La création des noms de
domaine et la mise en place d'un certificat (HTTPS) restent à la main de l'exploitant : elles
nécessitent des identifiants valides et une exposition publique explicite, et ne sont pas
faites par ce projet. En l'état, la production n'est joignable que par adresse, sur le réseau
local (`http://192.168.50.63/`).

État constaté côté DNS (mesures du 18/11/2026) :

- **Le joker `*` de `neuvytech.fr` (IONOS) couvre déjà `volvelo.neuvytech.fr`** : aucune
  création d'enregistrement A n'est nécessaire pour que le nom résolve. Il pointe vers
  l'IP publique de la box (`82.65.196.90`), où nginx répond sur 80 (redirection 301) et
  sert **Home Assistant** sur 443. Le nom résout donc, mais vers le mauvais service :
  tant que la VM de production n'est pas exposée (forward DNS sur la box, certificat,
  `ServerAlias` déjà en place), `https://volvelo.neuvytech.fr` atterrit sur Home Assistant.
- **Sur le réseau local, ce joker est invisible** : le NAS Synology est **autoritaire**
  sur `neuvytech.fr` (zone « DNS Server », SOA `ns.neuvytech.fr` série 2, vide) et les
  postes du réseau l'utilisent comme resolver (`192.168.1.22`). `volvelo.neuvytech.fr`
  y renvoie NXDOMAIN. C'est donc **sur le Synology** qu'il faut ajouter l'enregistrement
  A `volvelo` → `192.168.50.63` pour un accès depuis la maison, et non chez IONOS.
- `home.local` est la même zone du paquet « DNS Server » : l'enregistrement
  `volvelo-recette.home.local` s'y ajoute de la même façon depuis DSM.

Dans les deux cas il manque un compte DSM valide pour piloter le paquet « DNS Server »
(l'API `SYNO.API.Auth` refuse le compte transmis). L'ajout se fait sinon en trois clics
dans DSM → DNS Server → Zone `neuvytech.fr` / `home.local` → Créer un A.

## 8. Ce qui ne doit jamais être déployé

- Aucune donnée personnelle : la maquette n'enregistre rien, le dossier `data/` reste vide.
- Aucun fichier `.env` réel dans le dépôt (ignoré par `.gitignore`, seul `.env.example` est
  publié).
- Aucun identifiant, jeton ou clé API dans le dépôt ou l'historique Git.
- Aucun `git push --force`.
