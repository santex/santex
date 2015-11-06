


var width = 500,
    height = 500,
    cols = 100;

var scale = d3.scale.ordinal()
    .domain(d3.range(0, cols))
    .rangePoints([0, width], 2);

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var data = d3.range(0, cols * cols)
    .map(function(d) {
        var x = d % cols,
            y = ~~(d / cols),
            dx = cols / 2 - x,
            dy = cols / 2 - y;
        return { x: x, y: y, d: Math.sqrt(dx*dx + dy*dy) };
    });

var dots = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("fill","#000")
    .attr("cx", function(d) { return scale(d.x); })
    .attr("cy", function(d) { return scale(d.y); });

d3.timer(function(t) {
    dots.attr("r", function(d) {
        return Math.min(2, 10 / d.d) +
            (Math.sin((t + 100000) * d.d / 10000) + 1) / 2;
    });
});
