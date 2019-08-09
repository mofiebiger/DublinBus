function preCache() {
  return cache.open('my-cache').then(function(cache) {
    return cache.addAll([
      '{% url "user/index" %}'
    ]);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(preCache());
});
