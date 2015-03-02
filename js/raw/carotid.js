var n = 25,
    w = 1000,
    h = 300,
    p = [20, 40, 30, 40],
    x = d3.scale.linear().domain([-1, 1]).range([0, w]),
    y = d3.scale.linear().domain([-1, 1]).range([h, 0]),
    xAxis = d3.svg.axis().scale(x),
    yAxis = d3.svg.axis().scale(y),
    line = d3.svg.line()
      .x(function(d) { return x(d[0]); })
      .y(function(d) { return y(d[1]); }),
    zoom = d3.behavior.zoom()
      .x(x)
      .scaleExtent([1, Infinity])
      .on("zoom", function() {
        var t = d3.event.translate,
            xd = x.domain();
        if (xd[0] < -1) xd[1] = Math.min( 1, xd[1] - xd[0] - 1), xd[0] = -1;
        if (xd[1] >  1) xd[0] = Math.max(-1, xd[0] - xd[1] + 1), xd[1] =  1;
        x.domain(xd);
        t[0] = x(-1);
        zoom.translate(t);
        vis.select(".x.axis").call(xAxis);
        vis.selectAll("path.carotid")
            .data(carotid(n))
            .attr("d", line);
      });

d3.select("#vis").selectAll("*").remove();
var vis = d3.select("#vis").append("svg")
    .attr("width", w + p[1] + p[3])
    .attr("height", h + p[0] + p[2])
  .append("g")
    .attr("transform", "translate(" + p[3] + "," + p[0] + ")")
    .style("pointer-events", "all")
    .call(zoom);

vis.append("rect")
    .attr("width", w)
    .attr("height", h);

vis.selectAll("path")
    .data(carotid(n))
  .enter().append("path")
    .attr("class", "carotid")
    .attr("d", line);

vis.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis.orient("bottom"));

vis.append("g")
    .attr("class", "y axis")
    .call(yAxis.orient("left"));

d3.select("#n").on("change", function() {
  n = +this.value;
  d3.select("#n-value").text(n);
  var path = vis.selectAll("path.carotid")
      .data(carotid(n));
  path.enter().append("path")
      .attr("class", "carotid");
  path.attr("d", line);
  path.exit().remove();
})

function carotid(n) {
  var data = d3.range(n).map(function() { return []; }),
      xd = x.domain(),
      x0 = xd[0],
      x1 = xd[1],
      dx = 2 * (x1 - x0) / w; // every 2 pixels
  for (var j = x0; j < x1; j += dx) {
    var a = j * Math.acos(j);
    for (var i = 0; i < n;) data[i].push([j, Math.cos(++i * a)]);
  }
  return data;
}
