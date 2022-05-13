# CanvasKit vs HTMLCanvas benchmark

This is a simple application built for measuring the rendering performance of both rendering engine, namely CanvasKit based on skia, and also native HTMLCanvas, which is also based on Skia underneath.

## Usage

Visit https://goodnotes.github.io/canvaskit-benchmark/ to play around with both canvases.

Steps:

1. Choose the stroke type that you want to generate, e.g. variable or constant (default to constant)
2. Enter the number of strokes that you want to generate, default to 50
3. Click "Generate strokes"
4. Choose your rendering engine, e.g. CanvasKit2D, CanvasKitWebGL or HTMLCanvas
5. Click "Draw".
6. Wait for the results that will be printed as logs.
7. You can plot the reults by clicking "Plot results"

