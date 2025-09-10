# SAMASSA FRONTEND

Frontend React (Vite) + Tailwind CSS pour la suite de gestion SAMASSA TECHNOLOGIE.

## Installation locale

```bash
npm install
npm run dev
```

Tu peux aussi utiliser `pnpm` si tu préfères.

## Configuration

Pour pointer vers ton backend Render :
Ajoute un fichier `.env` à la racine :

```
VITE_API_URL=https://<TON_BACKEND_RENDER>.onrender.com
```

## Déploiement sur Render

1. Pousse tout le code sur GitHub.
2. Sur [render.com](https://render.com), crée un **Static Site** :
   - Build command : `npm install && npm run build`
   - Publish directory : `dist`
   - Ajoute la variable d’environnement :  
     `VITE_API_URL=https://<TON_BACKEND_RENDER>.onrender.com`
3. Déploie, puis utilise l’URL Render de ton frontend.

## Personnalisation

- Le composant `ClientList` récupère dynamiquement la liste des clients via l’API backend.
- La navigation est simple, tu peux ajouter d’autres pages (Factures, Interventions…) dans `/components`.

## Contact

SAMASSA TECHNOLOGIE — « Tout pour l’informatique »
