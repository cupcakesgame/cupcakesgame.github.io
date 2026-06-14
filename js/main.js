/* main.js — scroll animations, FAQ, tile delays */
(function () {
  'use strict';

  /* ── Scroll reveal ── */
  const animEls = document.querySelectorAll('[data-anim]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    animEls.forEach(el => io.observe(el));
  } else {
    animEls.forEach(el => el.classList.add('visible'));
  }

  /* ── FAQ accordion ── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0';
      });
      // open clicked if was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ── Staggered tile animations ── */
  const tilePreviews = document.querySelectorAll('.tile-preview');
  tilePreviews.forEach((tile, i) => {
    tile.style.animationDelay = (i * 0.06) + 's';
  });

  const tileCards = document.querySelectorAll('.tile-card');
  tileCards.forEach((card, i) => {
    card.setAttribute('data-anim', '');
    card.setAttribute('data-anim-delay', Math.min(i % 4 + 1, 4));
  });

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = document.getElementById('site-header')?.offsetHeight || 70;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Active nav highlight on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav.main-nav a[href^="#"]');
  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
      });
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + current ? 'var(--blush-dark)' : '';
      });
    }, { passive: true });
  }
})();
