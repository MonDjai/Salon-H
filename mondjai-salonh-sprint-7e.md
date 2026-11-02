# MonDjai/Salon H — Sprint 7E : note de livraison

**Aujourd’hui en cases, « + » charge, rappel de saisie, jauge du loyer, étiquettes** · version **SalonH-7E · cache 7** · livrée le 31/10/2026 · départ : SalonH-7D · cache 6

Réponses appliquées aux points à trancher (choix par défaut du prompt et recommandations du cahier, aucune autre réponse reçue) : **2-A** ordre du 29/09 gardé · **3-A** le « + » sert aux charges · **7-A** ligne « Ce mois-ci » · **8-A** rappel activé par défaut · **9-A** jauge du loyer · **10-A** étiquettes sur Gel et produits, Réparation tondeuse et Transport.

## 1. Fichiers à déposer sur GitHub

| Fichier | Statut | Remarque |
|---|---|---|
| index.html | **Modifié** | À déposer avec sw.js, ensemble |
| sw.js | **Modifié** | VERSION_CACHE "7", cache « mondjai-salonh-v7 » |
| manifest.json | Inchangé | (redéposé tel quel) |
| Les 9 icônes | Inchangées | — |

Avant de déposer : « Sauvegarder mes données » sur chaque téléphone de test. Après : ouvrir l’appli en ligne ; elle se met à jour seule. Vérifier « SalonH-7E · cache 7 » dans Réglages › À propos.

**Ni le 7C ni le 7D n’ont encore été testés sur téléphone.** La fiche du § 7 couvre les trois sprints.

## 2. Ce qui change pour le coiffeur

| Sujet | Maintenant (7E) |
|---|---|
| Aujourd’hui | Cases dans l’ordre du 29/09 : **Recette du jour** (grande case sur le bandeau, « + Recette » ou « ✏️ Modifier ») → **Charges** (« + Charge ») \| **Épargne** (jauge) → **Solde net du jour** (« Jour à perte » inchangé) |
| Ce mois-ci | Sous le solde : « Ce mois-ci : … F › » (solde net du mois), qui ouvre Mon état › Mois |
| Bouton « + » | Rond ambre à droite de « Ce mois-ci » : **+ → rubrique → Enregistrer**, montant prérempli, au jour affiché (jour passé compris), message Annuler |
| Recette en 2 taps | Case Recette → le champ reçoit le curseur → Enregistrer |
| Sans défiler | Sans avis, tout tient à 390×844 (et à 360×640) ; avec des avis, les cases se resserrent |
| Avis (sous les cases) | Loyer dû · jauge du loyer · rappel de saisie · sauvegarde · installation (ordre du cahier § 9.2) |
| Rappel de saisie | À l’ouverture, si hier est vide : « 📝 Hier n’est pas noté · Saisir hier · Je n’ai pas travaillé ». Réglages › Rappels : interrupteur (activé par défaut) et jours de repos (aucun par défaut) |
| Jauge du loyer | Loyer chaque semaine ou chaque mois : « 🔑 Loyer de la semaine / du mois à couvrir », %, « Loyer couvert ✓ » ou « encore … à couvrir ». Simple repère, rien n’est déduit |
| Étiquettes | Pastilles facultatives sous le montant : Gel · Mousse · Lotion · Huile · Parfum ; Tondeuse · Rasoir · Ciseaux · Sèche-cheveux ; Taxi · Woro-woro · Gbaka · Moto-taxi ; « + Autre » mémorisé. Visibles dans les listes (« Gel et produits · Mousse »), dans Mes habitudes (« Par étiquette ») et dans l’Excel (colonne « Détail ») |

Les chiffres d’Aujourd’hui ne changent pas, et l’image exportée est identique à la 7D.

## 3. Résultats des tests (avant livraison)

| Banc | Vérifications | Résultat |
|---|---|---|
| 0 · Logique (jsdom) | 33 | ✅ 0 échec |
| 1 · 7D ↔ 7E : 5 jeux × 28 écrans × 3 tailles et thèmes : mêmes chiffres, rien de perdu, image exportée identique | 45 | ✅ 0 échec |
| 2 · Saisie sans redessin, clavier stable, animations ; données identiques à la 7D | 49 | ✅ 0 échec |
| 3 · Démarrage < 1,5 s au processeur ×6 (222 à 604 ms), sans image blanche ni éclair ; secours ; ES5 | 50 | ✅ 0 échec |
| 4 · Installation guidée sur 20 navigateurs | 156 | ✅ 0 échec |
| 5 · Service worker réel : mise à jour 7D → 7E, mode avion, écrans 320 à 412 px | 32 | ✅ 0 échec |
| 6 · Socle 7B rejoué (copie de secours, trace, Annuler, mises à jour) | 82 | ✅ 0 échec |
| 7 · Thème rejoué, nouveaux éléments compris : contraste, éclairs, bandeau | 67 | ✅ 0 échec |
| 8 · 7D rejoué : menu, en-tête, Mes charges, Mes habitudes, retour, Excel | 49 | ✅ 0 échec |
| 9 · 7E : cases, « + », Ce mois-ci, rappel (horloge simulée), jauge du loyer, étiquettes | 62 | ✅ 0 échec |
| **Total** | **625** | **✅ 0 échec** |

Contraste : 2 286 textes en Clair, sur 65 écrans et feuilles (le plus faible 4,65:1), et 2 258 en Sombre (5,01:1). Les bords du « + » et des pastilles choisies dépassent 3:1 en Clair.

À signaler : lors d’un passage complet des bancs, une étape du banc 6 a dépassé son délai d’attente une fois. Elle porte sur un rechargement lancé par le banc juste après la remise en place automatique des données. Relancé seul trois fois puis une quatrième, le banc 6 passe sans échec (82/82). La même chose était arrivée une fois au 7C. C’est probablement une course entre deux rechargements dans le banc lui-même ; à surveiller.

## 4. Choix faits là où le prompt laissait la main

| N° | Sujet | Choix | Raison |
|---|---|---|---|
| 1 | Place du « + » | Rond, ambre, posé à droite de « Ce mois-ci », dans le flux de l’écran (pas flottant au-dessus du contenu) | Il ne peut recouvrir aucun montant ni bouton, à toutes les tailles (vérifié) |
| 2 | Avis | Sous les cases et « Ce mois-ci ». La case Recette est donc toujours la première carte, à cheval sur le bandeau | Les chiffres d’abord ; sans défiler quand il n’y a pas d’avis |
| 3 | Hauteur des cases | Mesurée après chaque rendu : hauteur de l’écran − place du menu − « Ce mois-ci » − avis ; jamais moins que la somme des hauteurs minimales. Recalculée au redimensionnement, jamais pendant que le clavier est ouvert | Fin du compte de bandeaux (nbBandeaux) ; pas de saut d’écran au clavier |
| 4 | Petits écrans (≤ 700 px de haut) | Cases plus compactes : icônes, montants et pastilles plus petits | Tout tient à 360×640 aussi |
| 5 | « Ce mois-ci » | Solde net du mois en cours (recette − charges − épargne), en vert ou en rouge | Le même chiffre que Mon état › Mois |
| 6 | Curseur dans le champ | À l’ouverture d’une feuille, le champ montant vide reçoit le curseur. Un montant déjà prérempli ne l’ouvre pas | Recette en 2 taps ; charge en 3 taps sans clavier |
| 7 | Rappel : « jamais deux fois le même jour » | Marqué dès qu’il s’affiche (meta.rappelSaisieVu). La carte reste le temps de l’ouverture, jusqu’à une réponse ; plus rien à la réouverture du même jour | Lecture stricte de la règle |
| 8 | Rappel : « veille notée » | Une recette (même 0 F), une charge ou des anciens clients suffisent | « Ni recette ni charge » |
| 9 | « Saisir hier » | Aujourd’hui passe sur la veille (« Vous complétez le … ») : recette et charges s’y notent | « Ouvre la saisie sur la veille » |
| 10 | Jauge du loyer | Recettes du jour de la dernière échéance jusqu’à aujourd’hui ÷ loyer, arrondi à l’inférieur, 99 % au plus tant que ce n’est pas couvert. Le pied indique aussi « … F sur … F » | Cahier § 9.3 |
| 11 | Étiquettes « + Autre » | Petit champ (24 caractères au plus), mémorisé par rubrique (6 au plus, les plus récentes : ETIQUETTES_PERSO_MAX). Annuler retire aussi l’étiquette mémorisée | « Mémorisé » ; Annuler retire exactement ce qui vient d’être créé |
| 12 | Corriger une étiquette | Dans « Modifier la charge », avec la trace du 7B (ancienne étiquette gardée) | Même règle que le montant |
| 13 | Jour de paiement du loyer (point C du 7C) | La pastille du jour choisi est enfin mise en évidence (même style que les étiquettes) | Corrigé au passage |

## 5. Modèle de données

Clé salonh_state_v1 inchangée. Ajouts (rien n’est réécrit à l’ouverture) :

| Champ | Défaut | Rôle |
|---|---|---|
| config.rappelSaisie | absent = activé | Rappel « Hier n’est pas noté » (false si désactivé) |
| config.joursRepos | absent = [] | Jours sans rappel (0 = lundi … 6 = dimanche) |
| meta.rappelSaisieVu | null | Dernier jour où le rappel a été montré |
| jours[…].charges[…].etiquette | absent | Détail facultatif d’une charge |
| config.etiquettesPerso | absent = {} | Étiquettes « + Autre » mémorisées, par rubrique |

## 6. Ce qui reste du cahier

Seul le Sprint 7F (accès mensuel) reste, à lancer seulement sur votre décision (point 11).

## 7. À vérifier sur téléphone (7C, 7D et 7E ensemble)

| Geste | Résultat attendu |
|---|---|
| Déposer la 7E, ouvrir | « SalonH-7E · cache 7 » dans À propos ; mêmes chiffres ; s’ouvre en clair sans éclair |
| Le soir, noter la recette | Toucher la case Recette, taper, Enregistrer : 2 taps |
| Noter une charge | « + » → rubrique → Enregistrer : 3 taps, sans défiler |
| Aujourd’hui sans avis | Tout se voit sans défiler ; le « + » ne cache rien |
| Ouvrir l’appli le lendemain d’un jour vide | « Hier n’est pas noté » ; « Je n’ai pas travaillé » la fait disparaître pour la journée |
| Loyer chaque semaine | Jauge « Loyer de la semaine à couvrir » ; « Noter le paiement » reste dans le bandeau Loyer dû |
| Gel et produits › Mousse | La charge apparaît « Gel et produits · Mousse » ; Mes habitudes › Par étiquette |
| Menu, Télécharger, Excel, Mes charges, Affichage | Comme décrit dans les notes 7C et 7D |

## 8. Points à trancher

| N° | Point | Options | Recommandation de Claude |
|---|---|---|---|
| A | Boutons du thème Sombre sous 3:1 (repris du 7C) | 1. Laisser comme la 7B. 2. Éclaircir | 1 tant que personne ne le demande |
| F | Montants proposés manquants (point 12 du cahier) | Gel et produits, Huile de machine, Papier cou, Teinture n’ont pas de montant prérempli : le « + » demande alors de taper le montant | Donner vos prix habituels ; ils deviennent des constantes |
| G | Étiquettes sur d’autres rubriques | 1. Seulement les 3 du cahier (livré). 2. Ajouter « + Autre » partout | 1 ; voir l’usage réel |

## 9. À reporter dans le cahier V2.1 après le test sur téléphone

- § 2 : lignes 7C, 7D et 7E (LIVRÉ).
- § 5 : F7 et F8 → LIVRÉ (7E).
- § 6 : D8, D9 et D10 → LIVRÉ (7E).
- § 10 : config.rappelSaisie, config.joursRepos, meta.rappelSaisieVu, charges[].etiquette → LIVRÉ ; ajouter config.etiquettesPerso.
- § 14 : points 2, 3, 7, 8, 9, 10 → A ; point C du 7C corrigé.
- § 12 : reste le 7F, sur décision.
