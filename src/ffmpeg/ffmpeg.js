
// example from:
// https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/vanilla-app/public/concatDemuxer.html


const { fetchFile } = FFmpegUtil;
const { FFmpeg } = FFmpegWASM;

let ffmpegFR = 30;

let ffmpeg = null;
let isFfmpegInit = false;

let progressBar;
let loadingAnim;
let videoDownloadLink;

let conversionProgress = 0;
let dConversionProgress = 1;

let savedFrameCount = 0;

let guiCaptureButton;
let guiVideoLoadingDiv;


function startCapture() {
  // console.log('startCapture()...');
  savedFrameCount = 0;
  isCapturingFrames = true;
  isPlaying = true;
  // frameCount = 0; // resets 'time'
}
function stopCapture() {
  // console.log('stopCapture()...');
  isCapturingFrames = false;
  isPlaying = false;
}
async function clearFramesDir() {
  // console.log('clearFramesDir()...');
  const listdir = await ffmpeg.listDir('/frames');
  for (let item of listdir) {
    if (item.isDir) continue;
    await ffmpeg.deleteFile('/frames/' + item.name);
  }
  await ffmpeg.deleteDir('/frames');
}

const BASE64_MARKER = ';base64,';
function convertDataURIToBinary(dataURI) {
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataURI.substring(base64Index);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  let array = new Uint8Array(new ArrayBuffer(rawLength));
  for(i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}
function saveToLocalFFMPEG(frameId) {
  // console.log('Saving local frame...', frameId);
  let dataURI = canvas.elt.toDataURL('image/png');
  let pngData = convertDataURIToBinary(dataURI);
  // console.log(dataURI, pngData);
  ffmpegSaveFrame(frameId, pngData);
}





function ffmpegUtilInit() {
  // loadingAnim = document.getElementById('loading-anim');
  // loadingAnim.style.display = 'none';

  // progressBar = document.getElementById('progress-bar');
  // progressBar.setProgress = (q) => {
  //   progressBar.style.width = round(q * 100) + '%';
  // };

  guiCaptureButton = gui.getController('buttonVidCapture');
}

let TOT = 0;

async function ffmpegInit() {
  ffmpeg = new FFmpeg();

  ffmpeg.on("log", ({ logMsg }) => {
    // console.log(logMsg);
    updateConversionProgress();
  });

  ffmpeg.on("progress", ({ progress, time }) => {
    // let percentage = round(progress / nSavedFrames * 100);
    // message.innerHTML = `${time / 1000000} s, prog ${progress}, ${percentage}%`;
    // progressBar.setProgress(progress / nSavedFrames);
    // progressBar.innerHTML = percentage;
    // progressBar.innerHTML = round(time / 1000) + ' s...';
    // console.log(progress, time);
    updateConversionProgress();
  });

  await ffmpeg.load({
    // coreURL: "/assets/core/package/dist/umd/ffmpeg-core.js",
    // coreURL: "/node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.js",
    // coreURL: "/ffmpeg/core/ffmpeg-core.js",
    // INCLUDE ROOT OF DOMAIN

    // coreURL: window.location.pathname + "ffmpeg/core/ffmpeg-core.js", // ------------- LOCAL
    coreURL: window.location.origin + "/shared-libs/ffmpeg/core/ffmpeg-core.js", // ------------- SHARED
  });

  isFfmpegInit = true;
}

function updateConversionProgress() {
  conversionProgress += dConversionProgress;
  let s = '';
  let n = conversionProgress % 30;// round(nmc(conversionProgress) * 25);
  for (let i = 0; i < n; i++) s += '#';
  // progressBar.innerHTML = s;
  guiCaptureButton.controllerElement.html(s);
}


function ffmpegSaveFrame(frameId, pngData) {
  ffmpeg.createDir('frames');
  let fileName = nf(frameId, 6) + '.png';
  let filePath = 'frames/' + fileName;
  ffmpeg.writeFile(filePath, pngData);
  // console.log(`Written ${filePath}.`);
}


async function getFrameFileNames() {
  let frames = await ffmpeg.listDir('frames');
  frames = frames.filter(item => !item.isDir).map(frame => frame.name);
  // console.log(frames);
  return frames;
}


async function ffmpegCreateMP4() {
  // console.log('Creating MP4...');

  guiCaptureButton.disable();
  guiVideoLoadingDiv.div.show();

  // progressBar.setProgress(1);
  // progressBar.innerHTML = 'Creating video...';

  // loadingAnim.style.display = 'inline-block';

  // create concatenation file list as .txt
  let frames = await getFrameFileNames();
  let inputPaths = frames.map(f => `file frames/${f}`);
  const concatFile = 'concat_list.txt';
  await ffmpeg.writeFile(concatFile, inputPaths.join('\n'));

  // run ffmpeg concatenation
  const outputFile = 'output.mp4';
  // await ffmpeg.exec(['-f', 'concat', '-safe', '0', '-i', concatFile, 'output.mp4']);
  // const args = `-r 30 -f image2 -safe 0 -f concat -i ${concatFile} -progress pipe:2 -vcodec libx264 -pix_fmt yuv420p -crf 21 -vf fps=30.0,scale=1080:1080:flags=lanczos -movflags faststart ${outputFile}`.split(' ');
  const width = canvas.width, height = canvas.height;
  const args = `-r ${ffmpegFR} -f image2 -safe 0 -f concat -i ${concatFile} -progress pipe:2 -vcodec libx264 -pix_fmt yuv420p -crf 21 -vf fps=${ffmpegFR}.0,scale=${width}:${height}:flags=lanczos -movflags faststart ${outputFile}`.split(' ');
  let execResult = await ffmpeg.exec(args);
  // console.log(`ffmpeg.exec result: ${execResult}`);
  // console.log('Completed concatenation.');

  // load mp4 to HTML video element
  // console.log('Loading MP4 data...');
  const data = await ffmpeg.readFile(outputFile);
  const video = document.getElementById('output-video');
  const blob = new Blob([data.buffer], {type: 'video/mp4'});
  // console.log(blob);
  const blobURL = URL.createObjectURL(blob);
  video.src = blobURL;
  
  videoDownloadLink = document.getElementById('video-link');
  videoDownloadLink.innerHTML = 'Download video';
  videoDownloadLink.title = 'download';
  videoDownloadLink.download = getOutputFileName();
  videoDownloadLink.href = blobURL;
  videoDownloadLink.click(); // auto-download

  guiVideoLoadingDiv.div.hide();
  guiCaptureButton.controllerElement.html('🎬 Start video capture');
  guiCaptureButton.enable();

  // setTimeout(() => alert('De video is gereed en wordt gedownload.'), 50);
  setTimeout(() => alert('The video is ready and will be downloaded.'), 50);

  // console.log('Clearing frames...');
  clearFramesDir();

  console.log('Created and loaded MP4.');

  isPlaying = true;
}


async function dir(path) {
  const listdir = await ffmpeg.listDir(path);
  for (let item of listdir) {
    console.log(item.isDir ? 'dir' : 'file', item.name);
  }
}
