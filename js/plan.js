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

function createScore() {
    var li = document.createElement("li");
    li.setAttribute("class", "score-item");
    li.textContent = `In ${gameState.mode} you got a high-score of `;
    // Make dat score
    var span = document.createElement("span");
    span.setAttribute("class", "score-value");
    span.textContent = `${gameState.score}`;
    li.appendChild(span);
    return li;
}

/* ---------------- Game Initialisation ---------------- */

function checkMode() {
    // Initiate Zen Mode
    if (document.getElementById("zen-mode").checked) {
        gameState.mode = "Zen Mode";
        for (const key in gameState.enemies) {
            gameState.enemies[key].inGame = false;
        }

        // Make more flowers for Zen Mode
        gameState.flowerFreqMax = 200;
        gameState.flowerFreqMin = 1000;

        // Bigger flowers
        gameState.flowerWidth = gameState.flowerWidth * 1.25;
        gameState.flowerHeight = gameState.flowerHeight * 1.25;

        // Show the Restart Btn so you can end the damn game (NOTE, Need to change restart btn to show Game over modal if zen mode is active)
        document.getElementById("start").classList.remove("hidden");
        // document.getElementById("start").addEventListener("click", ...)
    }
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
            if (gameState.score > scoreList[i].textContent) {
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
        }
    }
}

/* ---------------- Button Listeners ---------------- */

function addStartListeners() {
    let startBtn = document.getElementById("start");
    startBtn.addEventListener("click", function () {

        // Set Start modal status to hidden
        document.getElementById("start-modal").classList.add("hidden");
        document.getElementById("start").classList.add("hidden");
        // On click, startIfReady()
        if(gameState.gameRunning === false) {
            gameState.gameRunning = true;
            // Change the text to say Restart
            document.getElementById("start").textContent = "Restart";
            // Initialise the board
            init();
            // Check if Zen mode is pressed
            checkMode();

            startIfReady();
        } else if (gameState.mode === "Zen Mode") {
            gameOver();
        } else {
        
            // Initialise the board
            document.getElementById("GO-modal").classList.add("hidden");
            init();
            checkMode();
            addListeners();
        }
    })
    let changeMode = document.getElementById("change-mode");
    changeMode.addEventListener("click", function () {
        // Hide the GO Modal
        document.getElementById("GO-modal").classList.add("hidden");
        // Bring up the StartModal
        document.getElementById("start-modal").classList.remove("hidden");
    })
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
    if (document.hasFocus()) {
        addFlower();
    }
    // 500 is my minimum. 2000 is my max space between flowers.
    setTimeout(generateFlower, gameState.flowerFreqMax + (Math.random() * gameState.flowerFreqMin));
}

function addFlower () {
    
    // Set Random y height in a window
    gameState.flowers[gameState.flowerNum] = {};
    gameState.flowers[gameState.flowerNum].flowerY = generateXField();
    gameState.flowers[gameState.flowerNum].flowerOffset = 0; //unique offset for each flower
    gameState.flowers[gameState.flowerNum].randomOffset = randomRange(3, 1);
    gameState.flowers[gameState.flowerNum].pollinated = false;

    // Make sure the flowers array is no more than the number of max flowers
    if (gameState.flowerNum > gameState.maxFlowers) {
        gameState.flowerNum = - 1;
    }
    gameState.flowerNum ++;
}

function renderFlower() {
    // Render each flower in our Flowers array
    for (let i = 0; i < gameState.flowers.length; i++) {
        gameState.flowers[i].flowerX = CANVAS_WIDTH + gameState.flowerWidth - gameState.flowers[i].flowerOffset;

        if (gameState.flowers[i].pollinated === true) {
            ctx.drawImage(images.flower1pollinated, gameState.flowers[i].flowerX, gameState.flowers[i].flowerY, gameState.flowerWidth, gameState.flowerHeight);
        } else {
            ctx.drawImage(images.flower1, gameState.flowers[i].flowerX, gameState.flowers[i].flowerY, gameState.flowerWidth, gameState.flowerHeight);
        }
    
        /* ------ Debugging purposes -----
        ctx.fillStyle = "limegreen";
        ctx.beginPath();
        ctx.rect(gameState.flowers[i].flowerX, gameState.flowers[i].flowerY, gameState.flowerWidth, FLOWER_HEIGHT);
        ctx.fill()*/
    }
}

/* ---------------- WASP ---------------- */

// Randomly generate a WASP
function generateWasps() {
    if (gameState.enemies.wasps.inGame && document.hasFocus()) {
        addWasp(); 
    }
    setTimeout(generateWasps, gameState.enemies.wasps.freqMax + (Math.random() * gameState.enemies.wasps.freqMin));
}

function addWasp() {
    let waspsArray = gameState.enemies.wasps.waspsNum;
    let newWasp = {};
    newWasp.y = generateXField();
    newWasp.offsetBase = 0;
    newWasp.randomOffset = randomRange(5, 2);
    newWasp.width = gameState.enemies.wasps.width;
    newWasp.height = gameState.enemies.wasps.height;
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
    if (gameState.bee.hasStinger){
        ctx.drawImage(images.bee, gameState.bee.x, gameState.bee.y, 60, 50);
    } else if (gameState.bee.typeOfDeath == "wasp") {
        ctx.drawImage(images.bee, gameState.bee.x, gameState.bee.y, 60, 50);
        // Zoom bee down
        gameState.gravity = 6;
    }
    

    /* ------ BEEbugging Purposes ------ 
    //Bee Box
    let bXLeft = gameState.bee.x;
    let bXRight = gameState.bee.x + gameState.bee.width;
    let bYTop = gameState.bee.y + 10;
    let bYBottom = gameState.bee.y + gameState.bee.height;
    
    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.rect(bXLeft, bYTop, gameState.bee.width, bYBottom-bYTop);
    ctx.fill()
    */
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
    // W
    if(e.keyCode == 87){
        gameState.bee.beeMoveUp = true;
    }
    // D
    if(e.keyCode == 68){
        gameState.bee.beeMoveRight = true;
    }
    // S
    if(e.keyCode == 83){
        gameState.bee.beeMoveDown = true;
    }
    // A
    if(e.keyCode == 65){
        gameState.bee.beeMoveLeft = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 87){
        gameState.bee.beeMoveUp = false;
    }
    if(e.keyCode == 68){
        gameState.bee.beeMoveRight = false;
    }
    if(e.keyCode == 83){
        gameState.bee.beeMoveDown = false;
    }
    if(e.keyCode == 65){
        gameState.bee.beeMoveLeft = false;
    }
}

function moveBee() {
    // GraviBEE
    if (gameState.bee.y <= CANVAS_HEIGHT - gameState.bee.height) {
        gameState.bee.y += gameState.gravity;
    }
    if (gameState.bee.hasStinger && gameState.mode != "Game Over") {
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
}

/* WOULDN'T IT BE NICE (6 hours on this and nothing works, so I'll put it down)
function snapBee(destinationX, destinationY, xOffset) {
    gameState.bee.y = destinationY;
    if (destinationX < 0) {
        return;
    } else if (gameState.bee.x > destinationX) {
        gameState.bee.x -= xOffset;
        gameState.bee.beeMoveUp = false;
        gameState.bee.beeMoveDown = false;
        gameState.bee.beeMoveLeft = false;
        gameState.bee.beeMoveRight = false;
    }
}
*/
/*
function launchBee(x, y) {

    let diffX = gameState.bee.x - x;
    let diffY = gameState.bee.y - y;

    if (gameState.bee.x != x || gameState.bee.y != y) {
        console.log("while loop entered");
        if (gameState.bee.x != x) {
            gameState.bee.x = gameState.bee.x + (diffX / 4);
            //console.log(gameState.bee.x);
        }
        if (gameState.bee.y != y) {
            gameState.bee.y = gameState.bee.y + (diffY / 4);
            //console.log(gameState.bee.y);
        }
    }
}
*/
