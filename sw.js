// Keeps the app working offline after the first visit. Bump VERSION when publishing an update.
const VERSION='lypm-v10.0';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(new URL(e.request.url).origin!==location.origin)return; // map tiles, fonts and libraries go straight to the network
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(VERSION).then(c=>c.put(e.request,copy));return r;}).catch(()=>caches.match(e.request)));
});
