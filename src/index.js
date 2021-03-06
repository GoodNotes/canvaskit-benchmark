const CanvasKitInit = require('canvaskit-wasm/bin/canvaskit.js');
import { drawCanvasKit, drawCanvas2dContext } from './draw';
import { StrokeType, Engine, SIZE } from './types';
import { generateStrokes } from './generateStroke';
import { plot, parse } from './plot';

CanvasKitInit().then((CanvasKit) => {
  // Code goes here using CanvasKitInit
  window.CanvasKit = CanvasKit;

  const drawButton = document.getElementById("drawButton");
  drawButton.addEventListener("pointerup", () => {
    draw();
  }, { passive: true });

  document.getElementById("generateStrokeButton").onpointerup = generateStrokesFromInput;

  var plotButton = document.getElementById("plotButton");
  plotButton.onpointerup = plotResults;

  document.getElementById("spinner").remove();

});

var currentStrokes = [];
var currentStrokeType = StrokeType.Variable;

// entry point
function draw() {

  const engines = document.getElementById('engines');
  const drawButton = document.getElementById('drawButton');

  const htmlcanvas = document.getElementById("htmlcanvas");
  const canvasKitCanvas = document.getElementById("canvaskitCanvas");
  var engine = engines.options[engines.selectedIndex].value;

  drawButton.innerHTML = "Drawing...";

  var startTime;
  var endTime;

  var htmlcanvasFlushStartTime;
  function benchmark(resolve) {
    startTime = performance.now();
    switch (engine) {
      case Engine.CanvasKitWebGL: 
        var surface = CanvasKit.MakeWebGLCanvasSurface(canvasKitCanvas);
        surface.requestAnimationFrame((canvas) => {
          drawCanvasKit(canvas, currentStrokes, currentStrokeType);
          endTime = performance.now();

          resolve();
        });
        break;
      case Engine.CanvasKit2D: 
        var surface = CanvasKit.MakeCanvasSurface(canvasKitCanvas);
        surface.requestAnimationFrame((canvas) => {
          drawCanvasKit(canvas, currentStrokes, currentStrokeType);
          endTime = performance.now();

          resolve();
        });
        break;
      case Engine.HTMLCanvas: 
        htmlcanvas.width = htmlcanvas.height = 0;
        htmlcanvas.width = htmlcanvas.height = SIZE;

        // we cannot measure the flush time other than
        // waiting for it to become idle
        drawCanvas2dContext(htmlcanvas, currentStrokes, currentStrokeType);
        htmlcanvasFlushStartTime = performance.now();
        // force browser rendering here
        window.setTimeout(() => {
          endTime = performance.now();
          resolve();
        }, 0);

        break;
    }
  }
  // fake async
  setTimeout(() => {
    new Promise(benchmark).then(() => {
      log(startTime, endTime, engine, htmlcanvasFlushStartTime);
      drawButton.innerHTML = "Draw";
      return;
    });
  }, 0);
}

function log(startTime, endTime, engine, flushStartTime) {
  const canvaskitResult = document.getElementById("canvaskit-result");
  const htmlcanvasResult = document.getElementById("htmlcanvas-result");
  const logResult = document.getElementById("log");

  var durationText = (start, end) => {
    const v = end - start;
    const int = Math.floor(v);
    const decimal = v - int;
    
    return `${int + +decimal.toPrecision(3)}ms`;
  };
  var resultText = (engine, totalTime) => `[${engine}][${currentStrokes.length} ${currentStrokeType} strokes] Total time: ${totalTime}`;

  const span = document.createElement("span");

  var totalTime = durationText(startTime, endTime);
  var text;
  switch (engine) {
  case Engine.CanvasKit2D:
      text = resultText(engine, totalTime);
      canvaskitResult.textContent = text;
      break;
  case Engine.CanvasKitWebGL:
      text = resultText(engine, totalTime);
      canvaskitResult.textContent = text;
      break;
  case Engine.HTMLCanvas:
      text = resultText(engine, totalTime);
      if (flushStartTime) {
        text += `, drawTime: ${durationText(startTime, flushStartTime)}, flushTime: ${durationText(flushStartTime, endTime)}`
      }
      htmlcanvasResult.textContent = text;
      break;
  }
  span.innerHTML = text;
  logResult.appendChild(span);
  logResult.scrollTop = logResult.scrollHeight;
}

function plotResults() {
  const plotButton = document.getElementById("plotButton");
  const log = document.getElementById("log");
  plotButton.innerHTML = "Plotting...";

  setTimeout(() => {
    var text = "";
    for (let span of log.children) {
      let t = span.innerText;
      text += t + "\n";
    }
    plot(text);
    plotButton.innerHTML = "Plot results";
  }, 0);
}

function generateStrokesFromInput() {
  let generateButton = document.getElementById("generateStrokeButton");
  generateButton.innerHTML = "Generating...";

  window.setTimeout(() => {
    let currentStrokeSpan = document.getElementById("currentStrokeSpan");
    const input = document.getElementById("numOfStrokes");
    let n = Math.max(input.value || 0, 50);
    input.value = n;
    let strokeTypes = document.getElementById("strokeType");
    let type = strokeTypes.options[strokeTypes.selectedIndex].value;
    currentStrokes = generateStrokes(n, type, SIZE, SIZE);
    currentStrokeType = type;
    currentStrokeSpan.innerText = `strokeType: ${type}, strokeNum: ${n}`;
    generateButton.innerHTML = "Generate strokes";
  }, 0);
}
