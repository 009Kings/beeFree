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
    return (Math.floor(Math.random() * (canvasHeight - 80)) + 10);
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

function addTouch(direction, beeDirection) {
    direction.forEach(function (btn) {
        btn.addEventListener("touchstart", function(e){
            e.preventDefault();
            gameState.bee[beeDirection] = true;
        }, { passive: false })
        btn.addEventListener("pointerdown", function(e){
            e.preventDefault();
            gameState.bee[beeDirection] = true;
        })
    })
    direction.forEach(function(btn){
        btn.addEventListener("touchend", function(e){
            e.preventDefault();
            gameState.bee[beeDirection] = false;
        })
        btn.addEventListener("pointerup", function(e){
            e.preventDefault();
            gameState.bee[beeDirection] = false;
        })
    })
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
        gameState.flowerFreqMin = 1300;

        // Bigger flowers
        gameState.flowerWidth = gameState.flowerWidth * 1.25;
        gameState.flowerHeight = gameState.flowerHeight * 1.25;

        // Show the Restart Btn so you can end the damn game
        document.getElementById("start").classList.remove("hidden");
    }
}

function storeScore() {
    let scoresDOM = document.querySelector("#high-scores");
    let newScore = createScore();
    //Insert the li in order
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
            console.log(gameState.bee.x, gameState.bee.y);
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

    // Change mode button
    let changeMode = document.getElementById("change-mode");
    changeMode.addEventListener("click", function () {
        // Hide the GO Modal
        document.getElementById("GO-modal").classList.add("hidden");
        // Bring up the StartModal
        document.getElementById("start-modal").classList.remove("hidden");
    })

    // Enable touch button 
    let touchBtn = document.getElementById("mobile-mode");
    touchBtn.addEventListener("click", function(){
        if (!mobile) {
            mobile = true;
            document.getElementById("mobile-pads").classList.remove("hidden");
            touchBtn.textContent = "Disable touch mode";
            document.getElementById("start-content").textContent = "Help Mr. Bee in his mission to pollinate as many flowers as he can! Use the two D-pads on either side of the screen to fly though the world and land on the flowers you pass.";
        } else if (mobile) {
            mobile = false;
            document.getElementById("mobile-pads").classList.add("hidden");
            touchBtn.textContent = "Enable touch mode"
            document.getElementById("start-content").textContent = `Help Mr. Bee in his mission to pollinate as many flowers as he can! Use "W" to move up, "A" to move left, "S" to move down, and "D" to move right. Fly though the world and land on the flowers you pass.`;
        }
    })
}

function addListeners() {
    // add event listeners for keyboard
    document.addEventListener("keydown", keyDownHandler, false);
    
    // Stop trajectory when key is up
    document.addEventListener("keyup", keyUpHandler, false);

    // add event listeners for touch : MOBILE FUTURE DEVELOPMENT
    let up = document.querySelectorAll(".up");
    let right = document.querySelectorAll(".right");
    let down = document.querySelectorAll(".down");
    let left = document.querySelectorAll(".left");

    addTouch(up, "beeMoveUp");
    addTouch(right, "beeMoveRight");
    addTouch(down, "beeMoveDown");
    addTouch(left, "beeMoveLeft");
}

/* ---------------- Background ---------------- */

function renderBackground() {
    // establish x coordinates and the "stepper" which is when the animation loops
    var stepper = bgXOffset % BG_WIDTH;
    var x1 = 0 - stepper;
    var x2 = BG_WIDTH - stepper;

    // Draw dem backgrounds
    ctx.drawImage(images.background, x1, 0, BG_WIDTH, canvasHeight);
    ctx.drawImage(images.background, x2, 0, BG_WIDTH, canvasHeight);
}

/* ---------------- Foreground ---------------- */

function renderForeground() {
    var stepper = foregroundXOffset % BG_WIDTH; //I can use this bc they are the same width
    var x1 = 0 - stepper;
    var x2 = BG_WIDTH - stepper;

    // Draw dem foregrounds
    ctx.drawImage(images.foreground, x1, 0, BG_WIDTH, canvasHeight);
    ctx.drawImage(images.foreground, x2, 0, BG_WIDTH, canvasHeight);
}

/* ------------ Score ---------- */

function renderScore() {
    ctx.font = "20px Cherry Swash";
    ctx.fillText(`Score: ${gameState.score}`, canvasWidth - 110, 20);
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
        gameState.flowers[i].flowerX = canvasWidth + gameState.flowerWidth - gameState.flowers[i].flowerOffset;

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
        waspArray[i].x = canvasWidth + gameState.enemies.wasps.width - waspArray[i].offsetBase;

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
    if (gameState.bee.x <= 0) {
        gameState.bee.x = 0;
    }
    if (gameState.bee.y <= 0) {
        gameState.bee.y = 0;
    }
    if (gameState.bee.x >= canvasWidth - gameState.bee.width) {
        gameState.bee.x = canvasWidth - gameState.bee.width;
    }
    if (gameState.bee.y >= canvasHeight - gameState.bee.height) {
        gameState.bee.y = canvasHeight - gameState.bee.height;
    }
    // GraviBEE
    if (gameState.bee.y <= canvasHeight - gameState.bee.height && gameState.bee.beePause != true) {
        gameState.bee.y += gameState.gravity;
    }
    if (gameState.bee.hasStinger && gameState.mode != "Game Over") {
        // Move Bee Up
        if (gameState.bee.beeMoveUp == true) {
            gameState.bee.y -= gameState.bee.velocity;
        }
        // Move Bee Right
        if (gameState.bee.beeMoveRight == true) {
            gameState.bee.x += gameState.bee.velocity - .5;
        }
        // Move Bee Down
        if (gameState.bee.beeMoveDown == true) {
            gameState.bee.y += gameState.bee.velocity;
        }
        // Move Bee Left
        if (gameState.bee.beeMoveLeft == true) {
            gameState.bee.x -= gameState.bee.velocity + 1;
        }
    }
}

function snapBee(destinationY, xOffset, yDiff) {
    if (gameState.bee.y < destinationY - 1 && gameState.bee.y > destinationY + 1) {
        // gradually move the bee to
        gameState.bee.y += yDiff/4

    }
    gameState.bee.x -= xOffset*0.8;
    gameState.bee.beeMoveUp = false;
    gameState.bee.beeMoveDown = false;
    gameState.bee.beeMoveLeft = false;
    gameState.bee.beeMoveRight = false;
}

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
