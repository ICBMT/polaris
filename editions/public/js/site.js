/* ═══════════════════════════════════════════════════════════
   POLARIS · EDITION WINTER '26 — interactions
   All self-contained. No CDN. Respects prefers-reduced-motion
   and coarse pointers.
   ═══════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp  = (a, b, t) => a + (b - a) * t;
  const rand  = (a, b) => a + Math.random() * (b - a);

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COARSE  = matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ── Scroll progress + topbar ─────────────────────────── */
  const progress = $('#progress');
  const topbar   = $('#topbar');
  const chapterIds = ['copilot', 'design', 'automation', 'checkout'];
  const railLinks = $$('#rail a[data-ch]');
  const chapterRail = $('#rail');
  let ticking = false;

  const updateRailState = () => {
    if (!railLinks.length) return;

    const viewportCenter = innerHeight * 0.42;
    let activeId = chapterIds[0];

    chapterIds.forEach(id => {
      const section = document.getElementById(id);
      if (!section) return;

      const rect = section.getBoundingClientRect();
      if (rect.top <= viewportCenter) {
        activeId = id;
      }
    });

    chapterIds.forEach(id => {
      const section = document.getElementById(id);
      if (section) section.classList.toggle('is-current', id === activeId);
    });
    const activeIndex = chapterIds.indexOf(activeId);
    if (chapterRail) chapterRail.style.setProperty('--rail-progress', `${Math.max(0, activeIndex) / (chapterIds.length - 1) * 100}%`);
    railLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.ch === activeId);
    });
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const doc = document.documentElement;
      const max = Math.max(doc.scrollHeight - innerHeight, 1);
      const current = Math.min(Math.max(scrollY, 0), max);
      if (progress) progress.style.width = (current / max) * 100 + '%';
      if (topbar) topbar.classList.toggle('scrolled', scrollY > 40);
      updateRailState();
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ── Custom cursor ────────────────────────────────────── */
  const dot  = $('#cursorDot');
  const ring = $('#cursorRing');
  if (dot && ring && !COARSE && !REDUCED) {
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    document.addEventListener('mouseleave', () => { dot.style.opacity = ring.style.opacity = 0; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = ring.style.opacity = 1; });
    (function loop() {
      rx = lerp(rx, mx, .16);
      ry = lerp(ry, my, .16);
      dot.style.transform  = `translate(${mx - 3}px, ${my - 3}px)`;
      const half = ring.offsetWidth / 2;
      ring.style.transform = `translate(${rx - half}px, ${ry - half}px)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('pointerover', e => {
      ring.classList.toggle('big', !!e.target.closest('[data-hover], a, button, .swatch'));
    });
  } else if (dot && ring) {
    dot.remove(); ring.remove();
  }

  /* ── Frost particles (hero canvas) — 2D fallback ─────────
     When WebGL is available, three-scene.js takes over this
     canvas; the 2D field only runs as a graceful fallback. */
  const canvas = $('#frost');
  const WGL = document.documentElement.classList.contains('wgl');
  if (canvas && !REDUCED && !WGL) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1, parts = [];
    let hx = 0, hy = 0; // hero-space mouse, -1..1
    const hero = canvas.parentElement;

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(150, Math.round(W / 9));
      parts = Array.from({ length: n }, () => spawn(true));
    };
    const spawn = (anywhere = false) => ({
      x: rand(0, W),
      y: anywhere ? rand(0, H) : H + rand(4, 30),
      r: rand(.6, 2.3),
      vy: -rand(.12, .5),
      vx: rand(-.08, .08),
      a: rand(.12, .6),
      depth: rand(.3, 1),
      tw: rand(0, Math.PI * 2),
    });

    hero.addEventListener('mousemove', e => {
      const b = hero.getBoundingClientRect();
      hx = ((e.clientX - b.left) / b.width - .5) * 2;
      hy = ((e.clientY - b.top) / b.height - .5) * 2;
    }, { passive: true });

    let running = true;
    document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) frame(); });

    resize();
    addEventListener('resize', resize, { passive: true });

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.y += p.vy * p.depth;
        p.x += p.vx + Math.sin(p.tw += .004) * .05;
        if (p.y < -10 || p.x < -12 || p.x > W + 12) parts[i] = spawn();
        const ox = hx * 26 * p.depth;
        const oy = hy * 18 * p.depth;
        const alpha = p.a * (.7 + .3 * Math.sin(p.tw * 2));
        ctx.beginPath();
        ctx.arc(p.x + ox, p.y + oy, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 235, 255, ${alpha.toFixed(3)})`;
        ctx.fill();
        if (p.r > 1.9) {
          ctx.beginPath();
          ctx.arc(p.x + ox, p.y + oy, p.r * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(125, 211, 252, ${(alpha * .12).toFixed(3)})`;
          ctx.fill();
        }
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  /* ── Aurora orb parallax ──────────────────────────────── */
  const orbs = $$('.orbs');
  if (orbs.length && !REDUCED && !COARSE) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    addEventListener('mousemove', e => {
      tx = (e.clientX / innerWidth - .5) * 2;
      ty = (e.clientY / innerHeight - .5) * 2;
    }, { passive: true });
    (function loop() {
      cx = lerp(cx, tx, .04);
      cy = lerp(cy, ty, .04);
      for (const o of orbs) {
        const depth = parseFloat(o.dataset.depth || '1');
        o.style.transform =
          `translate(${(-cx * 30 * depth).toFixed(1)}px, ${(-cy * 22 * depth - scrollY * .03 * depth).toFixed(1)}px)`;
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ── Scramble-decode ──────────────────────────────────── */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789✦◆·—';
  function scramble(el) {
    const target = el.dataset.text || el.textContent;
    const total = Math.max(18, target.length * 1.6);
    let f = 0;
    (function step() {
      f++;
      const solved = Math.floor((f / total) * target.length);
      let out = '';
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        if (ch === ' ' || i < solved) out += ch;
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (f < total) requestAnimationFrame(step);
      else el.textContent = target;
    })();
  }

  /* ── Count-up ─────────────────────────────────────────── */
  function countUp(el) {
    const end = parseFloat(el.dataset.count || '0');
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const suf = el.dataset.suffix || '';
    const dur = 1700;
    const t0 = performance.now();
    (function tick(now) {
      const t = clamp((now - t0) / dur, 0, 1);
      const e = 1 - Math.pow(2, -10 * t); // easeOutExpo
      el.textContent = (end * e).toFixed(dec) + suf;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = end.toFixed(dec) + suf;
    })(t0);
  }

  /* ── Intersection triggers (one-shot, no styles) ────────
     Entry/exit choreography is scrub-based (see scroll
     engine below); IO only fires decode/counter/draw. */
  const io = new IntersectionObserver(entries => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const el = en.target;
      io.unobserve(el);
      if (el.classList.contains('scramble') && !REDUCED) scramble(el);
      if (el.hasAttribute('data-count')) (!REDUCED ? countUp : instantCount)(el);
      if (el.querySelector && el.querySelector('.spark-line')) {
        el.querySelector('.spark-line').classList.add('in');
        el.querySelector('.spark-area').classList.add('in');
      }
    }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });

  $$('.scramble, [data-count], .aura-mock').forEach(el => io.observe(el));

  function instantCount(el) {
    const end = parseFloat(el.dataset.count || '0');
    const dec = parseInt(el.dataset.decimals || '0', 10);
    el.textContent = end.toFixed(dec) + (el.dataset.suffix || '');
  }

  /* ── Typing engine ────────────────────────────────────── */
  const typers = $$('.pc-typed[data-prompts]').map((el, i) => {
    let prompts = [];
    try { prompts = JSON.parse(el.dataset.prompts || '[]'); } catch (e) { /* noop */ }
    if (!prompts.length) return null;
    return { el, prompts, i };
  }).filter(Boolean);

  if (typers.length) {
    if (REDUCED) {
      typers.forEach(t => { t.el.textContent = t.prompts[0]; });
    } else {
      const state = typers.map(t => ({ ...t, pi: 0, ci: 0, mode: 'type', wait: 500 + t.i * 1400 }));
      let last = performance.now();
      (function loop(now) {
        const dt = now - last; last = now;
        for (const s of state) {
          s.wait -= dt;
          if (s.wait > 0) continue;
          const text = s.prompts[s.pi];
          if (s.mode === 'type') {
            s.ci++;
            s.el.textContent = text.slice(0, s.ci);
            s.wait = rand(34, 74);
            if (s.ci >= text.length) { s.mode = 'hold'; s.wait = 2600; }
          } else if (s.mode === 'hold') {
            s.mode = 'erase'; s.wait = 26;
          } else {
            s.ci--;
            s.el.textContent = text.slice(0, Math.max(0, s.ci));
            s.wait = 16;
            if (s.ci <= 0) { s.mode = 'type'; s.pi = (s.pi + 1) % s.prompts.length; s.wait = 700; }
          }
        }
        requestAnimationFrame(loop);
      })(last);
    }
  }

  /* ── 3D tilt + glare ──────────────────────────────────── */
  if (!COARSE && !REDUCED) {
    $$('.tilt').forEach(card => {
      let raf = null;
      card.addEventListener('pointermove', e => {
        const b = card.getBoundingClientRect();
        const px = (e.clientX - b.left) / b.width;
        const py = (e.clientY - b.top) / b.height;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const rx = (.5 - py) * 7;
          const ry = (px - .5) * 7;
          card.style.transform = `perspective(950px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
          card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        });
      });
      card.addEventListener('pointerleave', () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = '';
      });
    });
  }

  /* ── Magnetic buttons ─────────────────────────────────── */
  if (!COARSE && !REDUCED) {
    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const b = el.getBoundingClientRect();
        const dx = clamp((e.clientX - (b.left + b.width / 2)) * .28, -12, 12);
        const dy = clamp((e.clientY - (b.top + b.height / 2)) * .28, -10, 10);
        el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ── Studio live re-skin ──────────────────────────────── */
  const phone = $('.phone');
  $$('.swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      $$('.swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      if (!phone) return;
      phone.style.setProperty('--studio-bg', sw.dataset.bg);
      phone.style.setProperty('--studio-acc', sw.dataset.acc);
      phone.style.setProperty('--studio-ink', sw.dataset.ink);
    });
  });

  /* ── "Run" demo buttons ───────────────────────────────── */
  $$('.pc-run').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.prompt-card');
      if (!card || card.classList.contains('running') || card.classList.contains('done')) return;
      btn.disabled = true;
      btn.innerHTML = 'Building…';
      card.classList.add('running');
      setTimeout(() => {
        card.classList.add('done');
        btn.innerHTML = 'Re-run <span class="arr">↻</span>';
        setTimeout(() => {
          card.classList.remove('done', 'running');
          btn.disabled = false;
          btn.innerHTML = 'Run <span class="arr">→</span>';
        }, 2400);
      }, 1350);
    });
  });

  /* ── Checkout step loop ───────────────────────────────── */
  const coMock = $('#coMock');
  if (coMock) {
    const steps = $$('.co-step', coMock);
    if (REDUCED) {
      steps.forEach(s => s.classList.add('done'));
      coMock.classList.add('success');
    } else {
      let phase = -1; // -1 idle → 0,1,2 → 3 success
      const io2 = new IntersectionObserver(en => {
        if (!en[0].isIntersecting) return;
        io2.disconnect();
        const cycle = () => {
          phase = (phase + 1) % 4;
          steps.forEach((s, i) => {
            s.classList.toggle('active', i === phase);
            s.classList.toggle('done', phase > 2 ? true : i < phase);
          });
          coMock.classList.toggle('success', phase > 2);
          const pay = $('.co-pay', coMock);
          if (pay) pay.textContent = phase > 2 ? 'Paid ✓' : 'Pay now';
          setTimeout(cycle, phase > 2 ? 2100 : 1250);
        };
        cycle();
      }, { threshold: .4 });
      io2.observe(coMock);
    }
  }

  /* ── Cart watcher jitter ──────────────────────────────── */
  const cartWatch = $('#cartWatch');
  if (cartWatch && !REDUCED) {
    let v = 4218;
    setInterval(() => {
      v = clamp(Math.round(v + rand(-90, 120)), 3900, 4700);
      cartWatch.textContent = v.toLocaleString('en-US');
    }, 2400);
  }

  /* ── Chapter rail: fade out in the finale ─────────────── */
  const rail = $('#rail');
  const finale = document.getElementById('finale');
  if (rail && finale) {
    const rio = new IntersectionObserver(en => {
      rail.style.opacity = en[0].isIntersecting ? '0' : '';
      rail.style.visibility = en[0].isIntersecting ? 'hidden' : '';
    }, { threshold: 0.15 });
    rio.observe(finale);
  }

  /* ── Chapter rail active state ────────────────────────── */
  if (railLinks.length) {
    updateRailState();
  }

  /* ── Live pulse from Laravel (with graceful fallback) ─── */
  const ordersTick = $('#ordersTick');
  const footClock  = $('#footClock');
  const footLatency = $('#footLatency');
  const tickLatency = $('#tickLatency');
  const livePill = $('#livePill');
  const liveLabel = $('#liveLabel');

  let ops = 142806112;
  let usingServer = false;

  const renderOrders = () => {
    if (ordersTick) ordersTick.textContent = Math.round(ops).toLocaleString('en-US');
  };
  renderOrders();

  if (!REDUCED) setInterval(() => {
    if (!usingServer) ops += rand(2, 9); // local simulation keeps the number alive
    renderOrders();
  }, 1500);

  async function fetchPulse() {
    try {
      const r = await fetch('/api/pulse', { cache: 'no-store' });
      if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      usingServer = true;
      if (livePill) livePill.classList.remove('sim');
      if (liveLabel) liveLabel.textContent = 'LIVE · ' + (d.framework || 'LARAVEL').toUpperCase();
      if (footClock) footClock.textContent = d.server_time_hms || '--:--:--';
      if (footLatency) footLatency.textContent = d.latency_ms != null ? d.latency_ms : '—';
      if (tickLatency) tickLatency.textContent = Math.max(1, Math.round(d.latency_ms || 12));
      if (typeof d.ops_this_season === 'number') ops = d.ops_this_season;
    } catch (e) {
      usingServer = false;
      if (livePill) livePill.classList.add('sim');
      if (liveLabel) liveLabel.textContent = 'SIM · OFFLINE MODE';
    }
  }
  fetchPulse();
  setInterval(fetchPulse, 5000);

  /* ═══════════════════════════════════════════════════════
     SCROLL ENGINE — "outside the browser"
     Lenis-style inertial scroll: native scroll stays the
     source of truth (scrollbar, anchors, keyboard all work),
     a fixed wrapper chases it with a smooth exponential
     ease — momentum, glide, catch-up. On top of that, every
     section is SCRUBBED (reversible, physical):
       · entry  : rise + un-blur + scale-in
       · exit   : drift up + atmospheric blur
       · parallax: per-layer speeds (data-driven)
       · velocity: whole-world micro scale-pulse
       · marquee : JS-driven, scrolls with your velocity
     Touch / reduced-motion → native scroll (light scrub).
  ═══════════════════════════════════════════════════════ */
  (function scrollEngine() {
    const SMOOTH = !COARSE && !REDUCED;
    const mainEl = $('main');
    const footEl = $('.footer');
    const railEl = $('#rail');
    const track  = $('.marquee-track');
    if (!mainEl) return;

    /* ── targets + parallax speeds ─────────────────────── */
    const SPEEDS = [
      ['.hero-inner', 1.12], ['.hero-ticker', 1.18], ['.ch-title', 0.88],
      ['.ch-copy', 0.8], ['.feature-list', 0.9], ['.prompt-grid', 0.96],
      ['.studio-cards', 0.98], ['.studio-stage', 0.9], ['.cta-title', 1.08],
      ['.cta .btn-big', 1.02], ['.foot-word', 0.64], ['.chapters-head h2', 0.9],
      ['.finale-ui', 0.9],
    ];
    const speedOf = el => {
      if (el.classList && el.classList.contains('m-line')) {
        const i = Array.prototype.indexOf.call(el.parentElement.children, el);
        return [1.08, 0.88, 1.14][i] || 1;
      }
      let n = el;
      while (n) {
        for (const [sel, sp] of SPEEDS) if (n.matches(sel)) return sp;
        n = n.parentElement;
      }
      return 1;
    };
    const targets = [];
    const seen = new Set();
    const addT = el => { if (el && !seen.has(el)) { seen.add(el); targets.push({ el, sp: speedOf(el), L: 0, _b: null }); } };
    $$('.reveal').forEach(addT);
    $$('.hero-inner, .chapters-head h2, .m-line, .cta-title, .foot-word').forEach(addT);

    /* ── inertial wrapper (fine pointers only) ─────────── */
    let wrapper = null;
    const state = { y: scrollY, vel: 0 };
    let trackHalf = 0;

    if (SMOOTH && footEl) {
      wrapper = document.createElement('div');
      wrapper.id = 'scrollWrap';
      wrapper.appendChild(mainEl);
      wrapper.appendChild(footEl);
      document.body.appendChild(wrapper);
      if (railEl) document.body.appendChild(railEl);
    }
    const setBodyH = () => {
      if (wrapper) document.body.style.height = (mainEl.offsetHeight + footEl.offsetHeight) + 'px';
    };
    const measure = () => {
      const y = wrapper ? state.y : scrollY;
      for (const t of targets) {
        t.el.style.transform = '';
        t.el.style.opacity = '';
        t.el.style.filter = '';
        t.L = t.el.getBoundingClientRect().top + y;
      }
      if (track) trackHalf = track.scrollWidth / 2;
    };

    /* ── anchor routing ────────────────────────────────────
       In-page anchors to elements inside the fixed wrapper
       don't scroll natively — we compute the target's layout
       offset and glide there ourselves. */
    const docTopOf = el => {
      let top = 0, n = el;
      while (n) { top += n.offsetTop; n = n.offsetParent; }
      return top;
    };
    const goToHash = (hash, push) => {
      let targetEl = null;
      try { targetEl = document.querySelector(hash); } catch (e) { return; }
      if (!targetEl) return;
      const top = Math.max(0, docTopOf(targetEl) - 96);
      window.scrollTo({ top, behavior: REDUCED ? 'auto' : 'smooth' });
      if (push) history.replaceState(null, '', hash);
    };
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute('href');
      if (hash.length < 2) return;
      e.preventDefault();
      goToHash(hash, true);
    });
    addEventListener('hashchange', () => { if (location.hash) goToHash(location.hash, false); });

    if (track) track.classList.add('js-driven');
    setBodyH();
    measure();
    new ResizeObserver(() => { setBodyH(); measure(); }).observe(mainEl);
    if (footEl) new ResizeObserver(setBodyH).observe(footEl);
    addEventListener('resize', measure, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => measure());

    /* ── frame ─────────────────────────────────────────── */
    const clamp01 = v => Math.min(1, Math.max(0, v));
    let last = performance.now();
    let mOff = 0;

    function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      /* inertia: exponential chase of native scroll */
      const target = scrollY;
      const prev = state.y;
      state.y += (target - state.y) * (SMOOTH ? 1 - Math.exp(-dt * 7.5) : 1);
      if (Math.abs(target - state.y) < 0.05) state.y = target;
      const rv = (state.y - prev) / Math.max(dt, 1e-4);
      state.vel += (rv - state.vel) * Math.min(1, dt * 12);

      if (wrapper) {
        const s = 1 + Math.min(0.005, Math.max(-0.0035, state.vel * 0.000004));
        wrapper.style.transformOrigin = `50% ${state.y + innerHeight / 2}px`;
        wrapper.style.transform = `translate3d(0, ${(-state.y).toFixed(2)}px, 0) scale(${s.toFixed(5)})`;
      }
      updateRailState();

      /* scrubbed sections */
      const vh = innerHeight;
      const y = state.y;
      for (const t of targets) {
        const vis = t.L - y;
        const pe = clamp01((vh * 1.05 - vis) / (vh * 0.55));
        const px = clamp01((vh * 0.42 - vis) / (vh * 0.72));
        const e  = 1 - Math.pow(1 - pe, 3);
        const x  = 1 - Math.pow(1 - px, 2);
        const po = (vis - vh * 0.5) * (1 - t.sp) * 0.28;
        const ty = (1 - e) * 12 + po - x * 10;
        const sc = 0.996 + 0.004 * e;
        const op = e * (1 - x * 0.3);
        t.el.style.opacity = op < 0.01 ? '0' : op.toFixed(3);
        t.el.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0) scale(${sc.toFixed(4)})`;
        const b = px * 1.1 + (1 - pe) * 0.45;
        const b2 = (COARSE ? b * 0.5 : b) > 0.08 ? Math.min(0.9, Math.round(b * 10) / 10) : 0;
        if (b2 !== t._b) { t._b = b2; t.el.style.filter = b2 ? `blur(${b2}px)` : 'none'; }
      }

      /* marquee: time + scroll velocity, seamless */
      if (track && trackHalf > 0) {
        mOff += dt * 110 + state.vel * 0.006;
        const x = -(((mOff % trackHalf) + trackHalf) % trackHalf);
        track.style.transform = `translateX(${x.toFixed(1)}px)`;
      }
      requestAnimationFrame(frame);
    }
    if (!REDUCED) requestAnimationFrame(frame);
  })();
})();
