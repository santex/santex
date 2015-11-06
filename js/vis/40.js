


var width = 500,
    height = 500,
    rows = 32,
    cols = 5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var g = svg.selectAll("g")
    .data(d3.range(1, rows + 1))
    .enter().append("g")
    .attr("transform", function(d, i) {
        return "translate(" + [0, i * height / rows] + ")";
    });

var paths = g.append("path")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-opacity", 0.7);

d3.timer(function(t) {
    paths.attr("d", function(r) {
        return d3.svg.line()
            .interpolate("basis")
            .y(function(d) { return 5 * Math.cos(d + r * t / 10000); })
            .x(function(d) { return d * width / (cols - 1); })
            (d3.range(-3, cols + 2));
    });
});
