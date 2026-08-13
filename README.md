# Site Saint-Cyr Services

Site vitrine statique : du HTML, du CSS et un petit fichier JavaScript. Aucune base de
données, aucune dépendance, aucun compte à créer. Il s'ouvre tel quel dans un navigateur
et s'héberge n'importe où.

## Ce qu'il faut compléter avant la mise en ligne

Ces informations n'étaient pas connues au moment de la construction du site. Tant qu'elles
ne sont pas renseignées, le site est utilisable mais incomplet.

| Où | Quoi | Fichier |
|---|---|---|
| Mentions légales | Forme juridique, SIRET, adresse, responsable de publication, hébergeur, assurance | `mentions-legales.html` — **19 marqueurs `[À COMPLÉTER]`**, obligatoire avant publication |
| Contact | **Zone d'intervention exacte** (commune de départ + rayon). Actuellement « Montpellier et alentours », déduit du Pic Saint-Loup visible sur une photo — **à confirmer** | `index.html` (section Contact) + les JSON-LD des 7 pages |
| Contact | **Jours et horaires d'appel** — la mention a été remplacée par un texte neutre en attendant | `index.html` (carte Téléphone) |
| Partout | **Nom de domaine réel** — `saint-cyr-services.fr` est une hypothèse | les 8 `canonical`, `og:url`, `og:image`, les JSON-LD, `sitemap.xml`, `robots.txt` |

Le numéro **06 68 05 33 81** a été repris du marquage du fourgon : il est utilisé partout,
en lien cliquable (`tel:`) et en lien WhatsApp (`wa.me/33668053381`). C'est la seule
coordonnée affirmée par le site — aucune adresse, aucun e-mail, aucun SIRET n'a été inventé.

## Affirmations commerciales à faire valider

Le site s'engage sur quelques promesses courantes du métier. Elles sont plausibles mais
personne ne les a confirmées : à relire avec l'intéressé, ce sont des engagements
contractuels vis-à-vis d'un client.

- « Devis gratuit », « déplacement et chiffrage sans engagement » (hero, bandeau, contact)
- « Chantier laissé propre, déchets verts évacués » (hero)
- « Dates annoncées et tenues » (section Méthode)
- « On répond, et si on est sur un chantier, on rappelle en fin de journée » (contact)

Tout le reste du texte décrit le métier, les techniques et les matériaux : rien qui engage
l'entreprise sur un fait vérifiable.

## Structure

```
index.html                     page d'accueil (hero, prestations, réalisations,
                               coulisses, méthode, contact)
prestations/                   une page par prestation
  amenagement-mineral.html
  taille-topiaires.html
  gazon-pelouse.html
  plantation-massifs.html
  piscine-terrasses.html
  entretien-jardin.html
mentions-legales.html
robots.txt  sitemap.xml        référencement (à mettre à jour avec le vrai domaine)
assets/css/style.css           toute la mise en forme, dans un seul fichier
assets/js/main.js              menu mobile, apparition au scroll, visionneuse photo
assets/img/                    photos converties en WebP, deux tailles
assets/favicon.svg
photos/                        photos d'origine — NE PAS METTRE EN LIGNE (13 Mo de sources)
```

## Les photos

Les 22 photos d'origine (`.jpeg`, 13 Mo) ont été converties en WebP en deux tailles :

- `nom.webp` — grand côté 1500 px, pour l'affichage en plein écran
- `nom-sm.webp` — grand côté 700 px, pour les vignettes

Total : 5,9 Mo au lieu de 13 Mo, et seules les vignettes visibles se chargent
(`loading="lazy"`). C'est ce qui fait qu'une page s'ouvre vite en 4G sur un chantier.

### Ajouter une photo

1. Déposer l'original dans `photos/`.
2. Le convertir (nécessite `cwebp`, installable avec `brew install webp`) :

```bash
cwebp -q 60 -m 6 -sharp_yuv -resize 1500 0 "photos/ma-photo.jpg" -o "assets/img/mon-slug.webp"
```

```bash
cwebp -q 58 -m 6 -sharp_yuv -resize 700 0 "photos/ma-photo.jpg" -o "assets/img/mon-slug-sm.webp"
```

(Pour une photo verticale, remplacer `-resize 1500 0` par `-resize 0 1500`.)

3. Copier un bloc `<button class="shot">` existant dans la galerie et remplacer le nom du
   fichier, le `data-caption`, et l'`alt` de l'image.

### Photos écartées

- **Les jardins de Versailles** (`WhatsApp Image 2026-08-11 at 16.01.55 (1).jpeg`) : ce n'est
  pas un chantier de l'entreprise, la publier laisserait croire le contraire. Elle reste
  dans `photos/`.
- Deux photos laissent voir un véhicule marqué **« Aqueduc Jardin »** : la remorque sur
  `palmiers-espace-commercial` et l'arrière du fourgon sur `chantier-taille-haie`. À arbitrer
  selon ce qu'est cette entreprise (ancien employeur, partenaire…).

## Voir le site en local

```bash
cd "/Users/dorian/Desktop/st cyr" && python3 -m http.server 5173
```

Puis ouvrir <http://localhost:5173>.

## Mettre en ligne

Site 100 % statique : il suffit de déposer le dossier. Netlify, Vercel, GitHub Pages ou
n'importe quel hébergement mutualisé par FTP font l'affaire. Ne pas oublier de renseigner
le vrai nom de domaine dans les `canonical`, `og:image`, `sitemap.xml` et `robots.txt`.

## L'identité

Elle n'a pas été inventée : elle a été **relevée sur le marquage du fourgon**, seule identité
visuelle existante de l'entreprise.

| | Relevé sur l'enseigne | Variable CSS |
|---|---|---|
| Vert du panneau | `#8fb133` | `--vert` |
| Haut du panneau, swoosh | `#c3d95a` | `--vert-clair` |
| Feuille foncée | `#3f6b1f` | `--vert-deep` |
| Lettrage (presque noir) | `#1b2411` | `--ink` |

Le logo (`assets/logo.svg`) reprend le motif du fourgon : deux feuilles et la tige qui les
souligne. Le bandeau téléphone de la page d'accueil reprend le même dégradé que le panneau,
avec le numéro en gros — comme sur le flanc du camion.

Pour changer toute la palette, il suffit de modifier le bloc `:root` en haut de
`assets/css/style.css`.

## Choix techniques

- Un seul fichier CSS, variables en haut (`:root`) : changer la palette se fait en trois lignes.
- Aucune police externe : rien à télécharger, rien qui bloque l'affichage, aucun cookie.
- Aucun script tiers, aucun traceur → pas de bandeau cookies à afficher.
- Visionneuse photo native (`<dialog>`), utilisable au clavier (flèches, Échap) et au doigt
  (balayage).
- `prefers-reduced-motion` respecté : les animations s'effacent pour qui les a désactivées.
- Contrastes vérifiés : le plus faible est à 5,6:1, au-dessus du seuil WCAG AA (4,5:1).
