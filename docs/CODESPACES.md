# ELYNVIA Life — aperçu avec GitHub Codespaces

GitHub Codespaces permet de lancer ELYNVIA Life sans déployer le site chez un hébergeur.

## 1. Ouvrir le Codespace

Dans le dépôt GitHub `BorexPoissons/elynvia` :

1. Cliquer sur **Code**.
2. Ouvrir l'onglet **Codespaces**.
3. Cliquer sur **Create codespace on main**.

Le conteneur installe automatiquement les dépendances avec `pnpm install`, puis lance `pnpm dev`.

## 2. Variables Supabase

Pour utiliser l'authentification et les données réelles, créer `apps/life/.env.local` dans le Codespace :

```env
NEXT_PUBLIC_SUPABASE_URL=https://lrhrguotvznqeawoncch.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=VOTRE_CLE_PUBLIQUE_SUPABASE
```

Ne jamais placer la clé `service_role` dans ce fichier.

Après modification des variables, relancer :

```bash
pnpm dev
```

## 3. Voir le site

Le port `3000` est configuré automatiquement et nommé **ELYNVIA Life**.

GitHub ouvre normalement l'aperçu automatiquement. Sinon :

1. Ouvrir l'onglet **Ports** du Codespace.
2. Repérer le port `3000` / **ELYNVIA Life**.
3. Cliquer sur l'icône d'ouverture dans le navigateur.

GitHub fournit alors une URL temporaire `*.app.github.dev`.

Le port est configuré en **Private** par défaut afin de ne pas exposer l'application publiquement pendant le développement.

## 4. Important

Le frontend peut être visualisé immédiatement, mais les fonctions nécessitant la base ne seront réellement utilisables qu'après application des migrations présentes dans `supabase/migrations/` sur le projet Supabase DEV.
