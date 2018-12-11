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
        setInterval(tick, 15);
        
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
        flowers[i].flowerOffset += flowers[i].randomOffset; // KEEP OR NOT? If not, replace flowers[i].randomOffset with set number
    } 
    moveBee(); 

    checkForCollision();
}

function render() {
    // MUST RENDER IN ORDER OF LAYERS
    renderBackground();
    renderFlower();
    renderBee();
    renderForeground();
    renderScore();
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

/* ---------------- Flowers ---------------- */
function generateFlower () {
    addFlower();
    // 1000 is my minimum (however long it takes to get flower width forward. flowerWidth / foregroundVelocity). 2000 is my max space between flowers.
    setTimeout(generateFlower, 500 + (Math.random() * 1500));
}

function addFlower () {
    // Set Random y height in a window
    flowers[flowerNum] = {};
    flowers[flowerNum].flowerY = (Math.floor(Math.random() * (CANVAS_HEIGHT - 80)) + 10);
    flowers[flowerNum].flowerOffset = 0; //unique offset for each flower
    flowers[flowerNum].randomOffset = Math.ceil(Math.random() * 2) + .5; // KEEP OR NOT? If not, delete line 112;
    flowers[flowerNum].pollinated = false;

    // Make sure the flowers array is no more than the number of max flowers
    if (flowerNum > maxFlowers) {
        flowerNum = - 1;
    }
    flowerNum ++;
}

function renderFlower() {
    // Render each flower in our Flowers array
    for (let i = 0; i < flowers.length; i++) {
        flowers[i].flowerX = CANVAS_WIDTH + FLOWER_WIDTH - flowers[i].flowerOffset;

        if (flowers[i].pollinated === true) {
            ctx.drawImage(images.flower1pollinated, flowers[i].flowerX, flowers[i].flowerY, FLOWER_WIDTH, CANVAS_HEIGHT);
        } else {
            ctx.drawImage(images.flower1, flowers[i].flowerX, flowers[i].flowerY, FLOWER_WIDTH, CANVAS_HEIGHT);
        }
    
        /* ------ Debugging purposes -----
        ctx.fillStyle = "chartreuse";
        ctx.beginPath();
        ctx.rect(flowers[i].flowerX, flowers[i].flowerY, FLOWER_WIDTH, FLOWER_HEIGHT);
        ctx.fill()*/
    }
    
}


/* ---------------- Bee ---------------- */

function renderBee() {

    // Draw the bee
    ctx.drawImage(images.bee, bee.beeX, bee.beeY, 60, 50);

    /* ------ BEEbugging Purposes ------
    //Bee Box
    let bXLeft = bee.beeX;
    let bXRight = bee.beeX + bee.WIDTH;
    let bYTop = bee.beeY + 10;
    let bYBottom = bee.beeY + bee.HEIGHT;
    
    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.rect(bXLeft, bYTop, bee.WIDTH, bYBottom-bYTop);
    ctx.fill()*/

    
}

/* ----- Bee Movement ----- */

function addListeners() {
    
    // add event listeners for keyboard
    document.addEventListener("keydown", keyDownHandler, false);
    
    //gradually stop
    document.addEventListener("keyup", keyUpHandler, false);

    // add event listeners for touch : MOBILE FUTURE DEVELOPMENT

}

function keyDownHandler(e) {
    // Up Arrow
    if(e.keyCode == 38){
        bee.beeMoveUp = true;
    }
    // Right Arrow
    if(e.keyCode == 39){
        bee.beeMoveRight = true;
    }

    // Down Arrow
    if(e.keyCode == 40){
        bee.beeMoveDown = true;
    }

    // Left Arrow
    if(e.keyCode == 37){
        bee.beeMoveLeft = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 38){
        bee.beeMoveUp = false;
    }
    // Right Arrow
    if(e.keyCode == 39){
        bee.beeMoveRight = false;
    }
    // Down Arrow
    if(e.keyCode == 40){
        bee.beeMoveDown = false;
    }
    // Left Arrow
    if(e.keyCode == 37){
        bee.beeMoveLeft = false;
    }
}

function moveBee() {
    // GraviBEE
    if (bee.beeY <= CANVAS_HEIGHT - bee.HEIGHT) {
        bee.beeY += GRAVITY;
    }

    // Move Bee Up
    if (bee.beeY > 0 && bee.beeMoveUp == true) {
        bee.beeY -= bee.VELOCITY;
    }
    // Move Bee Right
    if (bee.beeX < CANVAS_WIDTH - bee.WIDTH && bee.beeMoveRight == true) {
        bee.beeX += bee.VELOCITY;
    }
    // Move Bee Down
    if (bee.beeY < CANVAS_HEIGHT - bee.HEIGHT && bee.beeMoveDown == true) {
        bee.beeY += bee.VELOCITY;
    }
    // Move Bee Left
    if (bee.beeX > 0 && bee.beeMoveLeft == true) {
        bee.beeX -= bee.VELOCITY;
    }
}

/* ------------ Score ---------- */

function renderScore() {
    ctx.font = "20px Cherry Swash";
    ctx.fillText(`Score: ${score}`, CANVAS_WIDTH - 100, 20);
}