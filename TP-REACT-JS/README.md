# Art Institute — Galerie d'art en React + TypeScript
Projet final B2 React.js & TypeScript · Ynov
Binôme : [Membre 1] & [Membre 2] · API tirée : Art Institute of Chicago
URL déployée : [à compléter]

---

# Le sujet en une slide
- Application React + TypeScript complète, du premier commit à une URL publique
- API publique tirée au sort, sans clé ni compte : **Art Institute of Chicago**
- Thème retenu : une galerie d'art en ligne
- Contraintes : pas de backend, pas d'auth, pas de Redux/Zustand, pas de lib de formulaires

---

# Ce que l'utilisateur peut faire
- **Parcourir** le catalogue d'œuvres (24 œuvres chargées depuis l'API)
- **Rechercher** par titre et **filtrer** par artiste
- **Consulter** la fiche d'une œuvre via son URL propre : `/oeuvres/:id`
- **Constituer** une sélection personnelle, visible sur toutes les pages
- **Proposer** une œuvre via un formulaire validé
- Toujours savoir où on en est : chargement, erreur, liste vide

---

# La stack
- **Vite 8** + **React 19** + **TypeScript 6**
- **React Router 7** pour le routage
- **React Compiler** activé (mémoïsation automatique)
- **Oxlint** pour le lint
- Aucune autre dépendance : React seul suffisait

---

# L'API et sa difficulté
- Liste : `api.artic.edu/api/v1/artworks/search?...&fields=id,title,artist_title,date_display,image_id`
- Détail : `api.artic.edu/api/v1/artworks/{id}`
- **Piège n°1** : pas d'URL d'image. Il faut la construire : `{iiif_url}/{image_id}/full/843,/0/default.jpg`
- **Piège n°2** : beaucoup d'œuvres ont `image_id` à `null`
- **Notre réponse** : on filtre côté API (`exists image_id`) et on protège quand même l'affichage

---

# Typer la réalité, pas l'idéal
```ts
export interface Artwork {
  id: number;
  title: string;
  artist_title: string | null;
  date_display: string | null;
  image_id: string | null;
}

export interface ArtworkApiResponse<T> {
  config: { iiif_url: string };
  data: T;
}
```
- Chaque champ qui peut manquer est typé `| null`
- Un générique `<T>` sert à la fois pour la liste (`Artwork[]`) et le détail (`Artwork`)

---

# Construire l'image : une fonction pure
```ts
export function imageUrl(iiifUrl: string | null, imageId: string | null) {
  if (!iiifUrl || !imageId) return null;
  const iiifPath = new URL(iiifUrl).pathname.replace(/\/+$/, "");
  return `${iiifPath}/${imageId}/full/843,/0/default.jpg`;
}
```
- Pas d'image → `null` → le composant n'affiche simplement rien
- On garde seulement le chemin `/iiif/2` : artic.edu refuse les images demandées depuis un autre site
- Les images passent donc par un **proxy** (Vite en dev, nginx en prod)

---

# Le proxy : contourner le blocage des images
```ts
server: {
  proxy: {
    '/iiif': {
      target: 'https://www.artic.edu',
      changeOrigin: true,
      headers: { Referer: 'https://www.artic.edu/' },
    },
  },
}
```
- Le navigateur demande `/iiif/...` à notre propre serveur
- Le serveur relaie vers artic.edu avec les bons en-têtes
- Même principe en production avec nginx

---

# Les routes
| Route | Page |
|---|---|
| `/` | Catalogue |
| `/oeuvres/:id` | Fiche détaillée (route dynamique) |
| `/selection` | Ma sélection |
| `/proposer` | Formulaire de proposition |
| `*` | Page introuvable (404) |

- 4 routes + 1 page 404, conformément au sujet

---

# Charger les données : useEffect + 3 états
- `loading` → « Chargement du catalogue... »
- `error` → message clair si `response.ok` est faux ou si le réseau tombe
- `data` → la liste s'affiche
- Sur la fiche détail, l'effet dépend de `[id]` : il se relance quand l'URL change
- Identifiant inconnu → l'API répond 404 → page « Œuvre introuvable » + lien retour

---

# Recherche et filtre sans liste dérivée en state
```ts
const artists = [...new Set(artworks.map(artistName))].sort();
const visible = artworks.filter(
  (a) => a.title.toLowerCase().includes(search.toLowerCase()) &&
         (artist === "" || artistName(a) === artist)
);
```
- Seuls `search` et `artist` sont dans un state (champs contrôlés)
- La liste des artistes et la liste visible **se calculent** à chaque rendu
- Pas de `useEffect` pour synchroniser : une seule source de vérité

---

# La sélection partagée : Context
- `SelectionProvider` enveloppe toute l'application dans `main.tsx`
- Il expose `selection`, `toggleSelection(artwork)`, `isSelected(id)`
- Le hook `useSelection()` lève une erreur s'il est utilisé hors du Provider
- Utilisé par 4 endroits : menu (compteur), catalogue, fiche détail, page sélection
- Pas de Redux : le Context suffit pour un seul état partagé

---

# Le formulaire « Proposer une œuvre »
- 4 champs contrôlés : titre, année, technique, email
- `validate(values)` est une **fonction pure** : valeurs en entrée, erreurs en sortie
- Les erreurs ne sont pas stockées : elles se recalculent à chaque rendu
- Une erreur ne s'affiche qu'après avoir quitté le champ (`touched` + `onBlur`)
- Bouton désactivé tant qu'il reste une erreur, message de succès à l'envoi

---

# Tests
- [à compléter : nombre de tests, outil — Vitest + Testing Library]
- Candidats naturels, déjà écrits en fonctions pures :
  - `imageUrl()` : image_id null, iiif_url null, URL correcte
  - `artistName()` : artiste présent / absent
  - `validate()` : chaque règle du formulaire
- Composant : la page Sélection vide affiche « Aucune œuvre sélectionnée »
- Ce qui n'est pas testé : [à compléter]

---

# Performance : mesure avant / après
- Optimisation : [à compléter]
- Mesure avant : [valeur + outil — Lighthouse / onglet Performance / React Profiler]
- Mesure après : [valeur]
- Pourquoi c'était justifié : [à compléter]
- À noter : le React Compiler mémoïse déjà automatiquement, donc pas de `useMemo` ajouté à la main sans mesure

---

# Déploiement
- Build : `npm run build` (tsc + vite build), sans erreur
- Hébergement : [à compléter] derrière **nginx**
- nginx sert le build **et** relaie `/iiif` vers artic.edu
- Rafraîchissement sur une route profonde (`/oeuvres/27992`) : `try_files ... /index.html`
- URL publique : [à compléter], testée depuis un téléphone

---

# Journal de décisions (extraits)
- **Décision** : la liste des artistes n'est pas dans un state. **Pourquoi** : elle se calcule depuis les œuvres. **Écarté** : useState + useEffect.
- **Décision** : les erreurs du formulaire ne sont pas dans un state. **Pourquoi** : `validate()` les recalcule. **Écarté** : un state `errors` synchronisé.
- **Décision** : on filtre les œuvres sans image côté API. **Pourquoi** : une galerie sans visuel est vide. **Écarté** : filtrer après coup et afficher moins de 24 œuvres.
- **Décision** : proxy pour les images. **Pourquoi** : artic.edu bloque les requêtes venant d'un autre site. **Écarté** : URL IIIF directe.
- **Décision** : Context plutôt que Redux. **Pourquoi** : un seul état partagé. **Écarté** : Zustand.

---

# Avec une semaine de plus
- Pagination du catalogue (l'API en fournit une)
- Sauvegarde de la sélection dans `localStorage`
- Recherche plein texte côté API plutôt que sur les 24 œuvres chargées
- Placeholder visuel pour les œuvres sans image
- Plus de tests de composants

---

# Merci — questions ?
Démo en direct : [URL déployée]
Dépôt Git : [lien]
