var StrokeType = Object.freeze({
  Variable: "variable",
  Constant: "constant",
});

var Engine = Object.freeze({
  CanvasKitWebGL: "canvaskit-webgl",
  CanvasKit2D: "canvaskit-2d",
  HTMLCanvas: "htmlcanvas",
});

var SIZE = 600;

export {
  StrokeType,
  Engine,
  SIZE
}
