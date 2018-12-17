# Bee Free: Pollination Station

This is my first coding project. I wanted to do a cute, low-violence game that is fun and relaxing. I also wanted to make my own art assets

## Getting Started

The first thing I did was a wireframe of what I wanted my game to look like. I wireframed out my minimum viable product since most of my stretch goals still visually fit 

into that frame. I listed all the state that I would have to track for my MVP to function and all the assets I would need.

### Prerequisites

Because I only used Javascript, CSS, and HTML5, the only thing you'll need to play is an up to date browser. I thought about using Phaser, but creating this from scrap would be better for helping me get familiar with JS and give me a better understanding of how frameworks like Phaser work.

## The Process

### Weekend Work (days 1 & 2)

The first day was mostly planning. The only code that came out was my HTML code (which was just basic HTML skeleton with a canvas). I planned out my MVP and created a list of stretch goals, and prioritising them accordingly. On the Sunday, I created my repository and began work on the background, specifically getting it to move. I then cleaned up my code a bit and created the overarching structure that would be filled out as the game develops.

### Monday (day 3)

The bulk of my game logic was established on this day. The first thing I did was create a foreground that would move at a different speed to establish parallax.

Then I put my bee on the board and worked on motion. I initially put the bee motion in the event listeners for the keyboard, but that resulted in very jumpy bee movement, but the functionality was there so I put it down for a later time. 
```
/* ---------------- Bee ---------------- */
 function addListeners() {
    // add event listeners for keyboard
    document.addEventListener("keydown", keyDownHandler, false);
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
```
I fixed this by creating a couple of global variables that would be booleans, giving the bee a velocity, creating an event listener for keyup, and making a moveBee function.
```
function moveBee() {
    // Move Bee Up
    if (beeY > 0 && beeMoveUp == true) {
        beeY -= BEE_VELOCITY - 1;
    }
    // Move Bee Right
    if (beeX < CANVAS_WIDTH - BEE_WIDTH && beeMoveRight == true) {
        beeX += BEE_VELOCITY;
    }
    // Move Bee Down
    if (beeY < CANVAS_HEIGHT - BEE_HEIGHT && beeMoveDown == true) {
        beeY += BEE_VELOCITY;
    }
    // Move Bee Left
    if (beeX > 0 && beeMoveLeft == true) {
        beeX -= BEE_VELOCITY;
    }
}
```

The next thing was to get my flowers on the board, so I worked on how to randomly generate them and move them without eventually slowing down the game with thousands of off-screen flowers.
```
function generateFlower () {
    addFlower();
    setTimeout(generateFlower, 500 + (Math.random() * 1500));
}

function addFlower () {
    // Set Random y height in a window
    flowers[flowerNum] = {};
    flowers[flowerNum].flowerY = (Math.floor(Math.random() * (CANVAS_HEIGHT - 80)) + 10);
    flowers[flowerNum].flowerOffset = 0; //unique offset for each flower
    flowers[flowerNum].randomOffset = Math.ceil(Math.random() * 2) + .5;
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

        ctx.drawImage(images.flower1, flowers[i].flowerX, flowers[i].flowerY, FLOWER_WIDTH, CANVAS_HEIGHT);
    }
}
```
This got it working, even if it isn't the DRYest.

After that, I worked on my collision detection, detecting if the corners of the flowers enter the bee square. 
```
function checkForCollision() {
     // Check All the flowers on the board.
    for (let i = 0; i < flowers.length; i++) {
        // Lets establish corners
        let corners = [
            {corner: "topLeft", x : flowers[i].flowerX, y : flowers[i].flowerY},
            {corner: "topRight", x : flowers[i].flowerX + FLOWER_WIDTH, y : flowers[i].flowerY},
            {corner: "bottomLeft", x : flowers[i].flowerX, y : flowers[i].flowerY + FLOWER_HEIGHT},
            {corner: "bottomRight", x : flowers[i].flowerX + FLOWER_WIDTH, y : flowers[i].flowerY + FLOWER_HEIGHT}];
         // Check if any of the corner points is within the bounds of the bee box; 
        for (let j = 0; j < corners.length; j++) {
            // May not be DRY, but helps to read the logic
            let cX = corners[j].x;
            let cY = corners[j].y;
            let bXLeft = beeX;
            let bXRight = beeX + BEE_WIDTH;
            let bYTop = beeY + 10;
            let bYBottom = beeY + BEE_HEIGHT; 
             if (cX >= bXLeft && cX <= bXRight 
            && cY >= bYTop && cY <= bYBottom) {
                if (flowers[i].pollinated === true) {
                    break;
                }
                flowers[i].pollinated = true;
                score += 10;
                console.log(score);
            }
        }
    }
}
```
Unfortunately, while the bee had no gravitational pull, it meant that he could just cruise through the flower box without having any corners of the flower enter his space (NOTE: I didn't figure this bug out until I drew my assets as boxes). Rather than refactoring my code and flipping it to detect both ways, I just added a gravity mechanic to the moveBee function (after adding to renderBee and having my bee drop into the earth). This fixed my threading the needle problem.
```
if (bee.y <= CANVAS_HEIGHT - bee.height) {
        bee.y += GRAVITY;
    }
```

Since I had functional collision mechanics, I added a score that's kept and rendered every tick and changed the image of the flowers if they've been pollinated. The rest of the evening was spent refactoring some code and playing around with css to make my site look slightly more interesting and responsive.

## Tuesday (Day 4)

After having a few people playtest the game the night previous, there was a request to keep it as it was as a sort of "Zen mode", thus pushing my start menu stretch goal to the forefront. First step for that is to create a modial on the canvas that simply initiallises the game.

I spent a lot of time doing CSS work on this day. I made a modal over the screen and a button that starts the game. I had to make a div container to hold the canvas and the modal so that I could set it's position to relative in order to overlay the modal with absolute positioning. I also made a sticky footer that has links to my Github, LinkedIn, and a place to email me.

## Wednesday (Day 5)

I needed to have a start state which would initialise everytime the game restarted, so I made an empty object and a function to fill it. This seemed like a great idea until I broke the game.
![What a fun screen that isn't!](https://raw.githubusercontent.com/009kings/beeFree/master/readmeImg/noGame.png)

The fix is to start out the gameState.gameRunning to be false (because it's not running), that way when init() is called it initialises it to true, thus starting the game.

Always avoiding the death of my beloved bee, I decided to work on <strong>literally anything else</strong>, so I moved on to scoring. I wanted to make sure that I only had the top five scores and had them in order. I created a function to make my li components that also included a span of the score itself for easy comparison purposes.
```
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
```
Then, in order to place it appropriately, I wrote a function that runs through if statements on if statements! <em>For reference: scoresDOM accesses my ol element in my HTML file and newScore calls my createScore helper function.</em>

🎶 On the fifth day of project week, my true love asked of me, "are there any children in your scoresDom?"🎶 
```
    if (scoresDOM.childElementCount === 0) {
        scoresDOM.appendChild(newScore);
        return;
    }
```
If there aren't zero children, than there must be intiger children! The else basically creates a nodeList of all SCORES on the high-scores board (which is why I have that span over the scores in my createScore section), loops through them and checks if your score is greater than those currently on the board. If so, it adds the new score above.
```
    else {
        let scoreList = document.querySelectorAll(".score-value");
        for (let i = 0; i < scoreList.length; i++) {
            let parentLi = scoreList[i].parentNode;
            if (gameState.score > scoreList[i].textContent) {
                scoresDOM.insertBefore(newScore, parentLi);
```
You might think that's the last of it, but if you keep getting higher scores, then your list keeps getting bigger and bigger and bigger, so how to solve this problem? Remove the last child if there are more than five! Turns out this if statement needs to go right after the insertBefore otherwise we get all sorts of funky problems.
```
                if (scoresDOM.childElementCount > 5) {
                    scoresDOM.removeChild(scoresDOM.lastChild);
                }
```
So you got a new score, it's not higher than any of the current children of my ol, what to do now? Well, if there are less than five scores on the board, then you get a spot! But if there are already five on the board and your score hasn't been put on the board yet, than tough cookies, nothing happens.

All that logic and bug fixing took about 200% longer than anticipated. After the organised list runaround, it was about halfway through the day, and I was introduced to emojis in my git-commits, thus driving me to make my commits as cheesy as my game. You can see the time-window of this discovery in my commits.

After much feet dragging and doing everything else, I finally added a lose condition; the bee's impermanence finally came to fruition in the shape of chartreuse coloured box-wasps. Through implimenting the wasp collision detection, I found a couple of fixes that had to be made to my refactered collision code, but I came out with more widely applicable code.

After making sure the bee could die, I implimented a radio button in the start modal so that you could start the game in Zen mode should you feel so inclined.
![Zen Mode or Regular mode? The choice is yours with a simple click of a radio button](https://raw.githubusercontent.com/009kings/beeFree/master/readmeImg/radioZen.png)

## Thursday (Day 6)

I got a late start to the day so I went in and refactored some code and fixed a couple of little things (like having the wasp collision not register wingspace). I also figured out how to prevent my cool BAM FLOWERS AND WASPS bug where if you leave the screen while game is running, when you come back, it'll reward you with all of the flowers and wasps in one clump on the screen.
![BAM! Flowers and wasps!](https://raw.githubusercontent.com/009kings/beeFree/master/readmeImg/BAMFlowersAndWasps.png)
Thanks to Javascript's hasFocus method, I was able to fix this by adding a couple of if statements to my generateWasps function and to my generateFlowers function
```
if (gameState.enemies.wasps.inGame && document.hasFocus()) {
    addWasp(); 
}
...
if (document.hasFocus()) {
    addFlower();
}
```

I then polished up my GameOver modal so that losing is less painful  at least aesthetically. With that, I added a button to change modes if the presence of bee-killing wasps became too stressful for the player. I also edited my createScore function to represent which gamemode the score came from so players couldn't pass their Zen scores off as regular scores. I also kept the restart button at the bottom of the canvas for those who want to end Zen mode at some point and time (I don't know why you would though).

At the end of the day, I decided that the next step I wanted to bite off was making the bee pause on all of the pollinated flowers. I got a pretty sweet setInterval and setTimeout(clearInterval) going right before bed, not understanding that what I had bitten off was not a tasty amuse-bouche, but rather a fresh whale. 

## Friday (Day 7)

🎶 On the seventh day of project week, my true love gave to me, SEVEN HUNDRED BUGS! 🎶

While that number is certainly an exaggeration, it didn't feel like it. I ended the day on Thursday hopeful of what I could achieve, I had snapped my bee to the pollinated flower's x and y coordinates, how hard could it be to make that transition smooth?

<strong>Very.</strong>

I am changing my name to Icarus because after six or seven different logic structures and six hours of work I finally realised that the wax on my wings had melted and I was plumetting back to earth with the velocity of my hubris. 

![Bee's got the zoomies part One](https://raw.githubusercontent.com/009kings/beeFree/master/readmeImg/beeLaunchBug.gif)

![Bee's got the zoomies part One](https://raw.githubusercontent.com/009kings/beeFree/master/readmeImg/beeLaunchBug2.gif)

![Bee's got the zoomies part One](https://raw.githubusercontent.com/009kings/beeFree/master/readmeImg/beeLaunchBug3.gif)

Everything I wrote out logically made sense, but after a while I realised I wanted to do tweening, but most of the resources for tweening are frameworks which, for some masochistic reason, I am commited to not using in this project. I tried to figure out the code found at http://mattshaw.org/projects/simple-javascript-tweening/ (which is a very handy resouce), but had no luck. 

In the end, I just "turned off" the movement listeners and had the bee's x move at the same rate as the flower's.
```
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

gameState.bee.beePause = true;

let beePause = setInterval(function(){
    snapBee(gameState.flowers[i].flowerY, gameState.flowers[i].randomOffset, gameState.bee.y - gameState.flowers[i].flowerY);
}, FPS);

setTimeout(function () {
    clearInterval(beePause);
    gameState.bee.beePause = false;
}, gameState.pauseMS);
```
And thus we have a little hover that runs at the same rate as the render and lasts for as long as gameState.pauseMS states (pauseMS means pause in Millisecods).

## Weekend 2 (Days 8 and 9)

This day was all about pretty art and mobile. To impliment mobile, I made two dpads on either side of the screen so that the player can have a more erganomic experience. 

I got the dpads working on the "mobile" version on my computer, but when I went to play the deployed version on my phone, the "pointerdown" event listeners that I had attached were not reading the sweet touch of my digits. So I added touch listeners and prevented the default on them (so the screen doesn't enlarge whenever you press on both sides). I added listeners to each of my arrow images with the help of a handy helper function!
```
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
```
After that, it was all about making the game look better. First up, I had to make a scary lookin' wasp that could instill the same feeling of panic and dismay that you feel when seeing a wasp zoom toward you in real life. 
![The king of the Waspia](https://raw.githubusercontent.com/009kings/beeFree/master/assets/wasp.png)
The red eyes were crucial to offset the cuteness of the bee. Following that, I added a feature that changes the bee image when it dies, to really hammer in how evil these wasps are.
![Im-im-IMPERMANENCE](https://raw.githubusercontent.com/009kings/beeFree/master/assets/deadBee.png)
You don't get to see this art aspect much, it's more of a horrific artistic treat for when you get to see the be fall.

And finally, to make me feel better about how horrific the natural world is, I drew some lovely, serene mountains and put on Bob Ross.

## Technology Used:

* HTML5
* CSS
* Javascript
* Adobe Photoshop

## External Sources:

* Google Fonts
* Mozilla Developers Network
* W3Schools
* StackOverflow

## Acknowledgments

* Thank you to Axel Magnuson for helping me will all things math during the project
* Kudos to my lecturers at General Assembly for giving me the skills to create this game and helping me out during it's creation
