

var width = 500,
    height = 500,
    cols = 50,
    mid = cols / 2,
    duration = 5000,
    τ = 2 * Math.PI;

var scale = d3.scale.ordinal()
    .domain(d3.range(0, cols))
    .rangePoints([0, width], 2);

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var data = d3.range(0, cols * cols)
    .map(function(d) {
        return { x: d % cols, y: ~~(d / cols) };
    });

var dots = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("fill","#000")
    .attr("cx", function(d) { return scale(d.x); });

d3.timer(function(elapsed) {
    var t = cols * (elapsed % duration) / duration; // [0, cols)

    function f(d) {
        return Math.cos(τ * (d.x - t) / cols);
    }

    dots.attr("cy", function(d) { return scale(d.y) + 4 * (mid - d.y) * (1 + f(d)); })
        .attr("r", function(d) { return 1.5 - 1.4 * f(d); });
});
