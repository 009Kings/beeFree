/* ---------------- Helper Functions ---------------- */

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

function generateXField() {
    return (Math.floor(Math.random() * (CANVAS_HEIGHT - 80)) + 10);
}

function randomRange (maxMinusMin, minMinusOne) {
    return Math.ceil(Math.random() * maxMinusMin) + minMinusOne;
}

function storeScore() {
    let scoresDOM = document.querySelector("#high-scores");
    let newScore = createScore();
    //Insert the li PREFERABLY IN ORDER
    if (scoresDOM.childElementCount === 0) {
        scoresDOM.appendChild(newScore);
        return;
    } else {
        // Check the current scores, loop through them and see if your score is greater than those currently on the board, if not, we move on
        let scoreList = document.querySelectorAll(".score-value");
        for (let i = 0; i < scoreList.length; i++) {
            let parentLi = scoreList[i].parentNode;
            if (gameState.score > parseInt(scoreList[i].textContent)) {
                scoresDOM.insertBefore(newScore, parentLi);
                if (scoresDOM.childElementCount > 5) {
                    scoresDOM.removeChild(scoresDOM.lastChild);
                }
                return;
            }
        }
        // If the list doesn't have the top 5, then we add the score to the bottom
        if (scoresDOM.childElementCount < 5) {
            scoresDOM.appendChild(newScore);
            return;
        }
    }
}

function createScore() {
    var li = document.createElement("li");
    li.setAttribute("class", "score-item");
    li.textContent = `You got a high-score of `;
    // Make dat score
    var span = document.createElement("span");
    span.setAttribute("class", "score-value");
    span.textContent = `${gameState.score}`;
    li.appendChild(span);
    return li;
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

/* ------------ Score ---------- */

function renderScore() {
    ctx.font = "20px Cherry Swash";
    ctx.fillText(`Score: ${gameState.score}`, CANVAS_WIDTH - 110, 20);
}

/* ---------------- Flowers ---------------- */
function generateFlower () {
    addFlower();
    // 500 is my minimum. 2000 is my max space between flowers.
    setTimeout(generateFlower, 500 + (Math.random() * 1500));
}

function addFlower () {
    
    // Set Random y height in a window
    gameState.flowers[gameState.flowerNum] = {};
    gameState.flowers[gameState.flowerNum].flowerY = generateXField();
    gameState.flowers[gameState.flowerNum].flowerOffset = 0; //unique offset for each flower
    gameState.flowers[gameState.flowerNum].randomOffset = randomRange(3, .5);
    gameState.flowers[gameState.flowerNum].pollinated = false;

    // Make sure the flowers array is no more than the number of max flowers
    if (gameState.flowerNum > maxFlowers) {
        gameState.flowerNum = - 1;
    }
    gameState.flowerNum ++;
}

function renderFlower() {
    // Render each flower in our Flowers array
    for (let i = 0; i < gameState.flowers.length; i++) {
        gameState.flowers[i].flowerX = CANVAS_WIDTH + FLOWER_WIDTH - gameState.flowers[i].flowerOffset;

        if (gameState.flowers[i].pollinated === true) {
            ctx.drawImage(images.flower1pollinated, gameState.flowers[i].flowerX, gameState.flowers[i].flowerY, FLOWER_WIDTH, CANVAS_HEIGHT);
        } else {
            ctx.drawImage(images.flower1, gameState.flowers[i].flowerX, gameState.flowers[i].flowerY, FLOWER_WIDTH, CANVAS_HEIGHT);
        }
    
        /* ------ Debugging purposes -----
        ctx.fillStyle = "chartreuse";
        ctx.beginPath();
        ctx.rect(gameState.flowers[i].flowerX, gameState.flowers[i].flowerY, FLOWER_WIDTH, FLOWER_HEIGHT);
        ctx.fill()*/
    }
}

/* ---------------- WASP ---------------- */

// Add wasps to the gameState.enemies object, maybe an array, maybe an object.
//gameState.enemies.wasps = [];

// Randomly generate a WASP
function generateWasps() {
    gameState.enemies.wasps.inGame = true;
    addWasp();
    setTimeout(generateWasps, 3000 + (Math.random() * 7000));
}

function addWasp() {
    let waspsArray = gameState.enemies.wasps.waspsNum;
    let newWasp = {};
    newWasp.y = generateXField();
    newWasp.offsetBase = 0;
    newWasp.randomOffset = randomRange(5, 2);
    if (waspsArray.length > gameState.enemies.wasps.masWasps) {
        waspsArray.shift();
    } 
    waspsArray.push(newWasp);
}

function renderWasp() {
    let waspArray = gameState.enemies.wasps.waspsNum;
    for (let i = 0; i < waspArray.length; i++) {
        waspArray[i].x = CANVAS_WIDTH + gameState.enemies.wasps.width - waspArray[i].offsetBase;

        ctx.fillStyle = "chartreuse";
        ctx.beginPath();
        ctx.rect(waspArray[i].x, waspArray[i].y, gameState.enemies.wasps.width, gameState.enemies.wasps.height);
        ctx.fill()
    }
}


/* ---------------- Bee ---------------- */

function renderBee() {

    // Draw the bee
    ctx.drawImage(images.bee, gameState.bee.x, gameState.bee.y, 60, 50);

    /* ------ BEEbugging Purposes ------
    //Bee Box
    let bXLeft = gameState.bee.x;
    let bXRight = gameState.bee.x + gameState.bee.width;
    let bYTop = gameState.bee.y + 10;
    let bYBottom = gameState.bee.y + gameState.bee.height;
    
    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.rect(bXLeft, bYTop, gameState.bee.width, bYBottom-bYTop);
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
        gameState.bee.beeMoveUp = true;
    }
    // Right Arrow
    if(e.keyCode == 39){
        gameState.bee.beeMoveRight = true;
    }

    // Down Arrow
    if(e.keyCode == 40){
        gameState.bee.beeMoveDown = true;
    }

    // Left Arrow
    if(e.keyCode == 37){
        gameState.bee.beeMoveLeft = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 38){
        gameState.bee.beeMoveUp = false;
    }
    // Right Arrow
    if(e.keyCode == 39){
        gameState.bee.beeMoveRight = false;
    }
    // Down Arrow
    if(e.keyCode == 40){
        gameState.bee.beeMoveDown = false;
    }
    // Left Arrow
    if(e.keyCode == 37){
        gameState.bee.beeMoveLeft = false;
    }
}

function moveBee() {
    // GraviBEE
    if (gameState.bee.y <= CANVAS_HEIGHT - gameState.bee.height) {
        gameState.bee.y += GRAVITY;
    }

    // Move Bee Up
    if (gameState.bee.y > 0 && gameState.bee.beeMoveUp == true) {
        gameState.bee.y -= gameState.bee.velocity;
    }
    // Move Bee Right
    if (gameState.bee.x < CANVAS_WIDTH - gameState.bee.width && gameState.bee.beeMoveRight == true) {
        gameState.bee.x += gameState.bee.velocity - .5;
    }
    // Move Bee Down
    if (gameState.bee.y < CANVAS_HEIGHT - gameState.bee.height && gameState.bee.beeMoveDown == true) {
        gameState.bee.y += gameState.bee.velocity;
    }
    // Move Bee Left
    if (gameState.bee.x > 0 && gameState.bee.beeMoveLeft == true) {
        gameState.bee.x -= gameState.bee.velocity + 1;
    }
}

