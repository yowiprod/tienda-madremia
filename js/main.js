// ===== ZIMA — Agrumea-style animations =====

(function () {
  'use strict';

  // DOM refs
  const header     = document.getElementById('site-header');
  const slider     = document.getElementById('jar-slider');
  const shapeLayer = document.getElementById('shapeLayer');
  const badge      = document.getElementById('sliderBadge');
  const track      = document.getElementById('jarTrack');
  const prompt     = document.getElementById('sliderPrompt');
  const content    = document.getElementById('sliderContent');
  const items      = track ? [...track.querySelectorAll('.jar-slider__item')] : [];

  // ===== Header scroll =====
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ===== 360° Viewer =====
  (function () {
    const stage = document.getElementById('viewer3d');
    if (!stage) return;
    const imgs  = [...stage.querySelectorAll('.viewer3d__img')];
    const dots  = [...document.querySelectorAll('.viewer3d__dot')];
    const prev  = document.getElementById('v3dPrev');
    const next  = document.getElementById('v3dNext');
    if (!imgs.length) return;

    let current = 0;

    function goTo(idx) {
      imgs[current].classList.remove('viewer3d__img--active');
      dots[current] && dots[current].classList.remove('viewer3d__dot--active');
      current = (idx + imgs.length) % imgs.length;
      imgs[current].classList.add('viewer3d__img--active');
      dots[current] && dots[current].classList.add('viewer3d__dot--active');
    }

    if (prev) prev.addEventListener('click', function(e) { e.stopPropagation(); goTo(current - 1); });
    if (next) next.addEventListener('click', function(e) { e.stopPropagation(); goTo(current + 1); });
    dots.forEach(function(dot, i) { dot.addEventListener('click', function() { goTo(i); }); });

    // Drag to rotate (only on the track, not buttons)
    var dragStartX = 0, isDragging = false;
    var track = stage.querySelector('.viewer3d__track');
    if (track) {
      track.addEventListener('mousedown', function(e) { isDragging = true; dragStartX = e.clientX; });
      window.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        var dx = e.clientX - dragStartX;
        if (Math.abs(dx) > 50) { goTo(current + (dx > 0 ? -1 : 1)); dragStartX = e.clientX; }
      });
      window.addEventListener('mouseup', function() { isDragging = false; });
    }
  })();

  // ===== FAQ accordion =====
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ===== Order form =====
  window.handleOrder = function (e) {
    e.preventDefault();
    const form    = document.getElementById('orderForm');
    const success = document.getElementById('orderSuccess');
    const note    = document.querySelector('.order-note');
    if (form)    form.style.display = 'none';
    if (success) success.style.display = 'block';
    if (note)    note.style.display = 'none';
    const pedir = document.getElementById('pedir');
    if (pedir) window.scrollTo({ top: pedir.offsetTop - 80, behavior: 'smooth' });
  };

  // ===== Jar Slider animation =====
  if (!slider || !shapeLayer || !badge || items.length === 0) return;

  // Easing function
  function easeOutExpo(t) {
    return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  // Compute item positions based on viewport width
  function computePositions(vw) {
    const isMobile = vw < 640;
    if (isMobile) {
      // 3 visible items on mobile
      return [
        { xPct: 0.02,  y: -12, r: -15,  s: 0.72, blur: 1.0, br: 0.86 },
        { xPct: 0.37,  y: 8,   r: 7,    s: 1.28, blur: 0,   br: 1.1  },
        { xPct: 0.73,  y: -8,  r: -15,  s: 0.72, blur: 1.0, br: 0.86 },
        { xPct: -0.5,  y: 0,   r: 0,    s: 0,    blur: 0,   br: 1    }, // hidden
        { xPct: -0.5,  y: 0,   r: 0,    s: 0,    blur: 0,   br: 1    },
        { xPct: -0.5,  y: 0,   r: 0,    s: 0,    blur: 0,   br: 1    },
        { xPct: -0.5,  y: 0,   r: 0,    s: 0,    blur: 0,   br: 1    },
      ];
    }
    // 7 items on desktop — spread across full viewport width
    return [
      { xPct: 0.01,  y: -18, r: -20,  s: 0.52, blur: 2.0, br: 0.78 },
      { xPct: 0.145, y: 22,  r: 8,    s: 0.72, blur: 0.8, br: 0.88 },
      { xPct: 0.285, y: -11, r: 15,   s: 0.90, blur: 0.3, br: 0.95 },
      { xPct: 0.425, y: 5,   r: -6,   s: 1.28, blur: 0,   br: 1.1  }, // focus
      { xPct: 0.565, y: -13, r: 17,   s: 0.90, blur: 0.3, br: 0.95 },
      { xPct: 0.705, y: 20,  r: -4,   s: 0.72, blur: 0.8, br: 0.88 },
      { xPct: 0.845, y: -10, r: -20,  s: 0.52, blur: 2.0, br: 0.78 },
    ];
  }

  let positions = computePositions(window.innerWidth);

  // Set initial hidden positions (slightly lower for fly-up intro)
  function setInitial() {
    items.forEach((item, i) => {
      const p = positions[i] || positions[0];
      const x = p.xPct * window.innerWidth;
      item.style.transform = `translate(${x}px, ${p.y + 25}px) rotate(${p.r}deg) scale(${p.s * 0.85})`;
      item.style.filter    = `brightness(${p.br}) blur(${p.blur}px)`;
      item.style.opacity   = '0';
    });
  }

  setInitial();

  // ===== Parallax tracking =====
  let mouseX = 0, mouseY = 0;
  let smoothX = 0, smoothY = 0;
  let circleRot = 0;         // degrees, updated by scroll
  let introT = 0;            // 0→1 over ~1.4s
  const INTRO_SPEED = 0.012; // per frame at 60fps ≈ 1.4s

  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth)  * 2 - 1; // -1 to 1
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    circleRot = window.scrollY * 0.1; // 1° per 10px
  }, { passive: true });

  // ===== Main rAF loop =====
  function loop() {
    // Smooth mouse
    smoothX += (mouseX - smoothX) * 0.07;
    smoothY += (mouseY - smoothY) * 0.07;

    // Intro progress
    if (introT < 1) {
      introT = Math.min(introT + INTRO_SPEED, 1);
    }

    const e = easeOutExpo(introT);

    // --- Shape layer ---
    const shapeY = (1 - e) * 24;
    const pxX    = smoothX * -14;
    const pxY    = Math.max(0, smoothY * -10);
    shapeLayer.style.opacity   = e;
    shapeLayer.style.transform =
      `translate3d(calc(-50% + ${pxX}px), calc(${shapeY}px + ${pxY}px), 0)`;

    // --- Circular badge ---
    const badgeDelay  = 0.15;
    const badgeE      = easeOutExpo(Math.max(0, (introT - badgeDelay) / (1 - badgeDelay)));
    const badgeIntroY = (1 - badgeE) * 12;
    const badgeIntroR = (1 - badgeE) * -18;
    badge.style.opacity   = badgeE;
    badge.style.transform =
      `translate3d(calc(-52% + ${smoothX * -10}px), calc(${badgeIntroY}px + ${smoothY * -8}px), 0)`
      + ` rotate(${circleRot + badgeIntroR}deg)`;

    // --- Items staggered fly-in ---
    const vw = window.innerWidth;
    items.forEach((item, i) => {
      const p        = positions[i] || positions[0];
      const itemDelay = 0.08 + i * 0.09;
      const rawT      = (introT - itemDelay) / (1 - itemDelay);
      const itemE     = easeOutExpo(Math.max(0, Math.min(rawT, 1)));
      const x         = p.xPct * vw;
      const y         = p.y + (1 - itemE) * 22;
      item.style.opacity   = itemE;
      item.style.transform = `translate(${x}px, ${y}px) rotate(${p.r}deg) scale(${p.s})`;
      item.style.filter    = `brightness(${p.br}) blur(${p.blur}px)`;
    });

    // Show scroll prompt once intro done
    if (introT >= 1 && prompt && !prompt.classList.contains('is-ready')) {
      setTimeout(() => prompt.classList.add('is-ready'), 200);
      slider.classList.add('is-loaded');
    }

    requestAnimationFrame(loop);
  }

  // Start after first paint
  requestAnimationFrame(loop);

  // Recompute positions on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      positions = computePositions(window.innerWidth);
    }, 150);
  });

})();
