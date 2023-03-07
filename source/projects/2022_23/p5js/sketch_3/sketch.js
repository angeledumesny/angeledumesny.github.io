let mesBulles;
let n = 50; // n en largeur
let p = 50; // p en hauteur

function setup() {
  createCanvas(400, 400);
  mesBulles = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < p; j++) {
      let dx = width / (n);
      let dy = height / (p);
      let xBulle = (i * dx+(i+1)*dx)/2;
      let yBulle = (j + 1) * dy;
      let maBulle = new Bulle(xBulle, yBulle);
      mesBulles.push(maBulle);
      noStroke();
      frameRate(5);
    }
  }
}

function draw() {
  background(220);
  for (let i = 0; i < mesBulles.length; i++) {
    let maBulle = mesBulles[i];
 //   let r = random(254,255);
 //   let v = random(0,255);
    let b = random(0,255);
    
    maBulle.couleur = color(250,0,b);
    maBulle.affiche();
    
  }
}

class Bulle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 30;
 //   let r = random(250,255);
  //  let v = random(0,255);
    let b = random(0,255);
    
    this.couleur = color(250,0,b);
  }

  affiche() {
    rectMode(CENTER);
    fill(this.couleur);
    push();
    let larg = width/n;
    let haut = height/p;
    translate(this.x,this.y);
    rect(0,0,larg,haut);

    pop();
  }
}











