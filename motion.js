// Slow, transform-only parallax for elements marked [data-depth].
// Text and navigation never move. Disabled entirely for reduced motion.
(function () {
  var header = document.querySelector('.site-header');
  function onHeader() { header.classList.toggle('is-scrolled', window.scrollY > 40); }
  onHeader();
  window.addEventListener('scroll', onHeader, { passive: true });

  // Google Maps loads only when asked for: keeps third-party weight and cookies off the first visit.
  var map = document.querySelector('.visit-map');
  var mapBtn = map && map.querySelector('.map-load');
  if (mapBtn) mapBtn.addEventListener('click', function () {
    var frame = document.createElement('iframe');
    frame.src = map.dataset.src;
    frame.title = 'Map showing Papaz Spot on Lukuli Road, Makindye';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    map.replaceChildren(frame);
    frame.focus();
  });

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var layers = Array.prototype.slice.call(document.querySelectorAll('[data-depth]'));
  if (!layers.length) return;

  var visible = new Set();
  var ticking = false;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { e.isIntersecting ? visible.add(e.target) : visible.delete(e.target); });
    request();
  }, { rootMargin: '20% 0px' });

  function update() {
    ticking = false;
    if (reduce.matches) return;
    var vh = window.innerHeight;
    visible.forEach(function (el) {
      var host = el.parentElement.getBoundingClientRect();
      var offset = (host.top + host.height / 2) - vh / 2;
      var y = -offset * parseFloat(el.dataset.depth);
      el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    });
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  function start() {
    layers.forEach(function (el) { io.observe(el); });
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
  }
  function stop() { layers.forEach(function (el) { el.style.transform = ''; }); }

  start();
  (reduce.addEventListener ? reduce.addEventListener('change', function () { reduce.matches ? stop() : request(); }) : null);
})();
