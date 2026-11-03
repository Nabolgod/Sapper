// service-worker.js — работа игры без интернета. Автор: Матвей Канашин
//
// Как работает: при каждом запросе сначала пробуем взять свежий файл из интернета
// и заодно сохраняем его копию на телефоне. Если интернета нет — отдаём сохранённую копию.

const CACHE_NAME = 'sapper-v2';

// Файлы игры, которые сохраняем сразу при установке
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/adaptive.css',
  './js/game.js',
  './js/board.js',
  './js/ui.js',
  './js/touch.js',
  './js/main.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Установка: сохраняем файлы игры
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // Каждый файл по отдельности: если одного нет, остальные всё равно сохранятся
      return Promise.all(FILES.map(function (file) {
        return cache.add(file).catch(function () {});
      }));
    })
  );
  self.skipWaiting();
});

// Активация: удаляем старые сохранённые версии игры
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names
        .filter(function (name) { return name !== CACHE_NAME; })
        .map(function (name) { return caches.delete(name); }));
    })
  );
  self.clients.claim();
});

// Запросы: сначала интернет, без интернета — сохранённая копия
self.addEventListener('fetch', function (event) {
  const request = event.request;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then(function (response) {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
        }
        return response;
      })
      .catch(function () {
        return caches.match(request, { ignoreSearch: true });
      })
  );
});
