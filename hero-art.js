/* bhdasia.com home hero background (8 Nov 2026) - HummingBeing gold-hairline language:
   silk lines + concentric rings around Isabelle (constellation removed 8 Nov on owner request). The ONLY heavy motion on the site.
   Canvas, DPR <= 2, paused off-screen / hidden tab, one still frame for reduced motion. */
(function () {
  var hero = document.querySelector('.tn-hero-isa'); if (!hero) return;
  var cv = document.createElement('canvas'); cv.className = 'tn-hero-canvas'; cv.setAttribute('aria-hidden', 'true');
  hero.insertBefore(cv, hero.firstChild);
  var ctx = cv.getContext('2d'); if (!ctx) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 200, pts = [], t0 = performance.now(), raf = 0, running = false;
  var mx = 0, my = 0, px = 0, py = 0;
  var GOLD = [214, 168, 82], INK = [20, 36, 74];
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  function size() {
    var r = hero.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var ring = hero.querySelector('.tn-art-ring');
    if (ring) { var rr = ring.getBoundingClientRect(); cx = rr.left - r.left + rr.width / 2; cy = rr.top - r.top + rr.height / 2; R = rr.width / 2; }
    else { cx = W * .72; cy = H * .45; R = Math.min(W, H) * .28; }
    var n = W < 700 ? 18 : 34; pts = [];
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, d = R * (1.15 + Math.random() * 1.1);
      pts.push({ a: a, d: d, s: (Math.random() * .6 + .2) * (Math.random() < .5 ? -1 : 1) * .00012, tw: Math.random() * 6.28, z: Math.random() });
    }
  }

  function ease(x) { return 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3); }

  function frame(now) {
    var t = (now - t0) / 1000, intro = reduce ? 1 : ease(t / 1.8);
    px += (mx - px) * .06; py += (my - py) * .06;
    ctx.clearRect(0, 0, W, H);

    /* 1. silk lines: flowing gold hairlines across the hero, drawn in left -> right */
    var lines = W < 700 ? 5 : 8, reach = W * intro;
    for (var i = 0; i < lines; i++) {
      var base = H * (.18 + i * .085), amp = 18 + i * 4, ph = i * .7, sp = .18 + i * .025;
      var g = ctx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, rgba(GOLD, 0)); g.addColorStop(.3, rgba(GOLD, .18 + i * .02)); g.addColorStop(.72, rgba(GOLD, .55)); g.addColorStop(1, rgba(GOLD, .12));
      ctx.strokeStyle = g; ctx.lineWidth = i % 3 === 0 ? 1.5 : 1; ctx.beginPath();
      for (var x = 0; x <= reach; x += 8) {
        var y = base + Math.sin(x * .0042 + t * sp + ph) * amp + Math.sin(x * .011 - t * sp * 1.6 + ph * 2) * amp * .35 + py * (.2 + i * .05);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x + px * (.15 + i * .04), y);
      }
      ctx.stroke();
    }

    /* 2. rings around Isabelle: expand in, then turn slowly */
    var rs = [1.12, 1.28, 1.46, 1.66];
    for (var k = 0; k < rs.length; k++) {
      var rad = R * rs[k] * (.8 + .2 * intro), rot = t * (k % 2 ? -.05 : .07) + k;
      ctx.save(); ctx.translate(cx + px * (.3 + k * .12), cy + py * (.3 + k * .12)); ctx.rotate(rot);
      ctx.strokeStyle = k === 0 ? rgba(GOLD, .7 * intro) : rgba(INK, (.24 - k * .035) * intro);
      ctx.lineWidth = k === 0 ? 1.2 : .8; ctx.setLineDash(k === 0 ? [] : [2, 7 + k * 3]);
      ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2 * intro); ctx.stroke();
      if (k === 1 || k === 3) {                                  /* a small gold bead travelling on the ring */
        var ba = t * (k === 1 ? .35 : -.22);
        ctx.setLineDash([]); ctx.fillStyle = rgba(GOLD, .8 * intro);
        ctx.beginPath(); ctx.arc(Math.cos(ba) * rad, Math.sin(ba) * rad, k === 1 ? 2.6 : 2, 0, 6.283); ctx.fill();
      }
      ctx.restore();
    }
    ctx.setLineDash([]);

    if (running) raf = requestAnimationFrame(frame);
  }

  function start() { if (running || reduce) return; running = true; raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  size(); if (reduce) { frame(t0 + 4000); } else start();
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); if (reduce) frame(t0 + 4000); }, 150); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }).observe(hero);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  if (fine && !reduce) hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width - .5) * -18; my = ((e.clientY - r.top) / r.height - .5) * -12;
  });
})();
