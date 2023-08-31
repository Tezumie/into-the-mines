function windowResized() {
  canvasSetup();
}
function canvasSetup() {
  pixelsWidth = 320;
  pixelsHeight = 184;
  scaleFactor = 4;
  new Canvas(
    floor(pixelsWidth * scaleFactor),
    floor(pixelsHeight * scaleFactor),
    "pixelated"
  );
  document.body.style.backgroundColor = color(0, 7, 14);
}
function CameraController() {
  //////// parallaxCAMERA ////////
  let camerYoff = 12.0;
  let lagFactor = 0.05;
  let dx = player.x - camera.x;
  let dy = player.y - camerYoff - camera.y;
  camera.x += dx * lagFactor;
  camera.y += dy * lagFactor/2;
  camera.zoom = scaleFactor * (pixelsWidth / 256);
  let x = colIndex * pixelsWidth;
  let y = rowIndex * pixelsHeight;
  camera.x = constrain(
    camera.x,
    (camera.x = x + (pixelsWidth / 2) * 0.8),
    (camera.x = x + (pixelsWidth / 2) * 1.2)
  );
  camera.y = constrain(
    camera.y,
    (camera.y = y + (pixelsHeight / 2) * 0.8),
    (camera.y = y + (pixelsHeight / 2) * 1.2)
  );
  //////// stationaryCAMERA ////////
  // camera.zoom = scaleFactor;
  // let x = colIndex * pixelsWidth;
  // let y = rowIndex * pixelsHeight;
  // camera.x = x + pixelsWidth / 2;
  // camera.y = y + pixelsHeight / 2;
}
function parallaxBackground(imgPath1, imgPath2, imgPath3, imgPath4) {
  let w = bg1.width * scaleFactor;
  let h = bg1.height * scaleFactor;
  let layerOffset;
  if (currentLevel.world == "forest") {
    layerOffset = bg1.height / 1.5;
  } else if (currentLevel.world == "mine") {
    layerOffset = bg1.height * 1.1;
  }
  let y = -48 * scaleFactor * 2;
  let speed1 = 0.02; // Speed for the first image
  let speed2 = 0.06; // Speed for the second image
  let speed3 = 0.14; // Speed for the third image
  let speed4 = 0.2; // Speed for the fourth image
  let offsetX1 = (camera.x * speed1) % bg1.width;
  let offsetX2 = (camera.x * speed2) % bg1.width;
  let offsetX3 = (camera.x * speed3) % bg1.width;
  let offsetX4 = (camera.x * speed4) % bg1.width;
  let offsetY1 = ((camera.y * 0.3) % bg1.width) + y;
  let offsetY2 = ((camera.y * 0.2) % bg1.width) + y;
  let offsetY3 = ((camera.y * 0.1) % bg1.width) + y;
  let offsetY4 = ((camera.y * 0.05) % bg1.width) + y * 0.9;
  for (let x = -w; x < w * 10; x += w) {
    image(bg1, x - offsetX1, -layerOffset + offsetY1, w, h);
    image(bg2, x - offsetX2, -layerOffset + offsetY2, w, h);
    image(bg3, x - offsetX3, -layerOffset + offsetY3, w, h);
    image(bg4, x - offsetX4, -layerOffset + offsetY4, w, h);
  }
}
function shakeScreen(magnitude, duration) {
  let shakeMagnitude = magnitude;
  let shakeDuration = duration;
  initialCameraX = camera.x;
  initialCameraY = camera.y;
  let targetCameraX = initialCameraX;
  let targetCameraY = initialCameraY;
  let shakeTimer = shakeDuration;
  let shakeInterval = setInterval(function () {
    if (shakeTimer > 0) {
      let shakeProgress = 1 - shakeTimer / shakeDuration;
      let offsetX = lerp(-shakeMagnitude, shakeMagnitude, shakeProgress);
      let offsetY = lerp(-shakeMagnitude, shakeMagnitude, shakeProgress);
      camera.x = initialCameraX + offsetX;
      camera.y = initialCameraY + offsetY;
      shakeTimer -= deltaTime / 1000;
    } else {
      camera.x = initialCameraX;
      camera.y = initialCameraY;
      clearInterval(shakeInterval);
    }
  }, 1000 / frameRate());
}
