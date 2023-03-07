let mesBulles;
let n = 1000; // pour placer n bulles

function setup() {
  createCanvas(400, 400);
  mesBulles = [];
  for (let i = 0; i < n; i++) {
    let xBulle = random (width);
    let yBulle = random (height);
    let maBulle = new Bulle (xBulle, yBulle);
    mesBulles.push(maBulle); 
    noStroke();
  }
}

function draw() {
  background("#FA25CB");
  for (let i = 0; i < mesBulles.length; i++) {
    let maBulle = mesBulles[i];
    maBulle.moove();
    maBulle.affiche(); 
  }
}

class Bulle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 20;
    //let rBulle = random(0,255);
    //let vBulle = random(0,255);
    let bBulle = random(0,255);
    this.couleur = color (250,0,bBulle);
  }

  affiche() {
    fill(this.couleur);
    ellipse(this.x, this.y, this.r, this.r);
    if(this.x<0){this.x=0;}
    if(this.x>width){this.x=width;}
    if(this.y<0){this.y=0;}
    if(this.y>height){this.y=height;}
  }
  
  moove(){ 
  this.x = this.x + random(-1, 1);
  this.y = this.y + random(1, -1);
  }
}



