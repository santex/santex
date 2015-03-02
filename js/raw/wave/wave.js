// Based on http://paperjs.org/examples/smoothing/
var w,
    h,
    fill = d3.scale.linear().range(["brown", "steelblue"]),
    vis = d3.select("#vis").append("svg")
        .attr("pointer-events", "all"),
    points = 10,
    path,
    mouse = [0, 0],
    pathHeight,
    interpolator = 0,
    interpolators = [
      "basis",
      "linear",
      "step-after"
    ];

vis.append("rect")
    .attr("fill", "#fff");

var line = d3.svg.line().interpolate(interpolators[interpolator]);

function init() {
  var oldh = h;
  w = window.innerWidth;
  h = window.innerHeight;
  fill.domain([0, h]);
  vis
      .attr("width", w)
      .attr("height", h)
    .select("rect")
      .attr("width", w)
      .attr("height", h);
  if (!oldh) {
    path = [];
    path.push([0, h]);
    for (var i = 1; i < points; i++) path.push([w / points * i, h / 4]);
    path.push([w, h]);
    pathHeight = h / 2;
  } else {
    for (var i=0; i<=points; i++) {
      path[i][0] = w / points * i;
      path[i][1] = path[i][1] / oldh * h;
    }
    pathHeight = pathHeight / oldh * h;
  }
}

vis
    .on("mousemove", function() {
      mouse = d3.svg.mouse(this);
      vis.select("path").attr("fill", fill(mouse[1]));
      d3.event.preventDefault();
    })
    .on("touchmove", function() {
      var touches = d3.svg.touches(this);
      if (touches.length === 0) return;
      mouse = touches[0];
      vis.select("path").attr("fill", fill(mouse[1]));
      d3.event.preventDefault();
    })
    .on("mousedown", function() {
      line.interpolate(interpolators[interpolator = (interpolator + 1) % interpolators.length]);
    })

d3.select(window)
    .on("resize", init);

init();

d3.timer(function(elapsed) {
  pathHeight += (h / 2 - mouse[1] - pathHeight) / 10;
  for (var i = 1; i < points; i++) {
    var sinSeed = elapsed / 10 + (i + i % 10) * 100,
        sinHeight = Math.sin(sinSeed / 200) * pathHeight;
    path[i][1] = Math.sin(sinSeed / 100) * sinHeight + h / 2;
  }
  var wave = vis.selectAll("path")
      .data([path]);

  wave.enter()
    .append("path")
      .attr("fill", fill(mouse[1]))
      .attr("d", line);

  wave.attr("d", line);
});
