let video;
let trailBuffer;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create video capture from webcam
  video = createCapture(VIDEO);
  video.size(320, 240); // Lower resolution for better pixelation
  video.hide(); // Hide original video
  
  // Create a graphics buffer to hold the trail effect
  trailBuffer = createGraphics(320, 240);
  trailBuffer.pixelDensity(1); // Ensure pixel density matches
}

function draw() {
  // Load pixels from the video and trail buffer
  video.loadPixels();
  trailBuffer.loadPixels();
  
  // Adjust the scale for a stronger pixelation effect
  let scaleFactor = 1; // Increase for more pixelation
  let w = video.width / scaleFactor;
  let h = video.height / scaleFactor;
  
  for (let x = 0; x < video.width; x += scaleFactor) {
    for (let y = 0; y < video.height; y += scaleFactor) {
      let index = (x + y * video.width) * 4;
      
      // Get pixel color values
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];
      
      // Convert to grayscale for black and white effect
      let bw = (r + g + b) / 2; // eclaircie ou fonce
      
      // Apply the black and white color back to the buffer
      for (let dx = 0; dx < scaleFactor; dx++) {
        for (let dy = 0; dy < scaleFactor; dy++) {
          let bufferIndex = ((x + dx) + (y + dy) * trailBuffer.width) * 4;
          trailBuffer.pixels[bufferIndex] = bw;
          trailBuffer.pixels[bufferIndex + 1] = bw;
          trailBuffer.pixels[bufferIndex + 2] = bw;
          trailBuffer.pixels[bufferIndex + 3] = 30; // Add transparency for trail effect
        }
      }
    }
  }
  
  trailBuffer.updatePixels();
  
  // Blend the trail effect with the previous frames
  blendMode(DARKEST);
  image(trailBuffer, 0, 0, width, height);
  
  // Copy current frame to the buffer to leave a trail
  blendMode(LIGHTEST);
  image(trailBuffer, 0, 0, width, height);
}
