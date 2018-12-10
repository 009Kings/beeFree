// Constants

const BG_WIDTH = 2800;
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 350;

// Loadings Variables

var ctx = document.getElementById("game").getContext('2d');
let images = {};
let readiness = {};
let imagesReady = false;

// Coordinate Variables

let bgXOffset = 0;
let foregroundXOffset = 0;
let beeX = 50;
let beeY = 150;
