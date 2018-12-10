// Do the loading
function load() {
    loadImage("background2.png", "background");
    loadImage("vgForegroundGrass1.png", "foreground");
    loadImage("bee1.png", "bee");
}

function startIfReady() {
    
    // Start listening for imput (Add event listeners only once);
    addListeners();

    // put tick on an interval
    setInterval(tick, 15);

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
    // bg state
    bgXOffset += 1;
    foregroundXOffset += 4;
}

function render() {
    // MUST RENDER IN ORDER OF LAYERS
    renderBackground();
    renderForeground();
    renderBee();
}

/* ---------------- Helper Function ---------------- */

function loadImage(location, keyName) {
    // Creates background image
    readiness[keyName] = false;
    var img = document.createElement("img");
    img.src = `./assets/${location}`;
    images[keyName] = img;

    // When the images loads, store that it is DTR (down to render)
    img.onload = function () {
        readiness[keyName] = true;
    };
}

/* ---------------- Background ---------------- */


function renderBackground() {
    // establish x coordinates and the "stepper" which is when the animation loops
    var stepper = bgXOffset % BG_WIDTH;
    var x1 = 0 - stepper;
    var x2 = BG_WIDTH - stepper;

    // Draw dem backgrounds
    ctx.drawImage(images.background, x1, 0, BG_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(images.background, x2, 0, BG_WIDTH, CANVAS_HEIGHT);
}

/* ---------------- Foreground ---------------- */

function renderForeground() {
    var stepper = foregroundXOffset % BG_WIDTH; //I can use this bc they are the same width

    var x1 = 0 - stepper;
    var x2 = BG_WIDTH - stepper;

    // Draw dem foregrounds
    ctx.drawImage(images.foreground, x1, 0, BG_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(images.foreground, x2, 0, BG_WIDTH, CANVAS_HEIGHT);
}

/* ---------------- Bee ---------------- */

function renderBee() {

    // Draw the bee
    ctx.drawImage(images.bee, beeX, beeY, 60, 50);
}

/* ---------------- Bee ---------------- */

function addListeners() {
    // add event listeners for keyboard
    document.addEventListener("keydown", keyDownHandler, false);

    // add event listeners for touch : MOBILE FUTURE DEVELOPMENT

}

function keyDownHandler(e) {
    // Up Arrow
    if(e.keyCode == 38){
        console.log("Up clicked");
        beeY -= 10;
    }

    // Right Arrow
    if(e.keyCode == 39){
        console.log("Right clicked");
        beeX += 15;
    }

    // Down Arrow
    if(e.keyCode == 40){
        console.log("Down clicked");
        beeY += 15;
    }

    // Left Arrow
    if(e.keyCode == 37){
        console.log("Left clicked");
        beeX -= 15;
    }
}
