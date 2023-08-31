function weather(particleAmount, size, speed, directionVector) {
  for (let i = 0; i < particleAmount; i++) {
    let x = random(0, width + width / 2);
    let y = random(0, height);
    let deviation = createVector(random(-1.4, 1.4), random(-1.4, 1.4));
    let particle = {
      position: createVector(x, y),
      velocity: p5.Vector.mult(
        p5.Vector.add(directionVector, deviation),
        speed
      ),
      size: size,
      update: function () {
        this.position.add(this.velocity);
        if (this.position.y > height || this.position.x < 0) {
          this.position.y = 0;
          this.position.x = random(0, width + width / 2);
        }
      },
      display: function () {
        noStroke();
        fill(255, random(20, 50));
        rect(this.position.x, this.position.y, this.size, this.size);
      },
    };
    particles.push(particle);
  }
  weather.draw = function () {
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].display();
    }
  };
}
function crateParticle(spawnX, spawnY, shape) {
  let dust = new Group();
  if (shape == "crate") {
    new dust.Sprite(
      spawnX + random(-4, 4),
      spawnY + random(-4, 4),
      random(0, 2.5),
      random(0, 2.5)
    );
    dust.stroke = color(
      83 + random(-10, 10),
      53 + random(-10, 10),
      35 + random(-10, 10)
    );
    dust.color = color(
      83 + random(-10, 10),
      53 + random(-10, 10),
      35 + random(-10, 10)
    );
  } else if (shape == "stone") {
    new dust.Sprite(
      spawnX + random(-4, 4),
      spawnY + random(-4, 4),
      random(0, 3),
      random(0, 3)
    );
    dust.stroke = color(
      173 + random(-10, 10),
      161 + random(-10, 10),
      152 + random(-10, 10)
    );
    dust.color = color(
      173 + random(-10, 10),
      161 + random(-10, 10),
      152 + random(-10, 10)
    );
  }
  dust.layer = 1;
  dust.collider = "d";
  dust.overlaps(player);
  dust.direction = () => random(0, 360);
  dust.speed = () => random(0.01, 0.05);
  dust.visible = true;

  dust.life = 145;
}
function createDashSprites(myColor) {
  let graphicsBuffer = createGraphics(playerSprite.width, playerSprite.height);
  graphicsBuffer.tint(myColor);
  graphicsBuffer.image(playerSprite, 0, 0);
  newPlayerTrailSprite = graphicsBuffer.get();
  graphicsBuffer.remove();
  ///
  graphicsBuffer = createGraphics(tileSet.width, tileSet.height);
  graphicsBuffer.tint(myColor);
  graphicsBuffer.image(tileSet, 0, 0);
  newpickAxeTrailSprite = graphicsBuffer.get();
  graphicsBuffer.remove();
}
function playerParticle(spawnX, spawnY, angle, dir) {
  let frameCountThreshold = 3;
  if (typeof playerParticle.frameCounter === "undefined") {
    playerParticle.frameCounter = 0;
  }
  playerParticle.frameCounter++;
  if (playerParticle.frameCounter % frameCountThreshold === 0) {
    let playerTrail = new Group();
    let playerTrailSprite = new playerTrail.Sprite(spawnX, spawnY, 16, 16);
    playerTrail.spriteSheet = newPlayerTrailSprite;
    playerTrailSprite.addImg({ w: 16, h: 16, row: 0, col: 17 });
    playerTrailSprite.img.color = color(0);
    playerTrailSprite.mirror.x = dir;
    playerTrail.collider = "none";
    playerTrailSprite.layer = 0;
    playerTrail.life = 9;
  }
  if (playerParticle.frameCounter >= frameCountThreshold) {
    playerParticle.frameCounter = 0;
  }
}

function pickAxeParticle(spawnX, spawnY, angle, dir) {
  let pickAxeTrail = new Group();
  let pickAxeTrailSprite = new pickAxeTrail.Sprite(spawnX, spawnY, 8, 8);
  pickAxeTrail.spriteSheet = newpickAxeTrailSprite;
  pickAxeTrailSprite.addImg({ w: 8, h: 8, row: 13, col: 4 });
  pickAxeTrailSprite.layer = 0;
  pickAxeTrailSprite.rotation = angle;
  pickAxeTrailSprite.mirror.x = dir;
  pickAxeTrail.collider = "none";
  pickAxeTrail.life = 5;
}

function dustParticle(spawnX, spawnY) {
  let canSpawn = random(1);
  if (canSpawn > 0.75) {
    let dust = new Group();
    new dust.Sprite(
      spawnX + random(-2, 2),
      spawnY + random(-2, 2),
      random(0, 0.25),
      random(0, 0.25)
    );
    dust.collider = "none";
    dust.direction = () => random(0, 360);
    dust.speed = () => random(0.01, 0.05);
    dust.visible = true;
    dust.stroke = color(255, 150);
    dust.life = 9;
  }
}
