// FlowGuard service worker: selalu coba versi terbaru dari internet, cadangan dari cache saat offline.
var CACHE = "flowguard-v1";
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET" || !/^https?:/.test(e.request.url)) return;
  e.respondWith(fetch(e.request).then(function (res) {
    if (res && (res.ok || res.type === "opaque")) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); }).catch(function () {});
    }
    return res;
  }).catch(function () {
    return caches.match(e.request).then(function (r) { return r || caches.match("index.html"); });
  }));
});
