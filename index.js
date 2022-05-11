var CanvasKit;
CanvasKitInit({
  locateFile: (file) => 'node_modules/canvaskit-wasm/bin/'+file,
}).then((CanvasKit) => {
  // Code goes here using CanvasKitInit
  this.CanvasKit = CanvasKit;
  // wait at least 0.5 second to remove it
  setTimeout(() => document.getElementById("spinner").remove(), 500);
});

var StrokeType = Object.freeze({
  Variable: "variable",
  Constant: "constant",
});

var Engine = Object.freeze({
  CanvasKitGPU: "canvaskit-gpu",
  CanvasKit2D: "canvaskit-2d",
  HtmlCanvas: "htmlcanvas",
});

var SIZE = 600;
var currentStrokes = [];
var currentStrokeType = StrokeType.Variable;

// entry point
function draw() {

  const engines = document.getElementById('engines');
  const canvaskitResult = document.getElementById("canvaskit-result");
  const htmlcanvasResult = document.getElementById("htmlcanvas-result");
  const drawButton = document.getElementById('drawButton');

  const canvas = document.getElementById("htmlcanvas");
  const canvasKit = document.getElementById("canvaskit");
  var engine = engines.options[engines.selectedIndex].value;

  drawButton.innerHTML = "Drawing...";
  var startTime = performance.now();
  switch (engine) {
    case Engine.CanvasKitGPU: 
      var surface = CanvasKit.MakeWebGLCanvasSurface(canvasKit);
      drawCanvasKit(surface);
      break;
    case Engine.CanvasKit2D: 
      var surface = CanvasKit.MakeCanvasSurface(canvasKit);
      drawCanvasKit(surface);
      break;
    case Engine.HtmlCanvas: 
      canvas.width = canvas.height = 0;
      canvas.width = canvas.height = SIZE;
      drawHtmlCanvas(canvas);
      break;
  }
  drawButton.innerHTML = "Draw";
  var endTime = performance.now();

  var text = `Used ${endTime - startTime} ms`;
  if (engine == Engine.CanvasKitGPU || engine == Engine.CanvasKit2D) {
    canvaskitResult.textContent = text;
  } else {
    htmlcanvasResult.textContent = text;
  }
}

function updateSliderValue(value) {
  let span = document.getElementById("numOfStrokesValue");
  span.innerText = value;
}

function generateStrokesFromInput() {
  let currentStrokeSpan = document.getElementById("currentStrokeSpan");
  let n = document.getElementById("numOfStrokes").value;
  let strokeTypes = document.getElementById("strokeType");
  let type = strokeTypes.options[strokeTypes.selectedIndex].value;
  currentStrokes = generateStrokes(n, type);
  currentStrokeType = type;
  currentStrokeSpan.innerText = `strokeType: ${type}, strokeNum: ${n}`;
}


