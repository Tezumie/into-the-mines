function setSpawnPoint(pl, spawner) {
    let x2 = pixelsWidth * colIndex + pixelsWidth / 2;
    let y2 = pixelsHeight * colIndex + pixelsHeight / 2;
    if (spawner.x > x2) {
        player.spawnDirection = true;
    } else {
        player.spawnDirection = false;
    }
    playerSpawnX = spawner.x;
    playerSpawnY = spawner.y - 3;
}

function newLevel() {
    world.gravity.y = 0;
    numColumns = 6;
    levelSelector = rowIndex * numColumns + colIndex;
    currentLevel = Levels[levelSelector];
    GenerateLevel();
    generateMovingPlatforms();
    // player.speed = 0;
    // player.vel.x = 0;
    // player.inputLeft = false;
    // player.inputRight = false;
    // player.inputUp = false;
    // player.inputDown = false;
    // player.inputJump = false;
    // player.isOnGround = true;
    // player.currentState = player.states.IDLE;
}

function GenerateLevel() {
    grappleTarget = null;
    world.gravity.y = 8.2;
    for (let i = 0; i < allSprites.length; i++) {
        if (
            allSprites[i] != player &&
            allSprites[i] != player.groundSensor &&
            allSprites[i] != player.stompSensor &&
            allSprites[i] != player.leftClimbSensor &&
            allSprites[i] != player.rightClimbSensor &&
            allSprites[i] != player.headSensor &&
            allSprites[i] != player.cornerSensor
        ) {
            allSpritesGroup.add(allSprites[i]);
        }
    }

    text(`Row: ${rowIndex}, Column: ${colIndex}`, 10, 30);
    let x = colIndex * pixelsWidth + 4;
    let y = rowIndex * pixelsHeight + 4;
    myTileSet = new Tiles(currentLevel.data, x, y, 8, 8);
    myScene.addImg({
        w: pixelsWidth,
        h: pixelsHeight,
        row: rowIndex,
        col: colIndex,
    });
    SceneTileSet = new Tiles(
        ["Q"],
        x + pixelsWidth / 2 - 4,
        y + pixelsHeight / 2 - 4,
        pixelsWidth,
        pixelsHeight
    );
    for (let i = 0; i < breakingPlatform.length; i++) {
        ground.add(breakingPlatform[i]);
        grappleAbleBlocks.add(breakingPlatform[i]);
    }
    for (let i = 0; i < ground.length; i++) {
        grappleAbleBlocks.add(ground[i]);
    }
    for (let i = 0; i < breakingGround.length; i++) {
        ground.add(breakingGround[i]);
    }

    // for (let i = 0; i < crate.length; i++) {
    //   ground.add(crate[i]);
    //   grappleAbleBlocks.add(crate[i]);
    // }


    /////// overlaps ///////
    crate.overlaps(player);
    water.overlaps(player);
    /////// remove old level ///////
    allSpritesGroup.removeAll();
}

function LevelGenerator() {
    Levels.push({
        data: [
            "..g.....................................",
            "..g.....................................",
            "..g.....................................",
            "..g.....................................",
            "...g....................................",
            "...g....................................",
            "...g....................................",
            "...g....................................",
            "....g...................................",
            "....g...................................",
            "....g...................................",
            ".....ggg................................",
            "......gg................................",
            ".....g..................................",
            ".....g..................................",
            ".....g................o.................",
            "....g...................................",
            "....g...................................",
            "....g...................................",
            "....gc.........v............c.....f...v.",
            ".....ggwwwwwgggggggggggggggggggggggggggg",
            ".......gwwwg............................",
            "........ggg.............................",
        ],
        world: "forest",
        level: "1",
    });
    Levels.push({
        data: [
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "...........................gg...........",
            ".................ggg.......gg........v..",
            ".................g..gggg...gg.....gggggg",
            "........gggggg...g.....g...g.g....g.....",
            "...v....g....g...g....g....g.g...g......",
            "gggggggg.....g..g.....g....g.g...ggg....",
            ".............g..g.....g....g.g......g...",
            "............gxxxg.....gxxxxg.gxxxxxxg...",
        ],
        world: "forest",
        level: "2",
    });
    Levels.push({
        data: [
            "....................g.......gggggggggggg",
            "....................g.....gg............",
            "....................g.gggg..............",
            "....................gg..................",
            "....................gg..................",
            ".....................................v..",
            ".................................ggggggg",
            "..............................ggg.......",
            "..............................g.........",
            "..............................gg........",
            "................................g.......",
            "......................gggg......g.......",
            "......................g..g.......g......",
            "......................g..g.......g......",
            "....................gg....g.......gggggg",
            "........ggggppppppppg.....g........bbbbb",
            ".v......g..g........g.....g........bb...",
            "gggg....g..g........g.....g........bb.v.",
            "...g....g..g........g.....g......ggggggg",
            "...gxxxxg..g.........g....g......g......",
            "....gggg...g..........g...g.......g.....",
            "..........g...........g...g........g....",
            "..........gxxxxxxxxxxxg...gxxxxxxxxg....",
        ],
        world: "forest",
        level: "3",
    });
    Levels.push({
        data: [
            "ggggggggg.....g.........................",
            "........g...ggg.........................",
            "........g..gg...........................",
            ".........gg.............................",
            ".........gg.............................",
            ".v.......gg.............................",
            "ggg......gg.............................",
            "...ggg...gg.............................",
            ".....gooogg...ggggg..................v..",
            ".....g...gg..gg..gg.....pppppp.....ggggg",
            ".....g...gg...g.g..................ggg..",
            ".....g...gg...g.g....................g..",
            ".....g...gg...g..g...................g..",
            ".....g...gg...g..g...................g..",
            "ggggggooog....g..g...................gg.",
            ".....g........g..g...................gg.",
            "....cg........g..g....................g.",
            "...ccg........g..g....................g.",
            "gggggg......gg....g...................g.",
            "......gggggg......g...................g.",
            ".................g....................g.",
            ".................g....................g.",
            ".................gxxxxxxxxxxxxxxxxxxxxg.",
        ],
        world: "mine",
        level: "4",
    });
    Levels.push({
        data: [
            ".....g.....gg.....gggg..gggggg.......g..",
            "......ggg.g..ggggg....gg......ggggg.g.gg",
            ".........gg........................gg...",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "..v..................c..................",
            "gggggg..............gg..................",
            "..g.................gg................v.",
            "..g........gg.......ggg.............gggg",
            "..g........gg.......ggg.....gg......g...",
            "..g........gg.......gg......gg.......g..",
            "..g........gg.......gg......gg.......g..",
            "..g.........g.......gg......gg.......g..",
            "..g.........................gg.......g..",
            "..g..................................g..",
            "..g..................................g..",
            "..g..................................g..",
            "..g..................................g..",
            "..g..................................g..",
            "..gxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.",
        ],
        world: "mine",
        level: "5",
    });
    Levels.push({
        data: [
            "ggggg....gggggggg.......................",
            ".....g..g........g.......ggggggg...g....",
            "......gg..........g.....g.......g.g.g...",
            "......gg...........g...g.........gg..g..",
            "......gg...........g.gg..............g..",
            "...................gg................g..",
            "...................gg................g..",
            "...................ggc...............g..",
            ".......ggg.........ggc...............g..",
            ".......g.gxxxxxx...g.gggg............g..",
            "..v...cg..gggggg...g.ggg.............g..",
            "ggggggg..g.........gg...............g...",
            ".........g.........gg...............g...",
            "......gggg.........gg............ggg....",
            "..ggggg.........ooog.............gg.....",
            ".g.................................g....",
            ".g..................................g...",
            ".g..................................g...",
            ".g...........gggggggggg.............g...",
            ".g......v....g........gx............g...",
            ".g....ggggggg..........gxxxxxxxxxggg....",
            "g.....g.................ggggggggg.......",
            "g.....g.................................",
        ],
        world: "mine",
        level: "6",
    });
    Levels.push({
        data: ["........................................"],
        world: "mine",
        level: "7",
    });
    Levels.push({
        data: [

            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "......................................gg",
            "................................ggg..g..",
            "...............................g...gg...",
            "...............................g........",
            "...............................g........",
            "...............................g........",
            "...............................g.....v..",
            "................................gggggggg",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",


        ],
        world: "mine",
        level: "8",
    });
    Levels.push({
        data: [
            "........................................",
            "........................................",
            "........................................",
            "......gggggg....gggggggg................",
            "..gggg......g..g........g...............",
            ".g..........g.g.........gggggggggggggg..",
            ".g..........ggg.......................gg",
            "gg......................................",
            "........................................",
            "........................................",
            "........................................",
            ".....................................v..",
            ".........ppgg....pp.......gg.......ggggg",
            ".v.........gg.............gg.......g....",
            "gggxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxg....",
            "...ggggggggggggggggggggggggggggggggg....",
            ".............ggggggg...gggggg..ggggggggg",
            "...........gg.......g.g......gg.........",
            "..........g..........gg......gg.........",
            "..........g......v...gg......gg.........",
            "..........g.....gg.......gg.............",
            "..........g.....g.g......gg..........v..",
            "..........g.....g..gggggg..ggggggggggggg",


        ],
        world: "mine",
        level: "9",
    });
    Levels.push({
        data: ["........................................",
            "........................................",
            "........................................",
            ".....ggggggggggggggggg....gg............",
            ".gggg.................g..g..g...........",
            "g......................ggg...g..........",
            "g.............................g.........",
            "..............................g.........",
            "..............................g.........",
            "............ggg....ggg........g.........",
            "............g.g....g.g........g..gggg...",
            ".v..........g.g...xg.g........g.g....ggg",
            "gggxxxxxxgggg.g...xg.gwwwwwwgg..g.......",
            "..ggggggg.....g....g.gwwwwwg....g.......",
            "..............g....g.gggggg.....g.......",
            "..............g....g...........g......v.",
            "ggggggggggg...gx...g.......ggggg.....ggg",
            "...........ggggx...gggggggg..........g..",
            ".....................................g..",
            ".....................................g..",
            ".v...................................g..",
            "........ggggggggggggggggggggggggggggg...",
            "gggggggg................................",


        ],
        world: "mine",
        level: "10",
    });
    Levels.push({
        data: [
            "........................................",
            "........................................",
            "..................gggggggg.....gggggg...",
            "....gggg........gg........g...g......g..",
            "...g....ggggg..g...........g..g......ggg",
            "...g.........g.gx..........g..g.........",
            "..g..........g.gx..........g.g..........",
            "..g..........ggx...........g.g.......v..",
            "..g........................g.gx...gggggg",
            "..g........................g.gx...g.....",
            "..g........................g.gx...g.....",
            "gg....................xx...g.g....g.....",
            ".............c........gg...g.g....g.....",
            "............ggggg.....gg....gg.....g....",
            "............g...g.....gg....xx.....g....",
            "...v........g..g......gg...........g....",
            "ggggc.......g..g.....xgg...........g....",
            "....gggx.....ggg.....g.g..........g.....",
            "......gx.............g.g..........g.....",
            "......g..............g..ggxxxxxxxxg.....",
            "......g..............g....gggggggg......",
            "......g..............g..................",
            "......gxxxxxxxxxxxxxxg..................",
        ],
        world: "mine",
        level: "11",
    });

    Levels.push({
        data: [
            "g.....g.................................",
            "g.....g.................................",
            "g.....g......ggggggggggg................",
            "g.....ggggg.g...........gg........gg....",
            "g..........gg.............g......g..gg..",
            "...........gg.............g.ggggg.....g.",
            "...........gg.............gg..........g.",
            ".v...v....................gg..........g.",
            "ggggggg...................gg..........g.",
            "......g...............................g.",
            "......gc...............................g",
            ".......ggggggg.........................g",
            ".............g.....xxx...ggggx.........g",
            ".............gxxxxxgggxxxg.ggx.........g",
            ".ggggggg......ggggg...ggg.g............g",
            "g.......g.................g............g",
            "g........gg.....gggggggggg.............g",
            "g..........ggggg......................cg",
            "g................................ggggggg",
            ".g..c............................g......",
            ".g.cc..c.................v.....gg.......",
            "..gggggggggggggggggg...gggggggg.........",
            "...................g...g................",
        ],
        world: "mine",
        level: "12",
    });
    Levels.push({
        data: [
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
        ],
        world: "mine",
        level: "13",
    });
    Levels.push({
        data: [
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
        ],
        world: "mine",
        level: "14",
    });
    Levels.push({
        data: [
            ".......gggg.....g.......................",
            "...gggg.......v.g.gggg..................",
            "...g........gggg.g....ggggggggg.........",
            "...g........g....g.............g........",
            "...g.........g...g.............g........",
            "...gc........g...g..............g.......",
            "....gggwwwwwwg..g........c......g.......",
            "....gggwwwwwwg..g.......ggg.....g...gggg",
            "...gwwwwwwwwwg.gwwwwwwwwg.gwwwwwgg.gwwww",
            "...gwwwwwwwwwggxwwwwwwwg...gxwwwwwggwwww",
            "...gwwwwwwwwwxxwwwwwwwwg...gxwwwwwwwwwww",
            "...gwwwwwwwwwwwwwwwwwwg....gxwwwwwwwwwww",
            "...gwwwwwwwwwwwwwwwwwwg....gwwwwwwwwwwwx",
            "....ggwwwwwwwwwwwwwwwwgg...gwwwwwwwwwwwx",
            ".....gwwwwwwwwwwwwwwwwwwggggwwwwwwwwwwwx",
            ".....gwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
            ".....gxxwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
            "......ggwwwwwwwwwwwwwwwwwwwwwwxxwwwwwwww",
            ".......gwwwwwwwwwxxwwwwwwwwwwwggxxxxxwvw",
            ".......gwwwwwwwwwggwwwwwwwwwgg..gggggggg",
            ".......gwwwwwwwgg..gwggggggg............",
            "........ggggggg.....g...................",
            "........................................",


        ],
        world: "mine",
        level: "15",
    });
    Levels.push({
        data: [
            "........................................",
            ".....................gggggg.............",
            "....................g......g....gggggg..",
            "..................ggg......g...g......g.",
            "................gg.........g.ggg.......g",
            "......gggggg...g...........gg..........g",
            ".....g......g.g........................g",
            ".....g......g.g........................g",
            ".....gwwwwwwgggwwwwwwwwwwwwwwwwggwwwwwwg",
            ".....gggwwwwxxxwwwwwwwwwwwwwwwg.gwwwwgg.",
            "........gxwwwwwwwwwwwwwwwwwwwwg.gxwwg...",
            "........gxwwwwwwwwwwwwwwggxwwwg.gxwwgg..",
            "......gggxwwwwwwwwwwwwwwggxwwwg.gxwwwwg.",
            ".....gxxxwwwwwwwwwwwwwwwggxwwwg.gxwwwwgg",
            "ggggggwwwwwwwwwwwwwwwwxxggxwwwg.gxwwwwww",
            "wwwwwwwwwwwwwwwwwwwwwggg.gxwwg..gwwwwwww",
            "wwwwwwwwwwwwwwwwwwwwwg...gxwwg..gwwwwwww",
            "wwwwwwwwwwwwwwwwwwxxxg...gwvwg..gwwwwwww",
            "wwwvwwwwwwwxxxxxxxggg....gwwwwg..gwwwwww",
            "gggggggggggggggggg.......gwwvwg..gwwwwww",
            ".........................gwwwwg...gwwwvw",
            ".........................gwwwwg....ggggg",
            ".........................gwwwwg.........",

        ],
        world: "mine",
        level: "16",
    });
    Levels.push({
        data: [
            "..........g.............................",
            "..........g.gg...........ggggggggggggg..",
            "..........gg.ggggggggg..gxx.........gg..",
            "..........gg........ggggg...........gg..",
            "..........g...........ggg...........gg..",
            "..........g..................gg.....gg..",
            "..........g..................gg.....gg..",
            ".....gggggg..................ggx....gggg",
            "....gggggwwwwwwwwwwwwwwwwwwwwggg.....ggg",
            "....gwwwwwwwwwwwwxxwwwwwwwwwwggg.....ggg",
            "....gwwwwwwwwwwwwgggwwwwwwwwxggg......gg",
            "....gwwwwwwwwwwwggggxwwwwwwwxggg......gg",
            "gggggxwwwwwwwwggggggxwwwwwwwxggg......gg",
            "gggggxwwwwwwwwwgggggwwwwwwwwxggg........",
            "wwwwwwwwwwwwwwwwwwwwwwwwwwwwxggg........",
            "wwwwwwwwwwwwwwwwwwwwwwwwwwwwxgg.........",
            "wwwwwwwwwwwwwwwwwwwwwwwwwwwwxgg.........",
            "wwwwwwwwwwwwwwwwwwwwwwwwwwwwggg....v....",
            "wwwwwwwxxwwwwwwwwwwwwwwwwwwwggg...gg....",
            "wwwwwwwggggwwwwwwwwwwgggwwwwgggccgggg..g",
            "wwvwwwwgggggxxxxxxxxggg.ggggggggggggggg.",
            "gggggggggggggggggggggg..................",
            "........................................",




        ],
        world: "mine",
        level: "17",
    });
    Levels.push({
        data: [
            "...................g...g................",
            "...................g...g................",
            "...................g...g................",
            "...................g...g.....ggggggg....",
            ".ggggggg...........g...g..ggg.......g...",
            "g......ggg.........g...g.g..........gg..",
            "........ggg........g...gg.............g.",
            ".........ggg......g...................g.",
            "............g.....g...................g.",
            "............g.....gc.v................g.",
            ".............g....gggggggggggx.........g",
            "..............g.........gg..gx...ppp...g",
            "..............g.......gg..gggx.........g",
            "..............g......g.................g",
            "..............g......g.................g",
            "...............gg...gg.................g",
            ".................ggg...........ppp.....g",
            ".........................ggx...........g",
            "..v.....................gggx...........g",
            "gggg....................gggx...........g",
            "....g....pp.....pp......gggx...........g",
            "....g..................cgggx...........g",
            "....gxxxxxxxxxxxxxxxxggggggxxxxxxxxxxxxg",

        ],
        world: "mine",
        level: "18",
    });
    Levels.push({
        data: [
            ".gggggggg...............................",
            ".g......................................",
            ".g......................................",
            ".g......................................",
            ".g......................................",
            ".g......................................",
            "..ggg...................................",
            "...gg...................................",
            "..g.....................................",
            ".g......................................",
            ".g......................................",
            ".g......................................",
            ".g......................................",
            ".g......................................",
            ".g......................................",
            "..g...................................gg",
            "..g.................................gg..",
            "..g..vcc.......c..f............v..gg....",
            "..gggggggggggggggggggggggggggggggg......",
            "........................................",
            "........................................",
            "........................................",
            "........................................",

        ],
        world: "forest",
        level: "19",
    });
    Levels.push({
        data: [
            "...............................g........",
            "...............................gggg.....",
            "...................................g....",
            "...................................g....",
            "...................................ggggg",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            ".....................................v..",
            "..................................gggggg",
            "..................................g.....",
            ".v................................g.....",
            "gg..............................cg......",
            "..g...............gg........ggggg.......",
            "..g......c.......g.g......gg............",
            "..g.....gg.......g.g......gg............",
            "..g.....gg.......g.g......g.............",
            "..g.....gg.......g.g.......g............",
            "..g.....gg.......g.g.......g............",
            "..gxxxxxggxxxxxxxg.gxxxxxxxg............",

        ],
        world: "forest",
        level: "20",
    });
    Levels.push({
        data: [
            "...............................ggggggggg",
            "...........................gggg.........",
            "....ggggggggggg.........ggg.............",
            "...g...........ggggggggg................",
            "gggg....................................",
            "........................................",
            "........................................",
            ".....................xx..............v..",
            ".....................ggx............gggg",
            "....................g.gx........gggg....",
            "....................g.g.........g.......",
            "..v.................g.g.........ggggg...",
            "gggg................g.g..............g..",
            "...g................g.g..............gg.",
            "gggg................g.g................g",
            "............gggc....ggg.................",
            "............g..gg.......................",
            "............g...g.......................",
            "............g...g.......................",
            "............g...g.......................",
            "...........g....g.......................",
            "...........g....g.......................",
            "xxxxxxxxxxxg....gxxxxxxxxxxxxxxxxxxxxxxx",

        ],
        world: "mine",
        level: "21",
    });
    Levels.push({
        data: [
            "ggggggggggggggggggggggggggwwwwg.........",
            "........................ggwwwwg.........",
            "........................ggwwwwg.........",
            ".....................gg.ggwwwxg.........",
            ".....................g.g.gwwwxg.........",
            ".....................g...gwwwxg.........",
            ".....................gg..gwwwxg.........",
            "...v...cgggggggggwwwwwg..gwwwxg.........",
            "gggggggg.........gwwwwg..gwwwxg.........",
            "..................gwwwggggwwwwgg........",
            "..................gwwwwwwwwwwwwg........",
            "....gggggggggg.....gwwwwwwwwwwwg........",
            "...g.........gg....gxxxxxxxxxxxg........",
            "...g...........g....ggggggggggg.........",
            "...g...........gg..gggggg...............",
            "...g.............gg......gggggggggg.....",
            "...g...............................g....",
            "...g.c.....c........................g...",
            "....ggg...cc...cc...................g...",
            ".......gggggggggggggggggg..v.........g..",
            ".........................gggg........g..",
            "............................g........g..",
            "............................g........g..",


        ],
        world: "mine",
        level: "22",
    });
    Levels.push({
        data: [
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
            "........................................",
        ],
        world: "mine",
        level: "23",
    });
}