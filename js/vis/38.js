
var width = 500,
    height = 500,
    n = 30,
    r = width / n / 2,
    dx = r * 2 * Math.sin(Math.PI / 3),
    dy = r * 1.5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var data = [];

for (var y = -r, odd = false; y < height + 2 * r; y += dy, odd = !odd) {
    for (var x = odd ? -dx / 2 : 0; x < width + dx; x += dx) {
        data.push([x, y]);
    }
}

var hexes = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + d + ")";
    })
    .append("path")
    .attr("fill","#000")
    .attr("fill-opacity", 0.2)
    .attr("d", "M" + hexagon(r).join("l") + "Z");

d3.timer(function(t) {
    hexes.attr("transform", function(d, i) {
        return "scale(" + (Math.sin(i * t / 70000) + 1) + ")";
    });
});

function hexagon(radius) {
    var x0 = 0, y0 = 0;
    return d3.range(0, 2 * Math.PI, Math.PI / 3).map(function(angle) {
        var x1 = Math.sin(angle) * radius,
            y1 = -Math.cos(angle) * radius,
            dx = x1 - x0,
            dy = y1 - y0;
        x0 = x1;
        y0 = y1;
        return [dx, dy];
    });
}
