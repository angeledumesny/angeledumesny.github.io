let a = 10; // cote carreau
let c, l;
let mesCarreaux = [];
let capture;

function setup() {
  createCanvas(640, 480);
  noStroke();
  c = floor(width / a);
  l = floor(height / a);
  capture = createCapture(VIDEO);
  capture.size(c,l);
  for (let j = 0; j < l; j++) {
    for (let i = 0; i < c; i++) {
      let monCarreau = new Carreau(i,j);
      mesCarreaux.push(monCarreau);
    }
  }
  capture.hide();
}

function draw() {
  capture.loadPixels();
  let img = capture.pixels;
  for (let j = 0; j < l; j++) {
    for (let i = 0; i < c; i++) {
      let nCarreau = i+j*c;
      monCarreau = mesCarreaux[nCarreau];
      let r = img[nCarreau*4];
      let v = img[nCarreau*4+1];
      let b = img[nCarreau*4+2];
      monCarreau.coul = color(r,v,b);
      monCarreau.affiche();
    }
  }
}

class Carreau {
  constructor(c, l) {
    this.c = c;
    this.l = l;
    this.coul = color(random(0, 256));
  }

  affiche() {
    fill(this.coul);
    push();
    translate(width-a * this.c-a, a * this.l);
    rect(0, 0, a, a);
    pop();
  }
}
