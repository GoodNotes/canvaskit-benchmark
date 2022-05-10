var CanvasKit;
CanvasKitInit({
  locateFile: (file) => '/node_modules/canvaskit-wasm/bin/'+file,
}).then((CanvasKit) => {
  // Code goes here using CanvasKitInit
  this.CanvasKit = CanvasKit;
  // wait at least 0.5 second to remove it
  setTimeout(() => document.getElementById("spinner").remove(), 500);
});

var SIZE = 600;

// entry point
function draw() {
  var examples = document.getElementById('examples');
  var example = examples.options[examples.selectedIndex].value;

  var engines = document.getElementById('engines');
  var engine = engines.options[engines.selectedIndex].value;

  let canvas;
  let isCanvasKit = false;
  switch (engine) {
    case "canvaskit": 
      canvas = CanvasKit.MakeCanvas(SIZE, SIZE); 
      isCanvasKit = true; 
      break;
    case "htmlcanvas": 
      canvas = document.getElementById("htmlcanvas");
      canvas.getContext('2d').clearRect(0, 0, SIZE, SIZE);
      break;
  }
  var startTime = performance.now();
  var imgData;
  switch (example) {
    case "default": 
      imgData = drawDefault(canvas);
      break;
    case "another": 
      imgData = drawAnother(canvas);
      break;
    default: 
      throw Exception(`Value not handled: ${example}`);
  }
  var endTime = performance.now();

  var text = `Used ${endTime - startTime} ms`;
  if (isCanvasKit) {
    document.getElementById("canvaskit-result").textContent = text;
    document.getElementById("canvaskit").src = imgData;
    canvas.dispose();
  } else {
    document.getElementById("htmlcanvas-result").textContent = text;
  }
}
