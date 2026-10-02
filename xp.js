/* =====================================================================
   XP.JS
   Les noms des images viennent de xp.html (liste #xp-files).
   • au chargement : 2 images côte à côte au centre de la page (1 seule si la page est étroite)
   • clic          : une image de plus, à l'endroit du clic
   • Mix           : toutes les images changent de place
   • ↻             : on recommence à zéro
   Le survol (flou + couleurs inversées) est géré par le CSS.
   ===================================================================== */

const list = document.getElementById('xp-files');
const FOLDER = list.dataset.folder;                         // dossier des images
const FILES = list.textContent.split(/[\s,]+/).filter(Boolean);   // noms de fichiers, écrits dans xp.html
const EXTS = ['jpg', 'gif', 'jpeg'];                        // essayées dans l'ordre pour les noms sans extension
const field = document.getElementById('field');
const NARROW = 700;                                         // en dessous de cette largeur (px) : une seule image au départ
const GAP = 16;                                             // espace (px) entre les deux images du départ

/* un paquet mélangé : chaque image sort une fois avant qu'il soit rebattu */
let deck = [];
function nextFile() {
  if (!deck.length) {
    deck = [...FILES];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }
  return deck.pop();
}

/* adresses possibles d'un fichier : telle quelle s'il a une extension, sinon avec chaque extension */
const sources = (name) => /\.\w+$/.test(name) ? [FOLDER + name] : EXTS.map((e) => `${FOLDER}${name}.${e}`);

/* charge une image (essaie chaque adresse) : renvoie l'<img> prête, ou null si introuvable */
function loadImage(srcs) {
  return new Promise((resolve) => {
    const img = new Image();
    let k = 0;
    img.onload = () => resolve(img);
    img.onerror = () => { if (++k < srcs.length) img.src = srcs[k]; else resolve(null); };
    img.src = srcs[0];
  });
}

/* prend le prochain fichier du paquet (en sautant ceux qui sont introuvables) */
async function nextImage() {
  for (let tries = 0; tries < 10; tries++) {
    const name = nextFile();
    if (!name) return null;
    const img = await loadImage(sources(name));
    if (img) {
      img.className = 'xp-img fresh';              // "fresh" : sans survol tant que la souris n'a pas bougé
      img.alt = '';
      img.draggable = false;
      return img;
    }
  }
  return null;
}

/* "session" : change à chaque ↻, pour qu'une image encore en chargement n'arrive pas après */
let session = 0;

/* pose une image centrée sur (x, y) */
async function add(x, y) {
  const s = session;
  const img = await nextImage();
  if (!img || s !== session) return;
  img.style.left = x + 'px';
  img.style.top = y + 'px';
  field.appendChild(img);
}

/* le départ : 2 images côte à côte, centrées sur la page (1 seule si la page est étroite) */
async function start() {
  const s = session;
  const count = innerWidth >= NARROW ? 2 : 1;
  const imgs = (await Promise.all(Array.from({ length: count }, nextImage))).filter(Boolean);
  if (s !== session) return;
  imgs.forEach((img) => field.appendChild(img));

  // le CSS plafonne la taille des images : on mesure leur largeur réelle, puis on les aligne autour du centre
  const widths = imgs.map((img) => img.getBoundingClientRect().width);
  let x = innerWidth / 2 - (widths.reduce((a, b) => a + b, 0) + GAP * (imgs.length - 1)) / 2;
  imgs.forEach((img, i) => {
    img.style.left = x + widths[i] / 2 + 'px';
    img.style.top = innerHeight / 2 + 'px';
    x += widths[i] + GAP;
  });
}

/* un point au hasard dans l'écran (en gardant les images à peu près visibles) */
const randomPoint = () => ({
  x: innerWidth * (0.1 + Math.random() * 0.8),
  y: innerHeight * (0.1 + Math.random() * 0.8),
});

field.addEventListener('click', (e) => add(e.clientX, e.clientY));

/* Mix : chaque image change de place (le glissement est dans le CSS) */
document.getElementById('xp-mix').addEventListener('click', () => {
  field.querySelectorAll('.xp-img').forEach((img) => {
    const p = randomPoint();
    img.style.left = p.x + 'px';
    img.style.top = p.y + 'px';
  });
});

/* ↻ : tout effacer, rebattre le paquet et refaire le départ */
document.getElementById('xp-restart').addEventListener('click', () => {
  session++;
  deck = [];
  field.replaceChildren();
  start();
});

start();

/* curseur : le bouton noir XP suit la souris (le curseur normal n'est masqué que s'il se charge) */
const cursor = document.getElementById('xp-cursor');
let cursorOk = true;
cursor.onerror = () => { cursorOk = false; document.body.classList.remove('fake-cursor'); };
window.addEventListener('pointermove', (e) => {
  field.querySelectorAll('.fresh').forEach((el) => el.classList.remove('fresh'));
  if (e.pointerType !== 'mouse' || !cursorOk) return;
  document.body.classList.add('fake-cursor');
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  cursor.classList.add('on');
});
document.documentElement.addEventListener('mouseleave', () => cursor.classList.remove('on'));
