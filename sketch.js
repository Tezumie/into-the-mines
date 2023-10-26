let player, playerSpawnX, playerSpawnY;
let pixelsWidth, pixelsHeight, scaleFactor, scaleDifference;
let ground;
let breakingPlatforms, oneWayPlatforms, movingPlatforms;
let grappleTarget;
let r, grapple;
let overlapGroup;
let particles, stoneParticles, crateParticles;
let colIndex = 0;
let rowIndex = 0;
let currentLevel = [];
let levelSelector = 0;
let Levels = [];
let allSpritesGroup;
let myTileSet;
let prevRowIndex = 0;
let prevColIndex = 0;
let breakingGround;
let grappleAbleBlocks;
let playerIsRespawning = true;
let newPlayerTrailSprite, pickAxeTrailSpriteSheet;
let gameState = 'running';
let pauseMenu, buttonDiv, buttons;
// let buttonIDs = ["RESUME", "CONTROLS", "SETTINGS", "QUIT"];
// let buttonsArray = [];
// let buttonImg;
let initiate = true;

function preload() {
	// allSprites.debug = true;
	sceneImg = loadImage('zassets/scene/allLevels.png');
	playerSprite = loadImage('zassets/player/playerSprite.png');
	tileSet = loadImage('zassets/tileset/tileSet.png');
	platformImg = loadImage('zassets/tileset/moving.png');
	bg1 = loadImage('zassets/parallax/BG1.png');
	bg2 = loadImage('zassets/parallax/BG2.png');
	bg3 = loadImage('zassets/parallax/BG3.png');
	bg4 = loadImage('zassets/parallax/BG4.png');
	robotenemySprite = loadImage('zassets/enemy/robot.png');
	campFireImg = loadImage('zassets/objects/campFire.png');
	//// sounds ////
	crushSound = loadSound('zassets/sounds/638639__datasoundsample__smash-and-crumble.wav');
	splashSound = loadSound('zassets/sounds/223806__ctcollab__splash-4.wav');
	dieSound = loadSound('zassets/sounds/387433__blosche__video-game-die.wav');
	jumpSound = loadSound('zassets/sounds/269311__kwahmah-02__swoosh08.wav');
	swishSound = loadSound('zassets/sounds/76417__benboncan__swish.wav');
	landingSound = loadSound('zassets/sounds/514254__jtn191__footstep4.wav');
	breakBridgeSound = loadSound('zassets/sounds/572758__f-m-audio__stepping-on-pile-of-large-stones-1.wav');
	// UI Menu
	buttonImg = loadImage('zassets/menu/buttons/button-export.png');
	invButtonImg = loadImage('zassets/menu/buttons/inventoryButton-export.png');
	invMenuImg = loadImage('zassets/menu/buttons/inventoryMenu-export.png');
	redDashIcon = loadImage('zassets/menu/icons/redDashIcon-export.png');
	blueDashIcon = loadImage('zassets/menu/icons/blueDashIcon-export.png');
}

function setup() {
	// allSprites.pixelPerfect = true;
	createDashSprites(color(148, 229, 218, 130));
	canvasSetup();
	world.gravity.y = 8.2;
	overlapGroup = new Group();
	allSpritesGroup = new Group();
	grappleAbleBlocks = new Group();
	movingTilesGroup = new Group();
	///////
	campFire = new Group();
	campFire.layer = 1;
	campFire.collider = 'static';
	campFire.w = 16;
	campFire.h = 16;
	campFire.tile = 'f';
	campFire.overlaps(allSprites);
	campFire.spriteSheet = campFireImg;
	campFire.addAnis({
		regular: {
			row: 0,
			col: 0,
			frames: 8,
			frameSize: [16, 16],
			frameDelay: 8
		}
	});
	campFire.ani.offset.y = -4;

	///
	water = new Group();
	water.layer = 1;
	water.collider = 'static';
	water.w = 7;
	water.h = 6;
	water.tile = 'w';
	water.spriteSheet = tileSet;
	water.addImg({
		w: 8,
		h: 8,
		row: 1,
		col: 0
	});
	water.visible = false;
	//
	crate = new Group();
	crate.layer = 1;
	crate.collider = 'd';
	crate.w = 7;
	crate.h = 7;
	crate.tile = 'c';
	crate.spriteSheet = tileSet;
	crate.addImg({
		w: 8,
		h: 8,
		row: 11,
		col: 1
	});
	crate.mass = 0.15;
	crate.rotationLock = true;

	///////
	myScene = new Group();
	myScene.layer = 0;
	myScene.w = pixelsWidth;
	myScene.h = pixelsHeight;
	myScene.tile = 'Q';
	myScene.spriteSheet = sceneImg;
	myScene.addImg({
		w: pixelsWidth,
		h: pixelsHeight,
		row: 0,
		col: 0
	});
	myScene.collider = 'none';
	///////
	movingPlatforms = new Group();
	movingPlatforms.layer = 1;
	movingPlatforms.w = 32;
	movingPlatforms.h = 4;
	movingPlatforms.tile = 'm';
	movingPlatforms.spriteSheet = platformImg;
	movingPlatforms.addImg({
		w: 32,
		h: 4,
		row: 0,
		col: 0
	});
	///////
	breakingGround = new Group();
	breakingGround.layer = 1;
	breakingGround.collider = 'static';
	breakingGround.w = 8;
	breakingGround.h = 8;
	breakingGround.tile = 'b';
	breakingGround.spriteSheet = tileSet;
	breakingGround.addImg({
		w: 8,
		h: 8,
		row: 1,
		col: 2
	});
	///////
	playerSpawner = new Group();
	playerSpawner.layer = -1;
	playerSpawner.collider = 'static';
	playerSpawner.w = 1;
	playerSpawner.h = 64;
	playerSpawner.tile = 'v';
	playerSpawner.overlaps(allSprites);
	playerSpawner.visible = false;
	///////
	ground = new Group();
	ground.layer = -1;
	//   ground.layer = 1;
	ground.collider = 'static';
	ground.w = 8;
	ground.h = 8;
	ground.tile = 'g';
	ground.spriteSheet = tileSet;
	ground.addImg({
		w: 8,
		h: 8,
		row: 13,
		col: 6
	});
	// ground.visible = false;
	///////
	deathBox = new Group();
	deathBox.layer = 1;
	deathBox.collider = 'static';
	deathBox.w = 4;
	deathBox.h = 4;
	deathBox.tile = 'x';
	deathBox.visible = false;
	// deathBox.spriteSheet = tileSet;
	// deathBox.addImg({ w: 8, h: 8, row: 12, col: 0 });
	deathBox.overlaps(allSprites);
	deathBox.overlaps(crate, breakCrate);
	///////
	oneWayPlatforms = new Group();
	oneWayPlatforms.collider = 'static';
	oneWayPlatforms.layer = 1;
	oneWayPlatforms.w = 8;
	oneWayPlatforms.h = 8;
	oneWayPlatforms.tile = 'o';
	oneWayPlatforms.spriteSheet = tileSet;
	oneWayPlatforms.addImg({
		w: 8,
		h: 8,
		row: 1,
		col: 3
	});
	///////
	breakingPlatforms = new Group();
	breakingPlatforms.collider = 'static';
	breakingPlatforms.layer = 1;
	breakingPlatforms.w = 8;
	breakingPlatforms.h = 8;
	breakingPlatforms.tile = 'p';
	breakingPlatforms.spriteSheet = tileSet;
	breakingPlatforms.collider = 'static';
	breakingPlatforms.broken = false;
	breakingPlatforms.addAnis({
		regular: {
			row: 0,
			col: 3,
			frames: 1,
			frameSize: [8, 8],
			frameDelay: 8
		},
		cracked: {
			row: 0,
			col: 4,
			frames: 1,
			frameSize: [8, 8],
			frameDelay: 8
		},
		none: {
			row: 0,
			col: 5,
			frames: 1,
			frameSize: [8, 8],
			frameDelay: 8
		}
	});
	particles = new Group();
	particles.layer = 1;
	particles.life = 250;
	particles.direction = () => random(0, 360);
	particles.speed = () => random(0.01, 0.05);

	crateParticles = new particles.Group();
	crateParticles.stroke = () => color(83 + random(-10, 10), 53 + random(-10, 10), 35 + random(-10, 10));
	crateParticles.color = () => color(83 + random(-10, 10), 53 + random(-10, 10), 35 + random(-10, 10));
	crateParticles.w = () => random(0, 2);
	crateParticles.h = () => random(0, 2);

	stoneParticles = new particles.Group();
	stoneParticles.stroke = () => color(173 + random(-10, 10), 161 + random(-10, 10), 152 + random(-10, 10));
	stoneParticles.color = () => color(173 + random(-10, 10), 161 + random(-10, 10), 152 + random(-10, 10));
	stoneParticles.w = () => random(0, 2.5);
	stoneParticles.h = () => random(0, 2.5);

	///////
	weather = new Dust(30, 1.25 * scaleFactor, 0.15, createVector(-5, 2.75));

	playerSpawnX = 110;
	playerSpawnY = 152;

	//   playerSpawnX = 590;
	//   playerSpawnY =660;

	createPlayer(playerSpawnX, playerSpawnY);
	LevelGenerator();
	currentLevel = Levels[levelSelector];
	newLevel();
	///////

	createPauseMenu();
	createInventory();
}

function draw() {
	// renderStats();

	if (kb.pressed('p') || contro.pressed('start')) {
		if (gameState === 'running') {
			pauseGame();
		} else if (gameState === 'paused') {
			unPause();
		}
	}
	if (kb.presses('backspace') || contro.pressed('select')) {
		let fs = fullscreen();
		fullscreen(!fs);
		mouse.visible = false;
	}
	if (mouse.presses()) mouse.visible = true;

	if (gameState === 'running') {
		colIndex = floor(player.x / pixelsWidth);
		rowIndex = floor(player.y / pixelsHeight);
		if (rowIndex !== prevRowIndex) {
			prevRowIndex = rowIndex;
			newLevel();
		}
		if (colIndex !== prevColIndex) {
			prevColIndex = colIndex;
			newLevel();
		}
		background(0, 17, 134);
		parallaxBackground(bg1, bg2, bg3, bg4);
		if (currentLevel.world == 'forest') {
			//   background(0, 17, 34, 70);
		} else if (currentLevel.world == 'mine') {
			background(0, 17, 34, 70);
		}
		movePlayer();
		if (movingPlatforms) {
			movePlatforms();
		}
		handleGrapple();
		CameraController();
		handlePlatforms();
		weather.draw();
	} else {
		parallaxBackground(bg1, bg2, bg3, bg4);
		handleControllerDown();
	}
	if (initiate) {
		pauseGame();
		initiate = false;
	}
}
