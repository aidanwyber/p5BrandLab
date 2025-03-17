
const sketchName = 'Template';

let canvas;
let svgCanvas;
let canvWrapper;
let pw = 1, ph = 1;
let canvScale = 1;

let theShader;
let gui;
let generator;

let bodyFont, titleFont;

let img;
const maxImgResIncrease = 0.25;

const doRunRealTime = false;

let isCapturingFrames = false;

let mouse = new Vec2D();
let isMouseDown = false;
let timeOffset = 0;


let isPlaying = true;
let time = 0,
  ptime = -1 / 60,
  dtime; // dt start at 60 fps

let scrollScale = 1;

let SSID, SSIDindex = 0;
let SSIDs = [generateSSID()];
let K = 0; // util constant
let utilBools = [];
let FR, duration, nFrames;
let noiseOffs;

// ------------------------------------------------------------ PRELOAD
function preload() {
  // bodyFont = loadFont('fonts/XXX.ttf');
  // titleFont = loadFont('fonts/XXX.ttf');

  // theShader = loadShader('shader/shader.vert', 'shader/shader.frag');

  // img = loadImage('data/tomfisk.jpg', (img) => img.isLoaded = true);
}

// ------------------------------------------------------------ SETUP
function setup() {
  initUtil(10, ffmpegFR);

  canvas = theShader == undefined ?
    createCanvas(1, 1) :
    createCanvas(1, 1, WEBGL);

  // svgCanvas = new p5(theSvgCanvasSketch);

  createCanvasWrapper();

  generator = new Generator();
  if (img) generator.setImage(img);

  createGUI();

  ffmpegUtilInit(); // sync
  ffmpegInit(); // async

  generator.init();

  containCanvasInWrapper();

  // setTimeout(helpMe, 500);
}

// ------------------------------------------------------------ DRAW
let ffmpegWaiter = 0;
function draw() {
  if (!isFfmpegInit && ffmpegWaiter < FR) {
    ffmpegWaiter++;
    return;
  }
  if (!isPlaying) return;
  // if (keyIsDown('-')) frameCount--;
  // if (keyIsDown('=')) frameCount++;
  setTime();
  mouse.set(mouseX, mouseY);//.scale(1 / generator.canvScale);

  generator.update();
  generator.draw();

  handleFrameCapture();
}


// ------------------------------------------------------------ SVG CANVAS
function theSvgCanvasSketch(sketch) {
  sketch.setup = () => {
    let canvas = sketch.createCanvas(1, 1, SVG);
    canvas.svg.style.display = 'none';
    sketch.pixelDensity(1);
    sketch.clear();
    sketch.noLoop();
  };

  sketch.draw = () => {};
}


// ------------------------------------------------------------ HELP ME
function helpMe() {
  alert(
`Gebruik:
  Laat deze popup zien: ‘H’ toets
  Pauzeren / afspelen animatie: spatiebalk`
  );
}


// ------------------------------------------------------------ RESIZE
function resize(w, h) {
  if (w == pw && h == ph) return;
  if (w < 1 || h < 1) return;

  pw = w;
  ph = h;

  print(`Resizing to: ${w} x ${h}...`);
  pixelDensity(1);
  resizeCanvas(pw, ph);
  // generator.pg.pixelDensity(1);
  // generator.pg.resizeCanvas(pw, ph);
  if (svgCanvas) {
    svgCanvas.pixelDensity(1);
    svgCanvas.resizeCanvas(pw, ph);
  }

  containCanvasInWrapper();
  containCanvasInWrapper(); // needs a double call
}


// ------------------------------------------------------------ CONTAIN CANVAS
function containCanvasInWrapper() {
  const canvAsp = pw / ph;

  const wrapperW = canvWrapper.elt.clientWidth;
  const wrapperH = canvWrapper.elt.clientHeight;
  const wrapperAsp = wrapperW / wrapperH;

  canvas.elt.style = '';
  if (canvAsp > wrapperAsp) {
    canvas.elt.style.height = '';
    canvas.elt.style.width = '100%';
  } else {
    canvas.elt.style.width = ''; 
    canvas.elt.style.height = 'calc(100vh - 2em)';
  }

  if (svgCanvas) {
    svgCanvas.canvas.wrapper.style = '';
    svgCanvas.canvas.svg.removeAttribute('width');
    svgCanvas.canvas.svg.removeAttribute('height');
    svgCanvas.canvas.svg.style.width = pw;
    svgCanvas.canvas.svg.style.height = ph;
  }

  canvScale = sqrt(pw * ph / (1920 * 1080));
}


// ------------------------------------------------------------ FRAME CAPTURING
function handleFrameCapture() {
  if (isCapturingFrames) {
    const vidButton = gui.getController('buttonVidCapture').controllerElement;
    if (savedFrameCount < nFrames) {
      saveToLocalFFMPEG(savedFrameCount);
      // progressBar.setProgress(savedFrameCount / nFrames);
      // progressBar.innerHTML = round(savedFrameCount / nFrames * 100) + '%';
      vidButton.elt.style.backgroundColor = colorToHexString(randCol());
      savedFrameCount++;
    } else {
      vidButton.elt.style.backgroundColor = null;
      stopCapture();
      print('End of saving frames, making video...');
      ffmpegCreateMP4();
    }
  }
}


// ------------------------------------------------------------ EVENT HANDLERS
function keyPressed() {
  if (gui.isTypingText) return;

  if (keyCode >= 48 && keyCode <= 57) {
    let utilInd = keyCode - 48;
    utilBools[utilInd] = !utilBools[utilInd];
  }
  
  switch (key.toLowerCase()) {
  case ' ':
    isPlaying = !isPlaying;
    break;
  case 'h':
    helpMe();
    break;

  case '[':
    frameCount -= frameJump;
    break;
  case ']':
    frameCount += frameJump;
    break;
  case 's':
    save(getOutputFileName() + '.png');
    break;
  case 'f':
    let fs = fullscreen();
    fullscreen(!fs);
    break;
  case 'b':
    gui.toggleSide();
    break;

  case 'ArrowRight':
    if (SSID == SSIDs[SSIDs.length - 1])
      addNextSSID();
    else
      SSIDindex++;
    setup();
    break;
  case 'ArrowLeft':
    if (SSIDindex > 0) {
      SSIDindex--;
      setup();
    }
    break;

  case 'ArrowUp': 
    K++;
    print("K: " + K);
    break;
  case 'ArrowDown':
    if (K <= 0) break;
    K--;
    print("K: " + K);
    break;
  }
}

function mousePressed() {
  isMouseDown = true;
}

function mouseReleased() {
  isMouseDown = false;
}

const relScrollVel = (isMac() ? 0.1 : 1) * 0.06;
function mouseWheel(event) {
  let wheelDist = getWheelDistance(event);
  const s = exp(wheelDist * relScrollVel);
  scrollScale *= s;
  // scrollScale = constrain(scrollScale, 0.2, 5);
}

function windowResized() {
  containCanvasInWrapper();
}

