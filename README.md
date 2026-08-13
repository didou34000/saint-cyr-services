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
| Contact | **Jours et horaires d'appel** — la fiche Google indique une fermeture à 19 h, le détail par jour reste à recopier | `index.html` (carte Téléphone) |
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

## Après chaque modification du CSS ou du JS

```bash
python3 empreinte.py
```

Le script recalcule une empreinte du contenu de `style.css` et `main.js` et l'ajoute aux liens
des 8 pages (`style.css?v=92cf1b4a`). Tant que le fichier ne bouge pas, l'empreinte ne bouge
pas et le navigateur garde sa version en cache. Dès qu'il change, l'URL change et le navigateur
recharge tout seul.

Sans ça, une correction de CSS peut rester invisible pendant une heure : le navigateur continue
de servir l'ancienne feuille depuis son cache, et on croit que le bug n'est pas corrigé.

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

Elle vient des fichiers officiels de l'entreprise : `logo.png` et `favicon.png`. Les couleurs
du site ont été relevées au compte-gouttes dessus, rien n'est inventé.

| | Relevé sur le logo | Variable CSS |
|---|---|---|
| Lime de la feuille haute | `#8fbf1a` | `--vert` |
| Lime clair | `#b4dc3c` | `--vert-clair` |
| Vert forêt de la feuille basse | `#084020` | `--vert-deep` |
| Fond du favicon (sections sombres) | `#06301d` | `--ink-2` |
| Texte | `#10241a` | `--ink` |

Fichiers générés à partir des originaux (qui restent dans `photos/`) :

- `assets/logo-mark.webp` — la marque seule (le « S » feuille), utilisée dans l'en-tête et le pied de page
- `assets/logo.webp` — le lockup complet avec le texte, disponible pour les documents et impressions
- `assets/favicon-32.png`, `favicon-180.png` (icône iOS), `favicon-512.png`

Pour changer toute la palette, modifier le bloc `:root` en haut de `assets/css/style.css`.

## Les avis clients

Les avis affichés sur la page d'accueil sont **recopiés mot pour mot depuis la fiche Google
« SAINT CYR SERVICES »** (5,0 sur 5, 4 avis) : Damien Arnaud et Trésors de couture. Les deux
autres avis sont des notes sans commentaire, ils ne sont donc pas affichés.

Ne rien reformuler : ce sont les mots des clients. Pour en ajouter un, dupliquer le bloc
`<figure class="avis__carte">` dans `index.html` et recopier le texte tel quel.

La note globale n'est volontairement **pas** déclarée en `aggregateRating` dans les données
structurées : Google interdit de baliser sur son propre site des avis collectés sur une
plateforme tierce. Elle est affichée en texte, ce qui est autorisé.

## À faire sur la fiche Google

La fiche « SAINT CYR SERVICES » n'a **aucun site web renseigné** (elle affiche encore
« Ajouter un site Web »). Dès que le nom de domaine définitif est en place, l'ajouter à la
fiche : c'est le geste qui rapporte le plus en référencement local, et il prend deux minutes.

Les horaires réels figurent sur la fiche (fermeture à 19 h). Ils n'ont pas été recopiés sur le
site faute de connaître le détail jour par jour.

## Choix techniques

- Un seul fichier CSS, variables en haut (`:root`) : changer la palette se fait en trois lignes.
- Aucune police externe : rien à télécharger, rien qui bloque l'affichage, aucun cookie.
- Aucun script tiers, aucun traceur → pas de bandeau cookies à afficher.
- Visionneuse photo native (`<dialog>`), utilisable au clavier (flèches, Échap) et au doigt
  (balayage).
- `prefers-reduced-motion` respecté : les animations s'effacent pour qui les a désactivées.
- Contrastes vérifiés : le plus faible est à 5,6:1, au-dessus du seuil WCAG AA (4,5:1).
