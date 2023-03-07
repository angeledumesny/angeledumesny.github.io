let monBlob;

function setup() {
  createCanvas(400, 1000);
  monBlob = new Blobbe(width/2,height/2,100,"#fd307d");
//  monBlob2 = new Blobbe(width/5,height/5,80,"pink");
  noStroke(monBlob);
 // noLoop();
}

function draw() {
  background("#fff");
  monBlob.affiche();
  monBlob.avance();
//  monBlob2.affiche();
//  monBlob2.avance();
}


class Blobbe {
  constructor(x,y,r,couleur){
    this.x = x;
    this.y = y;
    this.r = r;
    this.couleur = couleur;
    this.points = this.r;
    this.seed1 = random (100,10000);
    this.seed2 = random (100,10000);
  }
  
  affiche(){
    push();
    fill(this.couleur);
    translate(this.x,this.y);
    beginShape();
    for(let i = 0;i<this.points;i++){
      let rPerlin = 2;
      let angle = i*2*PI/this.points;
      let xPerlin = rPerlin*cos(angle) +this.seed1;
      let yPerlin = rPerlin*sin(angle) +this.seed2;
      let t = frameCount / 10;
      let facteur = map(noise(xPerlin,yPerlin,t),0,1,0.8,1.2);
      let rVrai = this.r*facteur;
      let x = rVrai*cos(angle);
      let y = rVrai*sin(angle);
      vertex(x,y);
    }
    endShape(CLOSE);
    pop();
  }
  
  changeCouleur(){
    let r = red(this.couleur);
    let v = green(this.couleur);
    let b = blue(this.couleur);
  }
  
  avance(){
    let x = this.x;
    let y = this.y;
    let xS = mouseX;
    let yS = mouseY;
    let dx = (xS-x)/10;
    let dy = (yS-y)/10;
    this.x += dx;
    this.y += dy;
    
  }
}