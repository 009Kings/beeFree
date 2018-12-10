var ctx = document.getElementById("tutorial").getContext('2d');
var xPosition = 0;

function moveBackground() {
    if (xPosition < -2800){
        xPosition = 1;
    }
    xPosition -= 1;

    var img = document.getElementById("background");
    ctx.drawImage(img, xPosition, 0, 2800, 350);
}

function createBackground() {
    //fill with an img
    var img = document.createElement("img");
    img.setAttribute("id", "background");
    img.onload = function(){
        ctx.drawImage(img, xPosition, 0, 2800, 350);
    }
    img.src = "./assets/background2.png";
}

function update() {
    moveBackground();
}

document.addEventListener("DOMContentLoaded", function(){
    createBackground();
})
