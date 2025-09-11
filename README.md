# samassa-frontend

Application React minimale prête pour déploiement sur Render en tant que *Static Site*.

## Avant de déployer
- Remplace `process.env.REACT_APP_API_URL` par l'URL de ton backend Render ou ajoute la variable d'environnement `REACT_APP_API_URL` sur Render (Settings → Environment).

## Commandes locales
- Installer dépendances:
  ```
  npm install
  ```
- Lancer en local:
  ```
  npm start
  ```
- Construire pour production:
  ```
  npm run build
  ```

## Déploiement sur Render (Static Site)
- Build command: `npm install && npm run build`
- Publish directory: `build`
- Ajoute la variable d'environnement `REACT_APP_API_URL` avec l'URL de ton backend (par ex https://samassa-backend.onrender.com)