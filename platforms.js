function movePlatforms() {
	for (let p of movingPlatforms) {
		p.y = p.startY;
		p.leftSensor.y = p.startY;
		p.rightSensor.y = p.startY;
		if (
			p.leftSensor.overlapping(ground) ||
			(player.y + 8.5 < p.y && p.leftSensor.overlapping(player)) ||
			p.leftSensor.overlapping(movingPlatforms)
		) {
			p.moveDirection = 1;
		} else if (
			p.rightSensor.overlapping(ground) ||
			(player.y + 8.5 < p.y && p.rightSensor.overlapping(player)) ||
			p.rightSensor.overlapping(movingPlatforms)
		) {
			p.moveDirection = -1;
		}
		if (p.moveDirection == 1) {
			p.x += p.moveSpeed;
		} else {
			p.x -= p.moveSpeed;
		}
		p.leftSensor.x = p.x - 18;
		p.rightSensor.x = p.x + 18;
		if (player.currentState != player.states.CLIMBING) {
			if (player.groundSensor.overlapping(p)) {
				if (p.moveDirection == 1) {
					if (!player.rightClimbSensor.overlapping(ground) && !player.leftClimbSensor.overlapping(ground)) {
						player.x += p.moveSpeed;
					} else {
						player.vel.y = 0.1;
					}
				} else {
					if (!player.rightClimbSensor.overlapping(ground) && !player.leftClimbSensor.overlapping(ground)) {
						player.x -= p.moveSpeed;
					} else {
						player.vel.y = 0.1;
					}
				}
			}
		}
		if (
			player.y + 8.5 > p.y ||
			kb.pressing('down') ||
			contro.pressing('down') ||
			player.currentState == player.states.CLIMB ||
			contro.leftStick.y > 0.25
		) {
			p.collider = 'none';
			p.leftSensor.collider = 'd';
			p.rightSensor.collider = 'd';
		} else {
			p.collider = 'static';
		}
	}
}
function generateMovingPlatforms() {
	for (let p of movingPlatforms) {
		p.leftSensor = new Sprite(p.x - 18, p.y, 1, 3);
		p.leftSensor.visible = false;
		p.leftSensor.mass = 0.01;
		p.leftSensor.overlaps(allSprites);
		p.leftSensor.overlaps(ground);
		p.leftSensor.rotationLock = true;
		j = new GlueJoint(p, p.leftSensor);
		movingTilesGroup.add(p.leftSensor);
		j.visible = false;
		p.rightSensor = new Sprite(p.x + 18, p.y, 1, 3);
		p.rightSensor.visible = false;
		p.rightSensor.mass = 0.01;
		p.rightSensor.overlaps(allSprites);
		p.rightSensor.overlaps(ground);
		p.rightSensor.rotationLock = true;
		movingTilesGroup.add(p.rightSensor);
		j = new GlueJoint(p, p.rightSensor);
		j.visible = false;
		p.w = 32;
		p.h = 4;
		p.startY = p.y;
		p.moveDirection = 1;
		p.vel.y = 0;
		p.rotationLock = true;
		p.collider = 'k';
		p.collides(player);
		p.moveSpeed = 0.25;
		p.layer = 1;
	}
}

function handlePlatforms() {
	for (let b of breakingPlatforms) {
		let playerClimbing =
			player.currentState == player.states.CLIMB &&
			(player.rightClimbSensor.overlapping(b) || player.leftClimbSensor.overlapping(b));
		let playerStanding = player.isOnGround && player.groundSensor.overlapping(b);

		if (!playerClimbing && !playerStanding) continue;

		if (b.collider == 'none') {
			if (playerClimbing) {
				player.currentState = player.states.JUMP;
				player.climbToggle = false;
			}
			if (playerStanding) player.isOnGround = false;
			player.canJump = false;
			world.gravity.y = 8.2;
		}
		if (b.ani.name == 'regular') {
			b.changeAni('cracked');
			breakBridgeSound.play(0, random(0.4, 0.65), 0.08, 0.2, 0.1);

			setTimeout(() => {
				if (b.removed) return;
				b.changeAni('none');
				b.collider = 'none';
				ground.remove(b);
				breakBridgeSound.play(0, random(0.4, 0.65), 0.08, 0.2, 0.1);
				for (let i = 0; i < 3; i++) {
					let p = new stoneParticles.Sprite();
					p.x = b.x + random(-4, 4);
					p.y = b.y + random(-4, 4);
				}
				setTimeout(() => {
					if (b.removed) return;
					b.changeAni('regular');
					b.collider = 'static';
					if (!ground.includes(b)) ground.add(b);
				}, 2500);
			}, 1000);
		}
	}
	for (let o of oneWayPlatforms) {
		if (
			player.currentState == player.states.CLIMB ||
			kb.pressing('down') ||
			contro.pressing('down') ||
			contro.leftStick.y > 0.25 ||
			player.y + 10.5 > o.y
		) {
			o.collider = 'none';
			o.removeSensors();
		} else if (o.collider == 'none') {
			o.collider = 'static';
			o.addDefaultSensors();
		}
	}
}
