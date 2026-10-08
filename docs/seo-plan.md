# Saint-Cyr Services — plan SEO local

Audit du 6 octobre 2026. Site : https://www.saint-cyr-services.fr/.

## Verdict et objectif

Les bases techniques sont déjà bonnes : site statique, contenu disponible sans
JavaScript, photos de réalisations, pages de prestations, URL canoniques, sitemap,
contacts directs et absence de scripts publicitaires. Le travail utile consiste
à consolider ces bases et la pertinence locale, pas à multiplier les balises.

Priorité commerciale : **entretien de jardin à Montpellier**, tonte et taille de
haies. L'aménagement et la création restent proposés, sans prendre le dessus.
Le crédit d'impôt de 50 % reste réservé aux prestations éligibles via ACCÈS SAP,
sous conditions ; il ne s'applique pas à toute la création paysagère.

Estimation initiale : 10–15 minutes pour le plan, puis 1–2 heures pour l'audit,
les corrections et les tests/publication. Les délais Google ne font pas partie
de ce temps de travail. Une difficulté d'accès à un compte peut rallonger la configuration.

## 1. Périmètre et preuves

Code inspecté : branche `main`, version initiale `aab226b`.
L'API Vercel confirme cette même version en production (`READY`), projet
`saint-cyr-services`, équipe `dorians-projects-cce58770`. Le site public a également
été interrogé directement en HTTP. Il ne suffit pas que le code local soit correct.

Pages inventoriées depuis les fichiers, la navigation et le sitemap :

| URL | Rôle | Observation avant correction |
|---|---|---|
| [/](https://www.saint-cyr-services.fr/) | Entretien et présentation locale | Montpellier dans le titre/H1 ; description d'entreprise JSON-LD encore orientée création |
| [/prestations/entretien-jardin](https://www.saint-cyr-services.fr/prestations/entretien-jardin) | Prestation prioritaire, crédit d'impôt | Titre sans Montpellier ; service et coopération expliqués dans le contenu |
| [/prestations/taille-topiaires](https://www.saint-cyr-services.fr/prestations/taille-topiaires) | Taille de haies et arbres | Titre sans Montpellier ; photos et méthode spécifiques |
| [/prestations/gazon-pelouse](https://www.saint-cyr-services.fr/prestations/gazon-pelouse) | Création de pelouse | Titre/description sans localisation ; contenu distinct |
| [/prestations/amenagement-mineral](https://www.saint-cyr-services.fr/prestations/amenagement-mineral) | Allées et espaces minéraux | Titre/description sans localisation ; contenu distinct |
| [/prestations/plantation-massifs](https://www.saint-cyr-services.fr/prestations/plantation-massifs) | Plantation | Titre/description sans localisation ; contenu distinct |
| [/prestations/piscine-terrasses](https://www.saint-cyr-services.fr/prestations/piscine-terrasses) | Abords de piscine/terrasses | Titre/description sans localisation ; contenu distinct |
| [/mentions-legales](https://www.saint-cyr-services.fr/mentions-legales) | Identité, hébergement, confidentialité | Page disponible ; contenu juridique conservé dans ce chantier SEO |

Observations directes avant modification :

- Les huit pages, `robots.txt` et `sitemap.xml` répondent en HTTP 200.
- Chaque page possède un titre, une description, un H1 et une URL canonique distincts.
- Le domaine sans `www` redirige vers `www` ; les anciennes URL `.html` redirigent
  vers les URL sans extension. Cependant, les liens internes utilisaient encore `.html`.
- L'ancien domaine `saint-cyr-services.vercel.app` servait toujours une copie HTTP 200
  avec une canonique vers le nouveau domaine : pas une redirection.
- Les données `LocalBusiness` ne comportaient pas l'adresse, et les prestataires
  étaient définis différemment entre les pages. L'adresse et l'e-mail sont déjà
  confirmés dans les informations remises par le client et les mentions légales.
- Les communes autour de Montpellier étaient énumérées seulement dans un commentaire
  HTML indiquant leur reprise de la fiche Google. Elles sont désormais visibles dans
  le contact ; aucune commune supplémentaire ni page locale artificielle n'est inventée.
- Les images WebP possèdent déjà des textes alternatifs et des dimensions ; les
  galeries différées et les contacts téléphone/WhatsApp existent. Aucun formulaire
  de devis, réservation, calculateur ou paiement n'est à tester.
- `empreinte.py`, outil de développement, était publiquement téléchargeable : à exclure
  du déploiement, tout comme les documents de travail ajoutés pendant l'audit.

Recherches réalisées : `entretien jardin Montpellier paysagiste tonte taille haies`,
`site:saint-cyr-services.fr`, `Saint Cyr Services Montpellier Lagbo`.
Ce sont des recherches web ordinaires, sans localisation Google Maps contrôlée,
sans compte utilisateur de référence et sans distinction fiable mobile/desktop.
Elles ne prouvent **ni un rang stable, ni l'absence d'indexation** de Saint-Cyr Services.

## 2. Comparaison locale, sans score de classement

Pages publiques examinées pour la même intention « entretien de jardin autour
de Montpellier » : [Bruno entretient vos jardins](https://www.brunopaysagiste.fr/)
et [AEN Paysages — entretien](https://www.aenpaysages.com/entretien-du-jardin/).
AEN couvre un territoire plus large Hérault/Gard : comparaison de contenu,
pas affirmation qu'il s'agit d'un voisin immédiat ou d'un rang Google équivalent.

| Critère observable | Saint-Cyr avant correction | Bruno | AEN Paysages |
|---|---|---|---|
| Intention entretien | Page dédiée, entretien prioritaire à l'accueil | Entretien présenté avec tonte, haies, massifs et évacuation | Page entretien dédiée |
| Localisation dans le contenu | Montpellier visible ; communes détaillées non visibles | Montpellier et communes comme Lattes/Mauguio/Castelnau | Zone Hérault/Gard et rayon d'intervention présentés |
| Explication des prestations | Six pages distinctes, méthode et FAQ sur l'entretien | Prestations d'entretien expliquées | Prestations et FAQ d'entretien |
| Parcours devis/contact | Téléphone/WhatsApp directs, devis gratuit | Téléphone et demande de devis visibles | Demande de devis/contact visible |
| Preuves et limites | Photos de chantiers et extraits d'avis ; compteur d'avis figé | Contenu public examiné, avis récents non audités | Contenu public examiné, avis récents non audités |

Interprétation : Saint-Cyr a déjà un contenu utilisable et une bonne base de
conversion. Rendre le secteur explicite et les pages plus cohérentes est pertinent.
Cette comparaison ne mesure pas les liens entrants, la popularité, le nombre
d'appels ou les positions dans Google Maps ; elle ne prédit pas une première place.

## 3. Plan d'action priorisé

| Priorité | Action | Impact visé | Effort estimé | Pages/composant | État |
|---|---|---|---|---|---|
| P1 | Vérifier l'accès HTTP, l'indexabilité et les canoniques | Permettre une exploration cohérente | 10–15 min | 8 pages, robots, sitemap | Contrôle initial réalisé |
| P1 | Titres/descriptions uniques, prestation + Montpellier | Clarifier l'intention et les extraits de recherche | 15–25 min | 6 prestations, description accueil | Appliqué |
| P1 | Harmoniser l'entreprise avec adresse, téléphone et e-mail confirmés | Compréhension de l'entité locale | 15–25 min | JSON-LD des 7 pages commerciales, pied de page | Appliqué |
| P1 | Liens internes directs et redirection de l'ancien hôte public Vercel | Réduire les variantes d'URL et les redirections inutiles | 10–15 min | 8 pages, vercel.json | Appliqué et vérifié en production |
| P1 | Configurer Search Console et soumettre le sitemap | Mesurer exploration, indexation et requêtes | 15–30 min hors attente Google | Compte Google et DNS OVH | Réalisé ; sitemap traité, 8 URL découvertes (contrôle du 8 octobre 2026) |
| P1 | Vérifier le site web et l'identité sur la fiche Google existante | Cohérence locale et accès au site | 15–30 min | Google Business Profile | Accès de gestion nécessaire |
| P2 | Secteur visible et liens contextuels vers entretien/taille | Répondre aux visiteurs locaux et aider la navigation | 10 min | Contact de l'accueil | Appliqué |
| P2 | Ajouter WebSite et fils d'Ariane structurés conformes au contenu | Aider la compréhension du site | 10–15 min | Accueil et 6 prestations | Appliqué |
| P2 | Enlever le total d'avis figé et renvoyer à la fiche fournie | Éviter une preuve sociale périmée | 5 min | Avis accueil | Appliqué, citations conservées |
| P2 | Mettre à jour le sitemap avec des dates réelles | Communiquer les URL préférées et modifications | 5 min | sitemap.xml | Appliqué ; champs priority/changefreq retirés car ignorés par Google |
| P2 | Tester l'affichage et les interactions puis publier | Prévenir les régressions | 20–30 min | 8 pages, 4 largeurs | Tests locaux réussis, publié et contrôlé en HTTP |
| P2 | Rendre les cartes visibles lorsque JavaScript ne démarre pas | Robustesse et accès au contenu | 5 min | CSS/JS communs | Appliqué |
| P3 | Enrichir progressivement avec des chantiers documentés | Preuves de travail originales, utiles aux clients | 20–40 min par chantier | Réalisations et prestations concernées | Plus tard, avec photos/détails autorisés |

Ne pas ajouter de `meta keywords`, de pages quasi identiques par ville, de
fausses notes, d'horaires supposés, d'avis inventés, de texte bourré de mots-clés
ou d'outils de suivi sans besoin. Pas de FAQPage dans l'espoir d'un résultat
enrichi pour ce paysagiste ; la FAQ reste un contenu utile aux visiteurs.
Les données structurées ne garantissent pas un affichage enrichi.

## 4. Configuration Google et prochaines étapes

### Search Console

Configuration effectuée sur le compte Google de Saint-Cyr : propriété Domaine
`saint-cyr-services.fr` validée par TXT DNS chez OVH. Le sitemap est traité avec
succès et ses huit URL sont découvertes. Les demandes d'indexation de l'accueil
et de la page entretien ont été acceptées. Cela ne confirme pas encore leur
indexation effective ni un classement. Procédure utilisée et accès recommandé :

1. Avec un compte Google autorisé pour l'entreprise, ouvrir
   [Google Search Console](https://search.google.com/search-console).
2. Vérifier d'abord si une propriété existe. Sinon, ajouter une propriété **Domaine**
   `saint-cyr-services.fr` ; cela couvre HTTPS et les variantes avec/sans www.
3. Google fournit une valeur TXT de vérification. Dans OVH, sélectionner uniquement
   le domaine `saint-cyr-services.fr`, Zone DNS, Ajouter une entrée, TXT à la racine
   (`@` selon l'interface) et copier **la valeur fournie par Google**, sans l'inventer.
   Garder les A/CNAME/MX/NS existants : la vérification ne remplace aucun de ces services.
4. Revenir dans Search Console et valider après publication de l'entrée DNS.
   Le délai dépend de la propagation. Garder le TXT après validation.
5. Dans Sitemaps, soumettre `https://www.saint-cyr-services.fr/sitemap.xml`.
6. Inspecter l'accueil et la page entretien. Vérifier exploration autorisée,
   canonique sélectionnée et état d'indexation ; demander l'indexation si nécessaire.
   Éviter des demandes répétées : elles ne forcent pas un classement.
7. Faire inviter le compte du prestataire dans les utilisateurs de la propriété,
   plutôt que partager le mot de passe Google personnel du client.

### Google Business Profile

**État au 8 octobre 2026 :** l'ancienne fiche est gérée par un tiers inaccessible,
et une nouvelle fiche existe. Le dossier de récupération et de doublon est ouvert
dans la communauté. L'utilisateur a répondu à l'expert pour signaler que le parcours
officiel d'assistance ne propose toujours que la communauté, y compris après essai
avec le compte du client. Aucune fusion, suppression ni attribution d'accès n'a été
effectuée. Résoudre cette situation avant d'appliquer la liste ci-dessous et de
diffuser un QR code d'avis pour la fiche définitive.

1. Rechercher la fiche **existante** SAINT CYR SERVICES avec le compte qui la gère.
   Ne pas passer par « Ajouter un établissement » si la fiche existe déjà.
2. Dans les paramètres de la fiche, Personnes et accès, inviter le compte Google
   du prestataire comme **gestionnaire**. Le client reste propriétaire principal.
   Ce rôle suffit pour les modifications habituelles ; pas besoin de céder le compte.
3. Vérifier le champ Site Web : `https://www.saint-cyr-services.fr/`.
4. Confirmer le nom réel, le numéro, la catégorie principale appropriée, les
   prestations et les horaires réels. Ne pas ajouter des mots-clés au nom commercial.
5. Vérifier la configuration d'entreprise de zone desservie : ne pas afficher
   l'adresse comme un lieu d'accueil si les clients n'y sont pas reçus.
6. Ajouter quelques photos récentes autorisées et les prestations réellement proposées,
   en gardant l'entretien en priorité et la création en complément.
7. Depuis l'action pour demander des avis, récupérer le lien **direct pour laisser
   un avis** et générer un QR code à partir de ce lien exact. Le lien de partage
   fourni par le client ouvre la fiche, mais n'est pas vérifié comme lien direct d'avis.
   Inviter les clients réels sans cadeau, achat d'avis ni filtrage des clients mécontents.

La configuration Search Console a été réalisée après les modifications du code,
avec l'autorisation de l'utilisateur. Aucun accès de prestataire supplémentaire
n'a été accordé. La fiche Google Business Profile reste un chantier distinct :
aucun paramètre de fiche ni avis n'a été modifié dans cette configuration.

## 5. Mesure et suivi

Avant publication puis après : lancer `node scripts/check-seo.cjs` et
`node scripts/check-seo.cjs --live`. Pour l'affichage :
`node scripts/check-seo.cjs --browser` (Chrome et Playwright nécessaires).
Le contrôle automatisé vérifie les pages, les données JSON-LD, les liens/ancres,
les ressources, le menu et les galeries à 320, 390, 768 et 1440 px.
Téléphone/WhatsApp/e-mail sont vérifiés comme destinations, sans appeler ni
envoyer de messages à des tiers. Une validation automatisée JSON-LD n'est pas
une promesse d'éligibilité à un résultat enrichi Google.

Après accès Google : relever une base Search Console (pages indexées, impressions,
clics, requêtes et pages) et les interactions de la fiche. Demander au client le
nombre de contacts/devis qualifiés, sans installer de traceur juste pour cocher une case.
Comparer après environ 4 semaines, puis 8–12 semaines, des périodes comparables
en tenant compte de la saisonnalité. Ces dates sont des rendez-vous de mesure,
pas des promesses de hausse. Vérifier rapidement les erreurs d'exploration nouvelles.

Non mesuré à ce stade : historique de performances Search Console, Analytics, conversions réelles, backlinks,
classement local géolocalisé et Core Web Vitals de vrais visiteurs. Les tests de
mise en page ne constituent pas une mesure de LCP/INP/CLS en production.
Un contrôle [PageSpeed Insights](https://pagespeed.web.dev/) peut compléter la
mesure de laboratoire ; l'absence de données terrain d'un petit site ne signifie
ni bonnes ni mauvaises performances. Ne pas refondre le site sans problème démontré.

## Sources de référence

- [Google — Guide SEO pour débutants](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=fr) : contenu, titres, descriptions, liens et limites des promesses.
- [Google — LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business?hl=fr) : nom/adresse, informations véridiques et représentation de l'entreprise.
- [Google — Fil d'Ariane](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=fr) : liste ordonnée et URL des pages.
- [Google — Nom du site](https://developers.google.com/search/docs/appearance/site-names?hl=fr) : WebSite sur l'accueil.
- [Google — Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=fr) : canoniques, lastmod réel, priority/changefreq ignorés.
- [Google — URL en double](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=fr) : redirections, canoniques et cohérence des liens.
- [Google — Classement local](https://support.google.com/business/answer/7091?hl=fr) : pertinence, distance et popularité ; fiche complète et avis.
- [Google — Avis et résultats enrichis](https://developers.google.com/search/docs/appearance/structured-data/review-snippet?hl=fr) : exclusion des avis intéressés pour sa propre entreprise locale.
- [Google — Accès à la fiche](https://support.google.com/business/answer/3403100?hl=fr) : rôles et invitations, sans partager les mots de passe.
- [Google — Demander des avis](https://support.google.com/business/answer/3474122?hl=fr) : lien, QR code et règles sur les sollicitations d'avis.
- [Vercel — Configuration](https://vercel.com/docs/project-configuration/vercel-json) : URLs propres et redirection conditionnelle par hôte.
- [Vercel — Fichiers ignorés depuis Git](https://vercel.com/blog/changelog-may-2020) : prise en charge de .vercelignore.

## Journal de validation

Contrôles locaux du 6 octobre 2026 :

- `node scripts/check-seo.cjs` : réussite, 8 pages et 52 ressources.
- `node scripts/check-seo.cjs --browser` : réussite sur les 8 pages à 320, 390,
  768 et 1440 px, soit 32 vues contrôlées. Aucun débordement horizontal,
  image manquante ou erreur JavaScript détecté dans ces scénarios.
- Menu mobile : ouverture, fermeture avec Échap, fermeture après navigation.
- Galeries : ouverture, changement de photo et fermeture avec Échap.
- Contenu/cartes visibles sans JavaScript ; animation vérifiée avec JavaScript
  et réduction des animations testée. Captures accueil mobile/desktop inspectées.
- Liens téléphone, WhatsApp et e-mail vérifiés sans contact réel avec des tiers.
- `git diff --check` : aucune erreur d'espacement.

Vérification en production du 6 octobre 2026 :

- URL : https://www.saint-cyr-services.fr/.
- Cible : production ; statut Vercel **READY** ; version fonctionnelle `41bfe8a` sur `main`.
- Projet : `saint-cyr-services`, équipe `dorians-projects-cce58770` ; framework : HTML statique.
- Déploiement : `dpl_5uVdjFGriPU3VBMkAyvB4khb3zt5`, construction environ 3,4 secondes
  d'après les horodatages Vercel. L'alias officiel est bien affecté à ce déploiement.
- `node scripts/check-seo.cjs --live` : réussite. Les 8 pages publiques correspondent
  à la version locale, les 52 ressources répondent, le sitemap est à jour et aucun
  en-tête `X-Robots-Tag: noindex` ne bloque les pages.
- `node scripts/check-seo.cjs --browser --live` : réussite, les mêmes 32 vues
  et interactions contrôlées sur le site réellement publié, dans Chrome headless.
  Ce n'est pas une certification de tous les navigateurs ou téléphones possibles.
- Les variantes testées sans www, l'ancien hôte Vercel et les chemins `.html`
  redirigent de façon permanente vers les URL préférées.
- L'URL inexistante, `empreinte.py`, le plan et le script de test répondent 404 :
  les documents de travail ne sont pas exposés par le déploiement.
- Observabilité : aucun problème HTTP détecté dans ces contrôles. Journaux runtime,
  drains et suivi continu non audités ; aucun service payant ou traceur ajouté.

Ces contrôles portent sur des scénarios précis, pas sur une garantie d'absence totale de bugs.

Configuration Search Console du 7 octobre, contrôlée le 8 octobre 2026 :

- Propriété Domaine `saint-cyr-services.fr` validée sur le compte Google du client.
- Un seul TXT Google ajouté à la racine chez OVH après confirmation explicite.
  Sa présence a été vérifiée sur les deux serveurs DNS OVH et les résolveurs publics
  Google et Cloudflare. Conserver cet enregistrement pour garder la validation.
- Enregistrements A, CNAME www, MX, NS et TXT/SPF préexistants conservés ;
  le site répond toujours en HTTP 200.
- `https://www.saint-cyr-services.fr/sitemap.xml` envoyé. L'erreur initiale
  « Impossible de récupérer le sitemap » a disparu : le rapport affiche désormais
  **Opération effectuée**, type Sitemap, **8 pages découvertes**, aucune vidéo.
- Le test en ligne de Search Console a également confirmé l'accès de Google au sitemap.
- L'accueil et `/prestations/entretien-jardin` ont été inspectés ; Google a confirmé
  **Indexation demandée** pour les deux URL. Aucune demande répétée n'est nécessaire.
  Huit URL découvertes dans le sitemap ne signifie pas huit pages déjà indexées.
- Vérification HTTP indépendante : sitemap XML valide avec huit URL uniques,
  toutes accessibles ; robots.txt autorise leur exploration. Aucun problème
  technique nécessitant une modification du site n'a été observé dans ces contrôles.
- Prochaine étape : consulter les rapports d'indexation et de performances lorsque
  les données Google sont disponibles. Aucun suivi automatique n'a été programmé.

### Complément du 8 octobre 2026, soirée

- L'inspection individuelle dans Search Console confirme désormais **« Cette URL
  est sur Google »** pour l'accueil et `/prestations/entretien-jardin`. Le fil
  d'Ariane de l'entretien est valide. Les rapports globaux Indexation et Performances
  sont encore en traitement : aucun nombre total de pages indexées, de clics ou
  d'impressions ne peut être déduit de ces deux inspections.
- PageSpeed Insights Google, mobile simulé : accueil 99/100, entretien 99/100 en
  performances ; contrôles automatiques accessibilité, bonnes pratiques et SEO
  à 100/100. Accueil desktop : 100/100 dans les quatre catégories. Absence de données
  terrain CrUX. Mesures de laboratoire, pas un score de positionnement Google.
- Ajout d'un guide pratique `/conseils/preparer-devis-entretien-jardin`, relié à
  l'accueil, à l'entretien et aux pieds de page. Le site passe à neuf URL dans son
  sitemap ; la découverte de neuf URL par Google devra être constatée séparément.
- Images principales des six prestations rendues adaptatives avec leurs variantes
  WebP existantes. Pas de création d'images ni de cas clients fictifs.
- Correction du menu mobile : les liens fermés ne captent plus le clavier hors
  écran, et les liens restent utilisables sans JavaScript.
- Détails, mesures, publication et limites : [bilan du 8 octobre](seo-2026-10-08.md).
