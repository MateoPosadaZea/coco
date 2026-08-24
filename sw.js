/* ================== Coco 🦜 — que la app abra SIN SEÑAL (v1.60) ==================
   Petición de Mateo: practicar en el metro, en un avión, con mala señal.

   La estrategia importa más que el caché en sí:

     · RED PRIMERO para el index.html — si hay señal, SIEMPRE se sirve la versión
       recién publicada. Así un deploy se ve al instante y nunca te quedas mirando
       una versión vieja (el clásico dolor de cabeza de los service workers, y la
       razón por la que el pie de página se puede seguir verificando en vivo).
     · CACHÉ PRIMERO para lo que no cambia (iconos, manifest): son bytes que no
       vale la pena volver a pedir.
     · Sin señal, se sirve la última copia buena que se guardó.

   NUNCA se cachea nada de otros dominios ni nada que no sea GET.
   El progreso NO vive aquí: vive en localStorage y en la 🔒 caja fuerte.        */
const CACHE = "coco-v1";
const ESENCIALES = ["./", "./index.html", "./manifest.json", "./icon192.png", "./icon512.png"];

self.addEventListener("install", e => {
  // addAll falla entero si un archivo falla: se piden uno a uno para que el
  // service worker se instale aunque un icono no esté disponible ese día.
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(ESENCIALES.map(u => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;   // nada de terceros

  const esDocumento = req.mode === "navigate" || req.destination === "document";

  if (esDocumento) {
    // 🌐 RED PRIMERO: la versión nueva gana siempre que haya señal
    e.respondWith(
      fetch(req).then(r => {
        if (r && r.ok) {
          const c1 = r.clone(), c2 = r.clone();
          caches.open(CACHE).then(c => { c.put(req, c1); c.put("./index.html", c2); }).catch(() => {});
        }
        return r;
      }).catch(() =>
        caches.match(req).then(r => r || caches.match("./index.html")).then(r => r || caches.match("./"))
      )
    );
    return;
  }

  // 📦 CACHÉ PRIMERO para iconos y manifest
  e.respondWith(
    caches.match(req).then(cacheado =>
      cacheado || fetch(req).then(r => {
        if (r && r.ok) {
          const copia = r.clone();
          caches.open(CACHE).then(c => c.put(req, copia)).catch(() => {});
        }
        return r;
      })
    )
  );
});
