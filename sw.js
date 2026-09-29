/* MonDjai/Salon H — service worker (V1.1, Sprint 5A)
   - Fonctionnement hors ligne : tous les fichiers de l'application sont mis en cache à l'installation.
   - Mises à jour : la page (index.html) est d'abord demandée au réseau (3 s maximum), puis servie
     depuis le cache si pas de connexion. Une nouvelle version déposée sur GitHub Pages arrive donc
     toute seule sur les téléphones connectés, sans vider le cache à la main.
   - À chaque livraison qui modifie un fichier autre que index.html, incrémenter VERSION ci-dessous.
   - Aucun appel vers un service tiers : seuls les fichiers de l'application elle-même sont concernés. */
var VERSION = "salonh-v1.1-2026-09-29";
var FICHIERS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./icon-1024.png",
  "./apple-touch-icon.png",
  "./favicon.ico"
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(VERSION).then(function(cache){
      // Un fichier manquant ne doit pas empêcher l'installation du reste.
      return Promise.all(FICHIERS.map(function(url){
        return cache.add(new Request(url, { cache: "reload" })).catch(function(){});
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(cles){
      return Promise.all(cles.map(function(cle){
        if(cle !== VERSION && cle.indexOf("salonh-") === 0) return caches.delete(cle);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

function avecDelai(promesse, ms){
  return new Promise(function(resolve, reject){
    var t = setTimeout(function(){ reject(new Error("delai")); }, ms);
    promesse.then(function(r){ clearTimeout(t); resolve(r); }, function(e){ clearTimeout(t); reject(e); });
  });
}

self.addEventListener("fetch", function(event){
  var req = event.request;
  if(req.method !== "GET") return;
  var url = new URL(req.url);
  if(url.origin !== self.location.origin) return;

  // Page de l'application : réseau d'abord (pour recevoir les mises à jour), cache en secours.
  if(req.mode === "navigate"){
    event.respondWith(
      avecDelai(fetch(req), 3000).then(function(rep){
        if(rep && rep.ok){
          var copie = rep.clone();
          caches.open(VERSION).then(function(cache){ cache.put("./index.html", copie); });
        }
        return rep;
      }).catch(function(){
        return caches.match("./index.html").then(function(r){ return r || caches.match("./"); });
      })
    );
    return;
  }

  // Autres fichiers (icônes, manifest) : cache d'abord, réseau en secours.
  event.respondWith(
    caches.match(req).then(function(enCache){
      if(enCache) return enCache;
      return fetch(req).then(function(rep){
        if(rep && rep.ok){
          var copie = rep.clone();
          caches.open(VERSION).then(function(cache){ cache.put(req, copie); });
        }
        return rep;
      });
    })
  );
});
