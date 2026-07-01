# Trombinoscope — Socotec Limousin

Application de gestion des techniciens et de leurs qualifications pour l'agence Socotec Limousin (Brive-la-Gaillarde et Limoges).

---

## Stack technique

- **React + Vite** (frontend)
- **Tailwind CSS** (style)
- **Supabase** (base de données PostgreSQL + Storage photos + temps réel)
- **Vercel** (hébergement, déploiement continu)

---

## Déploiement — étape par étape

### 1. Créer le projet Supabase

1. Aller sur [supabase.com](https://supabase.com) → **New project**
2. Nommer le projet `trombinoscope-limousin`
3. Choisir la région **West EU (Paris)**
4. Copier l'**URL** et la **clé anon** (Settings > API)

### 2. Initialiser la base de données

Dans Supabase → **SQL Editor** → coller et exécuter le fichier :

```
supabase/schema.sql
```

Ce script crée les tables, active RLS, configure les politiques d'accès et insère les données initiales (16 personnes, 82 missions, 171 attributions).

### 3. Créer le bucket de photos

Dans Supabase → **Storage** → **New bucket** :
- Nom : `photos`
- **Public bucket** : ✅ coché
- Cliquer sur **Create bucket**

Puis dans le bucket → **Policies** → ajouter une politique :
- **SELECT** (lecture) : `true` (tout le monde)
- **INSERT / UPDATE / DELETE** : `true` (la restriction est gérée par le mot de passe dans l'app)

### 4. Activer le temps réel

Dans Supabase → **Database** → **Replication** → activer pour les tables :
- `personnes`
- `qualif_items`
- `personne_qualifications`

### 5. Créer le dépôt GitHub

```bash
git init
git add .
git commit -m "init: trombinoscope Socotec Limousin"
git remote add origin https://github.com/FredericCaetano/trombinoscope-limousin.git
git push -u origin main
```

### 6. Déployer sur Vercel

1. Aller sur [vercel.com](https://vercel.com) → **New Project**
2. Importer le dépôt GitHub `trombinoscope-limousin`
3. Framework : **Vite** (détecté automatiquement)
4. Dans **Environment Variables**, ajouter :
   ```
   VITE_SUPABASE_URL     = https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJ...
   ```
5. Cliquer **Deploy**

---

## Développement local

```bash
cp .env.example .env
# Remplir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env

npm install
npm run dev
```

---

## Fonctionnalités

| Fonctionnalité | Accès |
|---|---|
| Consulter trombinoscope et qualifications | Tout le monde |
| Mode impression A3 | Tout le monde |
| Modifier les données (personnes, qualifs, photos) | Mot de passe `socotec` |
| Modifications visibles en temps réel | Tout le monde (automatique) |
| Recadrage interactif des photos | Mode édition |
| Réordonnancement des missions par glisser-déposer | Mode édition |

---

## Structure du projet

```
src/
├── App.jsx           — Composant principal + toute la logique
├── supabaseClient.js — Connexion Supabase
├── main.jsx          — Point d'entrée React
└── index.css         — Tailwind CSS

supabase/
└── schema.sql        — Schéma + données initiales
```
