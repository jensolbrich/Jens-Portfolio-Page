const menu = document.querySelector('.menu');
const nav = document.querySelector('#navigation');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }));
document.addEventListener('keydown', event => { if(event.key === 'Escape' && nav.classList.contains('open')){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');menu.focus();} });
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#copy-email').addEventListener('click', async () => { const status = document.querySelector('#copy-status'); try { await navigator.clipboard.writeText('j.olbrich@gmx.net'); status.textContent = 'E-Mail-Adresse kopiert.'; } catch { status.textContent = 'Adresse: j.olbrich@gmx.net'; } });
if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if(entry.isIntersecting){nav.querySelectorAll('a').forEach(link => {const active = link.hash === '#' + entry.target.id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});} }); }, {rootMargin:'-15% 0px -55% 0px'}); ['profil','schwerpunkte','erfahrung','ki-weiterbildung','persoenlich','kontakt'].forEach(id => observer.observe(document.getElementById(id))); }

// Dezente Bewegung; ohne JavaScript bleiben alle Inhalte sichtbar.
(function setupPortfolioMotion() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!Element.prototype.animate || !('IntersectionObserver' in window)) return;
  const running = new Set();
  function enter(element, delay = 0) {
    if (reduced.matches) return;
    const animation = element.animate([
      { opacity: 0, transform: 'translateY(14px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 580, delay, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'backwards' });
    running.add(animation);
    animation.onfinish = animation.oncancel = () => running.delete(animation);
  }
  document.querySelectorAll('.hero-copy > *, .hero-visual').forEach((element, index) => {
    enter(element, Math.min(index * 65, 260));
  });
  const groups = [
    '.proof > div', '.about > div', '.section-heading', '.expertise-grid > article',
    '#erfahrung > .timeline > details', '.earlier-career', '.education',
    '.ai-heading', '.ai-topics > article', '.ai-transfer', '.approach > h2',
    '.steps > article', '.personal-intro', '.personal-gallery > figure',
    '.contact > .wrap > .eyebrow', '.contact h2', '.contact-bottom', '.contact-form'
  ];
  const observer = new IntersectionObserver(entries => {
    let order = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (!entry.target.contains(document.activeElement)) enter(entry.target, Math.min(order++ * 55, 165));
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll(groups.join(',')).forEach(element => observer.observe(element));
  function stopMotion(event) {
    if (event.matches) for (const animation of [...running]) animation.cancel();
  }
  reduced.addEventListener?.('change', stopMotion);
  window.addEventListener('pagehide', () => {
    observer.disconnect();
    for (const animation of [...running]) animation.cancel();
    reduced.removeEventListener?.('change', stopMotion);
  }, { once: true });
})();
