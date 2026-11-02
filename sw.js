/* ==============================================================
   MonDjai/Salon H — service worker (Sprint 7E, cache 7)
   Mécanisme de la famille MonDjai (Coiffure 8C/8D, Revente-E),
   adapté à Salon H. L'application ne fait aucun appel réseau : ce
   fichier garde index.html, manifest.json et les icônes sur le
   téléphone, pour que Salon H s'ouvre sans connexion une fois
   ouverte une première fois avec internet.

   ╔══════════════════════════════════════════════════════════╗
   ║  POUR PUBLIER UNE NOUVELLE VERSION : remplacer index.html ║
   ║  ET sw.js sur GitHub, en changeant seulement ce numéro    ║
   ║  (7 → 8 → 9…), le même que VERSION_APP dans index.html.   ║
   ╚══════════════════════════════════════════════════════════╝

   - Mise à jour : la nouvelle version s'installe seule ; index.html recharge la page
     une seule fois quand aucune saisie n'est en cours (sinon bandeau « Mettre à jour »).
   - Ouverture : cache d'abord (instantané, même en mode avion),
     puis mise à jour silencieuse de la copie pour l'ouverture
     suivante. Jamais la page d'erreur du navigateur.
   - Nettoyage : seuls les caches de Salon H sont supprimés (ses
     anciennes versions « mondjai-salonh-v… » et ceux de la V1.2
     « salonh-… »), jamais ceux d'une autre application MonDjai
     hébergée à la même adresse (Salaire, Coiffure, Revente…).
   - Un service worker n'a pas accès au localStorage : ce fichier ne
     lit, n'écrit ni n'efface jamais les données (salonh_state_v1).
   JavaScript ES5 (var, function).
   ============================================================== */
var VERSION_CACHE = "7";

var PREFIXE_CACHE = "mondjai-salonh-";
var ANCIEN_PREFIXE = "salonh-";            // caches de la V1.2 (« salonh-v1.2-2026-09-29 »)
var CACHE_NAME = PREFIXE_CACHE + "v" + VERSION_CACHE;

/* Fichier indispensable : l'application elle-même. */
var URL_INDEX = new URL("./index.html", self.location.href).href;
/* Fichiers facultatifs : un fichier absent ne fait jamais échouer l'installation. */
var FICHIERS_OPTIONNELS = [
  "./manifest.json",
  "./icon-192.png",
  "./icon-192-maskable.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./icon-1024.png",
  "./icon-monochrome-512.png",
  "./apple-touch-icon.png",
  "./favicon.ico",
  "./favicon-32.png"
];

/* ---------- Installation ---------- */
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      /* index.html : toujours redemandé au serveur (cache:"reload" contourne le
         cache HTTP de GitHub Pages). S'il est injoignable, l'installation échoue
         et l'ancienne version reste en place, intacte : le navigateur réessaiera. */
      return cache.add(new Request(URL_INDEX, { cache: "reload" })).then(function () {
        return Promise.all(FICHIERS_OPTIONNELS.map(function (chemin) {
          var url = new URL(chemin, self.location.href).href;
          return fetch(new Request(url, { cache: "reload" })).then(function (rep) {
            if (rep && rep.ok) return cache.put(url, rep);
          }).catch(function () { /* fichier absent ou réseau capricieux : on continue */ });
        }));
      });
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

/* ---------- Activation ---------- */
function estAncienCacheSalonH(cle) {
  if (cle === CACHE_NAME) return false;
  return cle.indexOf(PREFIXE_CACHE) === 0 || cle.indexOf(ANCIEN_PREFIXE) === 0;
}

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cles) {
      return Promise.all(cles.filter(estAncienCacheSalonH).map(function (cle) {
        return caches.delete(cle);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* ---------- Requêtes ---------- */

/* La page de l'application : le dossier (…/salonh/) ou index.html, avec ou sans « ?… ». */
function estPageApplication(url) {
  var dossier = new URL("./", self.location.href).pathname;
  return url.pathname === dossier || url.pathname === dossier + "index.html";
}

/* Rafraîchissement silencieux : si un fichier a changé sur GitHub, la copie en cache
   est remplacée pour l'ouverture suivante. */
function rafraichir(cache, cle, urlReseau) {
  return fetch(new Request(urlReseau, { cache: "no-cache" })).then(function (rep) {
    if (rep && rep.ok && rep.type === "basic") {
      return cache.put(cle, rep.clone()).then(function () { return rep; }, function () { return rep; });
    }
    return rep;
  });
}

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url;
  try { url = new URL(req.url); } catch (e) { return; }
  /* Même adresse uniquement : ce service worker ne contacte jamais un autre domaine. */
  if (url.origin !== self.location.origin) return;

  var navigation = req.mode === "navigate";
  var pageApp = navigation && estPageApplication(url);
  var cle = pageApp ? URL_INDEX : req;
  var urlReseau = pageApp ? URL_INDEX : req.url;

  /* Le rafraîchissement en arrière-plan doit pouvoir se terminer après la réponse. */
  var finArrierePlan;
  event.waitUntil(new Promise(function (resolve) { finArrierePlan = resolve; }));

  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(cle).then(function (enCache) {
        if (enCache) {
          /* Cache d'abord : ouverture instantanée, même hors ligne. */
          if (self.navigator.onLine !== false) {
            rafraichir(cache, cle, urlReseau).catch(function () {}).then(finArrierePlan);
          } else {
            finArrierePlan();
          }
          return enCache;
        }
        finArrierePlan();
        /* Pas encore en cache : réseau, puis repli hors ligne (jamais la page d'erreur
           du navigateur pour une page de l'application). */
        return rafraichir(cache, cle, urlReseau).catch(function () {
          if (navigation) {
            return cache.match(URL_INDEX).then(function (index) { return index || Response.error(); });
          }
          return Response.error();
        });
      });
    }).catch(function () {
      finArrierePlan();
      return fetch(req);
    })
  );
});
