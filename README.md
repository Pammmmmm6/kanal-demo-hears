# Maquette LP : KANAL × Hears (base : clone jpegsmafia.com)

Copie de la maquette FinCut (`../Maquette LP`), adaptée à la marque **Hears**
(bouchons d'oreilles haute fidélité, https://hears.com). Même moteur
d'animation, habillé en thème WhatsApp. Tout le texte visible est en
**anglais américain**, prix en USD. La démo montre **trois automatisations**
(conversations) et **trois campagnes** (un message unique suivi d'une commande).

| Ordre | Groupe (lecteur) | Titre (lecteur) | Clé `FLOWS` | Libellé entre les deux traits |
|---|---|---|---|---|
| 1 | Automation | Abandoned cart | `abandoned-cart` | Abandoned cart |
| 2 | Campaign | Black Friday | `black-friday` | Campaign · Black Friday |
| 3 | Automation | Order confirmation | `order-confirmation` | Order confirmed |
| 4 | Campaign | Hears × Pacha | `pacha` | Campaign · Hears × Pacha |
| 5 | Automation | AI Agent | `ai-agent` | Abandoned cart |
| 6 | Campaign | Hears Sleep launch | `hears-sleep` | Campaign · Hears Sleep launch |

Une automatisation, une campagne, en alternance.

## Automatisations

Conversations complètes entre Hears et Marie.

- **Abandoned cart** : photo lifestyle, questions rapides, 4 tailles d'embouts,
  essai 100 jours, code HEARS10, séparateur « ORDER PLACED · $38.70 » avec le
  logo Shopify.
- **Order confirmation** : confirmation, suivi, expédition DHL, livraison.
- **AI Agent** : démarre comme le panier abandonné ; la cliente demande la
  matière des embouts (peau sensible), l'agent (« Hears · AI Agent ») répond
  (TPE hypoallergénique, essai 100 jours) puis recommande Hears Sleep et le Deep
  Sleep Mask ; séparateur « ORDER PLACED · $82 » avec le logo Shopify (Hears +
  Hears Sleep).

## Campagnes

Chaque campagne = **un seul message** de Hears (photo, texte, un bouton qui
ouvre la vraie page produit sur hears.com dans un nouvel onglet). Environ 1 s
après le message arrive le séparateur de commande, identique aux autres
séparateurs avec le logo Shopify (dans un petit cercle blanc de 20 px) devant
le texte : « ORDER PLACED · $86 » (`op: 'event', kind: 'order', text, amount`
dans `app.js`). Puis Marie remercie en **un seul message** vert qui reprend sa
commande.

| Campagne | Visuel | Bouton → page | Commande | Réponse de Marie |
|---|---|---|---|---|
| Black Friday (offre **fictive** : Buy 2, Get 1 Free + Carry Pouch offerte, accès VIP WhatsApp) | `campaign-bf-hero.jpg` | Shop the Black Friday deal → `/products/hears-earplugs` | $86 (3 × $43, une offerte) | Thanks for the heads-up! I grabbed 3 pairs: one for me and two for Christmas gifts 🎁 |
| Hears × Pacha (Pacha Ibiza Edition, retour pour la saison 2026, édition limitée) | `campaign-pacha-hero.jpg` | Discover the Pacha Edition → `/products/pacha-2-0` | $92 (2 × $46, livraison offerte) | Thanks for keeping me posted! I got two, one for me and one for my best friend. See you on the dance floor 🍒 |
| Lancement Hears Sleep (« quietest earplugs we’ve ever made », côté, 4.9/5, 100 nuits) | `campaign-sleep-hero.jpg` | Discover Hears Sleep → `/products/hears-sleep` | $39 | Perfect timing, I’ve been sleeping so badly lately. Thanks for reaching out! 😴 |

Faits vérifiés sur hears.com et la presse le 2026-09-14 (partenariat Hears ×
Pacha Ibiza depuis juin 2025, Pacha Edition 2.0 à $46 marquée LIMITED EDITION,
Hears Sleep publié fin mai 2026 avec badge « Just launched », iF Design Award
2026). Aucun chiffre en dB n'est publié pour Hears Sleep : ne pas en ajouter.

Images non utilisées gardées dans `assets/unused/` (anciennes étapes des
campagnes et du welcome pop-up retiré).

## Faits et éléments inventés

Présents sur hears.com : 500 000 clients, plus de 10 000 avis 5 étoiles, essai
100 jours remboursé même porté, 4 tailles d'embouts (XS à L), embouts TPE
hypoallergéniques (silicone pour Hears Sleep), conçus et fabriqués en Europe,
livraison offerte dès $50, DHL 3 à 5 jours ouvrés, prix des produits.
**Illustratifs** (inventés pour la démo) : l'offre Black Friday, le code
HEARS10, le n° de commande HRS-10428, le suivi DHL 1234 5678 90, le créneau de
livraison et les montants des commandes.

## Thème, rythme, enchaînement

**Thème WhatsApp** : fond à motifs de l'app (`assets/whatsapp-bg.webp`, répété à
380 px, fixe au scroll), bulles de la marque blanches `#ffffff`, bulles de la
cliente vertes `#d9fdd3`, texte `#111b21`, ombre de bulle WhatsApp, actions en
vert WhatsApp `#008069` (plus aucun bleu ; boutons secondaires gris).

**Mise en page** :

- **Écran large (1280 px et plus)** : trois colonnes (grille dans `.page`).
  À gauche (`.rail--left`, 340 px max) la carte Hears et le lecteur ; au
  centre (`.stage`) la conversation, même largeur qu'avant (540 px) et centrée
  dans l'écran, alignée en haut ; à droite (`.rail--right`) la carte
  « contacter KANAL ». Les deux colonnes latérales sont **fixes** à l'écran
  (`position: fixed`, 48 px du haut, 32 px de la conversation) : elles ne
  bougent jamais, seule la conversation défile. Si l'écran fait moins de
  660 px de haut, elles reprennent leur place dans la grille et défilent avec
  la page, pour ne rien couper.
- **En dessous de 1280 px** : les colonnes s'effacent (`display: contents`) et
  tout s'empile comme avant : carte Hears, lecteur collé en haut (12 px du
  haut, 8 px sur mobile), conversation, carte KANAL, bouton de retour en haut.

**Carte Hears** : logo, nom, description, puis WhatsApp en chiffres (« 3B+ ·
people use WhatsApp », « 87% · open it every day »).

**Carte KANAL** (même style) : logo KANAL (`assets/avatar-kanal.png`, icône
de l'app reprise de getkanal.com), phrase d'accroche, « 500+ · Shopify
brands » et « 5.0/5 · Shopify App Store » (chiffres publiés par KANAL dans
`llms.txt` de getkanal.com, relevés en août 2026), bouton vert « Book a call »
vers https://cal.com/team/kanal/demo (lien de démo du site KANAL), bouton gris
« Discover KANAL » vers https://getkanal.com, et « Official WhatsApp API,
built for Shopify. ». Le pied de page (mention « powered by KANAL », liens et accroche) a été retiré ; seul reste le bouton de retour en haut.

**Le lecteur façon YouTube** (`.player`) :

- à gauche, en petit, le groupe (AUTOMATION ou CAMPAIGN, 10 px capitales) au
  dessus du nom de la démo en cours (14 px, graisse 500) ;
- à droite, deux petits boutons ronds de 30 px aux icônes de 14 px : pause /
  lecture (fond gris très léger) et démo suivante (sans fond) ;
- dessous, une barre fine (3 px, arrondie, verte sur piste grise) en retrait
  de 16 px des bords de la carte (14 px sur mobile). Elle ne montre que **la
  démo en cours** : elle se remplit jusqu'à la fin de cette automatisation ou
  campagne, puis repart de zéro pour la suivante ;
- sous la barre, **la liste des six démos** dans l'ordre de lecture (`#playlist`,
  construite par `app.js` depuis `PLAYLIST`) : coche verte pour celles déjà
  jouées, petit égaliseur vert animé pour celle en cours (figé en pause),
  numéro pour celles à venir, et le groupe (Automation / Campaign) à droite.
  Un clic sur une ligne lance directement cette démo. Sous 1280 px (lecteur
  collé en haut), la liste devient une rangée de pastilles qui défile de côté,
  recalée sur la démo en cours à chaque changement.

**Rythme volontairement rapide** : `SPEED = 1.8` (tous les délais divisés par
1,8) et `HOLD = 2500` ms de pause après le dernier message. Durées : abandoned
cart 11,1 s, order confirmation 14,3 s, AI agent 20,2 s, chaque campagne 5,4 s,
cycle complet environ 62 s.

**Enchaînement** : les six démos se jouent dans l'ordre de `PLAYLIST` puis
reprennent au début. La progression est calculée sur le temps écoulé (pas
d'animation CSS), ce qui permet la **pause exacte** : en pause, les messages
restants ne partent plus, les 3 points « en train d'écrire » se figent et la
barre s'arrête ; à la reprise, la démo continue au même instant. « Suivant » et
le passage automatique à la démo suivante remettent la barre à zéro et relancent
toujours la lecture. La démo démarre toujours par le panier abandonné (une ancre
dans l'URL est ignorée et retirée) et n'écrit rien dans l'URL. Les boutons
factices (`href="#"`) des conversations et du pied de page n'ont aucun effet sur
la démo.

**Pilotage depuis la console** : `KANAL.pause()`, `KANAL.resume()`,
`KANAL.next()`, `KANAL.load('pacha')`, `KANAL.isPlaying()`, `KANAL.elapsed()`.

**Petits écrans** : le nom de la démo est tronqué avec « … » s'il manque de
place ; les bulles restent dans la colonne.

## Reste à faire

- `assets/avatar-hears.png` : cœur Hears (favicon du site) recentré sur fond
  pêche pour le recadrage circulaire. À remplacer si Hears fournit un logo.
- `assets/favicon-kanal.svg` est un placeholder (monogramme « K »).
- La version française de la démo Hears n'est pas conservée ; la maquette
  d'origine en français est celle de FinCut, dans `../Maquette LP`.

## Dépôt et mises en ligne

Code sur GitHub : https://github.com/Pammmmmm6/kanal-demo-hears (public).
Deux hébergements pour la même maquette :

| Adresse | Mise à jour |
|---|---|
| https://pammmmmm6.github.io/kanal-demo-hears/ | automatique à chaque `git push` sur `main` (workflow `.github/workflows/pages.yml`) |
| https://kanal-demo-hears.vercel.app | `npx vercel@latest deploy --prod --yes --scope erevan1` |

`.gitignore` exclut `.env*`, `.vercel` et les vidéos `assets/previews` (46 Mo, héritées
du clone FinCut et inutilisées ici).

## En ligne (Vercel)

https://kanal-demo-hears.vercel.app (projet `kanal-demo-hears`, équipe Vercel « Erevan »).
Page en `noindex, nofollow` (balise meta + en-tête `X-Robots-Tag` dans `vercel.json`) :
accessible par le lien, pas référencée par les moteurs de recherche.
`.vercelignore` exclut `.claude`, ce README, `.env*`, `.vercel` et les assets non utilisés
(vidéos `assets/previews`, `assets/unused`, anciennes images FinCut).

Mettre à jour la version en ligne après une modification :

```bash
npx vercel@latest deploy --prod --yes --scope erevan1
```

## Lancer en local

```bash
node .claude/serve.mjs 4322
```

Puis ouvrir http://localhost:4322 (le serveur Python n'a pas le droit de lire le Bureau depuis l'app).

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | structure de la page (profil, lecteur, barre de date, chat vide, footer, icônes SVG) |
| `assets/style.css` | tout le design system relevé sur le site d'origine |
| `assets/app.js` | scénario de la conversation + moteur d'animation |
| `assets/` | images, avatars, polices Inter, vidéos de preview au survol |

## Où modifier quoi (étape 2)

**Le contenu des conversations** : `assets/app.js`, objet `FLOWS`.
Une entrée par démo (`trigger` = le libellé entre les deux traits, `steps` =
la conversation). Ajouter une démo = une entrée dans `FLOWS` + une ligne
`{ key, group, name }` dans `PLAYLIST` (même fichier) : l'ordre de `PLAYLIST`
donne l'ordre d'enchaînement, `group` et `name` sont affichés dans le lecteur.

Chaque entrée de `steps` = une étape de la conversation.

- `delay` : temps d'attente **avant** de jouer l'étape (ms)
- `op`
  - `typing` : ouvre une nouvelle ligne (avatar + nom + les 3 points)
  - `reply`  : remplace les 3 points par le contenu (même ligne)
  - `add`    : empile un contenu de plus dans la ligne en cours
  - `you`    : message vert à droite (la cliente)
  - `event`  : séparateur horizontal avec un libellé ; `kind: 'order'` +
    `amount` = même séparateur avec le logo Shopify devant (campagnes)
- `kind` : `bubble` | `card` (image + texte + boutons) | `panel` (bulle large) | `cta` (texte + boutons) | `form`
- `buttons: [{ label, ghost, icon, href, restart }]` sur un `cta` ou une `card` :
  autant de boutons que voulu, empilés. `ghost: true` = bouton gris secondaire.
  Un `href` en `https://` s'ouvre dans un nouvel onglet.
- `tight: true` sur un `cta` : 8 px entre le texte et les boutons (au lieu de 12)
- sur une `card` : `img` + `cap` (le texte sous l'image), `w`/`h` = dimensions
  réelles du fichier (réserve la place, évite le saut de mise en page),
  `auto: true` = l'image garde ses proportions, sinon elle est recadrée en
  199 px de haut (`tall: true` → 240 px)
- `dropLabel: true` : retire le nom de l'auteur au moment de la réponse
- `\n` dans un texte = retour à la ligne
- `**texte**` dans un texte = passage en gras

**La vitesse** : constante `SPEED` en haut de `app.js` (`1` = timings du site
d'origine ; actuellement `1.8`). La pause de fin est `HOLD`.

**Les avatars** : objet `AVATARS` en haut de `app.js`.
`assets/avatar-hears.png` = avatar de la marque (clé `hears`). Le nom affiché à droite se change avec `VISITOR`.

**Le profil, le footer, les mentions @marque, le libellé de l'événement
déclencheur par défaut** (`#trigger-label`, « Abandoned cart », entre les deux
traits) : directement dans `index.html`.

**Le suivi du scroll** : la page descend d'elle-même à chaque nouveau message
(`follow()` dans `app.js`). `FOLLOW_MARGIN` = l'espace laissé sous le dernier
message (96 px). Si le visiteur remonte lui-même, le suivi s'arrête ; il
reprend dès qu'il redescend en bas de page.

**Les couleurs** : variables `--wa-*` du bloc « Thème WhatsApp » de
`assets/style.css` (`--wa-in` bulle marque, `--wa-out` bulle cliente,
`--wa-green` actions, `--wa-bg` fond). Les variables d'origine (`--blue`,
`--bubble`…) sont surchargées par ce bloc.

## Timings

Valeurs écrites dans `app.js` (reprises du bundle Framer d'origine), toutes
divisées par `SPEED` à la lecture. Les réponses de la cliente arrivent après
**1800 ms** au lieu de 1000 ms dans l'original.

- 2000 ms : les 3 points avant chaque réponse de Hears
- 1800 ms : avant chaque réponse de Marie
- 800–1400 ms : entre deux bulles d'un même groupe

Animation d'entrée : spring `stiffness 400 / damping 30 / mass 1`,
`opacity 0 → 1` + `translateX ∓8px`. Les 3 points cyclent toutes les 300 ms
(opacités 1 / .5 / .2).

## Écarts connus vs l'original (volontaires)

- Le bloc « bio » : Framer utilise un conteneur de 92 px de haut avec un texte
  de 120 px qui déborde. Ici c'est un `gap: 6px` qui produit exactement le même
  rendu, mais qui reste correct si le texte change de longueur.
- Bouton secondaire : texte en `#161616` (sur le site d'origine il est
  blanc sur fond gris clair, donc illisible : visiblement un bug de leur côté).
- Les blocs propres à Jpegs Mafia (galeries de créas, témoignages clients,
  carte « Monthly Output », formulaire de contact) ont été retirés avec la
  conversation. Le code des types `card`, `panel` et `form` est toujours là,
  ainsi que les images dans `assets/` : il suffit de rajouter des étapes dans
  `STEPS` pour les réutiliser.
