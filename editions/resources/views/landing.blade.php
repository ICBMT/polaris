<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Nadeem Khan — Developer Portfolio</title>
  <meta name="description" content="Nadeem Khan is a developer building thoughtful web experiences, reliable systems, and useful digital products.">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 6 L94 50 L50 94 L6 50 Z' fill='%237dd3fc'/%3E%3C/svg%3E">
  <link rel="stylesheet" href="{{ asset('css/site.css') }}">
  <script>
    document.documentElement.classList.add('js');
    try {
      var _c = document.createElement('canvas');
      document.documentElement.classList.add((_c.getContext('webgl2') || _c.getContext('webgl')) ? 'wgl' : 'no-wgl');
    } catch (e) { document.documentElement.classList.add('no-wgl'); }
  </script>
</head>
<body>

  <div class="grain" aria-hidden="true"></div>
  <div class="progress" id="progress" aria-hidden="true"></div>
  <div class="cursor" id="cursorDot" aria-hidden="true"></div>
  <div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>

  <!-- ══════════════════ TOP BAR ══════════════════ -->
  <header class="topbar" id="topbar">
    <a class="wordmark" href="#top"><span class="diamond">◆</span>NADEEM KHAN</a>
    <nav class="topnav" aria-label="Sections">
      <a href="#copilot">About</a>
      <a href="#design">Skills</a>
      <a href="#automation">Work</a>
      <a href="#checkout">Approach</a>
      <a href="#finale">Contact</a>
    </nav>
    <div class="top-actions">
      <div class="live-pill" id="livePill"><span class="live-dot"></span><span id="liveLabel">BUILDING · LARAVEL 13</span></div>
      <a href="#cta" class="btn btn-small magnetic" data-hover>Let's work</a>
    </div>
  </header>

  <main id="top">

    <!-- ══════════════════ HERO ══════════════════ -->
    <section class="hero">
      <div class="orbs" id="orbs" aria-hidden="true">
        <div class="orb orb-a" data-depth="1"></div>
        <div class="orb orb-b" data-depth="1.8"></div>
        <div class="orb orb-c" data-depth="0.7"></div>
      </div>
      <canvas id="frost" aria-hidden="true"></canvas>

      <div class="hero-inner">
        <p class="overline reveal" style="--d:.05s">✦&nbsp; DEVELOPER · DESIGNER · BUILDER</p>
        <h1 class="hero-title">
          <span class="line"><span class="word w-shimmer" style="--i:0">NADEEM</span> <span class="word" style="--i:1">KHAN</span></span>
          <span class="line line-outline"><span class="word" style="--i:2">DIGITAL,</span> <span class="word" style="--i:3">REFINED.</span></span>
        </h1>
        <p class="hero-sub reveal" style="--d:.55s">Developer building thoughtful interfaces, dependable systems, and digital experiences that feel as good as they work.</p>
        <div class="hero-ctas reveal" style="--d:.7s">
          <a href="#copilot" class="btn btn-primary magnetic" data-hover>Discover my work <span class="arr">↓</span></a>
          <a href="#manifesto" class="btn btn-ghost magnetic" data-hover>More about me</a>
        </div>
      </div>

      <div class="hero-ticker reveal" style="--d:.9s">
        <span class="tick"><b id="ordersTick">142,806,112</b> lines of code explored</span>
        <span class="tick-dot">✦</span>
        <span class="tick"><b>100%</b> curiosity</span>
        <span class="tick-dot">✦</span>
        <span class="tick"><b>24/7</b> learning</span>
        <span class="tick-dot">✦</span>
        <span class="tick"><b id="tickLatency">12</b> ms response time</span>
      </div>
      <a class="scroll-hint" href="#chapters" aria-label="Scroll to content"><span></span></a>
    </section>

    <!-- ══════════════════ MARQUEE ══════════════════ -->
    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        <span>FRONTEND <i>✦</i></span><span>BACKEND <i>✦</i></span><span>PRODUCT THINKING <i>✦</i></span><span>INTERACTION <i>✦</i></span><span>LARAVEL <i>✦</i></span><span>JAVASCRIPT <i>✦</i></span><span>RESPONSIVE DESIGN <i>✦</i></span><span>CLEAN SYSTEMS <i>✦</i></span>
        <span>FRONTEND <i>✦</i></span><span>BACKEND <i>✦</i></span><span>PRODUCT THINKING <i>✦</i></span><span>INTERACTION <i>✦</i></span><span>LARAVEL <i>✦</i></span><span>JAVASCRIPT <i>✦</i></span><span>RESPONSIVE DESIGN <i>✦</i></span><span>CLEAN SYSTEMS <i>✦</i></span>
      </div>
    </div>

    <!-- ══════════════════ CHAPTERS HEADER ══════════════════ -->
    <section class="chapters-head" id="chapters">
      <p class="overline reveal">THE PORTFOLIO</p>
      <h2 class="scramble" data-text="ONE DEVELOPER. MANY WAYS TO BUILD.">ONE DEVELOPER. MANY WAYS TO BUILD.</h2>
    </section>

    <!-- fixed chapter rail (desktop) -->
    <nav class="chapter-rail" id="rail" aria-label="Chapters">
      <a href="#copilot" data-ch="copilot"><i>01</i><span class="lbl">ABOUT</span></a>
      <a href="#design" data-ch="design"><i>02</i><span class="lbl">SKILLS</span></a>
      <a href="#automation" data-ch="automation"><i>03</i><span class="lbl">WORK</span></a>
      <a href="#checkout" data-ch="checkout"><i>04</i><span class="lbl">APPROACH</span></a>
    </nav>

    <!-- ══════════════════ 01 · ABOUT ══════════════════ -->
    <section class="chapter" id="copilot">
      <div class="ch-label reveal"><span class="ch-num">01</span> ABOUT NADEEM</div>
      <h2 class="ch-title scramble" data-text="IDEAS, TURNED INTO EXPERIENCES.">IDEAS, TURNED INTO EXPERIENCES.</h2>
      <p class="ch-copy reveal" style="--d:.15s">I am Nadeem Khan, a developer who enjoys turning complex ideas into clear, useful, and memorable web experiences. I care about the details people feel, even when they cannot see them.</p>

      <div class="ch-grid">
        <ul class="feature-list">
          <li class="reveal" style="--d:.05s" data-hover>
            <span class="f-name">Curiosity</span>
            <span class="f-desc">I keep learning, exploring new tools, and asking better questions about how people use the things we build.</span>
            <span class="f-arr">→</span>
          </li>
          <li class="reveal" style="--d:.12s" data-hover>
            <span class="f-name">Problem solving</span>
            <span class="f-desc">From the first rough idea to the final interaction, I break difficult problems into focused, buildable steps.</span>
            <span class="f-arr">→</span>
          </li>
          <li class="reveal" style="--d:.19s" data-hover>
            <span class="f-name">Clear thinking</span>
            <span class="f-desc">Good development is more than writing code. It is choosing the right structure, trade-offs, and experience for the people using it.</span>
            <span class="f-arr">→</span>
          </li>
          <li class="reveal" style="--d:.26s" data-hover>
            <span class="f-name">Attention to detail</span>
            <span class="f-desc">Responsive layouts, thoughtful states, and small moments of polish make a product feel considered from every angle.</span>
            <span class="f-arr">→</span>
          </li>
          <li class="reveal" style="--d:.33s" data-hover>
            <span class="f-name">Always improving</span>
            <span class="f-desc">Every project is a chance to refine the process, strengthen the result, and leave the codebase better than I found it.</span>
            <span class="f-arr">→</span>
          </li>
        </ul>

        <div class="mock aura-mock tilt" data-tilt data-hover>
          <div class="mock-bar"><span></span><span></span><span></span><em>NADEEM — BUILDING</em></div>
          <div class="mock-body">
            <p class="mock-line user"><span class="ps">build&nbsp;›</span> <span class="pc-typed" data-prompts='["make this experience feel effortless","turn the idea into something people can use","build something clear, useful, and memorable"]'></span><span class="caret"></span></p>
            <div class="mock-lines">
              <p class="mock-line rl">▸ Understanding the problem… <b class="ok">done</b></p>
              <p class="mock-line rl">▸ Shaping the idea into a <b>clear experience</b></p>
              <p class="mock-line rl">▸ Building with <b>care</b> · testing every detail</p>
            </div>
            <svg class="spark" viewBox="0 0 320 84" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#7dd3fc" stop-opacity=".22"/>
                  <stop offset="1" stop-color="#7dd3fc" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path class="spark-area" d="M0,64 C30,60 45,52 70,50 C95,48 110,58 135,50 C160,42 175,30 200,32 C225,34 240,20 265,18 C290,16 305,10 320,8 L320,84 L0,84 Z" fill="url(#sparkFill)"/>
              <path class="spark-line" pathLength="600" d="M0,64 C30,60 45,52 70,50 C95,48 110,58 135,50 C160,42 175,30 200,32 C225,34 240,20 265,18 C290,16 305,10 320,8"/>
            </svg>
            <div class="mock-foot"><span class="live-dot"></span> currently exploring <b id="cartWatch">4,218</b> possibilities</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════ 02 · SKILLS ══════════════════ -->
    <section class="chapter chapter-alt" id="design">
      <div class="ch-label reveal"><span class="ch-num">02</span> TOOLS OF THE TRADE</div>
      <h2 class="ch-title scramble" data-text="SKILLS, WITH PURPOSE.">SKILLS, WITH PURPOSE.</h2>
      <p class="ch-copy reveal" style="--d:.15s">My toolkit spans frontend craft, backend structure, and the space between them. I choose technology to serve the experience, not the other way around.</p>

      <div class="studio-grid">
        <div class="studio-cards">
          <div class="s-card tilt" data-tilt data-hover>
            <span class="s-badge">NEW</span>
            <span class="s-ico">◧</span>
            <h3>Frontend craft</h3>
            <p>Responsive interfaces with clear hierarchy, deliberate motion, and the kind of polish that makes a product feel alive.</p>
          </div>
          <div class="s-card tilt" data-tilt data-hover>
            <span class="s-ico">❖</span>
            <h3>Backend structure</h3>
            <p>Reliable routes, thoughtful data models, and maintainable application logic built to support the experience.</p>
          </div>
          <div class="s-card tilt" data-tilt data-hover>
            <span class="s-ico">▣</span>
            <h3>Interaction design</h3>
            <p>Interfaces that communicate clearly through motion, feedback, states, and small details that reward attention.</p>
          </div>
          <div class="s-card tilt" data-tilt data-hover>
            <span class="s-badge">NEW</span>
            <span class="s-ico">✉</span>
            <h3>Continuous learning</h3>
            <p>The web keeps changing. I stay curious, experiment often, and bring the useful discoveries into my work.</p>
          </div>
        </div>

        <div class="studio-stage reveal" style="--d:.2s">
          <div class="phone tilt" data-tilt data-hover>
            <div class="p-img" id="pImg">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <rect class="p-cap" x="45" y="14" width="30" height="14" rx="3"/>
                <rect class="p-bottle" x="36" y="30" width="48" height="76" rx="12"/>
                <rect class="p-label" x="45" y="62" width="30" height="28" rx="4"/>
              </svg>
            </div>
            <div class="p-meta">
              <div>
                <p class="p-name">NADEEM KHAN</p>
                <p class="p-sku">Developer · builder · problem solver</p>
              </div>
              <p class="p-price">CODE</p>
            </div>
            <button class="p-btn" type="button" data-hover>View skills</button>
          </div>
          <div class="swatches" role="group" aria-label="Live theme palette">
            <button class="swatch active" type="button" data-hover data-bg="#0e1a24" data-acc="#7dd3fc" data-ink="#eaf6ff" style="--c:#7dd3fc" aria-label="Glacier"></button>
            <button class="swatch" type="button" data-hover data-bg="#1a0f22" data-acc="#c4b5fd" data-ink="#f3efff" style="--c:#c4b5fd" aria-label="Violet"></button>
            <button class="swatch" type="button" data-hover data-bg="#0d1a14" data-acc="#6ee7b7" data-ink="#eafff5" style="--c:#6ee7b7" aria-label="Moss"></button>
            <button class="swatch" type="button" data-hover data-bg="#20130f" data-acc="#fdba74" data-ink="#fff3ea" style="--c:#fdba74" aria-label="Ember"></button>
            <button class="swatch" type="button" data-hover data-bg="#17181c" data-acc="#f4f7f8" data-ink="#ffffff" style="--c:#f4f7f8" aria-label="Mono"></button>
          </div>
          <p class="swatch-hint">↑ tap a swatch — choose a working mood</p>
        </div>
      </div>
    </section>

    <!-- ══════════════════ 03 · WORK ══════════════════ -->
    <section class="chapter" id="automation">
      <div class="ch-label reveal"><span class="ch-num">03</span> SELECTED WORK</div>
      <h2 class="ch-title scramble" data-text="THE IDEA, MADE REAL.">THE IDEA, MADE REAL.</h2>
      <p class="ch-copy reveal" style="--d:.15s">A glimpse into the kinds of problems I like to solve: useful tools, expressive interfaces, and systems that make complicated work feel simple.</p>

      <div class="prompt-grid">
        <div class="prompt-card tilt" data-tilt>
          <div class="pc-top"><span class="pc-num">01</span><span class="pc-tag">WEB APP</span></div>
          <p class="pc-prompt"><span class="pc-typed" data-prompts='["Build a focused tool that turns a messy workflow into a clear next step.","Create a dashboard that helps people understand what matters now."]'></span><span class="caret"></span></p>
          <button class="pc-run" type="button" data-hover>Explore <span class="arr">→</span></button>
          <div class="pc-progress"><i></i></div>
          <p class="pc-result">✓ thoughtful, useful, and ready to grow</p>
        </div>
        <div class="prompt-card tilt" data-tilt>
          <div class="pc-top"><span class="pc-num">02</span><span class="pc-tag">INTERFACE</span></div>
          <p class="pc-prompt"><span class="pc-typed" data-prompts='["Design an interface that makes the important action feel obvious.","Turn a complex process into a calm, confident experience."]'></span><span class="caret"></span></p>
          <button class="pc-run" type="button" data-hover>Explore <span class="arr">→</span></button>
          <div class="pc-progress"><i></i></div>
          <p class="pc-result">✓ clear interaction, carefully considered</p>
        </div>
        <div class="prompt-card tilt" data-tilt>
          <div class="pc-top"><span class="pc-num">03</span><span class="pc-tag">FULL STACK</span></div>
          <p class="pc-prompt"><span class="pc-typed" data-prompts='["Connect a polished frontend to a backend that quietly does the hard work.","Build the foundation for a product that can evolve without friction."]'></span><span class="caret"></span></p>
          <button class="pc-run" type="button" data-hover>Explore <span class="arr">→</span></button>
          <div class="pc-progress"><i></i></div>
          <p class="pc-result">✓ structured for real-world use</p>
        </div>
        <div class="prompt-card tilt" data-tilt>
          <div class="pc-top"><span class="pc-num">04</span><span class="pc-tag">EXPERIMENT</span></div>
          <p class="pc-prompt"><span class="pc-typed" data-prompts='["Try something new, learn from it, and keep the part that makes the work better.","Explore an idea until it becomes a useful piece of the experience."]'></span><span class="caret"></span></p>
          <button class="pc-run" type="button" data-hover>Explore <span class="arr">→</span></button>
          <div class="pc-progress"><i></i></div>
          <p class="pc-result">✓ a small experiment with a clear point of view</p>
        </div>
        <div class="prompt-card tilt" data-tilt>
          <div class="pc-top"><span class="pc-num">05</span><span class="pc-tag">DISCOVERY</span></div>
          <p class="pc-prompt"><span class="pc-typed" data-prompts='["Look closely at where an experience gets confusing, then remove the friction.","Find the small improvement that changes how the whole product feels."]'></span><span class="caret"></span></p>
          <button class="pc-run" type="button" data-hover>Explore <span class="arr">→</span></button>
          <div class="pc-progress"><i></i></div>
          <p class="pc-result">✓ better questions, better decisions</p>
        </div>
        <div class="prompt-card tilt" data-tilt>
          <div class="pc-top"><span class="pc-num">06</span><span class="pc-tag">NEXT IDEA</span></div>
          <p class="pc-prompt"><span class="pc-typed" data-prompts='["Have a product idea worth exploring? I would love to hear what you are building.","Bring the rough version. We can shape the useful version together."]'></span><span class="caret"></span></p>
          <button class="pc-run" type="button" data-hover>Connect <span class="arr">→</span></button>
          <div class="pc-progress"><i></i></div>
          <p class="pc-result">✓ every good build starts with a conversation</p>
        </div>
      </div>
    </section>

    <!-- ══════════════════ 04 · APPROACH ══════════════════ -->
    <section class="chapter chapter-alt" id="checkout">
      <div class="ch-label reveal"><span class="ch-num">04</span> HOW I WORK</div>
      <h2 class="ch-title scramble" data-text="GOOD WORK, BUILT TO LAST.">GOOD WORK, BUILT TO LAST.</h2>
      <p class="ch-copy reveal" style="--d:.15s">The best work starts with listening, gets stronger through iteration, and earns its simplicity through care. I bring that mindset to every line of code and every screen.</p>

      <div class="ch-grid">
        <ul class="feature-list">
          <li class="reveal" style="--d:.05s" data-hover>
            <span class="f-name">Understand</span>
            <span class="f-desc">Start with the people, the problem, and the outcome. Clarity at the beginning saves time everywhere else.</span>
            <span class="f-arr">→</span>
          </li>
          <li class="reveal" style="--d:.12s" data-hover>
            <span class="f-name">Shape</span>
            <span class="f-desc">Give the idea structure without sanding away what makes it distinctive, useful, or human.</span>
            <span class="f-arr">→</span>
          </li>
          <li class="reveal" style="--d:.19s" data-hover>
            <span class="f-name">Build</span>
            <span class="f-desc">Choose practical tools, write maintainable code, and make progress visible at every stage.</span>
            <span class="f-arr">→</span>
          </li>
          <li class="reveal" style="--d:.26s" data-hover>
            <span class="f-name">Refine</span>
            <span class="f-desc">Test the edges, listen to feedback, and keep improving until the experience feels natural.</span>
            <span class="f-arr">→</span>
          </li>
        </ul>

        <div class="mock co-mock tilt" data-tilt data-hover id="coMock">
          <div class="mock-bar"><span></span><span></span><span></span><em>PROCESS — CLEAR</em></div>
          <div class="mock-body">
            <div class="co-steps">
              <div class="co-step" data-step="0"><span class="co-dot">◆</span><div><b>Listen first</b><small>the problem · the people · the purpose</small></div></div>
              <div class="co-step" data-step="1"><span class="co-dot">⚡</span><div><b>Build with intent</b><small>structure &amp; interaction · one step at a time</small></div></div>
              <div class="co-step" data-step="2"><span class="co-dot">✓</span><div><b>Make it matter</b><small>test · refine · ship something useful</small></div></div>
            </div>
            <div class="co-total"><span>Next step — <b>let's talk</b></span><button class="co-pay" type="button" data-hover>Connect</button></div>
          </div>
          <div class="chip-float" id="chipFloat">
            <b><span data-count="100" data-suffix="%">0%</span> attention to detail</b>
            <small>the standard I bring to every build</small>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════ MANIFESTO ══════════════════ -->
    <section class="manifesto" id="manifesto">
      <p class="m-line scramble" data-text="THOUGHTFUL BY DESIGN.">THOUGHTFUL BY DESIGN.</p>
      <p class="m-line m-outline scramble" data-text="BUILT WITH PURPOSE.">BUILT WITH PURPOSE.</p>
      <p class="m-line m-shimmer scramble" data-text="MADE TO BE REMEMBERED.">MADE TO BE REMEMBERED.</p>
    </section>

    <!-- ══════════════════ STATS ══════════════════ -->
    <section class="stats">
      <div class="stat reveal" style="--d:.05s"><span class="stat-num" data-count="1" data-suffix="">0</span><span class="stat-label">DEVELOPER, ALWAYS CURIOUS</span></div>
      <div class="stat reveal" style="--d:.15s"><span class="stat-num" data-count="24" data-suffix="/7">0</span><span class="stat-label">IDEAS WORTH EXPLORING</span></div>
      <div class="stat reveal" style="--d:.25s"><span class="stat-num" data-count="100" data-suffix="%">0</span><span class="stat-label">CARE IN THE DETAILS</span></div>
      <div class="stat reveal" style="--d:.35s"><span class="stat-num" data-count="40" data-suffix="+">0</span><span class="stat-label">IDEAS WORTH EXPLORING</span></div>
    </section>

    <!-- ══════════════════ CTA ══════════════════ -->
    <section class="cta" id="cta">
      <canvas id="ctaWave" aria-hidden="true"></canvas>
      <div class="orbs cta-orbs" aria-hidden="true">
        <div class="orb orb-a" data-depth="1.2"></div>
        <div class="orb orb-b" data-depth="0.8"></div>
      </div>
      <h2 class="cta-title reveal">Have an idea? <em>Let's build it.</em></h2>
      <a href="#top" class="btn btn-primary btn-big magnetic" data-hover>Start a conversation</a>
      <p class="cta-micro reveal" style="--d:.2s">Good work starts with a simple hello.</p>
    </section>

    <!-- ══════════════════ FINALE · FROST IN FORM ══════════════════ -->
    <section class="finale" id="finale">
      <canvas id="finaleParticles" aria-hidden="true"></canvas>
      <div class="finale-ui">
        <div class="finale-top">
          <p class="overline finale-overline reveal">THE FINALE · LET'S CONNECT</p>
          <div class="finale-hint">move through the particles — make something memorable</div>
        </div>
        <div class="finale-morph" role="group" aria-label="Particle shapes">
          <button type="button" data-morph="winter26" data-hover><i>01</i>ABOUT</button>
          <button type="button" data-morph="diamond" data-hover><i>02</i>SKILLS</button>
          <button type="button" data-morph="snowflake" data-hover><i>03</i>WORK</button>
          <button type="button" data-morph="polaris" data-hover><i>04</i>CONTACT</button>
        </div>
      </div>
    </section>
  </main>

  <!-- ══════════════════ FOOTER ══════════════════ -->
  <footer class="footer">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="wordmark" href="#top"><span class="diamond">◆</span>NADEEM KHAN</a>
        <p>Developer building thoughtful digital experiences, reliable systems, and useful things for the web.</p>
      </div>
      <div>
        <h4>PORTFOLIO</h4>
        <a href="#copilot">About me</a>
        <a href="#design">Skills</a>
        <a href="#automation">Selected work</a>
        <a href="#checkout">My approach</a>
      </div>
      <div>
        <h4>ELSEWHERE</h4>
        <a href="#manifesto">Principles</a>
        <a href="#stats">A few facts</a>
        <a href="#finale">Contact</a>
        <a href="#top">Back to top</a>
      </div>
      <div>
        <h4>CONTACT</h4>
        <a href="#cta">Get in touch</a>
        <a href="#top">LinkedIn</a>
        <a href="#top">GitHub</a>
      </div>
    </div>

    <div class="foot-status">
      <span class="live-dot"></span>
      <span>LIVE</span>
      <span>server <b id="footClock">--:--:--</b> UTC</span>
      <span><b id="footLatency">—</b> ms</span>
      <span>Laravel <b>{{ $framework }}</b></span>
      <span>PHP <b>{{ $php }}</b></span>
      <span>NADEEM KHAN · DEVELOPER</span>
    </div>

    <p class="foot-word" aria-hidden="true">NADEEM</p>

    <p class="foot-copy">© 2026 Nadeem Khan — crafted with Laravel, JavaScript, and care.</p>
  </footer>

  <a href="#top" class="to-top magnetic" data-hover aria-label="Back to top">↑</a>

  <script src="{{ asset('js/site.js') }}" defer></script>
  <script type="module" src="{{ asset('js/three-scene.js') }}?v=2"></script>
</body>
</html>
