document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => navList.classList.toggle('nav-open'));
  navList.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navList.classList.remove('nav-open'))
  );
}

/* ---------- hero trace tile: build the repeating ECG/oscilloscope blip ---------- */
const TILE_W = 320, TILE_H = 74;
const tileD = `M0,37 L60,37 L72,15 L84,58 L92,37 L140,37 L150,25 L158,49 L166,37 L${TILE_W},37`;
const traceTrack = document.getElementById('traceTrack');
if (traceTrack) {
  const tilesNeeded = Math.ceil((window.innerWidth * 1.5) / TILE_W) + 2;
  for (let i = 0; i < tilesNeeded; i++) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', TILE_W);
    svg.setAttribute('height', TILE_H);
    svg.setAttribute('viewBox', `0 0 ${TILE_W} ${TILE_H}`);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', tileD);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'var(--accent)');
    path.setAttribute('stroke-width', '1.8');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
    traceTrack.appendChild(svg);
  }
}

/* ---------- precise dash setup for divider + timeline traces ---------- */
document.querySelectorAll('.divider-trace path').forEach(path => {
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
});
document.querySelectorAll('.timeline-line .active-path').forEach(path => {
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
});

/* ---------- scroll reveal ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i % 6, 5) * 70}ms`;
  revealObserver.observe(el);
});

/* ---------- divider trace draw-in ---------- */
const dividerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      dividerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('[data-divider]').forEach(el => dividerObserver.observe(el));

/* ---------- timeline: draw line + light up nodes as items enter ---------- */
const timelineEl = document.getElementById('timeline');
if (timelineEl) {
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) timelineEl.classList.add('is-visible');
    });
  }, { threshold: 0.1 });
  timelineObserver.observe(timelineEl);

  const itemObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        itemObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  timelineEl.querySelectorAll('.timeline-item').forEach(item => itemObserver.observe(item));
}

/* ---------- scrollspy ---------- */
const navLinks = document.querySelectorAll('[data-nav]');
const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href')));
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = '#' + entry.target.id;
    const link = document.querySelector(`[data-nav][href="${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(sec => sec && spyObserver.observe(sec));
