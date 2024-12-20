const CACHE_NAME = "pwa-cache-v1";
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/Bilder/web-icon.webp",
    "/Bilder/web-icon.webp"
];

// Installationsereignis
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Dateien werden gecacht...");
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// Abrufereignis
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

// Aktivierungsevent
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log("Alter Cache wird gelöscht:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("Service Worker registriert:", registration);
    }).catch(error => {
        console.error("Service Worker Registrierung fehlgeschlagen:", error);
    });
}

