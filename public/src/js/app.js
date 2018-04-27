var deferredPrompt;

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(() => {
      console.log('serviceWorker registered!');
    })
}

window.addEventListener('beforeinstallprompt', function (event) {
  event.preventDefault();
  console.log('beforeinstallprompt fired', event);
  deferredPrompt = event;
  return false;
});

fetch('https://httpbin.org/ip')
  .then(res => res.json())
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });