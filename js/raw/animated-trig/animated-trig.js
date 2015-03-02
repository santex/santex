var INTERVAL = Math.PI / 30;

// Precompute sin and tan waves
var d = d3.range(0, Math.PI / 2 + INTERVAL, INTERVAL),
    sinWave = d.map(Math.sin),
    tanWave = d.map(Math.tan);

// Remove problematic "infinite" point
tanWave.pop();

var w = 600, h = 400,
    x = d3.scale.linear().domain([-5, 15]).range([0, w]),
    y = x,
    r = (function(a, b) {
  return Math.sqrt(a * a + b * b);
})(x.invert(w), y.invert(h));

var vis = d3.select("#vis").append("svg")
    .attr("width", w).attr("height", h);

vis.append("g")
    .attr("id", "sinwave")
    .attr("width", w)
    .attr("height", h)
    .attr("transform", "translate("+x(1)+")")
  .selectAll("path")
    .data([d3.range(0, 8 * Math.PI + INTERVAL, INTERVAL).map(Math.sin)])
  .enter().append("path")
    .attr("class", "wave")
    .attr("d", d3.svg.line()
      .x(function(d, i) { return x(i * INTERVAL) - x(0) })
      .y(function(d) { return y(d) }));
vis.append("g")
    .attr("id", "tanwave")
    .attr("width", w)
    .attr("height", h)
    .attr("transform", "translate("+x(1)+")")
  .selectAll("path")
    .data(d3.range(8).map(function(i) { return d3.range(-Math.PI/2+INTERVAL, Math.PI/2, INTERVAL).map(Math.tan) }))
  .enter().append("path")
    .attr("class", "wave")
    .attr("transform", function(d, i) { return "translate("+(x((i-.5) * Math.PI + INTERVAL)-x(0))+",0)" })
    .attr("d", d3.svg.line()
      .x(function(d, i) { return x(i * INTERVAL) - x(0) })
      .y(function(d) { return y(d) }));

var filler = function(w, h) {
  return vis.append("rect")
      .attr("class", "filler")
      .attr("width", w)
      .attr("height", h);
}
filler(x(1), h);
vis.append("g")
    .attr("id", "coswave")
    .attr("width", w)
    .attr("height", h)
  .selectAll("path")
    .data([d3.range(0, 5 * Math.PI + INTERVAL, INTERVAL).map(Math.cos)])
  .enter().append("path")
    .attr("class", "wave")
    .attr("d", d3.svg.line()
      .x(function(d) { return x(d) })
      .y(function(d, i) { return y(i * INTERVAL) - y(0) }))
filler(x(1), y(1));
var line = function(e, x1, y1, x2, y2) {
  return e.append("line")
      .attr("class", "line")
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x2)
      .attr("y2", y2);
}
var axes = function(cx, cy, cls) {
  cx = x(cx); cy = y(cy);
  line(vis, cx, 0, cx, h).attr("class", cls || "line")
  line(vis, 0, cy, w, cy).attr("class", cls || "line")
}
axes(0, 0, "axis");
axes(1, 1, "edge");

vis.append("circle")
    .attr("class", "circle")
    .attr("cx", x(0))
    .attr("cy", y(0))
    .attr("r", y(1) - y(0))
line(vis, x(0), y(0), x(1), y(0))
    .attr("id", "line");
line(vis, x(-x.invert(w)), y(0), w, y(0))
    .attr("id", "tanline");
line(vis, 0, y(0), w, y(0))
    .attr("id", "xline")
line(vis, x(0), 0, x(0), h)
    .attr("id", "yline")
vis.append("circle")
    .attr("class", "circle")
    .attr("id", "dot")
    .attr("cx", x(1))
    .attr("cy", y(0))
    .attr("r", 5)

var offset = -4*Math.PI, last = 0;

d3.timer(function(elapsed) {
  offset += (elapsed - last) / 500;
  last = elapsed;
  if (offset > -2*Math.PI) offset = -4*Math.PI;
  vis.selectAll("#sinwave, #tanwave")
    .attr("transform", "translate(" + x(offset+5*Math.PI/4) + ",0)")
  vis.selectAll("#coswave")
    .attr("transform", "translate(0," + y(offset+5*Math.PI/4) + ")")
  vis.selectAll("#dot, #tanline")
    .attr("transform", "rotate(" + (180-offset * 180 / Math.PI) + ","+x(0)+","+y(0)+")")
  var xline = x(Math.sin(offset)) - x(0);
  var yline = x(-Math.cos(offset)) - y(0);
  vis.select("#xline")
    .attr("transform", "translate(0," + xline + ")");
  vis.select("#yline")
    .attr("transform", "translate(" + yline + ",0)");
});
