function drawDefault(canvas) {
  let ctx = canvas.getContext('2d');
  let rgradient = ctx.createRadialGradient(200, 300, 10, 100, 100, 300);

  // Add three color stops
  rgradient.addColorStop(0, 'red');
  rgradient.addColorStop(0.7, 'white');
  rgradient.addColorStop(1, 'blue');

  ctx.fillStyle = rgradient;
  ctx.globalAlpha = 0.7;
  ctx.fillRect(0, 0, SIZE, SIZE);

  return canvas.toDataURL();
}

function drawAnother(canvas) {
  let ctx = canvas.getContext('2d');
  ctx.scale(1.1, 1.1);
  ctx.translate(10, 10);
  // Shouldn't impact the fillRect calls
  ctx.setLineDash([5, 3]);

  ctx.fillStyle = 'rgba(200, 0, 100, 0.81)';
  ctx.fillRect(20, 30, 100, 100);

  ctx.globalAlpha = 0.81;
  ctx.fillStyle = 'rgba(200, 0, 100, 1.0)';
  ctx.fillRect(120, 30, 100, 100);
  // This shouldn't do anything
  ctx.globalAlpha = 0.1;

  ctx.fillStyle = 'rgba(200, 0, 100, 0.9)';
  ctx.globalAlpha = 0.9;
  // Intentional no-op to check ordering
  ctx.clearRect(220, 30, 100, 100);
  ctx.fillRect(220, 30, 100, 100);

  ctx.fillRect(320, 30, 100, 100);
  ctx.clearRect(330, 40, 80, 80);

  ctx.strokeStyle = 'blue';
  ctx.ineWidth = 3;
  ctx.setLineDash([5, 3]);
  ctx.strokeRect(20, 150, 100, 100);
  ctx.setLineDash([50, 30]);
  ctx.strokeRect(125, 150, 100, 100);
  ctx.lineDashOffset = 25;
  ctx.strokeRect(230, 150, 100, 100);
  ctx.setLineDash([2, 5, 9]);
  ctx.strokeRect(335, 150, 100, 100);

  ctx.setLineDash([5, 2]);
  ctx.moveTo(336, 400);
  ctx.quadraticCurveTo(366, 488, 120, 450);
  ctx.lineTo(300, 400);
  ctx.stroke();

  ctx.font = '36pt Noto Mono';
  ctx.strokeText('Dashed', 20, 350);
  ctx.fillText('Not Dashed', 20, 400);
  return canvas.toDataURL();
}

window.drawDefault = drawDefault;
window.drawAnother = drawAnother;
