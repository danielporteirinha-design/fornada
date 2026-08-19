// Fornada — service worker
// Troque a versao a cada atualizacao do app: e isso que forca o celular
// a baixar o arquivo novo em vez de servir o antigo do cache.
const VERSAO = "fornada-v5";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icone-192.png",
  "./icone-512.png",
  "./icone-maskable-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(VERSAO)
      .then(function (c) { return c.addAll(ARQUIVOS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (nomes) {
        return Promise.all(nomes
          .filter(function (n) { return n !== VERSAO; })
          .map(function (n) { return caches.delete(n); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

// Rede primeiro, cache como reserva: abrindo online voce sempre pega a
// versao mais nova; sem sinal, o app continua funcionando.
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(function (resp) {
        const copia = resp.clone();
        caches.open(VERSAO).then(function (c) { c.put(e.request, copia); });
        return resp;
      })
      .catch(function () {
        return caches.match(e.request).then(function (r) {
          return r || caches.match("./index.html");
        });
      })
  );
});
