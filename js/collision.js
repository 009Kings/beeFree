function checkForFlowerCollision() {

    // Check All the flowers on the board.
    for (let i = 0; i < gameState.flowers.length; i++) {
        // Lets establish corners
        let corners = [
            {corner: "topLeft", x : gameState.flowers[i].flowerX, y : gameState.flowers[i].flowerY},
            {corner: "topRight", x : gameState.flowers[i].flowerX + FLOWER_WIDTH, y : gameState.flowers[i].flowerY},
            {corner: "bottomLeft", x : gameState.flowers[i].flowerX, y : gameState.flowers[i].flowerY + FLOWER_HEIGHT},
            {corner: "bottomRight", x : gameState.flowers[i].flowerX + FLOWER_WIDTH, y : gameState.flowers[i].flowerY + FLOWER_HEIGHT}];

        // Check if any of the corner points is within the bounds of the bee box; 
        for (let j = 0; j < corners.length; j++) {
            // May not be DRY, but helps to read the logic
            let cX = corners[j].x;
            let cY = corners[j].y;
            let bXLeft = gameState.bee.x;
            let bXRight = gameState.bee.x + gameState.bee.width;
            let bYTop = gameState.bee.y + 10;
            let bYBottom = gameState.bee.y + gameState.bee.height; 

            if (cX >= bXLeft && cX <= bXRight 
            && cY >= bYTop && cY <= bYBottom) {
                if (gameState.flowers[i].pollinated === true) {
                    break;
                }
                gameState.flowers[i].pollinated = true;
                gameState.score += 1;
            }
        }
    }
}

/* ------- Refactor that code! -------*/
function checkCollide(object1, object2, wings) {

    // Lets establish corners
    let corners = [
        {corner: "topLeft", x : object1.x, y : object1.y},
        {corner: "topRight", x : object1.x + object1.width, y : object1.y},
        {corner: "bottomLeft", x : object1.x, y : object1.y + object1.height},
        {corner: "bottomRight", x : object1.x + object1.width, y : object1.y + object1.height}];

    // Check if any of the corner points is within the bounds of the bee box; 
    for (let j = 0; j < corners.length; j++) {
        // May not be DRY, but helps to read the logic
        let cX = corners[j].x;
        let cY = corners[j].y;
        let bXLeft = object2.x;
        let bXRight = object2.x + object2.width;
        let bYTop = object2.y + wings;
        let bYBottom = object2.y + object2.height; 

        if (cX >= bXLeft && cX <= bXRight 
        && cY >= bYTop && cY <= bYBottom) {
            return true;
        }
    }
}

function checkWaspCollision() {
    let waspArray = gameState.enemies.wasps.waspsNum;
    for (let i = 0; i < waspArray.length; i++) {
        let collision = checkCollide(gameState.bee, waspArray[i], gameState.enemies.wasps.wingHeight);
        if (collision == true){
            if (gameState.bee.hasStinger) {
                gameState.bee.hasStinger = false;

                // Run game over setting
                gameOver();
            }
        }
    }
}