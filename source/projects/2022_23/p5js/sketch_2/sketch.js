let mesCarreaux;
let n = 20; // n en largeur
let p = 200; // p en hauteur
let precision = 50;

function setup() {
  noStroke();
  createCanvas(400, 400);
  mesCarreaux = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < p; j++) {
      let dx = width / (n);
      let dy = height / (p);
      let xCarreau = (i+1/2)*dx;
      let yCarreau = (j + 1/2) * dy;
      let monCarreau = new Carreau(xCarreau, yCarreau);
      mesCarreaux.push(monCarreau);
    }
  }
}

function draw() {
  background(220);
  for (let i = 0; i < mesCarreaux.length; i++) {
    let monCarreau = mesCarreaux[i];
    
    let x = monCarreau.x/precision;
    let y = monCarreau.y/precision;
    let t = frameCount/50;
    let r = map(noise(x,y,t),1,0,0,256);
    let v = map(noise(x,y,t+12),0,1,0,256);
    let b = map(noise(x,y,t+345),0,0,1,256);
   // let gris = noise(x,y,t)*256;
    
    monCarreau.couleur = color(r,v,b);
    monCarreau.affiche();
  }
}

class Carreau {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 30;
    let r = random(0,255);
    let v = random(0,255);
    let b = random(0,255);
    
    this.couleur = color(r,v,b);
  }

  affiche() {
    rectMode(CENTER);
    fill(this.couleur);
    push();
    let larg = width/n +1;
    let haut = height/p +1;
    translate(this.x,this.y);
    rect(0,0,larg,haut);
    pop();
  }
}











