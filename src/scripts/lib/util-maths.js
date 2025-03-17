// "use strict";

// -------------------------------------- CONSTANTS

const PHI = (Math.sqrt(5) + 1) / 2;



// -------------------------------------- HASHING

function simpleIntToFloatHash(i) {
  return fract(sin((i * 1097238.23492523) * 23479.23429237));
}

function stringToFloatHash(inputString) {
  let hash = 0, chr;
  if (inputString.length === 0)
    return hash;
  for (let i = 0; i < inputString.length; i++) {
    chr = inputString.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return abs(hash / 2147483647);
}

function hashThreeIntegers(a, b, c) {
  const prime = 31; // A prime number to afunction common patterns

  let hash = 17; // Initial value, can be any prime number
  hash = hash * prime + a;
  hash = hash * prime + b;
  hash = hash * prime + c;
  return hash;
}


// -------------------------------------- MAPPING


function sign(x) {
  return x >= 0 ? 1 : -1;
}

function nmc(x) {
  return -cos(x) * 0.5 + 0.5;
}

function sigmoid(x) {
  return 1 / (1 + exp(-x));
}
function tanh(x) {
  return sigmoid(2 * x) * 2 - 1;
}

const E = Math.E;
function gaussian(x) {
  return exp(-pow(x, 2));
}
function gaussianSharp(x) {
  return exp(-abs(x));
}
function gaussianAngular(x) {
  return lerp(gaussian(x), gaussianSharp(x), 0.5);
}
function gaussianWobble(x) {
  return lerp(gaussian(x), gaussianSharp(x), 3);
}

function paramToIntSteps(t, n) {
  return floor(t * n * (1-1e-5));
}


// -------------------------------------- L.ALGEBRA & GEOMETRY

function mix(va, vb, t) {
  return vb.sub(va).scale(t).add(va);
}

function midPoint(va, vb) {
  return mix(va, vb, 0.5);
}

function inCanvas(v, offs) {
  return v.x >= -offs && v.x < width + offs && v.y >= -offs && v.y < height + offs; 
}

function isMouseInside(x, y, w, h) {
  return mouseX >= x && mouseX < x + w && mouseY >= y && mouseY < y + h;
}

function inPg(v, offs) {
  return v.x >= -offs && v.x < (pg.width + offs) && v.y >= -offs && v.y < (pg.height + offs); 
}

function triangleSign(p1, p2, p3) {
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}
function isPointInTriangle (pt, v1, v2, v3) {
  const d1 = triangleSign(pt, v1, v2);
  const d2 = triangleSign(pt, v2, v3);
  const d3 = triangleSign(pt, v3, v1);
  const has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  const has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
  return !(has_neg && has_pos);
}

function signedAngleBetween(v, w) {
  // angle measured from v
  return atan2(
    v.x * w.y - v.y * w.x,
    v.x * w.x + v.y * w.y
    );
}



// -------------------------------------- STATISTICS

function numsToRoundedPercentages(list) {
  let listSum = list.reduce((acc, x) => acc + x, 0);
  if (listSum <= 0) 
    return;

  let normalizedList = [...list];

  let percentages = [];
  let index = 0;
  for (let num of normalizedList) {
    let percent = num / listSum * 100;
    let rounded = round(percent);
    let error = percent - rounded;
    percentages.push([index, rounded, error]);
    index++;
  }

  while (true) {
    let sum = percentages.map(item => item[1]).reduce((acc, x) => acc + x, 0);
    if (sum == 100 || sum <= 0) 
      break;

    percentages.sort((a, b) => abs(b[2]) - abs(a[2]));
    percentages[0][1] += sign(percentages[0][2]);
    percentages[0][2] = 0;
  }
  percentages.sort((a, b) => a[0] - b[0]); // sort index

  return percentages.map(item => item[1]);
}
