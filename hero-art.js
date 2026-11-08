/* bhdasia.com home hero background (8 Nov 2026) - HummingBeing concept, owner: "why push shapes behind Isabelle's image?
   use the concept of HummingBeing". So: NOTHING behind Isabelle - no disc, panel or rings - only HummingBeing's "silk":
   fine gold hairlines drifting across the hero like breath (same drawing method as hummingbeing.com hb-tn.js, 8 s breath
   cycle), softly cleared right behind Isabelle so they flow around her, never behind her. Each slide varies the flow:
     0 rising diagonally (as on HummingBeing)   1 low and calm, deeper breath   2 steeper, climbing   3 two bands crossing
   DPR <= 2, paused off-screen / hidden tab, pointer depth, one still frame for reduced motion. */
(function () {
  var hero = document.querySelector('.tn-hero-isa'); if (!hero) return;
  var cv = document.createElement('canvas'); cv.className = 'tn-hero-canvas'; cv.setAttribute('aria-hidden', 'true');
  hero.insertBefore(cv, hero.firstChild);
  var ctx = cv.getContext('2d'); if (!ctx) return;
  var mode = +(hero.getAttribute('data-v') || 0);
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var W = 0, H = 0, dpr = 1, ix = 0, iy = 0, ir = 0, small = false, t0 = performance.now(), raf = 0, running = false;
  var mx = 0, my = 0, px = 0, py = 0;
  var GOLD = [214, 160, 60], ACCENT = [[214, 160, 60], [222, 140, 100], [150, 130, 210], [110, 140, 205]][mode] || [214, 160, 60];
  /* per-slide flow: base band (fraction of height), how far it rises across the width, wave size, breath depth, line count */
  var FLOW = [
    [{ y0: .58, span: .34, rise: .38, amp: 1, breath: .18, n: 16, col: GOLD }],
    [{ y0: .78, span: .16, rise: .06, amp: .6, breath: .38, n: 8, col: ACCENT }],
    [{ y0: .66, span: .30, rise: .62, amp: .9, breath: .2, n: 16, col: GOLD }],
    [{ y0: .52, span: .28, rise: .42, amp: .9, breath: .2, n: 11, col: GOLD }, { y0: .22, span: .22, rise: -.34, amp: .8, breath: .2, n: 9, col: ACCENT }]
  ][mode] || [];
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function ease(x) { x = Math.min(Math.max(x, 0), 1); return 1 - Math.pow(1 - x, 3); }

  function size() {
    var r = hero.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    small = W < 700;
    var img = hero.querySelector('.tn-art-isa'), ar = img ? img.getBoundingClientRect() : null;
    if (ar && ar.width) { ix = ar.left - r.left + ar.width / 2; iy = ar.top - r.top + ar.height * .5; ir = Math.max(ar.width, ar.height) * .55; }
    else { ix = W * .72; iy = H * .55; ir = H * .45; }
    NV = null;   /* nerve network follows the hero size */
  }

  function silk(f, t, intro) {
    var breath = Math.sin(t * Math.PI / 4);                         /* 8 s cycle: in 4 s, out 4 s (HummingBeing rhythm) */
    var reach = W * intro;
    for (var i = 0; i < f.n; i++) {
      var k = i / (f.n - 1), a = (.07 + .22 * Math.sin(Math.PI * k)) * intro;
      ctx.beginPath(); ctx.lineWidth = i % 5 === 2 ? 1.3 : .8; ctx.strokeStyle = rgba(f.col, a.toFixed(3));
      for (var x = -20; x <= reach + 20; x += 14) {
        var u = x / W, base = H * (f.y0 + f.span * k) - u * H * f.rise;
        var amp = (18 + 26 * k) * f.amp * (1 + f.breath * breath);
        var y = base + Math.sin(u * 5.2 + t * .35 + k * 2.4) * amp + Math.sin(u * 11 - t * .22 + i) * 6 + py * (.3 + k * .6);
        x === -20 ? ctx.moveTo(x + px * (.3 + k * .5), y) : ctx.lineTo(x + px * (.3 + k * .5), y);
      }
      ctx.stroke();
    }
  }

  /* slide 1 "Calm nervous systems": a nervous-system network in fine gold hairlines - nerves branch in from the edges,
     junctions glow with the 8 s breath, soft impulses travel root -> tip. Seeded so it looks the same on every visit. */
  var NV = null, seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function buildNerves() {
    seed = 7; var segs = [], tips = [];
    function grow(x, y, ang, len, depth, parent) {
      var bend = (rnd() - .5) * .5, x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
      var cx = (x + x2) / 2 + Math.cos(ang + Math.PI / 2) * len * bend * .4, cy = (y + y2) / 2 + Math.sin(ang + Math.PI / 2) * len * bend * .4;
      var s = { x1: x, y1: y, cx: cx, cy: cy, x2: x2, y2: y2, d: depth, p: parent, kids: [], o: segs.length };
      segs.push(s); if (parent) parent.kids.push(s);
      if (depth >= (small ? 5 : 7) || len < 14) { tips.push(s); return; }
      var nb = depth < 2 ? 2 : (rnd() < .3 ? 3 : 2);
      for (var b = 0; b < nb; b++) {
        var spread = (b - (nb - 1) / 2) * (.42 + rnd() * .3);
        grow(x2, y2, ang + spread + (rnd() - .5) * .25, len * (.68 + rnd() * .14), depth + 1, s);
      }
    }
    var L = small ? H * .16 : H * .2, left = small ? W * .02 : W * .52;
    grow(left, H * 1.02, -Math.PI / 2 + .35, L, 0, null);            /* rising from the bottom, left of Isabelle */
    grow(W * 1.01, H * .98, -Math.PI / 2 - .55, L * .95, 0, null);    /* rising from the bottom-right corner */
    grow(W * 1.01, H * .08, Math.PI - .35, L * .85, 0, null);         /* reaching in from the top-right */
    var pulses = [];
    for (var i = 0; i < (small ? 7 : 14); i++) pulses.push({ seg: null, s: 0, sp: .55 + rnd() * .5, wait: rnd() * 4 });
    NV = { segs: segs, tips: tips, pulses: pulses };
  }
  function qpt(s, u) { var v = 1 - u; return [v * v * s.x1 + 2 * v * u * s.cx + u * u * s.x2, v * v * s.y1 + 2 * v * u * s.cy + u * u * s.y2]; }
  function nerves(t, dt, intro) {
    if (!NV) buildNerves();
    var breath = (Math.sin(t * Math.PI / 4) + 1) / 2, maxD = small ? 5 : 7;
    for (var i = 0; i < NV.segs.length; i++) {
      var s = NV.segs[i], g = ease((intro * (maxD + 2) - s.d) / 1.4); if (g <= 0) continue;   /* grows in, trunk first */
      var a = (.42 - s.d * .045) * intro, e = qpt(s, g);
      ctx.strokeStyle = rgba(s.d % 3 === 2 ? [20, 36, 74] : ACCENT, s.d % 3 === 2 ? a * .45 : a);
      ctx.lineWidth = Math.max(.6, 2.2 - s.d * .26);
      ctx.beginPath(); ctx.moveTo(s.x1 + px * (.4 + s.d * .1), s.y1 + py * (.4 + s.d * .1));
      ctx.quadraticCurveTo(s.cx + px * (.4 + s.d * .1), s.cy + py * (.4 + s.d * .1), e[0] + px * (.4 + s.d * .1), e[1] + py * (.4 + s.d * .1)); ctx.stroke();
      if (g >= 1 && s.kids.length) {                                     /* junction: breathes */
        var r = 1.6 + (3 - Math.min(3, s.d * .5)) * (.55 + .45 * breath);
        ctx.fillStyle = rgba(ACCENT, (.3 + .4 * breath) * intro);
        ctx.beginPath(); ctx.arc(s.x2 + px * (.4 + s.d * .1), s.y2 + py * (.4 + s.d * .1), r, 0, 6.283); ctx.fill();
      }
    }
    if (intro < .85) return;
    for (var p = 0; p < NV.pulses.length; p++) {                         /* impulses travel root -> tip */
      var q = NV.pulses[p];
      if (!q.seg) { q.wait -= dt; if (q.wait > 0) continue; var roots = NV.segs.filter(function (z) { return !z.p; }); q.seg = roots[Math.floor(rnd() * roots.length)]; q.s = 0; }
      q.s += dt * q.sp * (2.2 - q.seg.d * .15);
      if (q.s >= 1) { if (!q.seg.kids.length) { q.seg = null; q.wait = .6 + rnd() * 2.5; continue; } q.seg = q.seg.kids[Math.floor(rnd() * q.seg.kids.length)]; q.s = 0; }
      var h = qpt(q.seg, Math.min(q.s, 1)), off = .4 + q.seg.d * .1, hx = h[0] + px * off, hy = h[1] + py * off;
      var gr = ctx.createRadialGradient(hx, hy, 0, hx, hy, 12);
      gr.addColorStop(0, 'rgba(255,236,200,.95)'); gr.addColorStop(.35, rgba(ACCENT, .55)); gr.addColorStop(1, rgba(ACCENT, 0));
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(hx, hy, 12, 0, 6.283); ctx.fill();
    }
  }

  var prevT = 0;
  function frame(now) {
    var t = reduce ? 6 : (now - t0) / 1000, intro = reduce ? 1 : ease(t / 2.2), dt = prevT ? Math.min(t - prevT, .05) : 0; prevT = t;
    px += (mx - px) * .06; py += (my - py) * .06;
    ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H);
    if (mode === 1) nerves(t, dt, intro);
    for (var i = 0; i < FLOW.length; i++) silk(FLOW[i], t, intro);
    /* keep the space behind Isabelle clear: the silk flows around her, never behind her */
    ctx.globalCompositeOperation = 'destination-out';
    var g = ctx.createRadialGradient(ix, iy, ir * .25, ix, iy, ir);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.6, 'rgba(0,0,0,.92)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(ix - ir, iy - ir, ir * 2, ir * 2);
    ctx.globalCompositeOperation = 'source-over';
    if (running) raf = requestAnimationFrame(frame);
  }
  function start() { if (running || reduce) return; running = true; raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  size(); if (reduce) { frame(t0); } else start();
  /* Isabelle's photo can finish loading after this runs: re-measure once it has */
  var im = hero.querySelector('.tn-art-isa'); if (im && !im.complete) im.addEventListener('load', function () { size(); if (reduce) frame(t0); });
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); if (reduce) frame(t0); }, 150); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }).observe(hero);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  if (fine && !reduce) hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width - .5) * -18; my = ((e.clientY - r.top) / r.height - .5) * -12;
  });
})();
