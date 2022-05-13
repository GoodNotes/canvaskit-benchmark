function generateRandomConstantStrokeCommands(frame, thickness) {
    let nCmd = randInt(10) + 5; // at least 5 cmds
    let commands = [{
        type: 'moveTo',
        point: randomPoint(frame)
    }];

    for(let i = 0; i < nCmd; i++) {
        commands.push({
            type: 'quadCurveTo',
            control: randomPoint(frame),
            end: randomPoint(frame)
        });
    }
    return PConstantWidthStroke(thickness, frame, commands);
}

function generateRandomPFlattenVariableWidthStrokeCommands(frame) {
    let nCmd = randInt(10) + 5; // at least 5 cmds
    let commands = [{
        type: 'moveTo',
        point: randomPoint(frame),
        radius: randFloat(5)
    }];

    for (let i = 0; i < nCmd; i++) {
        let oCmd = randInt(10) + 5;
        let outlineCommands = [{
            type: 'moveTo',
            point: randomPoint(frame)
        }];
        for (let j = 0; j < oCmd; j++) {
            let type = randInt(3);
            switch (type) {
                case 0:
                    outlineCommands.push({
                        type: 'quadCurveTo',
                        control: randomPoint(frame),
                        end: randomPoint(frame)
                    });
                    break;
                case 1:
                    outlineCommands.push({
                        type: 'cubicCurveTo',
                        control1: randomPoint(frame),
                        control2: randomPoint(frame),
                        end: randomPoint(frame)
                    });
                    break;
                case 2:
                    outlineCommands.push({
                        type: 'addArc',
                        center: randomPoint(frame),
                        radius: randFloat(5),
                        startAngle: randFloat(Math.PI),
                        endAngle: randFloat(Math.PI),
                        clockwise: randInt(2) == 0
                    });
                    break;
            }
        }
        commands.push({
            type: 'quadCurveTo',
            control: randomPoint(frame),
            end: randomPoint(frame),
            controlRadius: randFloat(5),
            endRadius: randFloat(5),
            outline: outlineCommands
        });
    }
    let commandTypes = [];
    let moveTos = [];
    let quadCurveTos = [];
    let outlineCommandCount = [];
    let outlineCommandTypes = [];
    let outlineMoveTos = [];
    let outlineQuadCurveTo = [];
    let outlineCubicCurveTo = [];
    let outlineAddArc = [];
    let outlineAddArcIsClockwise = [];
    for (let command of commands) {
        switch (command.type) {
            case 'moveTo':
                commandTypes.push(0);
                moveTos.push(command.point.x);
                moveTos.push(command.point.y);
                moveTos.push(command.radius);
                break;
            case 'quadCurveTo':
                commandTypes.push(1);
                quadCurveTos.push(command.control.x);
                quadCurveTos.push(command.control.y);
                quadCurveTos.push(command.controlRadius);
                quadCurveTos.push(command.end.x);
                quadCurveTos.push(command.end.y);
                quadCurveTos.push(command.endRadius);
                outlineCommandCount.push(command.outline.length);
                for (let command_1 of command.outline) {
                    switch (command_1.type) {
                        case 'moveTo':
                            outlineCommandTypes.push(0);
                            outlineMoveTos.push(command_1.point.x);
                            outlineMoveTos.push(command_1.point.y);
                            break;
                        case 'quadCurveTo':
                            outlineCommandTypes.push(1);
                            outlineQuadCurveTo.push(command_1.control.x);
                            outlineQuadCurveTo.push(command_1.control.y);
                            outlineQuadCurveTo.push(command_1.end.x);
                            outlineQuadCurveTo.push(command_1.end.y);
                            break;
                        case 'cubicCurveTo':
                            outlineCommandTypes.push(2);
                            outlineCubicCurveTo.push(command_1.control1.x);
                            outlineCubicCurveTo.push(command_1.control1.y);
                            outlineCubicCurveTo.push(command_1.control2.x)
                            outlineCubicCurveTo.push(command_1.control2.y);
                            outlineCubicCurveTo.push(command_1.end.x);
                            outlineCubicCurveTo.push(command_1.end.y);
                            break;
                        case 'addArc':
                            outlineCommandTypes.push(3);
                            outlineAddArc.push(command_1.center.x)
                            outlineAddArc.push(command_1.center.y);
                            outlineAddArc.push(command_1.radius);
                            outlineAddArc.push(command_1.startAngle);
                            outlineAddArc.push(command_1.endAngle);
                            outlineAddArcIsClockwise.push(command_1.clockwise);
                            break;
                    }
                }
                break;
        }
    }
    return fromFlattenVariableWidthStroke({
        frame,
        commandTypes,
        moveTos,
        quadCurveTos,
        outlineCommandCount,
        outlineCommandTypes,
        outlineMoveTos,
        outlineQuadCurveTo,
        outlineCubicCurveTo,
        outlineAddArc,
        outlineAddArcIsClockwise
    });
}

function randInt(n) {
    return Math.floor(Math.random() * n);
}

function randFloat(n) {
    return Math.random() * n;
}

function randomPoint(frame) {
    return {
        x: frame.origin.x + randFloat(frame.size.width),
        y: frame.origin.y + randFloat(frame.size.height),
    }
}

function randColor() {
  let r = Math.ceil(Math.random() * 240) % 255;
  let g = Math.ceil(Math.random() * 240) % 255;
  let b = Math.ceil(Math.random() * 240) % 255;
  let a = Math.max(Math.random(), 0.3);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function generateRandomFrame(pageWidth, pageHeight) {
    let originX = randFloat(pageWidth);
    let originY = randFloat(pageHeight);
    let frameWidth = randFloat(pageWidth - originX) - randFloat(50);
    let frameHeight = randFloat(pageHeight - originY) - randFloat(50);

    return {
        origin: {
            x: originX,
            y: originY
        },
        size: {
            width: frameWidth,
            height: frameHeight
        }
    };
}

function PPoint(x, y) {
  return {name: "PPoint", x, y};
}

function PQuadCurveTo(control, end) {
  return {name: "PQuadCurveTo", control, end};
}

function PCubicCurveTo(control1, control2, end) {
  return {name: "PCubicCurveTo", control1, control2, end};
}

function PArc(center, radius, startAngle, endAngle, clockwise) {
  return {name: "PArc", center, radius, startAngle, endAngle, clockwise};
}

function PVariableWidthQuadCurveTo(control, end, controlRadius, endRadius, outline) {
  return {name: "PVariableWidthQuadCurveTo", control, end, controlRadius, endRadius, outline};
}

function PVariableWidthMoveTo(point, radius) {
  return {name: "PVariableWidthMoveTo", point, radius};
}

function PVariableWidthStroke(commands) {
  return {commands, color: randColor()};
}

function PConstantWidthStroke(thickness, frame, commands) {
  return {thickness, commands, frame, color: randColor()};
}

function fromFlattenVariableWidthStroke(flattenStroke) {
  var moveTosIndex = 0
  var quadCurveTosIndex = 0
  var outlineCommandCountIndex = 0
  var outlineCommandTypesIndex = 0
  var outlineMoveTosIndex = 0
  var outlineQuadCurveToIndex = 0
  var outlineCubicCurveToIndex = 0
  var outlineAddArcIndex = 0
  var outlineAddArcIsClockwiseIndex = 0
  let commands = [];

  for (let commandType of flattenStroke.commandTypes) {
    switch (commandType) {
    case 0:
        let moveTo = PVariableWidthMoveTo(
          PPoint(flattenStroke.moveTos[moveTosIndex], flattenStroke.moveTos[moveTosIndex+1]),
          flattenStroke.moveTos[moveTosIndex+2]
        )
        commands.push(moveTo);
        moveTosIndex += 3;
        break;

    case 1:
        var outline = [];
        let commandCount = flattenStroke.outlineCommandCount[outlineCommandCountIndex]
        outlineCommandCountIndex += 1
        for (var i=0; i<commandCount; i++) {
            switch (flattenStroke.outlineCommandTypes[outlineCommandTypesIndex]) {
            case 0:
                let moveTo = PPoint(flattenStroke.outlineMoveTos[outlineMoveTosIndex], flattenStroke.outlineMoveTos[outlineMoveTosIndex+1])
                outline.push(moveTo);
                outlineMoveTosIndex += 2;
                break;
            case 1:
                let quadCurveTo = PQuadCurveTo(
                  PPoint(flattenStroke.outlineQuadCurveTo[outlineQuadCurveToIndex], flattenStroke.outlineQuadCurveTo[outlineQuadCurveToIndex+1]),
                  PPoint(flattenStroke.outlineQuadCurveTo[outlineQuadCurveToIndex+2], flattenStroke.outlineQuadCurveTo[outlineQuadCurveToIndex+3])
                );
                outline.push(quadCurveTo);
                outlineQuadCurveToIndex += 4;
                break;
            case 2:
                let cubicCurveTo = PCubicCurveTo(
                  PPoint(flattenStroke.outlineCubicCurveTo[outlineCubicCurveToIndex], flattenStroke.outlineCubicCurveTo[outlineCubicCurveToIndex+1]),
                  PPoint(flattenStroke.outlineCubicCurveTo[outlineCubicCurveToIndex+2], flattenStroke.outlineCubicCurveTo[outlineCubicCurveToIndex+3]),
                  PPoint(flattenStroke.outlineCubicCurveTo[outlineCubicCurveToIndex+4], flattenStroke.outlineCubicCurveTo[outlineCubicCurveToIndex+5])
                );
                outline.push(cubicCurveTo);
                outlineCubicCurveToIndex += 6;
                break;
            case 3:
                let addArc = PArc(
                  PPoint(flattenStroke.outlineAddArc[outlineAddArcIndex], flattenStroke.outlineAddArc[outlineAddArcIndex+1]),
                  flattenStroke.outlineAddArc[outlineAddArcIndex+2],
                  flattenStroke.outlineAddArc[outlineAddArcIndex+3],
                  flattenStroke.outlineAddArc[outlineAddArcIndex+4],
                  flattenStroke.outlineAddArcIsClockwise[outlineAddArcIsClockwiseIndex]
                );
                outline.push(addArc);
                outlineAddArcIndex += 5;
                outlineAddArcIsClockwiseIndex += 1;
                break;
            default: throw Error("unknown command");
            }
            outlineCommandTypesIndex += 1;
        }
        let quadCurveTo = PVariableWidthQuadCurveTo(
          PPoint(flattenStroke.quadCurveTos[quadCurveTosIndex], flattenStroke.quadCurveTos[quadCurveTosIndex+1]),
          PPoint(flattenStroke.quadCurveTos[quadCurveTosIndex+3], flattenStroke.quadCurveTos[quadCurveTosIndex+4]),
          flattenStroke.quadCurveTos[quadCurveTosIndex+2],
          flattenStroke.quadCurveTos[quadCurveTosIndex+5],
          outline
        );
        commands.push(quadCurveTo);
        quadCurveTosIndex += 6;
        break;
    default: throw Error("unknown command");
    }
  }
  return PVariableWidthStroke(commands);
}

function generateStrokes(n, type, pageWidth, pageHeight) {
  var data = [];
  for (var i = 0; i < n; i++) {
    const frame = generateRandomFrame(pageWidth, pageHeight);
    let stroke;
    if (type == "variable") {
      stroke = generateRandomPFlattenVariableWidthStrokeCommands(frame);
    } else {
      stroke = generateRandomConstantStrokeCommands(frame, Math.ceil(randFloat(10)));
    }
    data.push(stroke);
  }
  return data;
}

export default generateStrokes;
