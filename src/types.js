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

export {
  StrokeType,
  Engine,
  SIZE
}
