

function randCol() {
  return color(random(255), random(255), random(255));
}


function initUtil(_duration, _framerate) {
  print("\nSETUP " + nf(SSIDindex, 2, 0) + " }------------------------------");

  // init util bools [1-9 + 0]
  for (let i = 0; i < 10; i++) utilBools.push(false);

  // SSID-based seed initialisation
  SSID = SSIDs[SSIDindex];
  randomSeed(SSID);
  noiseSeed(SSID);
  noiseOffs = SSID + sqrt(2) * sqrt(3) * PI;
  print("\tSSID: " + SSID);

  // set framerate and animation duration
  FR = _framerate;
  setDuration(_duration);
  frameRate(FR);
  print("\tduration: " + nf(duration, 0, 1) + " s, nFrames: " + nFrames);
  print("\tframeRate: " + FR + " fps");

  document.title = Generator.name + ' Generator';
}

function setDuration(_duration) {
  nFrames = int(_duration * FR);
  duration = nFrames / float(FR); // seconds
}

function getOutputFileName() {
  return Generator.name.replaceAll(' ', '-') + '_' + 
    pw + 'x' + ph + '_' + getTimestamp();
}


function generateSSID() {
  // randomSeed(getUNIX());
  return Math.floor(Math.random() * 1e8);
}
function getSSIDHash() {
  return SSID / 1e8;
}
function addNextSSID() {
  SSIDs.push(generateSSID());
  SSIDindex = SSIDs.length - 1;
  SSID = SSIDs[SSIDindex];
}



function getWheelDistance(evt) {
  if (!evt) evt = event;
  let w = evt.wheelDelta,
    d = evt.detail;
  if (d) {
    if (w) return (w / d / 40) * d > 0 ? 1 : -1;
    // Opera
    else return -d / 3; // Firefox;         TODO: do not /3 for OS X
  } else return w / 120; // IE/Safari/Chrome TODO: /3 for Chrome OS X
}



function setTime() {
  if (!isPlaying) frameCount--;

  ptime = time;
  if (doRunRealTime) time = millis() / 1000 + TAU;
  else time = frameCount / nFrames;
  dtime = time - ptime;
}




function createCanvasWrapper() {
  canvWrapper = createDiv();
  canvWrapper.id('canvas-workarea');
  canvas.parent(canvWrapper);
  if (svgCanvas) {
    canvWrapper.elt.append(svgCanvas.canvas.wrapper);
    svgCanvas.parent(canvWrapper);
  }
  document.querySelector('main').append(canvWrapper.elt);  
}










const frameJump = 100;

// function imageCentered(img, doFill) {
//   image(img, 0, 0, width, height, 0, 0, img.width, img.height, doFill ? COVER : CONTAIN);
// }





const b64Digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
const toB64 = n => n.toString(2).split(/(?=(?:.{6})+(?!.))/g).map(v => b64Digits[parseInt(v, 2)]).join('');
const fromB64 = s64 => s64.split('').reduce((s, v) => s * 64 + b64Digits.indexOf(v), 0);




// -------------------------------------- TIME

function getUNIX() {
  return Math.floor(new Date().getTime() / 1000);
}

function getTimestamp() {
  return toB64(new Date().getTime());
}

function randomDate(date1, date2) {
  function randomValueBetween(min, max) {
    return Math.random() * (max - min) + min;
  }
  let d1 = date1 || "01-01-1970";
  let d2 = date2 || new Date().toLocaleDateString();
  d1 = new Date(d1).getTime();
  d2 = new Date(d2).getTime();
  if (d1 > d2) {
    return new Date(randomValueBetween(d2, d1));
  } else {
    return new Date(randomValueBetween(d1, d2));
  }
}


// -------------------------------------- STRINGS UTIL

function capitalizeFirstLetter(inputString) {
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}



// -------------------------------------- ARRAY UTIL

function choice(arr) {
  return arr[int(random(arr.length))];
}

function last(arr) {
  return arr[arr.length - 1];
}


// -------------------------------------- MEMORY

function computeRoughSizeOfObject(object) {
  const objectList = [];
  const stack = [object];
  let bytes = 0;
  while (stack.length) {
    const value = stack.pop();

    switch (typeof value) {
      case 'boolean':
        bytes += 4;
        break;
      case 'string':
        bytes += value.length * 2;
        break;
      case 'number':
        bytes += 8;
        break;
      case 'object':
        if (!objectList.includes(value)) {
          objectList.push(value);
          for (const prop in value) {
            if (value.hasOwnProperty(prop)) {
              stack.push(value[prop]);
            }
          }
        }
        break;
    }
  }
  return bytes;
}


// -------------------------------------- SYSTEM

function isMac() {
  return window.navigator.platform.toLowerCase().indexOf("mac") > -1;
}


// -------------------------------------- DRAWING

function imageCenteredXY(img, doFill, pos0, pos1, sc, flipHorizontal=false) {
  let dx = -pos0;//doFill ? pos0 : pos1;
  let dy = pos1;//doFill ? pos1 : pos0;

  push(); 
  {

    imageMode(CENTER);
    let am = width / height, aimg = img.width / img.height;
    const doFitVertical = am > aimg ^ doFill;
    let renderW = doFitVertical ? (height * aimg) : width;
    let renderH = doFitVertical ? height : (width / aimg);
    
    translate(width * 0.5, height * 0.5);
    let scD = 1 * (doFitVertical ? (renderW - width) : (renderH - height));
    translate(dx * scD, dy * scD);

    scale(sc);

    if (flipHorizontal) scale(-1, 1);

    image(img, 0, 0, renderW, renderH);
  }
  pop();
}

function imageCenteredXYTransformation(x, y, img, doFill, pos0, pos1, sc) {
  let dx = -pos0;//doFill ? pos0 : pos1;
  let dy = pos1;//doFill ? pos1 : pos0;

  let am = width / height, aimg = img.width / img.height;
  const doFitVertical = am > aimg ^ doFill;
  let renderW = doFitVertical ? (height * aimg) : width;
  let renderH = doFitVertical ? height : (width / aimg);
  
  x -= img.width * 0.5;
  y -= img.height * 0.5;

  sc *= renderW / img.width;
  x *= sc;
  y *= sc;

  let scD = 1 * (doFitVertical ? (renderW - width) : (renderH - height));
  // translate(dx * scD, dy * scD);
  x += dx * scD;
  y += dy * scD;

  // scale(sc);

  x += width * 0.5;
  y += height * 0.5;

  return new Vec2D(x, y);
}

function imageCentered(img, doFill, pos=0) {
  push(); 
  {

    imageMode(CENTER);
    let am = width / height, aimg = img.width / img.height;
    const doFitVertical = am > aimg ^ doFill;
    let renderW = doFitVertical ? (height * aimg) : width;
    let renderH = doFitVertical ? height : (width / aimg);
    
    if (pos != 0) {
      let delta = pos * 0.5 * (doFitVertical ? (renderW - width) : (renderH - height));
      translate(
        doFitVertical ? delta : 0,
        doFitVertical ? 0 : delta
      );
    }

    image(img, width * 0.5, height * 0.5, renderW, renderH);
  }
  pop();
}

function pgImageCentered(pg, img, doFill) {
  pg.push();
  pg.imageMode(CENTER);
  let am = pg.width / pg.height, aimg = img.width / img.height;
  pg.image(img, 
    pg.width * 0.5, pg.height * 0.5, 
    am > aimg ^ doFill ? (pg.height*aimg) : pg.width,
    am > aimg ^ doFill ? pg.height : (pg.width/aimg)
    );
  pg.pop();
}

function getMouseMappedToCenteredPg(pg, doFill) {
  // main aspect ratio, pg aspect ratio
  let am = width / height, apg = pg.width / pg.height;

  // pg is fitted to screen height
  let isPgFitVertical = am > apg;

  let pgSc = isPgFitVertical ?
    height / pg.height :
    width / pg.width;

  let pgMouse = isPgFitVertical ?
    new Vec2D(
    map((mouseX - width / 2) / (pg.width * pgSc / 2), -1, 1, 0, pg.width ),
    map(mouseY, 0, height, 0, pg.height)
    ) :
    new Vec2D(
    map(mouseX, 0, width, 0, pg.width),
    map((mouseY - height / 2) / (pg.height * pgSc / 2), -1, 1, 0, pg.height )
    );
  return pgMouse;
}


// -------------------------------------- COLOURS

function lum(col) {
  if (!col.levels) col = color(col);
  return 0.2125 * col.levels[0] / 255 +
    0.7154 * col.levels[1] / 255 + 
    0.0721 * col.levels[2] / 255;
}

function v(col) {
  if (!col.levels) col = color(col);
  return (col.levels[0] + col.levels[1] + col.levels[2]) / 3;
}

function colorToHexString(col, doAlpha=false) {
  let levels = col.levels;
  if (!doAlpha) levels = levels.slice(0, 3);
  return '#' + levels.map(l => l.toString(16).padStart(2, '0')).join('');
}
