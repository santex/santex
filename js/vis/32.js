

var width = 500,
    height = 500,
    r = 0.3 * width,
    n = 16,
    π = Math.PI;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var g = svg.append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var paths = g.selectAll("path")
    .data(d3.range(0, n))
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke","#000")
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 0.5);

d3.timer(function(t) {
    paths.attr("d", function(d) {
        var circle = d3.svg.line()
            .x(function(θ) { return 6 * d * Math.sin(16 * θ + t / 10000 * d) + r * Math.cos(θ); })
            .y(function(θ) { return 6 * d * Math.cos(16 * θ + t / 10000 * d) + r * Math.sin(θ); });

        var u = 2 * π / 256;
        return circle(d3.range(0, 2 * π + u, u));
    });
});
