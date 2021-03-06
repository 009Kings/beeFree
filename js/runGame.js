// Do the loading
function load() {
    loadImage("background2.png", "background");
    loadImage("vgForegroundGrass1.png", "foreground");
    loadImage("bee1.png", "bee");
    loadImage("flower1.png", "flower1");
    loadImage("flower1polinated.png", "flower1pollinated");
    loadImage("wasp.png", "wasp");
    loadImage("deadBee.png", "deadBee");
    loadImage("mountains.png", "mountains");
}

/* -------- Start the game! Featuring modial -------- */

function start() {
    addStartListeners()
}

function init() {
    return gameState = {
        gravity: 1,
        score: 0,
        mode: "Regular Mode",
        gameRunning: true,
        bee: {
            beePause: false,
            x: canvasWidth/14,
            y: (canvasHeight*3)/7,
            height: 50,
            width: 60,
            wings: 10,
            velocity: 3.5,
            beeMoveUp: false,
            beeMoveDown: false,
            beeMoveLeft: false,
            beeMoveRight: false,
            hasStinger: true, // stinger false means bee is dead
            typeOfDeath: "none",
        },
        pauseMS: 300,
        flowers: [],
        flowerWidth: canvasWidth/14,
        flowerHeight: canvasHeight,
        flowerNum: 0,
        maxFlowers: 30,
        flowerFreqMin: 1500,
        flowerFreqMax: 500,
        enemies: {
            wasps: {
                inGame: true,
                width: 80,
                height: 70,
                wingHeight: 10,
                freqMin: 7000,
                freqMax: 3000,
                maxWasps: 10,
                waspsNum: [],
            },
            dasBoot: {
                inGame: false,
            },
            windGusts: {
                inGame: false,
            },
            wateringCan: {
                inGame: false,
            }
        },
    }
}

function startIfReady() {
    // Make sure all the images are ready to load
    for (const key in readiness) {
        if (readiness.key === false) {
            break;
        }
        imagesReady = true;
    }

    if (imagesReady) {
        // Start listening for imput (Add event listeners only once);
        addListeners();

        // put tick on an interval
        setInterval(tick, FPS);
        
        // Create flowers at an interval determined by generate flower
        generateFlower();

        //WASPS
        if (gameState.enemies.wasps.inGame === true) {
            generateWasps();
        }
    }  
}

// What happens every "frame"
function tick() {
    if (gameState.gameRunning && document.hasFocus()) {
        // Update (everything that doesn't rely on an event listener ie. time passing)
        update();

        // Render
        render();
    }
}

// Updates state
function update() {
    // Zoomies of various things
    //Scenery
    mtnOffset += .5;
    bgXOffset += .75;
    foregroundXOffset += 4;

    // Flowers
    for (let i = 0; i < gameState.flowers.length; i++) {
        gameState.flowers[i].flowerOffset += gameState.flowers[i].randomOffset; 
    } 

    // WASPS
    let waspArray = gameState.enemies.wasps.waspsNum;
    for (let i = 0; i < waspArray.length; i++) {
        waspArray[i].offsetBase += waspArray[i].randomOffset;
    }

    moveBee(); 

    checkForFlowerCollision();
    checkWaspCollision();
}

function render() {
    // MUST RENDER IN ORDER OF LAYERS
    renderScene(mtnOffset, "mountains");
    renderScene(bgXOffset, "background");
    renderFlower();
    renderBee();
    renderWasp();
    renderScene(foregroundXOffset, "foreground");
    renderScore();
}

function gameOver() {
    //Get Game-Over Modal and reinstate the button!
    let GOModal = document.getElementById("GO-modal");
    GOModal.classList.remove("hidden");
    document.getElementById("start").classList.remove("hidden");
    // Store the Score
    storeScore();
    // Game Change
    gameState.mode = "Game Over";
}
