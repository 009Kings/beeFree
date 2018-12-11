// Constants
const BEE_HEIGHT = 50;
const BEE_WIDTH = 60;
const BG_WIDTH = 2800;
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 350;
const FLOWER_WIDTH = 50;

// Loadings Variables

var ctx = document.getElementById("game").getContext('2d');
let images = {};
let readiness = {};
let imagesReady = false;
let flowers = [];
let flowerNum = 0;
let maxFlowers = 20;

// Coordinate Variables

let beeX = 50;
let beeY = 150;
let bgXOffset = 0;
let flowerY;
let foregroundXOffset = 0;

