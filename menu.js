// let buttonIDs = ["RESUME", "INVENTORY", "CONTROLS", "SETTINGS", "QUIT"];
let buttonIDs = ["RESUME"];
let buttonsArray = [];
let buttonImg;
let inventoryDiv; // New variable to store the inventory
let backgroundDiv;
let isInventoryOpen = false;
let inventoryItems = [];
let inventoryCols = 5;
// Simulated inventory items
//let items = ["Item 1", "Item 2", "Item 3"];
let redDashIcon;
let items = [];

function pauseGame() {
    pauseMenu.style("display", "flex");
    gameState = "paused";
    allSprites.sleeping = true;
    player.ani.stop();
    buttonsArray[0].elt.focus();
    if (grappleTarget != null) {
        grappleTarget.returning = true;
    }
}

function unPause() {
    pauseMenu.style("display", "none");
    gameState = "running";
    allSprites.sleeping = false;
    player.ani.play();
}

function createPauseMenu() {
    pauseMenu = createDiv(" ");
    pauseMenu.id("pause-menu");
    pauseMenu.style("display", "flex");
    pauseMenu.style("flex-direction", "column");
    pauseMenu.style("align-items", "center");
    pauseMenu.style("background-color", color(0, 7, 14, 225));
    pauseMenu.style("border", "2px solid white");
    pauseMenu.style("padding", "20px");
    pauseMenu.style("position", "absolute");
    pauseMenu.style("top", "50%");
    pauseMenu.style("left", "50%");
    pauseMenu.style("transform", "translate(-50%, -50%)");

    // Create a new div to show the pause button information
    let pauseInfo = createDiv("Press 'Start' or 'P' to resume");
    pauseInfo.style("font-family", "Arial, sans-serif");
    pauseInfo.style("color", color(255));
    pauseInfo.style("font-weight", "bold");
    pauseInfo.style("font-size", "16px");
    pauseInfo.style("margin-bottom", "20px");
    pauseInfo.parent(pauseMenu);

    let controlsInfo = createDiv(`Controller Controls:<br>
A Button: Jump / Action<br>
B Button: Throw Pickaxe<br>
Right Bumper (RB) / RT: Hold to Climb<br>
Left Stick / D-pad: Move character<br>
Select Button: Fullscreen<br>
Start Button: Pause / Menu<br><br>
Keyboard Controls:<br>
Spacebar: Jump / Action<br>
Enter / Mouse Left: Throw Pickaxe<br>
W / ArrowUp: Aim up<br>
A / ArrowLeft: Move Left<br>
S / ArrowDown: Dropdown<br>
D / ArrowRight: Move Right<br>
Shift: Hold to Climb<br>
Backspace: Fullscreen<br>
P: Pause / Menu`);
    controlsInfo.style("font-family", "Arial, sans-serif");
    controlsInfo.style("color", color(255));
    controlsInfo.style("font-size", "14px");
    controlsInfo.style("border-top", "1px solid white");
    controlsInfo.style("padding-top", "10px");
    controlsInfo.style("margin-bottom", "20px");
    controlsInfo.parent(pauseMenu);

    controlsInfo.style("margin-bottom", "20px");
    controlsInfo.parent(pauseMenu);
    let buttonDiv = createDiv("");
    buttonDiv.id("buttonContainer");
    buttonDiv.style("display", "flex");
    buttonDiv.style("flex-direction", "column");
    buttonDiv.style("justify-content", "center");
    buttonDiv.style("align-items", "center");
    buttonDiv.style("grid-gap", "24px");
    buttonDiv.style("margin-top", "10px");
    buttonDiv.style("width", "100%");
    buttonDiv.parent(pauseMenu);
    buttonDiv.parent(pauseMenu);
    for (let i = 0; i < buttonIDs.length; i++) {
        let buttons = createButton(buttonIDs[i]);
        buttons.style("height", "31px");
        buttons.style("border", "1px solid white");
        buttons.style("padding", "10px");
        buttons.style("text-align", "center");
        buttons.style("background-color", color(0, 7, 14));
        buttons.style("font-family", "Arial, sans-serif");
        buttons.style("color", color(255));
        buttons.style("font-weight", "bold");
        buttons.style("font-size", "12px");
        buttons.style("cursor", "pointer");
        buttons.parent(buttonDiv);
        buttons.mouseClicked(() => {
            if (i == 0) {
                unPause();
            } else if (i == 1) {
                openInventory();
                isInventoryOpen = true;
            }
        });
        if (i === 0) {
            buttons.elt.focus();
        }
        buttonsArray.push(buttons);
    }
    buttonsArray.forEach((button) => {
        button.elt.addEventListener("focus", () => {
            button.style("transform", "scale(1.05)");
            button.style("filter", "brightness(1.2)");
            button.style("cursor", "pointer");
            button.style("outline", "none");
        });
        button.elt.addEventListener("blur", () => {
            button.style("transform", "scale(1.0)");
            button.style("filter", "brightness(0.9)");
            button.style("cursor", "default");
            button.style("outline", "none");
        });
    });
}

function createInventory() {
    items = [{
            name: "red trail",
            icon: redDashIcon,
            description: "make your trail red",
            onClick: () => {
                console.log("Red trail clicked!");
                createDashSprites(color(199, 60, 61, 130));
            },
        },
        {
            name: "blue trail",
            icon: blueDashIcon,
            description: "make your trail blue",
            onClick: () => {
                console.log("blue trail clicked!");
                createDashSprites(color(148, 229, 218, 130));
            },
        },
        // Add more items with their respective onClick functions...
    ];
    for (let i = 0; i < 28; i++) {
        items.push({
            name: "red trail",
            icon: invButtonImg,
            description: "make your trail red",
            onClick: () => {
                console.log("Red trail clicked!");
                createDashSprites(color(199, 60, 61, 130));
            },
        });
    }

    let maxColumns = inventoryCols;
    let maxRows = 4;
    let totalCells = maxColumns * maxRows;

    backgroundDiv = createDiv("");
    backgroundDiv.id("backgroundDiv");
    backgroundDiv.style("position", "absolute");
    backgroundDiv.style("top", "50%");
    backgroundDiv.style("left", "50%");
    backgroundDiv.style("transform", "translate(-50%, -50%)");
    backgroundDiv.style("display", "none");
    backgroundDiv.style("background-color", color(0));
    backgroundDiv.style("padding", "0px");
    backgroundDiv.style("overflow-y", "auto");
    backgroundDiv.style("height", pixelsHeight + 151 + "px");
    backgroundDiv.style("width", maxColumns * 103 + "px");
    backgroundDiv.style("scrollbar-width", "thin");
    backgroundDiv.style("scrollbar-color", "rgb(53,52,52) #000000");
    backgroundDiv.style("padding-top", "25px");
    backgroundDiv.style("padding-bottom", "20px");
    backgroundDiv.style("padding-left", "25px");
    backgroundDiv.style("padding-right", "15px");

    backgroundDiv.style(
        "background-image",
        `url(${invMenuImg.canvas.toDataURL()})`
    );
    backgroundDiv.style("background-size", "cover");
    backgroundDiv.style("background-position", "center");
    ///////////////////////////////
    inventoryDiv = createDiv("");
    inventoryDiv.id("inventory");
    inventoryDiv.style("display", "grid");
    inventoryDiv.style(
        "grid-template-columns",
        "repeat(" + maxColumns + ", 1fr)"
    );
    inventoryDiv.style("grid-gap", "20px");
    inventoryDiv.style("position", "absolute");
    inventoryDiv.style("top", "50%");
    inventoryDiv.style("left", "50%");
    inventoryDiv.style("transform", "translate(-50%, -50%)");
    inventoryDiv.style("display", "none");
    inventoryDiv.style("background-color", color(0));
    inventoryDiv.style("padding", "00px");
    inventoryDiv.style("overflow-y", "auto");
    inventoryDiv.style("height", pixelsHeight + 118 + "px");
    inventoryDiv.style("width", maxColumns * 90 + "px");
    inventoryDiv.style("scrollbar-width", "thin");
    inventoryDiv.style("scrollbar-color", "rgb(0,0,0,0) rgb(0,0,0,0)");
    inventoryDiv.style("padding-top", "25px");
    inventoryDiv.style("padding-bottom", "20px");
    inventoryDiv.style("padding-left", "25px");
    inventoryDiv.style("padding-right", "0px");
    inventoryDiv.style("background-color", color(0, 0));

    // inventoryDiv.style("aspect-ratio", "1/1");
    let closeButton = createButton("X");
    closeButton.style("position", "absolute");
    closeButton.style("top", "5px");
    closeButton.style("right", "15px");
    closeButton.style("background-color", "rgb(0,0,0,0)");
    closeButton.style("color", "rgb(0,0,0,0)");
    closeButton.style("font-size", "20px");
    closeButton.style("border", "none");
    closeButton.style("cursor", "pointer");
    closeButton.parent(backgroundDiv);
    closeButton.mouseClicked(closeInventory);
    for (let i = 0; i < items.length; i++) {
        let item = items[i].name;
        let icon = items[i].icon;
        let itemButton = createButton("");

        itemButton.style("cursor", "pointer");
        itemButton.style("height", "50px");
        itemButton.style("width", "50px");
        //itemButton.style("height", "auto");
        itemButton.style("border", "none");
        itemButton.style("padding", "0px 0px");
        itemButton.style("padding-bottom", "0px");
        itemButton.style("padding-top", "0px");
        itemButton.style("text-align", "center");
        itemButton.style("filter", "brightness(0.9)");
        itemButton.style("background-image", `url(${icon.canvas.toDataURL()})`);
        itemButton.style("background-size", "cover");
        itemButton.style("background-position", "center");
        itemButton.style("background-color", "transparent");
        itemButton.style("font-family", "Arial, sans-serif");
        itemButton.style("color", color(40, 82, 63));
        itemButton.style("font-weight", "bold");
        itemButton.style("font-size", "12px");
        itemButton.style("letter-spacing", "2px");
        // itemButton.style(
        //   "text-shadow",
        //   "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
        // );
        itemButton.parent(inventoryDiv);

        itemButton.mouseClicked(() => {
            items[i].onClick();
        });

        itemButton.elt.addEventListener("focus", () => {
            itemButton.style("transform", "scale(1.05)");
            itemButton.style("filter", "brightness(1.2)");
        });
        itemButton.elt.addEventListener("blur", () => {
            itemButton.style("transform", "scale(1.0)");
            itemButton.style("filter", "brightness(0.9)");
        });

        inventoryItems.push(itemButton);
    }
}

function openInventory() {
    inventoryDiv.elt.scrollTop = 0;
    backgroundDiv.style("display", "flex");
    inventoryDiv.style("display", "grid");

    inventoryItems[0].elt.focus();
}

function closeInventory() {
    isInventoryOpen = false;
    backgroundDiv.style("display", "none");
    inventoryDiv.style("display", "none");
    buttonsArray[1].elt.focus();
}

function handleControllerDown() {
    if (isInventoryOpen) {
        handleInventoryControls();
    } else {
        handlePauseMenuControls();
    }
}

function handleInventoryControls() {
    const currentIndex = inventoryItems.findIndex(
        (itemButton) => itemButton.elt === document.activeElement
    );

    if (contro.pressed("left") || kb.pressed("left")) {
        // Handle inventory navigation to the left
        let nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
            nextIndex = inventoryItems.length - 1;
        }
        inventoryItems[nextIndex].elt.focus();
    } else if (contro.pressed("right") || kb.pressed("right")) {
        // Handle inventory navigation to the right
        let nextIndex = currentIndex + 1;
        if (nextIndex >= inventoryItems.length) {
            nextIndex = 0;
        }
        inventoryItems[nextIndex].elt.focus();
    } else if (contro.pressed("down") || kb.pressed("down")) {
        // Handle inventory navigation to the right
        let nextIndex = currentIndex + inventoryCols;
        if (nextIndex >= inventoryItems.length) {
            nextIndex = nextIndex - inventoryItems.length;
            inventoryDiv.elt.scrollTop = 0;
        }
        inventoryItems[nextIndex].elt.focus();
    } else if (contro.pressed("up") || kb.pressed("up")) {
        // Handle inventory navigation to the right
        let nextIndex = currentIndex - inventoryCols;
        if (nextIndex >= inventoryItems.length) {
            nextIndex = 0;
        } else if (nextIndex < 0) {
            nextIndex = inventoryItems.length - abs(nextIndex);
            inventoryDiv.elt.scrollTop = inventoryDiv.elt.scrollHeight;
        }
        inventoryItems[nextIndex].elt.focus();
    } else if (contro.pressing("a")) {
        // Handle click on the focused inventory item
        if (currentIndex !== -1) {
            setTimeout(() => {
                inventoryItems[currentIndex].elt.click();
            }, 150);
            player.canJump = false;
        }
    } else if (contro.pressed("b")) {
        // Handle closing the inventory
        closeInventory();
    }
}

function handlePauseMenuControls() {
    if (
        contro.pressed("left") ||
        kb.pressed("left") ||
        contro.pressed("right") ||
        kb.pressed("right") ||
        contro.pressing("a")
    ) {
        const currentIndex = buttonsArray.findIndex(
            (button) => button.elt === document.activeElement
        );

        if (contro.pressing("a")) {
            setTimeout(() => {
                buttonsArray[currentIndex].elt.click();
            }, 150);
            player.canJump = false;
        } else {
            if (currentIndex !== -1) {
                let nextIndex;
                if (contro.pressed("left") || kb.pressed("left")) {
                    nextIndex = currentIndex - 1;
                    if (nextIndex < 0) {
                        nextIndex = buttonsArray.length - 1;
                    }
                } else if (contro.pressed("right") || kb.pressed("right")) {
                    nextIndex = currentIndex + 1;
                    if (nextIndex >= buttonsArray.length) {
                        nextIndex = 0;
                    }
                }
                buttonsArray[nextIndex].elt.focus();
            }
        }
    } else if (contro.pressed("b")) {
        unPause();
    }
}
