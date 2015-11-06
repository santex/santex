
var width = 500,
    height = 500,
    cols = 50;

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
    .attr("fill", "#000")
    .attr("cx", function(d) { return scale(d.x); })
    .attr("cy", function(d) { return scale(d.y); });

d3.timer(function(t) {
    dots.attr("r", function(d) {
        var x = cols / 2 - d.x,
            y = cols / 2 - d.y;
        return Math.cos(Math.sqrt(x * x + y * y) / 4 - t / 4000 +
                        Math.sin(d.x * d.y + t / 1000) +
                        Math.sin(d.x * d.y + t / 2000)) + 1;
    });
});
