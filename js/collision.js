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
            let bXLeft = bee.beeX;
            let bXRight = bee.beeX + bee.WIDTH;
            let bYTop = bee.beeY + 10;
            let bYBottom = bee.beeY + bee.HEIGHT; 

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
