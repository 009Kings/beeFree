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
                if (gameState.flowers[i].pollinated === true || gameState.bee.hasStinger === false) {
                    break;
                }
                gameState.flowers[i].pollinated = true;
                gameState.score += 1;
            }
        }
    }
}

/* ------- Refactor that code! -------*/
function checkCollide(smallerObject, object2, wings1, wings2) {

    // Lets establish corners
    let corners = [
        {corner: "topLeft", x : smallerObject.x, y : smallerObject.y + wings1},
        {corner: "topRight", x : smallerObject.x + smallerObject.width, y : smallerObject.y + wings1},
        {corner: "bottomLeft", x : smallerObject.x, y : smallerObject.y + smallerObject.height},
        {corner: "bottomRight", x : smallerObject.x + smallerObject.width, y : smallerObject.y + smallerObject.height}];

    // Check if any of the corner points is within the bounds of the bee box; 
    for (let j = 0; j < corners.length; j++) {
        // May not be DRY, but helps to read the logic
        let cX = corners[j].x;
        let cY = corners[j].y;
        let bXLeft = object2.x;
        let bXRight = object2.x + object2.width;
        let bYTop = object2.y + wings2;
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
        let collision = checkCollide(gameState.bee, waspArray[i], gameState.bee.wings, gameState.enemies.wasps.wingHeight);
        if (collision == true){
            if (gameState.bee.hasStinger) {
                gameState.bee.hasStinger = false;
                gameState.bee.typeOfDeath = "wasp";

                // Run game over setting
                gameOver();
            }
        }
    }
}