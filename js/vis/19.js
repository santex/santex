
// Math from https://github.com/d3/d3-plugins/tree/master/hexbin
var width = 500,
    height = 500,
    n = 10,
    r = width / n / 2,
    dx = r * 2 * Math.sin(Math.PI / 3),
    dy = r * 1.5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color);

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
    .attr("transform", "scale(1.02)")
    .attr("fill", "#"+((1<<24)*Math.random()|0).toString(16))
    .attr("fill-opacity", 1)
    .attr("d", "M" + hexagon(r).join("l") + "Z");

var transition = hexes.transition()
    .delay(function(d, i) {
        return i * 50;
    });

(function loop() {
    transition = transition.transition()
        .duration(2500)
        .attrTween("transform", function() {
            return d3.interpolate("scale(1.2)", "scale(0)");
        })
        .each("end", function() {
            d3.select(this)
                .attr("d", "M" + rectangle(dx, dy).join("l") + "Z");
        })
        .transition()
        .attrTween("transform", function () {
            return d3.interpolate("scale(0)", "scale(1.2)");
        })
        .each("end", function(d, i) {
            d3.select(this)
                .attr("d", "M" + hexagon(r).join("l") + "Z");
            if (i === 0) loop();
        });
})();

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

function rectangle(dx, dy) {
    return [[-dx / 2, -dy / 2],
            [ dx,  0],
            [ 0,  dy],
            [-dx,  0]];
}
