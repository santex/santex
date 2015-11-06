
var width = 500,
    height = 500,
    n = 5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var scale = d3.scale.ordinal()
    .domain(d3.range(-n / 2, n / 2 + 1))
    .rangePoints([0, width], 6);

var data = [];
for (var x = -n / 2; x <= n / 2; x++) {
    for (var y = -n / 2; y <= n / 2; y++) {
        data.push({x: x, y: y});
    }
}

var squares = svg.selectAll("g")
    .data(data)
    .enter().append("g");

squares.append("rect")
    .attr("fill","#000")
    .attr("fill-opacity", 0.1)
    .attr("x", -80)
    .attr("y", -80)
    .attr("width", 160)
    .attr("height", 160);

d3.timer(function(t) {
    squares.attr("transform", function(d) {
        return "translate(" + [scale(d.x), scale(d.y)] + ")rotate(" + 360 * (t % 20000 / 20000) + ")";
    });
});

