var C='attendance-v2';
var FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(function(c){return Promise.all(FILES.map(function(f){return c.add(f).catch(function(){})}))}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(function(r){
    var cp=r.clone();caches.open(C).then(function(c){c.put(e.request,cp)});return r;
  }).catch(function(){
    return caches.match(e.request).then(function(m){return m||caches.match('index.html')});
  }));
});
