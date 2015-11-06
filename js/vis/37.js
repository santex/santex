

var w = 500,
    h = 500,
    n = 30;

var svg = d3.select("#vis").append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("background", color);

var g = svg.selectAll("g")
    .data([
        [0, 0],
        [w, 0],
        [w, h],
        [0, h]
    ])
    .enter().append("g")
    .attr("transform", function(d) { return "translate(" + d + ")" });

var circles = g.selectAll("circle")
    .data(d3.range(1,n))
    .enter().append("circle")
    .attr("r", function(d) { return d * (w / n); })
    .attr("fill", "#000")
    .attr("fill-opacity", 0);

(function loop() {
    var duration = Math.random() * 2000 + 3000,
        delay    = Math.random() * 100  + 200;
    circles
      .transition()
        .ease("linear")
        .duration(duration)
        .delay(function(d) { return d * delay; })
        .attr("fill-opacity", 0.05)
      .transition()
        .attr("fill-opacity", 0)
        .each("end", function(d) {
            if (d === 1) {
                loop();
            }
        });
})();
