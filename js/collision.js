function checkForFlowerCollision() {

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
            let bXLeft = bee.x;
            let bXRight = bee.x + bee.width;
            let bYTop = bee.y + 10;
            let bYBottom = bee.y + bee.height; 

            if (cX >= bXLeft && cX <= bXRight 
            && cY >= bYTop && cY <= bYBottom) {
                if (flowers[i].pollinated === true) {
                    break;
                }
                flowers[i].pollinated = true;
                score += 1;
            }
        }
    }
}

/* ------- Refactor that code! -------*/
function checkCollide(object1, object2) {

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
        let bYTop = object2.y + object2;
        let bYBottom = object2.y + object2.height; 

        if (cX >= bXLeft && cX <= bXRight 
        && cY >= bYTop && cY <= bYBottom) {
            return true;
        }
    }
}