let a = 15; 
let c, l;
let mesCarreaux = [];
let capture;
let monBackground;

function preload(){
  monBackground = loadImage("img.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
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
  background(255);
  capture.loadPixels();
  let img = capture.pixels;
  for (let j = 0; j < l; j++) {
    for (let i = 0; i < c; i++) {
      let nCarreau = i+j*c;
      monCarreau = mesCarreaux[nCarreau];
      let r = img[nCarreau*4];
      let v = img[nCarreau*4+1];
      let b = img[nCarreau*4+2];
      let g = (r+v+b)/2;
      
      monCarreau.diam = map(g,0,255,a,0);
      //monCarreau.coul = color(g,g,g);
      monCarreau.affiche();
    }
  }

}



class Carreau {
  constructor(c, l) {
    this.c = c;
    this.l = l;
    this.coul = color(0,0,0);
    this.diam = a;
  }

  affiche() {
    fill(this.coul);
    push();
    translate(width-a * this.c-a, a * this.l);
    ellipse(0, 0, this.diam, this.diam);
    
    pop();
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
