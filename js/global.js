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
let bee = {
    x: 50,
    y: 150,
    height: 50,
    width: 60,
    wings: 10,
    velocity: 3.5,
    beeMoveUp: false,
    beeMoveDown: false,
    beeMoveLeft: false,
    beeMoveRight: false,
    stinger: true, // stinger false means bee is dead
}
let score = 0;
let gameRunning = false;
let flowers = [];
let flowerNum = 0;

// Coordinate Variables
let bgXOffset = 0;
let flowerY;
let foregroundXOffset = 0;
