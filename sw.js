// Service worker de MonDjai/Salon H — fonctionnement hors ligne.
// Incrémenter CACHE_NAME à chaque nouveau sprint qui modifie un des 4 fichiers,
// pour forcer la mise à jour du cache sur les téléphones déjà installés.
const CACHE_NAME = "salonh-cache-v1";

const FICHIERS_A_METTRE_EN_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-512.png"
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(FICHIERS_A_METTRE_EN_CACHE);
    }).then(function(){
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(noms){
      return Promise.all(
        noms.filter(function(nom){ return nom !== CACHE_NAME; })
            .map(function(nom){ return caches.delete(nom); })
      );
    }).then(function(){
      return self.clients.claim();
    })
  );
});

// Stratégie : cache d'abord, réseau en secours (et mise à jour discrète du cache).
// Aucun appel réseau n'est jamais nécessaire au fonctionnement de l'application :
// ce repli existe seulement pour le cas où un fichier manquerait encore du cache.
self.addEventListener("fetch", function(event){
  if(event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(function(reponseEnCache){
      if(reponseEnCache) return reponseEnCache;

      return fetch(event.request).then(function(reponseReseau){
        var copie = reponseReseau.clone();
        caches.open(CACHE_NAME).then(function(cache){
          cache.put(event.request, copie);
        });
        return reponseReseau;
      }).catch(function(){
        return reponseEnCache;
      });
    })
  );
});
