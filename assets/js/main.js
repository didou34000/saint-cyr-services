/* Saint-Cyr Services — interactions : menu mobile, apparition au scroll, visionneuse photo */
(function () {
  'use strict';

  /* --- Menu mobile ------------------------------------------------------ */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav-principal');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.setAttribute('data-open', String(!open));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('data-open', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.getAttribute('data-open') === 'true') {
        toggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('data-open', 'false');
        toggle.focus();
      }
    });
  }

  /* --- Année courante dans le pied de page ------------------------------ */
  var annee = document.getElementById('annee');
  if (annee) { annee.textContent = String(new Date().getFullYear()); }

  /* --- Apparition douce au scroll --------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

      reveals.forEach(function (el, i) {
        el.style.transitionDelay = (i % 3) * 90 + 'ms';
        io.observe(el);
      });
    }
  }

  /* --- Visionneuse photo ------------------------------------------------- */
  /* chaque galerie garde sa propre séquence : on ne passe pas des réalisations
     aux photos de chantier en cliquant sur « suivant ». */
  var galleries = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'))
    .map(function (g) { return Array.prototype.slice.call(g.querySelectorAll('.shot')); })
    .filter(function (list) { return list.length; });

  if (!galleries.length) { return; }

  var shots = [];
  var index = 0;
  var opener = null;

  var box = document.createElement('dialog');
  box.className = 'lightbox';
  box.setAttribute('aria-label', 'Photo agrandie');
  box.innerHTML =
    '<button class="lightbox__btn lightbox__close" type="button" aria-label="Fermer">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
    '</button>' +
    '<button class="lightbox__btn lightbox__prev" type="button" aria-label="Photo précédente">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18 9 12l6-6"/></svg>' +
    '</button>' +
    '<button class="lightbox__btn lightbox__next" type="button" aria-label="Photo suivante">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>' +
    '</button>' +
    '<div>' +
      '<img alt="">' +
      '<p class="lightbox__caption"></p>' +
    '</div>';
  document.body.appendChild(box);

  var img = box.querySelector('img');
  var caption = box.querySelector('.lightbox__caption');

  function show(i) {
    index = (i + shots.length) % shots.length;
    var shot = shots[index];
    var thumb = shot.querySelector('img');
    img.src = shot.getAttribute('data-full') || thumb.src;
    img.alt = thumb ? thumb.alt : '';
    caption.innerHTML =
      (shot.getAttribute('data-caption') || '') +
      '<span class="lightbox__count">' + (index + 1) + ' / ' + shots.length + '</span>';
  }

  function open(list, i, trigger) {
    shots = list;
    opener = trigger || null;
    show(i);
    if (typeof box.showModal === 'function') { box.showModal(); }
    else { box.setAttribute('open', ''); }
  }

  function close() {
    if (typeof box.close === 'function') { box.close(); }
    else { box.removeAttribute('open'); }
    if (opener) { opener.focus(); opener = null; }
  }

  galleries.forEach(function (list) {
    list.forEach(function (shot, i) {
      shot.addEventListener('click', function () { open(list, i, shot); });
    });
  });

  box.querySelector('.lightbox__close').addEventListener('click', close);
  box.querySelector('.lightbox__prev').addEventListener('click', function () { show(index - 1); });
  box.querySelector('.lightbox__next').addEventListener('click', function () { show(index + 1); });

  /* clic sur le fond = fermeture */
  box.addEventListener('click', function (e) {
    if (e.target === box) { close(); }
  });

  box.addEventListener('cancel', function () { if (opener) { opener.focus(); opener = null; } });

  document.addEventListener('keydown', function (e) {
    if (!box.open) { return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
  });

  /* balayage tactile */
  var startX = null;
  box.addEventListener('touchstart', function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null) { return; }
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 55) { show(dx < 0 ? index + 1 : index - 1); }
    startX = null;
  }, { passive: true });
})();
