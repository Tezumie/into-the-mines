class Dust {
  constructor (particleAmount, size, speed, directionVector) {
    this.dust = [];
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
      this.dust.push(particle);
    }
  }
  draw() {
    for (let i = 0; i < this.dust.length; i++) {
      this.dust[i].update();
      this.dust[i].display();
    }
  }
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
  pickAxeTrailSpriteSheet = graphicsBuffer.get();
  graphicsBuffer.remove();
}
function playerParticle(spawnX, spawnY, angle, dir) {
  let frameCountThreshold = 3;
  if (typeof playerParticle.frameCounter === "undefined") {
    playerParticle.frameCounter = 0;
  }
  playerParticle.frameCounter++;
  if (playerParticle.frameCounter % frameCountThreshold === 0) {
    let playerTrail = new Sprite(spawnX, spawnY, 16, 16);
    playerTrail.spriteSheet = newPlayerTrailSprite;
    playerTrail.addImg({ w: 16, h: 16, row: 0, col: 17 });
    playerTrail.img.color = color(0);
    playerTrail.mirror.x = dir;
    playerTrail.collider = "none";
    playerTrail.layer = 0;
    playerTrail.life = 9;
  }
  if (playerParticle.frameCounter >= frameCountThreshold) {
    playerParticle.frameCounter = 0;
  }
}

function pickAxeParticle(spawnX, spawnY, angle, dir) {
  let pickAxeTrail = new Sprite(spawnX, spawnY, 8, 8);
  pickAxeTrail.spriteSheet = pickAxeTrailSpriteSheet;
  pickAxeTrail.addImg({ w: 8, h: 8, row: 13, col: 4 });
  pickAxeTrail.layer = 0;
  pickAxeTrail.rotation = angle;
  pickAxeTrail.mirror.x = dir;
  pickAxeTrail.collider = "none";
  pickAxeTrail.life = 5;
}

function dustParticle(spawnX, spawnY) {
  let canSpawn = random(1);
  if (canSpawn > 0.75) {
    let dust = new Sprite(
      spawnX + random(-2, 2),
      spawnY + random(-2, 2),
      random(0, 0.25),
      random(0, 0.25)
    );
    dust.collider = "none";
    dust.stroke = color(255, 150);
    dust.life = 9;
  }
}
