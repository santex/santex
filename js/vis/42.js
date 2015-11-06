

var width = 500,
    height = 500,
    n = 4,
    r = width / n / 2,
    dx = r * 2 * Math.sin(Math.PI / 3),
    dy = r * 1.5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var hexes = svg.append("g")
    .attr("transform", "translate(" + [-20, -15] + ")")
    .append("path")
    .attr("fill", "#fff")
    .attr("fill-opacity", 0.8)
    .attr("fill-rule", "evenodd");

d3.timer(function(t) {
    hexes.attr("d", function() {
        var d = "";
        for (var y = -r, odd = false; y < height + 2 * r; y += dy, odd = !odd) {
            for (var x = odd ? -dx / 2 : 0; x < width + dx; x += dx) {
                d += "M" + [x, y];
                d += "m" + hexagon(r + r * Math.sin(t / 10000)).join("l") + "z";
            }
        }
        return d;
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


