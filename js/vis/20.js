


var width = 500,
    height = 500,
    rows = 16,
    cols = 3;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var g = svg.selectAll("g")
    .data(d3.range(1, rows))
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + [0, (d - 1) * height / rows] + ")";
    });

var paths = g.append("path")
    .attr("fill", "#fff")
    .attr("fill-opacity", 0.05);

d3.timer(function(t) {
    paths.attr("d", function(r) {
        return d3.svg.area()
            .interpolate("basis")
            .y0(height)
            .y1(function(d, i) { return 300 * (i % 2) - 150 + 20 * Math.sin(r + t / 500); })
            .x(function(d) { return (r * t / 100) % (width / (cols - 2)) + d * width / (cols - 1); })
            (d3.range(-3, cols + 2));
    });
});

