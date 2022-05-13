import Chart from 'chart.js/auto';
import { randColor } from './generateStroke';

var chart;
function plot(logs, forHTML = false) {
  if (chart) chart.destroy();
  let {labelToData, sortedStrokeNums, title} = parse(logs, forHTML);
  let datasets = [];

  for (let key of labelToData.keys()) {
    var color = randColor();
    var dataset = {};
    dataset.label = key;
    dataset.data = labelToData.get(key);
    dataset.borderColor = color;
    dataset.backgroundColor = color;
    datasets.push(dataset);
  }

  const data = {
    labels: sortedStrokeNums,
    datasets: datasets
  };

  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: title
        }
      }
    }
  };

  var chartCanvas = document.getElementById("plot");
  chart = new Chart(chartCanvas.getContext('2d'), config);
}

function parse(logs, forHTML) {
  // labels: [stroke nums]
  // label: engine + strokeType
  // data: [time]
  let labelToDataFirstPass = new Map();
  let strokeLabels = new Set();

  for (let log of logs.split("\n").slice(0, -1)) {
    var regex = /\[(htmlcanvas|canvaskit-webgl|canvaskit-2d)]\[(\d+) (.+ )strokes]( .+)/g;
    var regexResults = regex.exec(log);
    var engine = regexResults[1].trim();
    if (engine !== "htmlcanvas" && forHTML) throw Error("");
    var strokeNum = +regexResults[2].trim();
    var strokeType = regexResults[3].trim();
    var result = regexResults[4].trim();
    strokeLabels.add(strokeNum);

    let getMs = (timeWithColonAndMs) => {
      let onlyMs = timeWithColonAndMs.split(":")[1].trim();
      return +onlyMs.trim().slice(0, -2);
    }
    let split = result.split(",");
    if (forHTML) {
      // Total time: xx.yyms, drawTime: aa.bbms, flushTime: cc.ddms
      let total = getMs(split[0]);
      let totalLabel = "total";
      let draw = getMs(split[1]);
      let drawLabel = "draw";
      let flush = getMs(split[2]);
      let flushLabel = "flush";

      let process = (label, time) => {
        if (labelToDataFirstPass.has(label)) {
          var data = labelToDataFirstPass.get(label);
          if (data.has(strokeNum)) {
            var minTime = Math.min(data.get(strokeNum), time);
            data.set(strokeNum, minTime);
          } else {
            data.set(strokeNum, time);
          }
        } else {
          var data = new Map();
          data.set(strokeNum, time);
          labelToDataFirstPass.set(label, data);
        }
      }

      process(totalLabel, total);
      process(drawLabel, draw);
      process(flushLabel, flush);
    } else {
      // Total time: xx.yyms
      let time = getMs(split[0]);

      let label = `${engine}|${strokeType}`;
      if (labelToDataFirstPass.has(label)) {
        var data = labelToDataFirstPass.get(label);
        if (data.has(strokeNum)) {
          var minTime = Math.min(data.get(strokeNum), time);
          data.set(strokeNum, minTime);
        } else {
          data.set(strokeNum, time);
        }
      } else {
        var data = new Map();
        data.set(strokeNum, time);
        labelToDataFirstPass.set(label, data);
      }
    }
  }

  let labelToData = new Map();
  let sortedStrokeNums = [...strokeLabels].sort((a, b) => a - b);

  let title;
  if (forHTML) {
    for (let label of labelToDataFirstPass.keys()) {
      for (let num of sortedStrokeNums) {
        var time = labelToDataFirstPass.get(label).get(num) || 0;
        if (labelToData.has(label)) {
          labelToData.get(label).push(time);
        } else {
          labelToData.set(label, [time]);
        }
      }
    }
    title = "HTMLCanvas";
  } else {
    for (let label of labelToDataFirstPass.keys()) {
      for (let num of sortedStrokeNums) {
        var time = labelToDataFirstPass.get(label).get(num) || 0;
        if (labelToData.has(label)) {
          labelToData.get(label).push(time);
        } else {
          labelToData.set(label, [time]);
        }
      }
    }
    title = "CanvasKit vs HTMLCanvas";
  }

  return {
    labelToData,
    sortedStrokeNums,
    title
  }
}

export {
  plot,
  parse
}

window.plot = plot;

