/* =====================================================================
   SCRIPT.JS — GRAPHIC / Dumulus
   1. Projets : ouverts indépendamment, le dernier ouvert est "actif"
   2. Nom du haut : remet la page à zéro
   3. Galerie : clic sur une image pour l'agrandir
   4. Panneau « À propos » (+ position du bouton XP)
   5. Fenêtre « Crédits »
   6. Clavier
   ===================================================================== */

/* ---------- 1. PROJETS ----------
   Chaque projet s'ouvre / se ferme seul. Le DERNIER ouvert est "actif" (classe .active) :
   il reste lumineux, tous les autres projets (photos dépliées comprises) s'assombrissent.
   Si on ferme le projet actif, le précédent encore ouvert redevient actif.
   Le clic est géré ici (preventDefault) : la case à cocher ne reçoit jamais le focus,
   donc le navigateur ne fait pas défiler la page.                                       */
const openOrder = [];                      // projets ouverts, du plus ancien au plus récent

function refreshActive() {
  document.querySelectorAll('.project.active').forEach((p) => p.classList.remove('active'));
  const last = openOrder[openOrder.length - 1];
  if (last) last.classList.add('active');
}

function setProject(cover, open) {
  const box = document.getElementById(cover.htmlFor);
  const project = cover.closest('.project');
  box.checked = open;
  cover.setAttribute('aria-expanded', open);

  const i = openOrder.indexOf(project);
  if (i > -1) openOrder.splice(i, 1);
  if (open) openOrder.push(project);
  refreshActive();
}

const isOpen = (cover) => document.getElementById(cover.htmlFor).checked;

document.addEventListener('click', (e) => {
  const cover = e.target.closest('.project > label.card');
  if (!cover) return;
  e.preventDefault();
  setProject(cover, !isOpen(cover));
});

// clavier : Entrée / Espace sur une couverture focalisée
document.addEventListener('keydown', (e) => {
  const cover = e.target.closest && e.target.closest('.project > label.card');
  if (!cover || (e.key !== 'Enter' && e.key !== ' ')) return;
  e.preventDefault();
  setProject(cover, !isOpen(cover));
});


/* ---------- 2. NOM DU HAUT = RESET ----------
   Le lien pointe vers #all (aucun filtre) ; on referme en plus tous les projets,
   le panneau À propos, et on remonte en haut.                                   */
document.querySelector('header h1 a').addEventListener('click', () => {
  document.querySelectorAll('.project > label.card').forEach((c) => setProject(c, false));
  setAbout(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ---------- 3. GALERIE ---------- */
const lb = document.getElementById('lightbox');
const big = lb.querySelector('img');
const cap = lb.querySelector('figcaption');
let list = [];
let idx = 0;

function show(n) {
  idx = (n + list.length) % list.length;
  const el = list[idx];
  big.src = el.src;
  big.alt = el.alt;
  cap.textContent = `${idx + 1} / ${list.length}` + (el.alt ? ` — ${el.alt}` : '');
  [idx - 1, idx + 1].forEach((k) => {          // précharge les voisines
    const nb = list[(k + list.length) % list.length];
    if (nb) new Image().src = nb.src;
  });
}

function openLightbox(img) {
  const project = img.closest('.project');
  list = [...project.querySelectorAll('.card:not(.text) img')];   // couverture + images (sans les textes)
  lb.classList.add('open');
  document.body.classList.add('no-scroll');
  show(list.indexOf(img));
}

function closeLightbox() {
  lb.classList.remove('open');
  document.body.classList.remove('no-scroll');
  big.removeAttribute('src');
}

document.addEventListener('click', (e) => {
  const img = e.target.closest('.card.extra:not(.text) img');
  if (img) openLightbox(img);
});
lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
lb.querySelector('.lb-prev').addEventListener('click', () => show(idx - 1));
lb.querySelector('.lb-next').addEventListener('click', () => show(idx + 1));
lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

// glissement au doigt (mobile)
let x0 = null;
lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', (e) => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
  x0 = null;
});


/* ---------- 4. PANNEAU « À PROPOS » ----------
   Le bouton ouvre ET ferme. Pas de blocage du scroll : les projets restent utilisables.
   Quand il est ouvert, le nom du haut disparaît (classe about-open sur <body>).        */
const about = document.getElementById('about');
const aboutBtn = document.getElementById('about-open');

// le bouton XP se place à gauche du bouton À propos : on lui donne sa largeur réelle
new ResizeObserver(() => {
  document.documentElement.style.setProperty('--about-w', aboutBtn.offsetWidth + 'px');
}).observe(aboutBtn);

function setAbout(open) {
  about.classList.toggle('open', open);
  about.setAttribute('aria-hidden', !open);
  aboutBtn.setAttribute('aria-expanded', open);
  document.body.classList.toggle('about-open', open);
  if (open) about.scrollTop = 0;
}

aboutBtn.addEventListener('click', () => setAbout(!about.classList.contains('open')));


/* ---------- 5. FENÊTRE « CRÉDITS » ----------
   Ouverte depuis le lien Crédits ; le reste du site est assombri par la fenêtre elle-même. */
const credits = document.getElementById('credits');

function setCredits(open) {
  credits.classList.toggle('open', open);
  credits.setAttribute('aria-hidden', !open);
  document.body.classList.toggle('no-scroll', open);
}

document.getElementById('credits-open').addEventListener('click', (e) => {
  e.preventDefault();
  setCredits(true);
});
credits.querySelector('.credits-close').addEventListener('click', () => setCredits(false));
credits.addEventListener('click', (e) => { if (e.target === credits) setCredits(false); });


/* ---------- 6. CLAVIER ---------- */
document.addEventListener('keydown', (e) => {
  if (credits.classList.contains('open')) {          // priorité : crédits > galerie > à propos
    if (e.key === 'Escape') setCredits(false);
  } else if (lb.classList.contains('open')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  } else if (e.key === 'Escape') {
    setAbout(false);
  }
});
