// Do the loading
function load() {
    loadBackground();
}

function startIfReady() {
    // put tick on an interval
    setInterval(tick, 16);
}

// What happens every "frame"
function tick() {
    // Update
    update();

    // Render
    render();
}

// Updates state
function update() {
    // bg state
    bgXOffset += 3;
}

function render() {
    renderBackground();
}

/* ---------------- Background ---------------- */

function loadBackground() {
    
    // Creates background image
    var img = document.createElement("img");
    img.src = "./assets/background2.png";
    images.background = img;

    // When the images loads, store that it is DTR (down to render)
    img.onload = function () {
        readiness.background = true;
    };
}

function renderBackground() {
    // establish x coordinates
    var stepper = bgXOffset % BG_WIDTH;
    var x1 = 0 - stepper;
    var x2 = BG_WIDTH - stepper;

    // Draw dem backgrounds
    ctx.drawImage(images.background, x1, 0, BG_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(images.background, x2, 0, BG_WIDTH, CANVAS_HEIGHT);
}

/* ---------------- Foreground ---------------- */

