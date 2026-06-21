/* ===== WEBNOVA AGENCY — SCRIPT.JS ===== */

/* ============================================================
   1. DOM READY
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initHeader();
  initMobileMenu();
  initCustomCursor();
  initRevealObserver();
  initStatCounters();
  initContactForms();
  initShowcaseSlider();
  initParallax();
});

/* ============================================================
   2. SCROLL PROGRESS BAR
============================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }, { passive: true });
}

/* ============================================================
   3. HEADER — sticky + active nav
============================================================ */
function initHeader() {
  const header  = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
    updateActiveNav();
  }, { passive: true });

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        // Close mobile menu
        closeMobileMenu();
      }
    });
  });

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY + 120 >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }
}

/* ============================================================
   4. MOBILE MENU
============================================================ */
function closeMobileMenu() {
  const menu   = document.getElementById('mobileMenu');
  const toggle = document.getElementById('menuToggle');
  if (menu)   { menu.classList.remove('open'); }
  if (toggle) { toggle.classList.remove('open'); }
}

function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu   = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
  });
}

/* ============================================================
   5. CUSTOM CURSOR
============================================================ */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  const trail  = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;

  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%,-50%) scale(0.7)');
  document.addEventListener('mouseup',   () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');

  document.querySelectorAll('a, button, .service-card, .portfolio-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1.5)';
      trail.style.transform  = 'translate(-50%,-50%) scale(1.4)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      trail.style.transform  = 'translate(-50%,-50%) scale(1)';
    });
  });
}

/* ============================================================
   6. REVEAL ON SCROLL (IntersectionObserver)
============================================================ */
function initRevealObserver() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Staggered delay based on sibling index
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.querySelectorAll('.reveal'))
          : [];
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.min(delay, 400));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ============================================================
   7. STAT COUNTERS
============================================================ */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const duration = 1600;
      const step   = 16;
      const steps  = duration / step;
      const inc    = target / steps;
      let current  = 0;

      const timer = setInterval(() => {
        current += inc;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}

/* ============================================================
   8. CONTACT FORMS
============================================================ */
function initContactForms() {
  const forms = document.querySelectorAll('.contact-form, .contact-form-large');

  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const origHTML = btn.innerHTML;

      btn.disabled = true;
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 0.8s linear infinite"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg> Sending...`;

      setTimeout(() => {
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Message Sent!`;
        btn.style.background = 'linear-gradient(135deg,#00C84A,#008F34)';

        setTimeout(() => {
          btn.innerHTML = origHTML;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 3000);
      }, 1200);
    });
  });
}

/* ============================================================
   9. SHOWCASE SLIDER
============================================================ */
function initShowcaseSlider() {
  const slider     = document.getElementById('showcaseSlider');
  const prevBtn    = document.getElementById('showcasePrev');
  const nextBtn    = document.getElementById('showcaseNext');
  const dotsWrap   = document.getElementById('showcaseDots');
  if (!slider) return;

  const slides = slider.querySelectorAll('.showcase-slide');
  const dots   = dotsWrap ? dotsWrap.querySelectorAll('.showcase-dot') : [];
  let current  = 0;
  let autoTimer = null;
  let isAnimating = false;

  // Touch swipe
  let touchStartX = 0;
  let touchEndX   = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  slider.addEventListener('touchend',   e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goTo(current + 1); else goTo(current - 1);
    }
  }, { passive: true });

  function goTo(index) {
    if (isAnimating) return;
    isAnimating = true;

    const next = ((index % slides.length) + slides.length) % slides.length;
    if (next === current) { isAnimating = false; return; }

    slides[current].classList.remove('active');
    slides[next].classList.add('active');

    dots.forEach((d, i) => d.classList.toggle('active', i === next));
    current = next;

    setTimeout(() => { isAnimating = false; }, 520);
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  // Pause on hover
  slider.addEventListener('mouseenter', () => clearInterval(autoTimer));
  slider.addEventListener('mouseleave', startAuto);

  startAuto();
}

/* ============================================================
   10. PARALLAX (subtle, performance-safe)
============================================================ */
function initParallax() {
  const bg = document.getElementById('parallaxBg');
  if (!bg) return;

  // Disable on mobile (no perf cost)
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        // Only apply while hero is visible
        const hero = document.getElementById('home');
        if (hero && scrollY < hero.offsetHeight + 100) {
          const y = scrollY * 0.35;
          bg.style.transform = `translateY(${y}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   CSS spin keyframe (injected for form submit icon)
============================================================ */
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
document.head.appendChild(spinStyle);

