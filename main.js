/* ============================
   SHASHI KALA – MAIN.JS
   ============================ */

/* ── Utility ─────────────────────────────────────────── */
function animateCounter(el, target) {
  const duration = 2000;
  const start    = performance.now();
  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(tick);
}

document.addEventListener('DOMContentLoaded', () => {

  /* ── Selectors ─────────────────────────────────────── */
  const introOverlay = document.getElementById('intro-overlay');
  const navbar       = document.getElementById('navbar');
  const hamburger    = document.getElementById('hamburger');
  const mobileNav    = document.getElementById('mobile-nav');
  const backTopBtn   = document.getElementById('back-top');
  const mobileLinks  = document.querySelectorAll('.mobile-nav a');
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const contactForm  = document.getElementById('contact-form');
  const formSuccess  = document.getElementById('form-success');
  const sideLightL   = document.getElementById('side-light-l');
  const sideLightR   = document.getElementById('side-light-r');

  /* ── Welcome Intro Overlay ─────────────────────────── */
  // Show for ~3.4 seconds then fade out
  if (introOverlay) {
    setTimeout(() => {
      introOverlay.classList.add('hide');
    }, 3400);
    // Remove from DOM after transition
    introOverlay.addEventListener('transitionend', () => {
      if (introOverlay.classList.contains('hide')) {
        introOverlay.remove();
      }
    });
  }

  /* ── Hamburger ─────────────────────────────────────── */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });

  /* ── Side-light scroll burst ────────────────────────── */
  let scrollTimer;
  const activateSideLights = () => {
    if (sideLightL) sideLightL.classList.add('scrolling-active');
    if (sideLightR) sideLightR.classList.add('scrolling-active');
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (sideLightL) sideLightL.classList.remove('scrolling-active');
      if (sideLightR) sideLightR.classList.remove('scrolling-active');
    }, 800);
  };

  /* ── Scroll handler ────────────────────────────────── */
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    backTopBtn.classList.toggle('visible', window.scrollY > 500);
    activateSideLights();
    highlightNav();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Active nav highlight ───────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  function highlightNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    });
  }

  /* ── Gallery filters ────────────────────────────────── */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
      });
    });
  });

  /* ── Counter animation ──────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, Number.parseInt(entry.target.dataset.target, 10));
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(num => counterObserver.observe(num));

  /* ── Scroll reveal ──────────────────────────────────── */
  document.querySelectorAll(
    '.about-img-wrap, .about-content, .service-card, .gallery-item, .contact-info, .contact-form-wrap, .section-intro'
  ).forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── WhatsApp Contact Form ──────────────────────────── */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl    = contactForm.querySelector('#name');
      const phoneEl   = contactForm.querySelector('#phone');
      const serviceEl = contactForm.querySelector('#service');
      const msgEl     = contactForm.querySelector('#message');

      const name    = nameEl ? nameEl.value.trim() : '';
      const phone   = phoneEl ? phoneEl.value.trim() : '';
      const service = serviceEl ? serviceEl.value.trim() : '';
      const message = msgEl ? msgEl.value.trim() : '';

      if (!name || !phone || !message) {
        // Shake the empty required fields
        [nameEl, phoneEl, msgEl].forEach(el => {
          if (el && !el.value.trim()) {
            el.style.borderColor = '#e53935';
            el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
          }
        });
        return;
      }

      // Build WhatsApp message
      const waText = [
        '🌸 *S K Tylering – ಹೊಸ ಆದೇಶ ವಿನಂತಿ*',
        '',
        `👤 *ಹೆಸರು:* ${name}`,
        `📞 *ಫೋನ್:* ${phone}`,
        service ? `💎 *ಸೇವೆ:* ${service}` : '',
        '',
        `📝 *ಸಂದೇಶ:*`,
        message,
        '',
        '—————————————',
        'Sent via SHASHI KALA Website'
      ].filter(Boolean).join('\n');

      const waNumber = '919741968529';
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

      // Show success then open WhatsApp
      if (formSuccess) {
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }

      contactForm.reset();
      setTimeout(() => window.open(waUrl, '_blank'), 600);
    });
  }

  /* ── Smooth scroll for anchor links ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
