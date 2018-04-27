const CACHE_STATIC_NAME = 'static-v10';
const CACHE_DYNAMIC_NAME = 'dynamic-v6';


self.addEventListener('install', (event) => {
  console.log('SW install' + event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(cache => {
        console.log('Precache');
        cache.addAll([
          '/',
          '/index.html',
          '/offline.html',
          '/src/js/app.js',
          '/src/js/promise.js', // можно не кэшить, так как есть поддержка в хроме
          '/src/js/fetch.js',  // так же
          '/src/js/material.min.js',
          '/src/css/app.css',
          '/src/css/feed.css',
          '/src/images/main-image.jpg',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ]);

      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('SW activate ' + event);
  event.waitUntil(
    caches.keys()
      .then(keyList => {
          return Promise.all(keyList.map(key => {
            if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
              console.log('Removed cache ' + key);
              return caches.delete(key);
            }
          }))
        }
      )
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  console.log('SW fetch ' + event);
  event.respondWith(
    caches.match(event.request)
      .then(res => {
        if (res) {
          return res;
        }
        else {
          return fetch(event.request)
            .then(res => {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(cache => {
                  console.log(cache);
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            })

        }
      })
      .catch(err => {
        return caches.open(CACHE_STATIC_NAME)
          .then(cache => {
            return cache.match('/offline.html');
          })
      })
  )
});

// cache-only strategy
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request)
//   )
// });

// network-only strategy
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     fetch(event.request)
//   )
// });