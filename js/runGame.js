// Do the loading
function load() {
    loadImage("background2.png", "background");
    loadImage("vgForegroundGrass1.png", "foreground");
    loadImage("bee1.png", "bee");
    loadImage("flower1.png", "flower1");
    loadImage("flower1polinated.png", "flower1pollinated");
}

function startIfReady() {
    // Make sure all the images are ready to load
    for (const key in readiness) {
        while (readiness.key === false) {
            break;
        }
        imagesReady = true;
    }

    if (imagesReady === true) {
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
    // Update (everything that doesn't rely on an event listener ie. time passing)
    update();

    // Render
    render();
}

// Updates state
function update() {
    // Zoomies of various things
    bgXOffset += .5;
    foregroundXOffset += 4;
    for (let i = 0; i < flowers.length; i++) {
        flowers[i].flowerOffset += flowers[i].randomOffset; 
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