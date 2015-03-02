var chart = d3.horizon()
    .height(40)
    .bands(5)
    .mode("offset")
    .colors(["#00c", "#fff", "#f90"])
    .interpolate("basis");

function plotHorizon(data, index, code, colour) {
  var div = d3.select("#horizon").selectAll("div")
      .filter(function(d, i) { return i === index; });

  // Offset so that positive is above-average and negative is below-average.
  var mean = data.reduce(function(p, v) { return p + v; }, 0) / data.length;

  // Transpose column values to rows.
  var downsampled = [];
  var di = 5;
  for (var i=0, ii=data.length/di-di; i<ii; i++) {
    var j = i * di;
    downsampled[i] = [data.length-i, (data[j] + data[j+1] + data[j+2] + data[j+3] + data[j+4]) / di - mean];
  }

  div.append("span").text(String);

  var maxWidth = 750;
  chart.width(maxWidth / 2560 * data.length);

  // Render the chart.
  var svg = div.append("svg")
      .attr("width", chart.width())
      .attr("height", chart.height());
  svg.append("g").data([downsampled]).call(chart);
}
