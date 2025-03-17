precision highp float;
precision highp int;

// ---------------------------------------------------------------- CONSTANTS
#define AA 1
#define SCALE 1.

#define PI             3.14159265358979323846264
#define TAU            6.28318530717958647692528
#define SQRT_2         1.41421356237309504880169
#define PHI            1.61803398874989484820459
#define E              2.71828182845904523536028

#define X_AXIS         vec3(1., 0., 0.)
#define Y_AXIS         vec3(0., 1., 0.)
#define Z_AXIS         vec3(0., 0., 1.)

#define WHITE          vec3(1.)
#define BLACK          vec3(0.)
#define DARK_GREY      vec3(.25)
#define MID_GREY       vec3(.5)
#define LIGHT_GREY     vec3(.75)
#define RED            vec3(0.859,0.133,0.165)
#define GREEN          vec3(0.765,0.922,0.471)
#define BLUE           vec3(0.020,0.235,0.369)
#define YELLOW         vec3(0.906,0.733,0.255)
#define CYAN           vec3(0.267,0.733,0.643)
#define MAGENTA        vec3(0.769,0.271,0.604)
#define PINK           vec3(1.,0.1,0.6)


// ---------------------------------------------------------------- VARYINGS
varying vec2 vTexCoord; // UV coordinate from shader.vert


// ---------------------------------------------------------------- UNIFORMS
uniform vec2 resolution;
uniform vec3 mouse;
uniform float scrollVal;
uniform float time;
uniform sampler2D img;

uniform vec2 camOrigin;
uniform float camScale;
uniform vec2 camPan;

uniform bool utilBools[10];
uniform float utilVal;
uniform int utilInt;
uniform int K;


uniform bool isTransparent;
uniform bool isPrikkelArm;
uniform bool isPrikkelend;
uniform bool isTintsOnly;
uniform bool doDoorkijkje;
uniform float SSIDHash;

// // lists of things in this format
// #define N_MAX 100
// uniform int n;
// uniform float radii[N_MAX];
// uniform float locs[N_MAX * 2];
// // uniform vec3 cols[N_MAX];

#define MIN_WH min(resolution.x, resolution.y)


// ---------------------------------------------------------------- SCALAR MATHS
#define sat(x) clamp(x, 0., 1.)

#define triangle(x) (1. - 2. * abs(x - 0.5))
#define pyramid(x) (0.5 - abs(x - 0.5)) // = 1/2 * triangle(x)

#define sq(x) (x)*(x)
#define circleMap(x) sqrt(1. - sq(x - 1.))

#define nmc(x) (-cos(x) * 0.5 + 0.5)
#define nmc2(x) nmc(nmc(x) * PI)

#define flipUvY(uv) (mat3x2(1.,0.,0.,-1.,0.,1.) * vec3(uv, 1.)) // column-wise 3x2

float map(in float x, in float xmin, in float xmax, in float ymin, in float ymax) {
  return (x - xmin) / (xmax - xmin) * (ymax - ymin) + ymin;
}

float mpow(in float x, in float p) {
  // mini pow for mapping
  float v = 2. * x - 1.;
  return (pow(abs(v), p) * sign(v)) * 0.5 + 0.5;
}

float sigmoid(in float x) { // [0, 1] 
  return 1. / (1. + exp(-x));
}
vec2 sigmoid(in vec2 v) { return vec2(sigmoid(v.x), sigmoid(v.y)); }
vec3 sigmoid(in vec3 v) { return vec3(sigmoid(v.r), sigmoid(v.g), sigmoid(v.b)); }

float tanh(in float x) { // [-1, 1]
  return 2. * sigmoid(2. * x) - 1.; // fast
}
vec2 tanh(in vec2 v) { return vec2(tanh(v.x), tanh(v.y)); }
vec3 tanh(in vec3 v) { return vec3(tanh(v.r), tanh(v.g), tanh(v.b)); }

float smin( float a, float b, float k ) {
  // circular smooth min
  // https://iquilezles.org/articles/smin/
  k *= 3.414213562373096; // 1.0/(1.0-sqrt(0.5));
  return max(k, min(a, b)) - 
    length(max(k - vec2(a, b), 0.0));
}


// ---------------------------------------------------------------- VECTOR MATHS

#define dot2(x) dot(x, x)

float antidot(in vec2 a, in vec2 b) {
  // (2D cross product)
  return a.x * b.y - a.y * b.x;
}

vec3 spherical(in float alpha, in float beta, in float radius) {
  return vec3(
    cos(alpha) * cos(beta),
    sin(alpha),
    cos(alpha) * sin(beta)
  ) * radius;
}

const mat2 rot45 = mat2(1., 1., -1., 1.) * 0.5 * SQRT_2;
const mat2 rot90 = mat2(0., 1., -1., 0.);

mat2 rotMat(in float theta) {
  float s = sin(theta);
  float c = cos(theta);
  return mat2(c, -s, s, c);
}

vec2 rotate(in vec2 v, in float theta) {
  return rotMat(theta) * v;
}

vec3 rotateAroundAxis(in vec3 pos, in vec3 axisOrigin, in vec3 axisDirNormalized, in float theta){
  // based on https://github.com/ykob/glsl-util
  pos -= axisOrigin;
  float c = cos(theta);
  float s = sin(theta);
  float t = 1.0 - c;
  vec3 a = axisDirNormalized;
  mat3 m = mat3(
    t * a.x * a.x + c,
    t * a.x * a.y + a.z * s,
    t * a.x * a.z - a.y * s,
    t * a.y * a.x - a.z * s,
    t * a.y * a.y + c,
    t * a.y * a.z + a.x * s,
    t * a.z * a.x + a.y * s,
    t * a.z * a.y - a.x * s,
    t * a.z * a.z + c
  );
  return m * pos + axisOrigin;
}

vec2 projectOnto(in vec2 a, in vec2 b) {
  return b * dot(a, b) / dot(b, b);
}

float signedAngleBetween(in vec2 a, in vec2 b) {
  // angle measured from a
  return atan( // args may be wrong way round
    a.x * b.y - a.y * b.x,
    a.x * b.x + a.y * b.y
    );
}

vec2 glslPixPos2ScreenPos(in vec2 glFrag) {
  // [0, width>, [0, height>, smallest dim maps to [-1, 1]
  return ((glFrag - resolution * 0.5) / (MIN_WH * 0.5));
}
vec2 processingPixPos2ScreenPos(in vec2 pxPos) {
  return glslPixPos2ScreenPos(
    (pxPos - camOrigin) * camScale + camOrigin + camPan
    ) * vec2(1., -1.);
}


// ---------------------------------------------------------------- RANDOMNESS
float randomSin(in vec2 pos, in float seed) {
  return fract(sin(dot(pos, vec2(12.9898, (seed + 1.) * 78.233))) * 43758.5453123);
}
float randomSin(in vec2 pos) { return randomSin(pos, 0.); }

float randomTan(in vec3 pos, in float seed){
  return fract(tan(distance(pos * 999. * (seed + PHI), vec3(PHI * 0.1, PI * 0.1, E))) * SQRT_2 * 1e4);
}
float randomTan(in vec2 pos, in float seed) { return randomTan(vec3(pos, E), seed); }
float randomTan(in float pos, in float seed) { return randomTan(vec2(pos), seed); }


// ---------------------------------------------------------------- NOISE
// Simplex 2D noise
// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
// ^ also has 3D & 4D noise
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, 
    -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float snoise(float x) {
  return snoise(vec2(x, PI));
}
vec2 snoise2(vec2 v) {
  return vec2(snoise(v), snoise(v + 99.));
}


// ---------------------------------------------------------------- COLOURS

#define gamma(col) pow(col, vec3(1./2.2))
#define ungamma(col) pow(col, vec3(2.2))


float sdCircle(in vec2 pos, in float r) {
  return length(pos) - r;
}

float sdRect(in vec2 pos, in vec2 halfSize) {
  vec2 d = abs(pos) - halfSize;
  return length(max(d, 0.)) + min(max(d.x, d.y), 0.);
}

// ---------------------------------------------------------------- RAYMARCHING

#define MAX_DIST 40.
#define MAX_ITERS 256
#define MIN_DIST 0.001

float sdSphere(in vec3 pos, in float r) {
  return length(pos) - r;
}

float sdExtrude(in vec3 pos, in float sdf2D, in float height) {
  vec2 w = vec2(sdf2D, abs(pos.z) - height);
  return min(max(w.x, w.y), 0.) + length(max(w, 0.));
}

float sdScene(in vec3 pos) {
  float sd = 1e9;

  sd = min(sd, sdSphere(pos, 0.5));

  return sd;
}

vec3 sdSceneNormal(in vec3 pos) {
  // iq's tetrahedron method
  const float h = 0.001; // replace by an appropriate value
  const vec2 k = vec2(1., -1.);
  return normalize(
    k.xyy * sdScene(pos + k.xyy * h) + 
    k.yyx * sdScene(pos + k.yyx * h) + 
    k.yxy * sdScene(pos + k.yxy * h) + 
    k.xxx * sdScene(pos + k.xxx * h)
  );
}

float raymarch(vec3 ro, vec3 rd) {
  float d = 0.;
  for (int i = 0; i < MAX_ITERS; i++) {
    float sd = sdScene(ro + rd * d);
    d += sd;
    if (sd < MIN_DIST || d > MAX_DIST) break;
  }
  if (d > MAX_DIST) return -1.;
  return d;
}



// **************************************************************** PASTE






// ================================================================ WIP








// ---------------------------------------------------------------- COMPUTE COLOUR
vec4 computeCol(in vec2 uv, in vec2 pos) {
  vec3 col = PINK;
  return vec4(col, 1.);
}


// ---------------------------------------------------------------- MAIN
void main() {
  // const int AA = 1;//K + 1;

  vec2 pxPosition = vTexCoord.xy * resolution.xy;

  vec4 totCol = vec4(0.);
  for (int nn = 0; nn < AA; nn++) {
    for (int mm = 0; mm < AA; mm++) {
      vec2 aa = vec2(float(nn), float(mm)) / float(AA);
      vec2 uv = (pxPosition + aa) / resolution.xy;
      vec2 pos = glslPixPos2ScreenPos(pxPosition + aa);

      vec4 acol = computeCol(uv, pos);


      if (utilBools[5]) acol.r = 1.;

      totCol += acol;
    }
  }

  totCol /= float(AA * AA);

  // totCol.rgb += (randomSin(vec2(gl_FragCoord.xy / resolution), time) * 2. - 1.) * 0.05; // add grain

  // #ifdef USE_GL_FRAG_COLOR
  gl_FragColor = totCol;
  // gl_FragColor = vec4(vTexCoord.xyy, 1.);
  // #else
  // fragColor = totCol;
  // #endif
}



