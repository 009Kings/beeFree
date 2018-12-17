// Constants
const BG_WIDTH = 2800;
const FLOWER_HEIGHT = 50;
const FPS = 16;

// Loadings Variables
let canvasWidth = 700;
let canvasHeight = canvasWidth/2;
var ctx = document.getElementById("game").getContext('2d');
let images = {};
let imagesReady = false;
let readiness = {};

// Game state
let gameState = {
    gameRunning: false,
};
let mobile = false;

// Coordinate Variables
let bgXOffset = 0;
let mtnOffset = 0;
let flowerY;
let foregroundXOffset = 0;