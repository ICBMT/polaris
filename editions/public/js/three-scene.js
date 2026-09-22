/* ═══════════════════════════════════════════════════════════
   POLARIS · EDITION WINTER '26 — WebGL layer (three.js r186)
   ─────────────────────────────────────────────────────────
   • hero : 2,600-particle frost field (custom shader, additive)
            + faceted crystal — fresnel/iridescent rim shader
            + counter-rotating wireframe shell
   • cta  : flowing "data sea" — vertex-displaced line grid
   Smoothness protocol:
     · single rAF loop, delta-clamped clock
     · DPR capped (2 desktop / 1.5 touch)
     · each canvas pauses off-screen (IntersectionObserver)
       and when the tab is hidden
     · additive blending, no depth-write on transparents,
       no shadows, no post-processing → cheap frames
     · all pointer motion is lerp-smoothed
     · prefers-reduced-motion → one composed static frame, no loop
     · WebGL unavailable / context lost → 2D frost fallback takes over
   ═══════════════════════════════════════════════════════════ */
import * as THREE from '/vendor/three.module.js';

const root = document.documentElement;

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const COARSE  = matchMedia('(hover: none), (pointer: coarse)').matches;
const DPR_CAP = COARSE ? 1.5 : 2;

if (root.classList.contains('wgl')) {
  /* ── shared state ─────────────────────────────────────── */
  const mouse = { x: 0, y: 0, lx: 0, ly: 0 };
  addEventListener('pointermove', e => {
    mouse.x = (e.clientX / innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  const clock  = new THREE.Clock();
  const scenes = [];

  let rafId = null;
  const loop = () => {
    const dt = Math.min(clock.getDelta(), 0.05); // clamp: no time-jumps after tab sleep
    const t  = clock.elapsedTime;
    mouse.lx += (mouse.x - mouse.lx) * 0.045;
    mouse.ly += (mouse.y - mouse.ly) * 0.045;
    for (const s of scenes) if (s.visible && !s.dead) s.render(t, dt);
    rafId = requestAnimationFrame(loop);
  };

  const setLoop = (on) => {
    if (on && rafId === null) {
      clock.getDelta();                       // flush hidden-time delta
      rafId = requestAnimationFrame(loop);
    } else if (!on && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
  document.addEventListener('visibilitychange', () => {
    if (!REDUCED) setLoop(!document.hidden);
  });

  /**
   * build(renderer, scene, camera) → { render(t, dt), pose?() }
   */
  function mount(canvas, build) {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas, antialias: true, alpha: true, powerPreference: 'high-performance',
      });
    } catch (e) {
      root.classList.remove('wgl');           // hand the canvas back to 2D frost
      return null;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, DPR_CAP));

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120);
    const parts  = build(renderer, scene, camera);
    const entry  = { renderer, scene, camera, render: parts.render, visible: false, dead: false, staticDone: false };

    const resize = () => {
      const w = canvas.clientWidth  || 1;
      const h = canvas.clientHeight || 1;
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, DPR_CAP));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (parts.resize) parts.resize();
    };
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(resize).observe(canvas);
    addEventListener('resize', resize, { passive: true });
    resize();

    canvas.addEventListener('webglcontextlost', e => {
      e.preventDefault();
      entry.dead = true;
      entry.visible = false;
    });

    const io = new IntersectionObserver(en => {
      entry.visible = en[0].isIntersecting;
      if (REDUCED && entry.visible && !entry.staticDone) {
        entry.staticDone = true;
        if (parts.pose) parts.pose();          // compose a flattering static pose
        entry.render(2.2, 0);
      }
    }, { threshold: 0.04 });
    io.observe(canvas);

    scenes.push(entry);
    return entry;
  }

  /* ════════════════════════════════════════════════════════
     HERO — frost field + crystal
  ════════════════════════════════════════════════════════ */
  const heroCanvas = document.getElementById('frost');
  if (heroCanvas) {
    const N  = COARSE ? 1400 : 2600;
    const pos  = new Float32Array(N * 3);
    const scl  = new Float32Array(N);
    const tint = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() * 2 - 1) * 17;
      pos[i * 3 + 1] = (Math.random() * 2 - 1) * 8;
      pos[i * 3 + 2] = (Math.random() * 2 - 1) * 10 - 1;
      scl[i]  = 0.5 + Math.random() * 1.2;
      tint[i] = Math.random();
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('aScale',   new THREE.BufferAttribute(scl, 1));
    pGeo.setAttribute('aTint',    new THREE.BufferAttribute(tint, 1));

    const pMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPR:   { value: Math.min(devicePixelRatio || 1, DPR_CAP) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uPR;
        attribute float aScale;
        attribute float aTint;
        varying float vA;
        varying float vTint;
        void main() {
          vec3 p = position;
          float sp = 0.22 + aScale * 0.34;                  // per-flake drift speed
          p.y = mod(p.y + uTime * sp + 8.0, 16.0) - 8.0;    // endless upward wrap
          p.x += sin(uTime * 0.22 + p.y * 0.6 + aTint * 6.28) * 0.42;
          p.z += cos(uTime * 0.18 + p.x * 0.5) * 0.3;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position  = projectionMatrix * mv;
          gl_PointSize = clamp(aScale * uPR * 42.0 / -mv.z, 1.0, 11.0 * uPR);
          float tw = 0.72 + 0.28 * sin(uTime * (1.4 + aTint * 2.2) + aTint * 21.0);
          vA    = smoothstep(20.0, 5.0, -mv.z) * (0.32 + 0.5 * fract(aTint * 7.31)) * tw;
          vTint = aTint;
        }`,
      fragmentShader: /* glsl */ `
        varying float vA;
        varying float vTint;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.04, d) * vA;
          if (a < 0.004) discard;
          vec3 cIce = vec3(0.60, 0.86, 1.00);
          vec3 cVio = vec3(0.70, 0.72, 1.00);
          gl_FragColor = vec4(mix(cIce, cVio, vTint * 0.75), a);
        }`,
    });
    const points = new THREE.Points(pGeo, pMat);

    /* crystal — faceted octahedron with fresnel/iridescent rim */
    const cGeo = new THREE.OctahedronGeometry(3.0, 0);
    const cMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        varying vec3 vN;
        varying vec3 vV;
        varying vec3 vP;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vN = normalize(mat3(modelMatrix) * normal);
          vV = cameraPosition - wp.xyz;
          vP = position;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        varying vec3 vN;
        varying vec3 vV;
        varying vec3 vP;
        void main() {
          float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0);
          float iri  = 0.5 + 0.5 * sin(uTime * 0.5 + vP.y * 0.9 + vP.x * 0.7 - vP.z * 0.5);
          vec3 ice   = vec3(0.52, 0.84, 1.00);
          vec3 vio   = vec3(0.66, 0.62, 1.00);
          vec3 rim   = mix(ice, vio, iri);
          vec3 col   = rim * fres * 1.9 + vec3(0.008, 0.02, 0.035);
          gl_FragColor = vec4(col, 0.05 + fres * 0.9);
        }`,
    });
    const crystal = new THREE.Mesh(cGeo, cMat);
    crystal.scale.set(1, 1.5, 1);
    crystal.position.set(0, 0.2, -1);

    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(cGeo),
      new THREE.LineBasicMaterial({
        color: 0x7dd3fc, transparent: true, opacity: 0.15,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }),
    );
    wire.scale.setScalar(1.16);
    crystal.add(wire);

    mount(heroCanvas, (renderer, scene, camera) => {
      scene.add(points, crystal);
      camera.position.set(0, 0.2, 14);

      const render = (t) => {
        pMat.uniforms.uTime.value = t;
        cMat.uniforms.uTime.value = t;

        crystal.rotation.y = t * 0.14 + mouse.lx * 0.5;
        crystal.rotation.x = 0.18 + mouse.ly * 0.35 + scrollY * 0.0012;
        crystal.position.y = 0.2 + Math.sin(t * 0.5) * 0.18 - scrollY * 0.0022;
        crystal.scale.x = 1 + Math.sin(t * 0.8) * 0.015;
        crystal.scale.z = 1 + Math.cos(t * 0.7) * 0.015;
        wire.rotation.y = -t * 0.1;

        points.rotation.y = t * 0.012 + mouse.lx * 0.06;

        camera.position.x += (mouse.lx * 1.1 - camera.position.x) * 0.05;
        camera.position.y += (0.2 - mouse.ly * 0.7 - camera.position.y) * 0.05;
        camera.position.z = 14 + Math.min(scrollY * 0.004, 7);   // pull back as you leave the hero
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      return {
        render,
        pose: () => { crystal.rotation.set(0.32, 0.68, 0); },
      };
    });
  }

  /* ════════════════════════════════════════════════════════
     CTA — flowing data-sea grid
  ════════════════════════════════════════════════════════ */
  const waveCanvas = document.getElementById('ctaWave');
  if (waveCanvas) {
    const X0 = -26, X1 = 26, Z0 = -10, Z1 = 30, S = 1.6;
    const verts = [];
    for (let x = X0; x <= X1; x += S) verts.push(x, 0, Z0, x, 0, Z1);
    for (let z = Z0; z <= Z1; z += S) verts.push(X0, 0, z, X1, 0, z);
    const gGeo = new THREE.BufferGeometry();
    gGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));

    const gMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAmp:  { value: COARSE ? 0.55 : 0.85 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uAmp;
        varying float vX;
        varying float vZ;
        void main() {
          vec3 p = position;
          float d = length(p.xz);
          p.y += (
              sin(p.x * 0.5 + uTime * 0.8) * cos(p.z * 0.36 + uTime * 0.5)
            + 0.6 * sin(p.x * 0.7 - p.z * 0.5 + uTime * 0.6)
          ) * uAmp * smoothstep(5.0, 17.0, d);
          vX = p.x;
          vZ = p.z;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        varying float vX;
        varying float vZ;
        void main() {
          float far  = 1.0 - smoothstep(15.0, 29.0, vZ);   // dissolve into the horizon
          float near = smoothstep(-11.0, -5.0, vZ);        // rise from under the viewer
          float a = 0.5 * far * near;
          vec3 ice = vec3(0.34, 0.74, 1.00);
          vec3 vio = vec3(0.60, 0.58, 1.00);
          vec3 c = mix(ice, vio, 0.5 + 0.5 * sin(vX * 0.16 + uTime * 0.25));
          gl_FragColor = vec4(c, a);
        }`,
    });
    const grid = new THREE.LineSegments(gGeo, gMat);

    mount(waveCanvas, (renderer, scene, camera) => {
      scene.add(grid);
      camera.position.set(0, 3.4, -12);
      camera.lookAt(0, 0.3, 14);

      const render = (t) => {
        gMat.uniforms.uTime.value = t;
        const r = waveCanvas.getBoundingClientRect();
        const c = 1 - Math.min(1, Math.abs(r.top + r.height / 2 - innerHeight / 2) / (innerHeight * 0.9));
        gMat.uniforms.uAmp.value = (COARSE ? 0.55 : 0.85) * (0.6 + c * 0.8);   // swells as it centers
        camera.position.x += (mouse.lx * 1.6 - camera.position.x) * 0.04;
        camera.position.y += (3.4 + (1 - c) * 1.1 - camera.position.y) * 0.06;
        renderer.render(scene, camera);
      };

      return { render };
    });
  }

  /* ════════════════════════════════════════════════════════
     FINALE — "Frost in form"
     6,000 particles on spring physics that assemble into
     shapes and reform: WINTER '26 → DIAMOND → SNOWFLAKE → POLARIS
     (text sampled from an offscreen canvas — igloo.inc-style
      volume targets). The cursor carves through the field;
      particles scatter, glow from velocity, and spring home.
  ════════════════════════════════════════════════════════ */
  const finCanvas = document.getElementById('finaleParticles');
  if (finCanvas) {
    const N  = COARSE ? 2600 : 6000;
    const HOLD = 4.6; // seconds per shape before auto-morph

    const pos  = new Float32Array(N * 3);
    const vel  = new Float32Array(N * 3);
    const base = new Float32Array(N * 3);
    const scl  = new Float32Array(N);
    const tint = new Float32Array(N);
    const glow = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      const r  = 13 * Math.cbrt(Math.random());
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      base[i * 3]     = r * Math.sin(ph) * Math.cos(th);
      base[i * 3 + 1] = r * Math.cos(ph) * 0.7;
      base[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) * 0.5;
      pos[i * 3] = base[i * 3]; pos[i * 3 + 1] = base[i * 3 + 1]; pos[i * 3 + 2] = base[i * 3 + 2];
      scl[i]  = 0.55 + Math.random() * 1.1;
      tint[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    const posAttr  = new THREE.BufferAttribute(pos, 3);
    const glowAttr = new THREE.BufferAttribute(glow, 1);
    geo.setAttribute('position', posAttr);
    geo.setAttribute('aScale', new THREE.BufferAttribute(scl, 1));
    geo.setAttribute('aTint',  new THREE.BufferAttribute(tint, 1));
    geo.setAttribute('aGlow',  glowAttr);

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPR:   { value: Math.min(devicePixelRatio || 1, DPR_CAP) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uPR;
        uniform float uTime;
        attribute float aScale;
        attribute float aTint;
        attribute float aGlow;
        varying float vA;
        varying float vTint;
        varying float vGlow;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp(aScale * uPR * 58.0 / -mv.z, 1.5, 9.0 * uPR);
          float tw = 0.85 + 0.15 * sin(uTime * (1.2 + aTint * 2.0) + aTint * 25.0);
          vA = tw * (0.95 + aGlow * 0.7);
          vTint = aTint;
          vGlow = aGlow;
        }`,
      fragmentShader: /* glsl */ `
        varying float vA;
        varying float vTint;
        varying float vGlow;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.02, d) * vA;
          if (a < 0.004) discard;
          vec3 ice = vec3(0.55, 0.85, 1.00);
          vec3 vio = vec3(0.68, 0.66, 1.00);
          vec3 wht = vec3(0.96, 0.99, 1.00);
          vec3 c = mix(ice, vio, vTint * 0.8);
          c = mix(c, wht, clamp(vGlow, 0.0, 1.0) * 0.9);
          gl_FragColor = vec4(c, a);
        }`,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;

    /* ── shape registry ─────────────────────────────────── */
    const shapes = [];   // { name, pts, btn }
    let activeIdx = -1;  // -1 = free scatter
    let switchT = -99;
    let started = false;

    const setShape = (i, t) => {
      if (!shapes[i]) return;
      activeIdx = i;
      switchT = t;
      for (let j = 0; j < N * 3; j += 3) {          // burst: the cloud explodes, then reforms
        vel[j]     += (Math.random() - 0.5) * 24;
        vel[j + 1] += (Math.random() - 0.5) * 24;
        vel[j + 2] += (Math.random() - 0.5) * 16;
      }
      for (const s of shapes) s.btn && s.btn.classList.toggle('active', s === shapes[i]);
    };

    /* ── the scene ──────────────────────────────────────── */
    const _ndc = new THREE.Vector3();
    const _dir = new THREE.Vector3();
    const finMouse = { x: 0, y: 0, lx: 0, ly: 0, active: false };

    const entry = mount(finCanvas, (renderer, scene, camera) => {
      scene.add(points);
      camera.position.set(0, 0, 26);

      const sec = finCanvas.parentElement;
      sec.addEventListener('pointermove', e => {
        const r = finCanvas.getBoundingClientRect();
        finMouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        finMouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
        finMouse.active = true;
      }, { passive: true });
      sec.addEventListener('pointerleave', () => { finMouse.active = false; });

      let mwX = 0, mwY = 300;  // mouse in world (z=0 plane), parked far away

      const render = (t, dt) => {
        mat.uniforms.uTime.value = t;
        const r = finCanvas.getBoundingClientRect();
        const c = 1 - Math.min(1, Math.abs(r.top + r.height / 2 - innerHeight / 2) / (innerHeight * 0.9));
        points.rotation.x = (1 - c) * 0.22;          // tilts into place as it centers
        points.scale.setScalar(0.92 + c * 0.08);
        if (activeIdx >= 0 && t - switchT > HOLD) setShape((activeIdx + 1) % shapes.length, t);
        const T = activeIdx >= 0 ? shapes[activeIdx].pts : null;

        finMouse.lx += (finMouse.x - finMouse.lx) * 0.14;
        finMouse.ly += (finMouse.y - finMouse.ly) * 0.14;
        let tmx = 0, tmy = 300;
        if (finMouse.active) {
          _ndc.set(finMouse.lx, finMouse.ly, 0.5).unproject(camera);
          _dir.subVectors(_ndc, camera.position).normalize();
          const tt = -camera.position.z / _dir.z;
          tmx = camera.position.x + _dir.x * tt;
          tmy = camera.position.y + _dir.y * tt;
        }
        mwX += (tmx - mwX) * 0.18;
        mwY += (tmy - mwY) * 0.18;

        const RET  = Math.pow(0.90, dt * 60);       // frame-rate independent damping
        const SPK  = 40;                            // spring stiffness
        const R    = 3.4, R2 = R * R;               // cursor repulsion radius

        for (let i = 0; i < N; i++) {
          const j = i * 3;
          let ax, ay, az;
          if (T) {
            ax = (T[j] - pos[j]) * SPK;
            ay = (T[j + 1] - pos[j + 1]) * SPK;
            az = (T[j + 2] - pos[j + 2]) * SPK;
          } else {                                   // free scatter: drift around anchors
            ax = (base[j] - pos[j]) * 2 + Math.sin(t * 0.5 + i * 1.7) * 2.2;
            ay = (base[j + 1] - pos[j + 1]) * 2 + Math.cos(t * 0.4 + i * 2.3) * 2.2;
            az = (base[j + 2] - pos[j + 2]) * 2 + Math.sin(t * 0.35 + i * 3.1) * 1.4;
          }
          if (finMouse.active || mwY < 200) {
            const dx = pos[j] - mwX, dy = pos[j + 1] - mwY, dz = pos[j + 2];
            const d2 = dx * dx + dy * dy + dz * dz;
            if (d2 < R2) {
              const d = Math.sqrt(d2) + 1e-4;
              const f = 1 - d / R;
              const acc = f * f * 300;
              ax += (dx / d) * acc;
              ay += (dy / d) * acc;
              az += (dz / d) * acc * 0.6;
            }
          }
          vel[j]     = (vel[j]     + ax * dt) * RET;
          vel[j + 1] = (vel[j + 1] + ay * dt) * RET;
          vel[j + 2] = (vel[j + 2] + az * dt) * RET;
          pos[j]     += vel[j] * dt;
          pos[j + 1] += vel[j + 1] * dt;
          pos[j + 2] += vel[j + 2] * dt;
          const sp = Math.sqrt(vel[j] * vel[j] + vel[j + 1] * vel[j + 1] + vel[j + 2] * vel[j + 2]);
          let gd = 0;
          if (T) {
            const ex = T[j] - pos[j], ey = T[j + 1] - pos[j + 1], ez = T[j + 2] - pos[j + 2];
            gd = Math.sqrt(ex * ex + ey * ey + ez * ez);
          }
          glow[i] = Math.min(1, sp * 0.05 + gd * 0.05);
        }
        posAttr.needsUpdate = true;
        glowAttr.needsUpdate = true;
        renderer.render(scene, camera);
      };

      return {
        render,
        pose: () => {                                 // reduced-motion: snap to first shape
          if (shapes[activeIdx]) {
            const T = shapes[activeIdx].pts;
            for (let i = 0; i < N * 3; i++) pos[i] = T[i];
            posAttr.needsUpdate = true;
            glow.fill(0);
            glowAttr.needsUpdate = true;
          }
        },
      };
    });

    /* ── target builders ────────────────────────────────── */
    const fontSpec = fs => `700 ${fs}px "Space Grotesk", "Inter", sans-serif`;

    function buildText(text, worldW) {
      const cv = document.createElement('canvas');
      cv.width = 2000; cv.height = 620;
      const cx = cv.getContext('2d', { willReadFrequently: true });
      let fs = 250;
      cx.font = fontSpec(fs);
      let w = cx.measureText(text).width;
      if (w > 1860) { fs = Math.floor(fs * 1860 / w); cx.font = fontSpec(fs); w = cx.measureText(text).width; }
      cx.fillStyle = '#fff';
      cx.textAlign = 'center';
      cx.textBaseline = 'middle';
      cx.fillText(text, 1000, 310);
      const data = cx.getImageData(0, 0, 2000, 620).data;
      let minX = 2000, maxX = 0, minY = 620, maxY = 0;
      const raw = [];
      for (let y = 0; y < 620; y += 4) {
        for (let x = 0; x < 2000; x += 4) {
          if (data[(y * 2000 + x) * 4 + 3] > 140) {
            raw.push(x, y);
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
          }
        }
      }
      if (!raw.length) return null;
      const cxr = (minX + maxX) / 2, cyr = (minY + maxY) / 2;
      const scale = worldW / (maxX - minX);
      const count = raw.length / 2;
      const out = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const p = (i % count) * 2;
        out[i * 3]     = (raw[p] - cxr) * scale + (Math.random() - 0.5) * 0.06;
        out[i * 3 + 1] = (cyr - raw[p + 1]) * scale + (Math.random() - 0.5) * 0.06;
        out[i * 3 + 2] = (Math.random() - 0.5) * 0.9;
      }
      return out;
    }

    function buildDiamond() {
      const out = new Float32Array(N * 3);
      const g = () => (Math.random() + Math.random() + Math.random() - 1.5) * 2;
      for (let i = 0; i < N; i++) {
        let x = g(), y = g(), z = g();
        const l = Math.hypot(x, y, z) || 1;
        x /= l; y /= l; z /= l;
        const l1 = Math.abs(x) + Math.abs(y) + Math.abs(z);
        const r = 4.6 * (0.99 + Math.random() * 0.02);
        out[i * 3]     = (x / l1) * r;
        out[i * 3 + 1] = (y / l1) * r * 1.6;
        out[i * 3 + 2] = (z / l1) * r;
      }
      return out;
    }

    function buildSnowflake() {
      const raw = [];
      const push = (x, y, j) => raw.push(
        (x + (Math.random() - 0.5) * j) * 0.85,
        (y + (Math.random() - 0.5) * j) * 0.85,
        (Math.random() - 0.5) * 0.5,
      );
      const seg = (x0, y0, x1, y1, n, j) => {
        for (let k = 0; k <= n; k++) {
          const t = k / n;
          push(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, j);
        }
      };
      const LEN = 5.0;
      for (let a = 0; a < 6; a++) {
        const ang = (a * Math.PI) / 3;
        const dx = Math.cos(ang), dy = Math.sin(ang);
        seg(0, 0, dx * LEN, dy * LEN, 48, 0.07);
        for (const [bt, bl] of [[0.45, 1.7], [0.74, 1.15]]) {
          const bx = dx * LEN * bt, by = dy * LEN * bt;
          for (const s of [-1, 1]) {
            const ba = ang + s * (Math.PI * 0.42);
            seg(bx, by, bx + Math.cos(ba) * bl, by + Math.sin(ba) * bl, 14, 0.05);
          }
        }
        push(dx * LEN, dy * LEN, 0.12);
      }
      const count = raw.length / 3;
      const out = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const p = (i % count) * 3;
        out[i * 3] = raw[p]; out[i * 3 + 1] = raw[p + 1]; out[i * 3 + 2] = raw[p + 2];
      }
      return out;
    }

    /* ── assembly (procedural first, text when fonts are in) */
    const diamond = buildDiamond();
    const snow    = buildSnowflake();
    (async () => {
      try {
        await Promise.all([document.fonts.load(fontSpec(240)), document.fonts.ready]);
      } catch (e) { /* procedural shapes only */ }
      const t0 = (() => { try { return buildText("WINTER '26", 22); } catch (e) { return null; } })();
      const t1 = (() => { try { return buildText('POLARIS', 22); } catch (e) { return null; } })();
      if (t0) shapes.push({ name: 'winter26',  pts: t0, btn: document.querySelector('.finale-morph [data-morph="winter26"]') });
      shapes.push({ name: 'diamond',  pts: diamond, btn: document.querySelector('.finale-morph [data-morph="diamond"]') });
      shapes.push({ name: 'snowflake', pts: snow,  btn: document.querySelector('.finale-morph [data-morph="snowflake"]') });
      if (t1) shapes.push({ name: 'polaris',  pts: t1,  btn: document.querySelector('.finale-morph [data-morph="polaris"]') });
      if (!shapes.length) return;

      const start = () => {
        if (started) return;
        started = true;
        setTimeout(() => {
          setShape(0, clock.elapsedTime);
          if (REDUCED && entry && entry.visible) entry.render(2.2, 0);
        }, 650);
      };
      start();
    })();

    document.querySelectorAll('.finale-morph button').forEach(b => {
      b.addEventListener('click', () => {
        const i = shapes.findIndex(s => s.name === b.dataset.morph);
        if (i >= 0) setShape(i, clock.elapsedTime);
      });
    });
  }

  if (!REDUCED) setLoop(true);
}
