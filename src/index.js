const CanvasKitInit = require('canvaskit-wasm/bin/canvaskit.js');
import { drawCanvasKit, drawCanvas2dContext } from './draw';
import { StrokeType, Engine, SIZE } from './types';
import generateStrokes from './generateStroke';

CanvasKitInit().then((CanvasKit) => {
  // Code goes here using CanvasKitInit
  window.CanvasKit = CanvasKit;
  var slider = document.getElementById("numOfStrokes");
  slider.oninput = () => updateSliderValue(slider.value);
  document.getElementById("drawButton").onclick = draw;
  document.getElementById("generateStrokeButton").onclick = generateStrokesFromInput;

  var copyLogButton = document.getElementById("copyLogButton");
  copyLogButton.onclick = copyLog;

  // wait at least 0.5 second to remove it
  setTimeout(() => document.getElementById("spinner").remove(), 500);

});

var currentStrokes = [];
var currentStrokeType = StrokeType.Variable;

// entry point
function draw() {

  const engines = document.getElementById('engines');
  const drawButton = document.getElementById('drawButton');

  const htmlcanvas = document.getElementById("htmlcanvas");
  const canvasKitCanvas = document.getElementById("canvaskitCanvas");
  const canvasKitImg = document.getElementById("canvaskitImg");
  var engine = engines.options[engines.selectedIndex].value;

  drawButton.innerHTML = "Drawing...";
  function benchmark() {
    var startTime = performance.now();
    var flushStartTime = 0;
    switch (engine) {
      case Engine.CanvasKitGPU: 
        canvasKitCanvas.style.display = 'block';
        canvasKitImg.style.display = 'none';
        var surface = CanvasKit.MakeWebGLCanvasSurface(canvasKitCanvas);
        flushStartTime = drawCanvasKit(surface, currentStrokes, currentStrokeType);
        break;
      case Engine.CanvasKit2D: 
        canvasKitCanvas.style.display = 'none';
        canvasKitImg.style.display = 'block';
        var canvas = CanvasKit.MakeCanvas(SIZE, SIZE);
        drawCanvas2dContext(canvas, currentStrokes, currentStrokeType);
        flushStartTime = performance.now();
        var src = canvas.toDataURL();
        canvasKitImg.src = src;
        break;
      case Engine.HtmlCanvas: 
        htmlcanvas.width = htmlcanvas.height = 0;
        htmlcanvas.width = htmlcanvas.height = SIZE;
        drawCanvas2dContext(htmlcanvas, currentStrokes, currentStrokeType);
        break;
    }
    var endTime = performance.now();

    log(startTime, endTime, flushStartTime, engine);
    drawButton.innerHTML = "Draw";
  }

  // fake async
  setTimeout(benchmark, 0);
}

function log(startTime, endTime, flushStartTime, engine) {
  const canvaskitResult = document.getElementById("canvaskit-result");
  const htmlcanvasResult = document.getElementById("htmlcanvas-result");
  const logResult = document.getElementById("log");

  var durationText = (start, end) => {
    const v = end - start;
    const int = Math.floor(v);
    const decimal = v - int;
    
    return `${int + +decimal.toPrecision(3)}ms`;
  };
  var resultWithoutFlushText = (engine, totalTime) => `[${engine}][${currentStrokes.length} ${currentStrokeType} strokes] Total time: ${totalTime}`;
  var resultWithFlushText = (engine, totalTime, drawTime, flushTime) => `${resultWithoutFlushText(engine, totalTime)}, draw time: ${drawTime}, flush time: ${flushTime}`;

  const span = document.createElement("span");

  var totalTime = durationText(startTime, endTime);
  var drawTime = durationText(startTime, flushStartTime);
  var flushTime = durationText(flushStartTime, endTime);
  var text;
  switch (engine) {
  case Engine.CanvasKit2D:
      text = resultWithFlushText(engine, totalTime, drawTime, flushTime);
      canvaskitResult.textContent = text;
      break;
  case Engine.CanvasKitGPU:
      text = resultWithFlushText(engine, totalTime, drawTime, flushTime);
      canvaskitResult.textContent = text;
      break;
  case Engine.HtmlCanvas:
      text = resultWithoutFlushText(engine, totalTime);
      htmlcanvasResult.textContent = text;
      break;
  }
  span.innerHTML = text;
  logResult.appendChild(span);
  logResult.scrollTop = logResult.scrollHeight;
}

function updateSliderValue(value) {
  let span = document.getElementById("numOfStrokesValue");
  span.innerText = value;
}

function copyLog() {
  const copyLogButton = document.getElementById("copyLogButton");
  const log = document.getElementById("log");
  copyLogButton.innerHTML = "Copying...";
  var text = "";
  for (let span of log.children) {
    let t = span.innerText;
    text += t + "\n";
  }
  var type = "text/plain";
  var blob = new Blob([text], { type });
  var data = [new ClipboardItem({ [type]: blob })];
  navigator.clipboard.write(data).then(() => {
    copyLogButton.innerHTML = "Copy logs to clipboard";
  });
}

function generateStrokesFromInput() {
  let currentStrokeSpan = document.getElementById("currentStrokeSpan");
  let n = document.getElementById("numOfStrokes").value;
  let strokeTypes = document.getElementById("strokeType");
  let type = strokeTypes.options[strokeTypes.selectedIndex].value;
  currentStrokes = generateStrokes(n, type, SIZE, SIZE);
  currentStrokeType = type;
  currentStrokeSpan.innerText = `strokeType: ${type}, strokeNum: ${n}`;
}

