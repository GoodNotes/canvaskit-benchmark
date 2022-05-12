import { StrokeType } from './types';

function drawCanvasKit(surface, strokes, type) {
  let canvas = surface.getCanvas(); 

  for (let stroke of strokes) {
    let path = new CanvasKit.Path();
    let paint = new CanvasKit.Paint();
    paint.setColor(CanvasKit.parseColorString(stroke.color));
    paint.setAntiAlias(true);
    if (type == StrokeType.Variable) {
      paint.setStyle(CanvasKit.PaintStyle.Fill);
      applyVariableStrokeTo(path, stroke);
      canvas.drawPath(path, paint);
    } else {
      paint.setStyle(CanvasKit.PaintStyle.Stroke);
      paint.setStrokeCap(CanvasKit.StrokeCap.Round);
      paint.setStrokeJoin(CanvasKit.StrokeJoin.Round);
      paint.setStrokeWidth(stroke.thickness);
      applyConstantWidthStrokeTo(path, stroke);
      canvas.drawPath(path, paint);
    }
    path.delete();
    paint.delete();
  }
  var st = performance.now();
  surface.flush();
  return st;
}

function drawCanvas2dContext(canvas, strokes, type) {
  let context = canvas.getContext('2d');
  for (let stroke of strokes) {
    if (type == StrokeType.Variable) {
      context.fillStyle = stroke.color;
      applyVariableStrokeTo(context, stroke);
      context.fill();
    } else {
      context.strokeStyle = stroke.color;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.lineWidth = stroke.thickness;
      applyConstantWidthStrokeTo(context, stroke);
      context.stroke();
    }
    context.beginPath();
  }
}

function applyVariableStrokeTo(context, stroke) {
  for (let command of stroke.commands) {
    if (command.name == "PVariableWidthQuadCurveTo") {
      for (let cmd of command.outline) {
        switch (cmd.name) {
          case 'PPoint': // moveTo
            context.moveTo(cmd.x, cmd.y);
            break;
          case 'PQuadCurveTo':
            if (context['quadraticCurveTo'] !== undefined) {
              context.quadraticCurveTo(cmd.control.x, cmd.control.y, cmd.end.x, cmd.end.y);
            } else {
              context.quadTo(cmd.control.x, cmd.control.y, cmd.end.x, cmd.end.y);
            }
            break;
          case 'PCubicCurveTo':
            if (context['bezierCurveTo'] !== undefined) {
              context.bezierCurveTo(cmd.control1.x, cmd.control1.y, cmd.control2.x, cmd.control2.y, cmd.end.x, cmd.end.y);
            } else {
              context.cubicTo(cmd.control1.x, cmd.control1.y, cmd.control2.x, cmd.control2.y, cmd.end.x, cmd.end.y);
            }
            break;
          case 'PArc':
            context.arc(cmd.center.x, cmd.center.y, cmd.radius, cmd.startAngle, cmd.endAngle, cmd.clockwise);
            break;
        }
      }
      if (context['closePath'] !== undefined) {
        context.closePath();
      } else {
        context.close();
      }
    }
  }
}

function applyConstantWidthStrokeTo(context, stroke) {
  var previousPoint = null;
  for (let command of stroke.commands) {
      switch (command.type) {
        case 'moveTo':
          context.moveTo(command.point.x, command.point.y);
          break;
        case 'quadCurveTo':
          var p2 = command.end;
          if (previousPoint == null) {
            previousPoint = p2;
            break;
          }
          if (context['quadraticCurveTo'] !== undefined) {
            context.quadraticCurveTo(command.control.x, command.control.y, command.end.x, command.end.y);
          } else {
            context.quadTo(command.control.x, command.control.y, command.end.x, command.end.y);
          }
          previousPoint = p2;
          break;
      }
  }
}

export {
  drawCanvasKit,
  drawCanvas2dContext
}
