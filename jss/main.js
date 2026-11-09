(function () {
  'use strict';

  var cfg = window.WORKSHOP_CONFIG || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Google Form links ---------- */
  var formReady = /^https:\/\/(docs\.google\.com\/forms|forms\.gle)\//.test(cfg.FORM_URL || '');
  var notice = document.getElementById('form-notice');

  document.querySelectorAll('[data-form-link]').forEach(function (a) {
    if (formReady) {
      a.href = cfg.FORM_URL;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', a.textContent.trim() + ' (يفتح النموذج في نافذة جديدة)');
    } else {
      // Form URL not set yet: keep the button working as an in-page link
      // and tell the site owner what to do.
      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (notice) {
          notice.textContent = 'رابط نموذج Google لم يُضف بعد. افتحي الملف js/config.js وضعي الرابط في FORM_URL.';
          notice.hidden = false;
        }
        var target = document.getElementById('register');
        if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      });
    }
  });

  /* ---------- Maps link ---------- */
  document.querySelectorAll('[data-map-link]').forEach(function (a) {
    if (cfg.MAPS_URL) a.href = cfg.MAPS_URL;
  });

  /* ---------- Contact ---------- */
  var contact = document.querySelector('[data-contact]');
  if (contact && cfg.CONTACT_TEXT) {
    if (cfg.CONTACT_URL) {
      var link = document.createElement('a');
      link.href = cfg.CONTACT_URL;
      link.textContent = cfg.CONTACT_TEXT;
      link.rel = 'noopener noreferrer';
      contact.textContent = '';
      contact.appendChild(link);
    } else {
      contact.textContent = cfg.CONTACT_TEXT;
    }
  }

  /* ---------- Move focus to the section after an in-page jump (keyboard / screen readers) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var id = a.getAttribute('href').slice(1);
      var el = id && document.getElementById(id);
      if (el && !a.hasAttribute('data-form-link')) {
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        setTimeout(function () { el.focus({ preventScroll: true }); }, reduceMotion ? 0 : 400);
      }
    });
  });

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Gentle reveal on scroll ---------- */
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }
})();
