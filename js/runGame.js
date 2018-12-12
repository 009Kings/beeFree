// Do the loading
function load() {
    loadImage("background2.png", "background");
    loadImage("vgForegroundGrass1.png", "foreground");
    loadImage("bee1.png", "bee");
    loadImage("flower1.png", "flower1");
    loadImage("flower1polinated.png", "flower1pollinated");
}

function init() {
    return gameState = {
        bee: {
            x: 50,
            y: 150,
            height: 50,
            width: 60,
            wings: 10,
            velocity: 3.5,
            beeMoveUp: false,
            beeMoveDown: false,
            beeMoveLeft: false,
            beeMoveRight: false,
            stinger: true, // stinger false means bee is dead
        },
        score: 0,
        gameRunning: false,
        flowers: [],
        flowerNum: 0,
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
        // Initialise the board
        init();
        
        // Start listening for imput (Add event listeners only once);
        addListeners();

        // put tick on an interval
        setInterval(tick, FPS);
        
        // Create flowers at an interval determined by generate flower
        generateFlower();

    }  
}

// What happens every "frame"
function tick() {
    if (gameState.gameRunning) {
        // Update (everything that doesn't rely on an event listener ie. time passing)
        update();

        // Render
        render();
    }
}

// Updates state
function update() {
    // Zoomies of various things
    bgXOffset += .5;
    foregroundXOffset += 4;
    for (let i = 0; i < gameState.flowers.length; i++) {
        gameState.flowers[i].flowerOffset += gameState.flowers[i].randomOffset; 
    } 
    moveBee(); 

    checkForFlowerCollision();
}

function render() {
    // MUST RENDER IN ORDER OF LAYERS
    renderBackground();
    renderFlower();
    renderBee();
    renderForeground();
    renderScore();
}

