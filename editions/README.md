# ◆ POLARIS — Edition Winter '26

A dark, editorial, *alive* landing page in the spirit of the big annual "Edition"
launch pages (giant display type, aurora glows, numbered chapters, live data) —
built as a clean **Laravel 13** project.

## Run it

```bash
composer install --no-dev   # or: composer install (with dev tools)
php artisan serve --host=0.0.0.0 --port=8000
```

Then open <http://localhost:8000>.

> No `npm install` needed — the front-end is hand-rolled CSS + vanilla JS
> (no Vite, no CDN), so it works fully offline and in any proxy.

## What's on the page

| System | Where | Notes |
|---|---|---|
| **Inertial scroll engine** | global | Lenis-style smooth scroll (igloo.inc feel): native scroll stays the source of truth — scrollbar, keyboard, touch, URL hashes all work — while a fixed wrapper chases it with an exponential ease (momentum, glide, catch-up). Fine pointers only; touch/reduced-motion get native scroll. |
| **Scrubbed section transitions** | every section | Reversible, physical (not fire-once): entry = rise + un-blur + scale-in, exit = drift up + atmospheric blur, plus per-layer parallax speeds (hero 1.3×, ticker 1.5×, copy 0.94×, wordmark 0.72×…). Velocity pulses the whole world by ±0.5%. |
| **Scroll-driven 3D** | hero, CTA, finale | hero camera pulls back + crystal tilts as you leave; the CTA data-sea swells as it centers; the finale particle field tilts and grows into frame. |
| **JS marquee** | band | time + scroll-velocity driven, seamless wrap. |
| **WebGL frost field + crystal** | hero | three.js r186, self-hosted. 2,600 GPU particles (custom GLSL, additive, per-flake drift/twinkle) + faceted octahedron with a fresnel/iridescent rim shader + counter-rotating wireframe shell. Mouse-parallaxed camera, scroll-linked bob, breathing scale. |
| **WebGL data-sea grid** | CTA | vertex-displaced line grid in GLSL — a flowing "sea" of data lines that dissolve into the horizon, gradient ice→violet, mouse-parallaxed |
| **Morphing particle finale** | "Frost in form" | igloo.inc-style closer: 6,000 particles on spring physics (60fps frame-rate-independent, cursor repulsion, velocity glow) that assemble into volume targets and reform: **WINTER '26** → **DIAMOND** (3D octahedron surface) → **SNOWFLAKE** (procedural 6-arm crystal) → **POLARIS**. Text targets are sampled from an offscreen canvas rendered in Space Grotesk. Auto-cycles every 4.6 s; the four buttons morph instantly (burst + spring settle). |
| 2D frost fallback | hero | if WebGL is unavailable (or the context is lost) the original 2D canvas field takes over automatically |
| Frost particle canvas | hero (fallback) | ~150 drifting flakes, mouse parallax, DPR-aware, pauses when tab is hidden |
| Aurora orbs + parallax | hero, CTA | GPU-blurred radial gradients, lerped mouse/scroll follow |
| Custom cursor | global | dot + trailing ring, blend-mode difference, scales on interactives |
| Word-rise hero reveal | hero | masked word animation + gradient shimmer sweep |
| Scramble-decode headings | chapter titles, manifesto | characters decode on scroll-in |
| Count-up stats | stats band, chips | easeOutExpo, tabular numerals |
| Typing prompt cards | chapter 03 (and AURA console) | 6 cards cycle prompts independently, staggered |
| 3D tilt + glare | all mock panels | pointer-tracked rotateX/Y with radial glare |
| Magnetic buttons | CTAs, footer | pull toward cursor, spring back |
| Live re-skin studio | chapter 02 | tap a swatch → the mock storefront re-skins in 0.7 s |
| "Run" build demo | chapter 03 | fake build progress → deploy result, re-runnable |
| Checkout step loop | chapter 04 | cart → verified → paid, loops in view |
| Marquee, grain, progress bar | global | infinite strip (pauses on hover), animated noise, scroll progress |
| **LIVE backend feed** | top pill, footer, hero ticker | polls `GET /api/pulse` every 5 s — real server time, real latency, running ops counter (file cache). Falls back to local simulation if the API is unreachable. |

`prefers-reduced-motion` and touch devices are respected: heavy JS effects
disable themselves and the page remains fully readable.

## Structure

```
routes/web.php                 GET /  → landing view
                               GET /api/pulse → JSON heartbeat
resources/views/landing.blade.php   single-page layout
public/css/site.css            all styling (self-hosted fonts)
public/js/site.js              all 2D interactions + fallback frost
public/js/three-scene.js       WebGL layer (ES module, custom GLSL)
public/vendor/three.*.js       three.js r186 (self-hosted, pinned)
public/fonts/                  Inter + Space Grotesk (woff2, latin)
```

## Rebranding

Everything visual lives in `:root` tokens at the top of `public/css/site.css`
(`--bg`, `--ink`, `--ice`, `--violet`, …). Copy is plain Blade in
`landing.blade.php`. Swap the brand name in the top bar, footer and `<title>`,
retune the tokens, and it's your edition.

## House rules

- Self-contained front-end: no external requests of any kind.
- Workspace-light by design: no `node_modules`, dev deps pruned from `vendor`
  (run `composer install` without `--no-dev` locally if you want Pint/PHPUnit).
