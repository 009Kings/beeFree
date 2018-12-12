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

Unfortunately, while the bee had no gravitational pull, it meant that she could just cruise through the flower box without having any corners of the flower enter her space (NOTE: I didn't figure this bug out until I drew my assets as boxes).Rather than refactoring my code and flipping it to detect both ways, I just added a gravity mechanic to the moveBee function (after adding to renderBee and having my bee drop into the earth). This fixed my threading the needle problem.

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


## Technology Used:

* HTML5
* CSS
* Javascript

## External Sources:

* Google Fonts
* Mozilla Developers Network
* W3Schools
* StackOverflow

## Acknowledgments

* Thank you to Axel Magnuson for helping me will all things math during the project
* Kudos to my lecturers at General Assembly for giving me the skills to create this game and helping me out during it's creation
