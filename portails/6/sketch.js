let video;
let buffer = [];
const bufferSize = 2; // Taille du buffer pour la latence
const pixelSize = 1; // Taille des pixels pour l'effet pixélisé

function setup() {
    createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
}

function draw() {
  // Capture l'image actuelle de la vidéo
  video.loadPixels();

  // Créer une image temporaire pour appliquer l'effet pixélisé
  let tempImage = createImage(width, height);
  tempImage.loadPixels();

  // Appliquer l'effet pixélisé
  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      let i = (y * width + x) * 4;

      // Calculer la moyenne des pixels dans le bloc
      let r = 0, g = 0, b = 0;
      for (let j = 0; j < pixelSize; j++) {
        for (let k = 0; k < pixelSize; k++) {
          if (x + k < width && y + j < height) {
            let idx = ((y + j) * width + (x + k)) * 4;
            r += video.pixels[idx];
            g += video.pixels[idx + 1];
            b += video.pixels[idx + 2];
          }
        }
      }
      r = r / (pixelSize * pixelSize);
      g = g / (pixelSize * pixelSize);
      b = b / (pixelSize * pixelSize);

      // Appliquer la couleur moyenne à l'image temporaire
      for (let j = 0; j < pixelSize; j++) {
        for (let k = 0; k < pixelSize; k++) {
          if (x + k < width && y + j < height) {
            let idx = ((y + j) * width + (x + k)) * 4;
            tempImage.pixels[idx] = r;
            tempImage.pixels[idx + 1] = g;
            tempImage.pixels[idx + 2] = b;
            tempImage.pixels[idx + 3] = 30; // Opacité
          }
        }
      }
    }
  }
  tempImage.updatePixels();

  // Convertir l'image pixélisée en noir et blanc
  tempImage.loadPixels();
  for (let i = 0; i < tempImage.pixels.length; i += 4) {
    let brightness = (tempImage.pixels[i] + tempImage.pixels[i + 1] + tempImage.pixels[i + 2]) / 3;
    let bw = brightness > 128 ? 255 : 0;
    tempImage.pixels[i] = bw;
    tempImage.pixels[i + 1] = bw;
    tempImage.pixels[i + 2] = bw;
  }
  tempImage.updatePixels();

  // Ajouter l'image actuelle au buffer pour la latence
  buffer.push(tempImage);
  if (buffer.length > bufferSize) {
    buffer.shift(); // Enlever l'élément le plus ancien
  }

  // Afficher l'image avec latence
  if (buffer.length > 1.8) {
    image(buffer[0], 0, 1, width, height); // Affiche l'image la plus ancienne
  }
}
