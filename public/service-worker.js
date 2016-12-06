(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('/js/sw-toolbox/sw-toolbox.js');

  // The route for any requests
  toolbox.router.get('/images/(.*)', global.toolbox.fastest);

  toolbox.router.get('/js/(.*)', global.toolbox.fastest);

  toolbox.router.get('/example', global.toolbox.fastest);

  // Ensure that our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));
})(self);
