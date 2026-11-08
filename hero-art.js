/* bhdasia.com home hero background (8 Nov 2026) - the ONLY heavy motion on the site.
   One canvas, four looks chosen by the hero variant (section[data-v], set by the inline variant script):
   0 gold silk lines + rings around Isabelle · 1 breathing ripples (resilience) · 2 aurora mesh + orbit arcs (coaching)
   3 rising gold light motes (certification). No connected dots (owner removed that effect 8 Nov).
   DPR <= 2, paused off-screen / hidden tab, one still frame for reduced motion. */
(function () {
  var hero = document.querySelector('.tn-hero-isa'); if (!hero) return;
  var cv = document.createElement('canvas'); cv.className = 'tn-hero-canvas'; cv.setAttribute('aria-hidden', 'true');
  hero.insertBefore(cv, hero.firstChild);
  var ctx = cv.getContext('2d'); if (!ctx) return;
  var mode = +(hero.getAttribute('data-v') || 0);
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 200, t0 = performance.now(), raf = 0, running = false;
  var mx = 0, my = 0, px = 0, py = 0, motes = [], blobs = [];
  var GOLD = [214, 168, 82], INK = [20, 36, 74], PEACH = [251, 196, 150], LAV = [176, 166, 222], SKY = [150, 176, 222];
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function ease(x) { return 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3); }

  function size() {
    var r = hero.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var ring = hero.querySelector('.tn-art-ring');
    if (ring) { var rr = ring.getBoundingClientRect(); cx = rr.left - r.left + rr.width / 2; cy = rr.top - r.top + rr.height / 2; R = rr.width / 2; }
    else { cx = W * .72; cy = H * .45; R = Math.min(W, H) * .28; }
    if (R < 40) { cx = W * .72; cy = H * .45; R = Math.min(W, H) * .28; }
    var small = W < 700;
    motes = [];
    for (var i = 0; i < (small ? 34 : 80); i++) motes.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2.2 + .6,
      v: Math.random() * 14 + 8, sw: Math.random() * 6.28, sa: Math.random() * 14 + 4, tw: Math.random() * 6.28, big: Math.random() < .08 });
    blobs = [
      { c: PEACH, r: .55, ax: .18, ay: .12, fx: .07, fy: .09, ox: .70, oy: .40, p: 0 },
      { c: LAV, r: .48, ax: .22, ay: .16, fx: .05, fy: .08, ox: .82, oy: .62, p: 2 },
      { c: SKY, r: .42, ax: .16, ay: .20, fx: .09, fy: .06, ox: .40, oy: .20, p: 4 },
      { c: [255, 226, 160], r: .36, ax: .20, ay: .10, fx: .06, fy: .11, ox: .60, oy: .80, p: 1 }
    ];
    ORB = [];   /* orbit radii follow the halo size: re-seed on resize */
  }

  /* 0: flowing gold hairlines drawn in left -> right + rings with travelling beads */
  function silk(t, intro) {
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
    rings(t, intro, [1.12, 1.28, 1.46, 1.66]);
  }
  function rings(t, intro, rs) {
    for (var k = 0; k < rs.length; k++) {
      var rad = R * rs[k] * (.8 + .2 * intro), rot = t * (k % 2 ? -.05 : .07) + k;
      ctx.save(); ctx.translate(cx + px * (.3 + k * .12), cy + py * (.3 + k * .12)); ctx.rotate(rot);
      ctx.strokeStyle = k === 0 ? rgba(GOLD, .7 * intro) : rgba(INK, (.24 - k * .035) * intro);
      ctx.lineWidth = k === 0 ? 1.2 : .8; ctx.setLineDash(k === 0 ? [] : [2, 7 + k * 3]);
      ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2 * intro); ctx.stroke();
      if (k === 1 || k === 3) {
        var ba = t * (k === 1 ? .35 : -.22);
        ctx.setLineDash([]); ctx.fillStyle = rgba(GOLD, .8 * intro);
        ctx.beginPath(); ctx.arc(Math.cos(ba) * rad, Math.sin(ba) * rad, k === 1 ? 2.6 : 2, 0, 6.283); ctx.fill();
      }
      ctx.restore();
    }
    ctx.setLineDash([]);
  }

  /* 1: breathing ripples from Isabelle (inhale / exhale) + slow breath waves along the bottom */
  function ripples(t, intro) {
    var period = 3.2, n = 6, ox = cx + px * .4, oy = cy + py * .4;
    for (var i = 0; i < n; i++) {
      var ph = ((t / period) + i / n) % 1, rad = R * (.95 + ph * 2.4);
      ctx.strokeStyle = rgba(i % 2 ? INK : GOLD, (1 - ph) * (i % 2 ? .16 : .5) * intro);
      ctx.lineWidth = i % 2 ? .8 : 1.4; ctx.beginPath(); ctx.arc(ox, oy, rad, 0, 6.283); ctx.stroke();
    }
    var breath = (Math.sin(t * 2 * Math.PI / 6) + 1) / 2;   /* 6-second breath */
    ctx.strokeStyle = rgba(GOLD, .55 * intro); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(ox, oy, R * (1.06 + breath * .08), 0, 6.283); ctx.stroke();
    for (var k = 0; k < 4; k++) {
      var base = H * (.70 + k * .07), amp = (10 + k * 5) * (.4 + breath * .9);
      ctx.strokeStyle = rgba(k % 2 ? INK : GOLD, (k % 2 ? .10 : .32) * intro); ctx.lineWidth = 1; ctx.beginPath();
      for (var x = 0; x <= W * intro; x += 10) {
        var y = base + Math.sin(x * .006 + t * (.35 + k * .05) + k) * amp + py * .3;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  /* 2: aurora - soft colour fields drifting on lissajous paths + three orbit arcs around Isabelle */
  function aurora(t, intro) {
    var m = Math.max(W, H);
    for (var i = 0; i < blobs.length; i++) {
      var b = blobs[i], x = W * (b.ox + Math.sin(t * b.fx * 6.283 + b.p) * b.ax) + px * (1 + i), y = H * (b.oy + Math.cos(t * b.fy * 6.283 + b.p) * b.ay) + py * (1 + i);
      var g = ctx.createRadialGradient(x, y, 0, x, y, m * b.r);
      g.addColorStop(0, rgba(b.c, .42 * intro)); g.addColorStop(1, rgba(b.c, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    for (var k = 0; k < 3; k++) {
      ctx.save(); ctx.translate(cx + px * .5, cy + py * .5); ctx.rotate(-.5 + k * .9 + t * (k % 2 ? -.08 : .06));
      var rx = R * (1.35 + k * .22), ry = R * (.55 + k * .12);
      ctx.strokeStyle = rgba(k === 1 ? GOLD : INK, (k === 1 ? .55 : .18) * intro); ctx.lineWidth = k === 1 ? 1.2 : .8;
      ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2 * intro); ctx.stroke();
      var a = t * (k === 1 ? .6 : -.4) + k * 2; ctx.fillStyle = rgba(k === 1 ? GOLD : INK, (k === 1 ? .9 : .4) * intro);
      ctx.beginPath(); ctx.arc(Math.cos(a) * rx, Math.sin(a) * ry, k === 1 ? 3 : 2, 0, 6.283); ctx.fill();
      ctx.restore();
    }
  }

  /* 3: gold light motes rising and swaying, a few soft bokeh discs, a slow halo ring */
  function rise(t, dt, intro) {
    for (var i = 0; i < motes.length; i++) {
      var p = motes[i]; p.y -= p.v * dt; if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      var x = p.x + Math.sin(t * .6 + p.sw) * p.sa + px * (p.big ? 1.6 : .6), tw = .55 + .45 * Math.sin(t * 2 + p.tw);
      var fade = Math.min(1, (H - p.y) / (H * .25)) * Math.min(1, p.y / (H * .2));
      if (p.big) {
        var g = ctx.createRadialGradient(x, p.y, 0, x, p.y, p.r * 9);
        g.addColorStop(0, rgba(GOLD, .22 * fade * intro)); g.addColorStop(1, rgba(GOLD, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, p.y, p.r * 9, 0, 6.283); ctx.fill();
      } else {
        ctx.fillStyle = rgba(GOLD, (.35 + .5 * tw) * fade * intro); ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, 6.283); ctx.fill();
      }
    }
    ctx.save(); ctx.translate(cx + px * .4, cy + py * .4); ctx.rotate(t * .05);
    ctx.strokeStyle = rgba(GOLD, .5 * intro); ctx.lineWidth = 1; ctx.setLineDash([1, 9]);
    ctx.beginPath(); ctx.arc(0, 0, R * 1.32, 0, Math.PI * 2 * intro); ctx.stroke();
    ctx.setLineDash([]); ctx.strokeStyle = rgba(INK, .14 * intro);
    ctx.beginPath(); ctx.arc(0, 0, R * 1.52, 0, Math.PI * 2 * intro); ctx.stroke(); ctx.restore();
  }

  /* all looks: sparkles on three tilted orbits around Isabelle, with fading trails; front of the orbit = bigger + brighter */
  var ORB = [];
  function seedOrbits() {
    ORB = []; var n = W < 700 ? 14 : 30;
    for (var i = 0; i < n; i++) {
      var k = i % 3;
      ORB.push({ k: k, a: Math.random() * 6.283, s: (0.18 + Math.random() * 0.22) * (k === 1 ? -1 : 1),
        rx: R * (1.18 + k * 0.2 + Math.random() * 0.06), tilt: [-0.42, 0.5, -0.12][k], flat: [0.34, 0.28, 0.46][k],
        size: 1.2 + Math.random() * 1.8, gold: Math.random() < 0.72 });
    }
  }
  function orbits(t, intro) {
    if (!ORB.length) seedOrbits();
    var ox = cx + px * 0.6, oy = cy + py * 0.6;
    for (var i = 0; i < ORB.length; i++) {
      var o = ORB[i], ct = Math.cos(o.tilt), st = Math.sin(o.tilt);
      for (var j = 7; j >= 0; j--) {                       /* trail: 7 fading steps behind the head */
        var a = o.a + t * o.s - j * 0.045 * Math.sign(o.s), ex = Math.cos(a) * o.rx, ey = Math.sin(a) * o.rx * o.flat;
        var x = ox + ex * ct - ey * st, y = oy + ex * st + ey * ct, depth = (Math.sin(a) + 1) / 2;   /* 0 back .. 1 front */
        var al = (j === 0 ? 0.95 : 0.5 * (1 - j / 8)) * (0.35 + 0.65 * depth) * intro;
        ctx.fillStyle = o.gold ? rgba(GOLD, al) : rgba(INK, al * 0.55);
        ctx.beginPath(); ctx.arc(x, y, o.size * (0.6 + 0.8 * depth) * (j === 0 ? 1 : 1 - j / 10), 0, 6.283); ctx.fill();
        if (j === 0 && depth > 0.75) {                     /* glint when passing in front */
          var g = ctx.createRadialGradient(x, y, 0, x, y, o.size * 7);
          g.addColorStop(0, rgba(GOLD, 0.35 * intro)); g.addColorStop(1, rgba(GOLD, 0));
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, o.size * 7, 0, 6.283); ctx.fill();
        }
      }
    }
  }

  var prev = 0;
  function frame(now) {
    var t = (now - t0) / 1000, intro = reduce ? 1 : ease(t / 1.8), dt = prev ? Math.min((now - prev) / 1000, .05) : 0; prev = now;
    px += (mx - px) * .06; py += (my - py) * .06;
    ctx.clearRect(0, 0, W, H);
    if (mode === 1) ripples(t, intro); else if (mode === 2) aurora(t, intro); else if (mode === 3) rise(t, dt, intro); else silk(t, intro);
    orbits(t, intro);
    if (running) raf = requestAnimationFrame(frame);
  }

  function start() { if (running || reduce) return; running = true; prev = 0; raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  size(); if (reduce) { frame(t0 + 4000); } else start();
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); if (reduce) frame(t0 + 4000); }, 150); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }).observe(hero);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  if (fine && !reduce) hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width - .5) * -18; my = ((e.clientY - r.top) / r.height - .5) * -12;
  });
})();
