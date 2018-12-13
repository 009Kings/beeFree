// Constants
const BG_WIDTH = 2800;
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 350;
const FLOWER_WIDTH = 50;
const FLOWER_HEIGHT = 50;
const GRAVITY = 1;
const FPS = 16;

// Loadings Variables
var ctx = document.getElementById("game").getContext('2d');
let images = {};
let imagesReady = false;
let maxFlowers = 30;
let readiness = {};

// Game state
let gameState = {
    gameRunning: false,
};

// Coordinate Variables
let bgXOffset = 0;
let flowerY;
let foregroundXOffset = 0;