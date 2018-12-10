const BG_WIDTH = 2800;
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 350;
let bgXOffset = 0;

var ctx = document.getElementById("game").getContext('2d');
let images = {};
let readiness = {};
let imagesReady = false;