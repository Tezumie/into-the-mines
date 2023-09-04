function killPlayer() {
    let d = player.spawnDirection;
    dieSound.play(0, 2.7, 0.08, 0, 1);
    allSprites.remove();
    player.remove();
    createPlayer(playerSpawnX, playerSpawnY);
    player.mirror.x = d;
    player.speed = 0;
    newLevel();
}

function breakCrate(g, b) {
    if (g == grappleTarget) {
        if (player.joints.length < 6 && grappleTarget != null) {
            b.remove();
            grappleTarget.collider = "k";
            grappleTarget.returning = true;
            crushSound.play(0, 0.9, 0.06, 0, 0.9);
            for (let i = 0; i < 5; i++) {
                crateParticle(grappleTarget.x, grappleTarget.y, "crate");
            }
        }
    } else {
        b.remove();
        crushSound.play(0, 0.9, 0.06, 0, 0.9);
        for (let i = 0; i < 5; i++) {
            crateParticle(g.x, g.y, "crate");
        }
    }
}

function breakBlocks(g, b) {
    if (player.joints.length < 6 && grappleTarget != null) {
        b.remove();
        grappleTarget.collider = "k";
        grappleTarget.returning = true;
        crushSound.play(0, 0.9, 0.06, 0, 0.9);
        crateParticle(g.x, g.y, "crate");
    }
}

function Grapple() {
    if (player.joints.length < 6 && grappleTarget != null) {
        crushSound.play(0, random(1.9, 2.05), 0.06, 0, 0.09);
        world.gravity.y = 0;
        player.maxWalkSpeed = 2.5;
        player.vel.y = 0;
        player.vel.x *= 0.5;
        let x = grappleTarget.x;
        let y = grappleTarget.y;
        grappleTarget.remove();
        grappleTarget = null;
        grapple = new Sprite(x, y, 12);
        grapple.startY = y;
        grapple.spriteSheet = tileSet;
        grapple.addImg({
            w: 8,
            h: 8,
            row: 13,
            col: 0
        });
        grapple.mass = 0.0;
        grapple.collider = "static";
        grapple.rotation = random(-30, 30);
        if (player.mirror.x == true) {
            grapple.mirror.x = true;
        }
        r = new DistanceJoint(player, grapple);
        r.springiness = 1;
        r.visible = true;
        r.layer = 10;
        r.strokeColor = color(255);
        r.strokeWeight = 5;
        setTimeout(() => {
            grapple.remove();
            player.maxWalkSpeed = 1.4;
            world.gravity.y = 8.2;
            r.remove();
        }, 1250);
    }
}

function handleGrapple() {
    if (
        grappleTarget == null &&
        (kb.presses("enter") || mouse.presses() || contro.presses("b")) &&
        player.currentState != player.states.CLIMB
    ) {
        setTimeout(() => {
            player.maxWalkSpeed = 1.4;
            world.gravity.y = 8.2;
        }, 1250);
        if (player.joints.length > 5) {
            grapple.remove();
            player.maxWalkSpeed = 1.4;
            world.gravity.y = 8.2;
            r.remove();
            world.gravity.y = 8.2;
        } else {
            if (player.mirror.x == true) {
                grappleTarget = new Sprite(player.x - 8, player.y - 1, 10, 8);
            } else {
                grappleTarget = new Sprite(player.x + 8, player.y - 1, 10, 8);
            }
            swishSound.play(0, random(0.9, 1.05), 0.025, 0, 1);
            grappleTarget.returning = false;
            grappleTarget.spriteSheet = tileSet;
            grappleTarget.addImg({
                w: 8,
                h: 8,
                row: 13,
                col: 0
            });
            if (player.mirror.x == true) {
                grappleTarget.mirror.x = true;
            }
            grappleTarget.startX = grappleTarget.x;
            grappleTarget.startY = grappleTarget.y;
            grappleTarget.movingUp = false;
            if (player.mirror.x == false) {
                target = createVector(player.x + 100, player.y);
            } else {
                target = createVector(player.x - 100, player.y);
            }
            // if aiming up with the control stick and not moving left or right 
            if (
                kb.pressing("up") || contro.pressing("up") ||
                (contro.leftStick.y < -0.9 && contro.leftStick.x < 0.25 && contro.leftStick.x > -0.25)) {
                target = createVector(player.x, player.y - 100);
                grappleTarget.movingUp = true;
                grappleTarget.x = player.x;
            }
            grappleTarget.moveTowards(target, 0.05);
            grappleTarget.collider = "d";
            grappleTarget.overlaps(allSprites);
            grappleTarget.overlaps(crate, breakCrate);
            grappleTarget.overlaps(breakingGround, breakBlocks);
            grappleTarget.overlaps(grappleAbleBlocks, Grapple);
        }
    }
    if (grappleTarget != null) {
        if (!grappleTarget.movingUp) {
            grappleTarget.vel.y = 0;
            if (!grappleTarget.returning) {
                grappleTarget.y = grappleTarget.startY;
            }
        } else {
            grappleTarget.vel.x = 0;
        }
        let d;
        if (!grappleTarget.returning) {
            d = dist(
                grappleTarget.x,
                grappleTarget.y,
                grappleTarget.startX,
                grappleTarget.startY
            );
        }
        if (d > 72) {
            grappleTarget.returning = true;
            grappleTarget.collider = "k";
        }
        let angle = atan2(grappleTarget.y - player.y, grappleTarget.x - player.x);

        if (grappleTarget.returning) {
            grappleTarget.mirror.x = true;
            pickAxeParticle(grappleTarget.x, grappleTarget.y, angle, true);
            grappleTarget.rotation = angle;
            d = dist(grappleTarget.x, grappleTarget.y, player.x, player.y);
            target = createVector(player.x, player.y);
            grappleTarget.moveTo(target, 3);
        } else {
            pickAxeParticle(grappleTarget.x, grappleTarget.y, angle, false);
        }
        if (
            grappleTarget.returning &&
            d < 5 &&
            player.currentState != player.states.CLIMB &&
            player.isOnGround
        ) {
            grappleTarget.remove();
            grappleTarget = null;
        }
    }
    if (player.joints.length > 5) {
        let d = dist(player.x, player.y, grapple.x, grapple.y);
        if (
            d < 14 ||
            (player.rightClimbSensor.overlapping(grappleAbleBlocks) &&
                player.mirror.x == false) ||
            (player.leftClimbSensor.overlapping(grappleAbleBlocks) &&
                player.mirror.x == true)
        ) {
            grapple.remove();
            r.remove();
            player.vel.y = 0;
            player.maxWalkSpeed = 1.4;
            world.gravity.y = 8.2;
        }
    }
    if (player.joints.length > 5) {
        world.gravity = 0;
        player.vel.y = -1;
        let target = createVector(grapple.x, grapple.startY - 3);
        player.moveTo(target, 3);
        playerParticle(player.x, player.y, 0, player.mirror.x);
    }
}

function handleSounds(prevState) {
    if (
        prevState == player.states.FALLDOWN &&
        player.currentState != player.states.FALLDOWN &&
        player.currentState != player.states.CLIMB
    ) {
        if (player.isInWater) {
            // splashSound.play(0, random(0.3, 0.5), 0.2, 0, 1);
        } else {
            landingSound.play(0, random(0.9, 1.1), 0.2, 0, 1);
        }
        // shakeScreen(0.1, 0.1)
    }
}

function createPlayer(x, y) {
    ////////// create player //////////
    player = new Sprite(x, y, 5, 8);
    //player.debug = true;
    player.bottomHalf = player.addCollider(0, 4, 6);
    player.layer = 2;
    player.rotationLock = true;
    ////////// player animations //////////
    player.spriteSheet = playerSprite;
    player.addAnis({
        idle: {
            row: 0,
            col: 8,
            frames: 4,
            frameSize: [16, 16],
            frameDelay: 8
        },
        walk: {
            row: 0,
            col: 1,
            frames: 6,
            frameSize: [16, 16],
            frameDelay: 6
        },
        jump: {
            row: 0,
            col: 14,
            frames: 1,
            frameSize: [16, 16],
            frameDelay: 8
        },
        fall: {
            row: 0,
            col: 15,
            frames: 2,
            frameSize: [16, 16],
            frameDelay: 8,
        },
        death: {
            row: 0,
            col: 15,
            frames: 1,
            frameSize: [16, 16],
            frameDelay: 8
        },
        climb_idle: {
            row: 0,
            col: 18,
            frames: 4,
            frameSize: [16, 16],
            frameDelay: 8,
        },
        climb: {
            row: 0,
            col: 23,
            frames: 4,
            frameSize: [16, 16],
            frameDelay: 9
        },
        pushing: {
            row: 0,
            col: 28,
            frames: 4,
            frameSize: [16, 16],
            frameDelay: 10,
        },
    });
    player.ani = "idle";
    player.overlaps(deathBox, killPlayer);
    player.overlaps(playerSpawnerVerticle, setSpawnPoint);
    player.topHalf = player.addCollider(0, -2, 5);
    player.friction = 0;
    player.bounciness = 0;
    ////////// player sensors //////////
    player.groundSensor = new Sprite(x, y + 7, 3, 7);
    player.groundSensor.visible = false;
    player.groundSensor.mass = 0.01;
    player.groundSensor.overlaps(allSprites);
    j = new GlueJoint(player, player.groundSensor);
    j.visible = false;
    player.leftClimbSensor = new Sprite(player.x - 3.5, player.y + 2, 3, 4.5);
    player.leftClimbSensor.visible = false;
    player.leftClimbSensor.mass = 0.0;
    player.leftClimbSensor.overlaps(allSprites);
    j = new GlueJoint(player, player.leftClimbSensor);
    j.visible = false;
    player.rightClimbSensor = new Sprite(player.x + 3.5, player.y + 2, 3, 4.5);
    player.rightClimbSensor.visible = false;
    player.rightClimbSensor.mass = 0.0;
    player.rightClimbSensor.overlaps(allSprites);
    j = new GlueJoint(player, player.rightClimbSensor);
    j.visible = false;
    player.headSensor = new Sprite(player.x, player.y - 3.5, 3, 5);
    player.headSensor.visible = false;
    player.headSensor.mass = 0.0;
    player.headSensor.overlaps(allSprites);
    j = new GlueJoint(player, player.headSensor);
    j.visible = false;
    player.cornerSensor = new Sprite(player.x, player.y + 8, 8, 2);
    player.cornerSensor.visible = false;
    player.cornerSensor.mass = 0.0;
    player.cornerSensor.overlaps(allSprites);
    j = new GlueJoint(player, player.cornerSensor);
    j.visible = false;
    ////////// player variables //////////
    player.states = {
        IDLE: 0,
        WALK: 1,
        JUMP: 2,
        FALLDOWN: 3,
        FALLUP: 4,
        CLIMB: 5,
    };
    player.currentState = player.states.IDLE;
    player.prevState = player.states.IDLE;
    player.isOnGround = false;
    player.jumpForce = 2.85;
    player.maxjumpSpeed = 3.4;
    player.maxfallSpeed = 10;
    player.walkSpeed = 0.1;
    player.maxWalkSpeed = 1.23;
    player.walkBreaking = 0.65;
    player.walkAcceleration = 0.08;
    player.slideFriction = 0.08;
    player.airAcceleration = 0.075;
    player.airBreaking = 0.85;
    player.climbToggle = false;
    //////////
    player.jumpBuffer = false;
    player.coyoteBuffer = false;
    //////////
    player.inputLeft = false;
    player.inputRight = false;
    player.inputUp = false;
    player.inputDown = false;
    player.inputJump = false;
    //////////
    player.spawnDirection = false;
    player.setAni = "idle";
}

function movePlayer() {
    ////////// detect input //////////
    if (kb.presses("space") || contro.presses("a")) {
        player.inputJump = true;
        if (player.isInWater) {
            splashSound.play(0, random(0.7, 1.5), 0.2, 0, 1);
        }
    }
    if (
        kb.pressing("left") ||
        contro.pressing("left") ||
        contro.leftStick.x < -0.25
    ) {
        player.inputLeft = true;
    } else {
        player.inputLeft = false;
    }
    if (
        kb.pressing("right") ||
        contro.pressing("right") ||
        contro.leftStick.x > 0.25
    ) {
        player.inputRight = true;
    } else {
        player.inputRight = false;
    }
    ////////// Climb Check //////////
    if (
        (player.rightClimbSensor.overlapping(ground) ||
            player.leftClimbSensor.overlapping(ground)) &&
        player.climbToggle == false
    ) {
        if (kb.pressing("shift") || contro.pressing("r") || contro.pressing("rt")) {
            player.currentState = player.states.CLIMB;
            player.walkAcceleration = 0.07;
            if (
                player.rightClimbSensor.overlapping(ground) &&
                player.mirror.x == true
            ) {
                player.mirror.x = false;
            } else if (
                player.leftClimbSensor.overlapping(ground) &&
                player.mirror.x == false
            ) {
                player.mirror.x = true;
            }
            player.climbToggle = true;
        }
    }
    ////////// buffer check //////////
    if (player.inputJump && player.currentState == player.states.FALLDOWN) {
        player.jumpBuffer = true;
        setTimeout(() => {
            player.jumpBuffer = false;
        }, 150);
    }
    ////////// ground check //////////
    if (player.overlapping(water)) {
        if (!player.isInWater && !player.inputJump && player.vel.y > 2) {
            splashSound.play(0, random(0.7, 1.5), 0.2, 0, 1);
        }
        player.isInWater = true;
    } else {
        player.isInWater = false;
    }
    if (
        player.groundSensor.overlapping(ground) ||
        player.groundSensor.overlapping(oneWayPlatform) ||
        player.groundSensor.overlapping(movingPlatform)
    ) {
        if (player.vel.y >= 0) {
            player.vel.y *= player.walkBreaking;
            player.isOnGround = true;
            player.coyoteBuffer = false;
            player.climbToggle = false;
        }
    } else {
        player.isOnGround = false;
    }
    ////////// state conditions //////////
    if (player.currentState !== player.states.CLIMB) {
        if (player.inputLeft) {
            player.mirror.x = true;
            player.currentState = player.states.WALK;
        } else if (player.inputRight) {
            player.mirror.x = false;
            player.currentState = player.states.WALK;
        } else if (player.isOnGround) {
            player.currentState = player.states.IDLE;
        }
        if (player.coyoteBuffer && player.inputJump) {
            jumpSound.play(0, 0.5, 0.2);
            player.vel.y = -player.jumpForce;
            player.currentState = player.states.JUMP;
            player.coyoteBuffer = false;
        } else if (player.inputJump || (player.jumpBuffer && player.isOnGround)) {
            player.currentState = player.states.JUMP;
        }
        if (player.isInWater && player.inputJump) {
            player.vel.y = -player.jumpForce;
        }
        if (
            player.vel.y > 0 &&
            player.isOnGround &&
            !player.coyoteBuffer &&
            player.currentState == player.states.WALK
        ) {
            player.coyoteBuffer = true;
            setTimeout(() => {
                player.coyoteBuffer = false;
            }, 250);
        }
        if (!player.isOnGround) {
            if (player.vel.y < 0) {
                player.currentState = player.states.FALLUP;
            } else if (player.vel.y > 0) {
                player.currentState = player.states.FALLDOWN;
            }
        }
        if (
            player.currentState == player.states.FALLDOWN &&
            !player.isOnGround &&
            player.cornerSensor.overlapping(ground) &&
            (kb.pressing("shift") || contro.pressing("r") || contro.pressing("rt"))
        ) {
            player.vel.x = 0;
            if (player.mirror.x == true) {
                player.mirror.x = false;
            } else {
                player.mirror.x = true;
            }
        }
    }
    if (player.currentState != player.states.CLIMB) {
        player.jumpedDuringClimb = false;
    }
    ////////// playerStateMachine //////////
    switch (player.currentState) {
        case player.states.IDLE:
            if (player.vel.y == 0) {
                player.setAni = "idle";
            }
            player.vel.x *= player.walkBreaking;
            break;
        case player.states.WALK:
            dustParticle(player.x, player.y + 7);
            if (
                (player.rightClimbSensor.overlapping(ground) && player.inputRight) ||
                (player.leftClimbSensor.overlapping(ground) && player.inputLeft)
            ) {
                player.setAni = "pushing";
            } else {
                player.setAni = "walk";
            }
            if (player.mirror.x == true) {
                //moveleft
                player.vel.x -= player.walkAcceleration;
                if (player.vel.x > 0) {
                    player.vel.x -= player.slideFriction;
                }
            } else {
                //moveright
                player.vel.x += player.walkAcceleration;
                if (player.vel.x < 0) {
                    player.vel.x += player.slideFriction;
                }
            }
            break;
        case player.states.JUMP:
            for (let i = 0; i < 3; i++) {
                dustParticle(player.x, player.y + 6);
            }
            jumpSound.play(0, 0.5, 0.2);
            player.setAni = "jump";
            if (player.jumpBuffer) {
                player.vel.y = -player.jumpForce * 0.85;
            } else {
                player.vel.y = -player.jumpForce;
            }
            break;
        case player.states.FALLDOWN:
            player.setAni = "fall";
            if (player.inputLeft || player.inputRight) {
                if (player.mirror.x == true) {
                    //moveleft
                    player.vel.x -= player.airAcceleration;
                } else {
                    //moveright
                    player.vel.x += player.airAcceleration;
                }
            } else {
                player.vel.x *= player.airBreaking;
            }
            break;
        case player.states.FALLUP:
            player.setAni = "jump";
            if (player.inputLeft || player.inputRight) {
                if (player.mirror.x == true) {
                    //moveleft
                    player.vel.x -= player.airAcceleration;
                } else {
                    //moveright
                    player.vel.x += player.airAcceleration;
                }
            } else {
                player.vel.x *= player.airBreaking;
            }
            break;
        case player.states.CLIMB:
            player.setAni = "climb_idle";
            player.vel.y = 0;
            player.vel.x = 0;
            world.gravity.y = 0;
            if (kb.presses("space") || contro.presses("a")) {
                player.jumpedDuringClimb = true;
            }
            if (
                player.jumpedDuringClimb &&
                (kb.pressing("space") || contro.pressing("a"))
            ) {
                if (player.mirror.x == false) {
                    player.vel.x = -1.5;
                } else {
                    player.vel.x = 1.5;
                }
                player.canJump = false;
                player.currentState = player.states.JUMP;
                player.climbToggle = false;
                player.vel.y = -player.jumpForce / 2;
                jumpSound.play(0, 0.5, 0.1);
                world.gravity.y = 8.2;
            }
            if (
                kb.released("shift") ||
                contro.released("r") ||
                contro.released("rt") ||
                (!player.rightClimbSensor.overlapping(ground) &&
                    !player.leftClimbSensor.overlapping(ground))
            ) {
                player.currentState = player.states.JUMP;
                player.climbToggle = false;
                //player.setAni = "idle";
                player.canJump = false;
                if (
                    kb.pressing("down") ||
                    contro.pressing("down") ||
                    contro.leftStick.y > 0.25
                ) {
                    player.vel.y = -player.jumpForce / 7;
                } else {
                    player.vel.y = -player.jumpForce / 2.5;
                }
                jumpSound.play(0, 0.5, 0.1);
                if (player.mirror.x == false) {
                    player.vel.x = 0.5;
                } else {
                    player.vel.x = -0.5;
                }
                world.gravity.y = 8.2;
            }
            if (
                (player.rightClimbSensor.overlapping(ground) &&
                    contro.leftStick.x >= -0.5) ||
                (player.leftClimbSensor.overlapping(ground) &&
                    contro.leftStick.x <= 0.5)
            ) {
                if (
                    kb.pressing("up") ||
                    contro.pressing("up") ||
                    contro.leftStick.y < -0.25
                ) {
                    if (!player.headSensor.overlapping(ground)) {
                        player.setAni = "climb";
                        player.vel.y -= 0.7;
                    }
                } else if (
                    kb.pressing("down") ||
                    contro.pressing("down") ||
                    contro.leftStick.y > 0.25
                ) {
                    if (!player.groundSensor.overlapping(ground)) {
                        player.vel.y += 0.8;
                        player.setAni = "climb";
                    }
                }
            }
            break;
    }
    ////////// endOfStateMachine //////////
    ////////// constrain Velocity //////////
    if (player.isInWater) {
        player.maxjumpSpeed = 2;
        player.maxfallSpeed = 0.7
        player.maxWalkSpeed = 0.7;
    } else {
        player.maxjumpSpeed = 3.4;
        player.maxfallSpeed = 10;
        player.maxWalkSpeed = 1.23;
    }
    player.vel.x = constrain(
        player.vel.x,
        -player.maxWalkSpeed,
        player.maxWalkSpeed
    );
    player.vel.y = constrain(
        player.vel.y,
        -player.maxjumpSpeed,
        player.maxfallSpeed
    );
    ////////// reset Input check //////////
    player.inputJump = false;
    ////////// set Animation Last //////////
    player.ani = player.setAni;

    handleSounds(player.prevState);
    player.prevState = player.currentState;
}
