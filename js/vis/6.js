
var width = 500,
    height = 500,
    n = 35,
    r = width / n / 2,
    dx = r * 2 * Math.sin(Math.PI / 3),
    dy = r * 1.5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .append("g")
    .attr("transform", "translate(" + [-width / 2, -height / 2] + ")");

var data = [[0, 0]], x, y, j;

for (var i = 1; i <= 17; i++) {
    var odd = i % 2 === 1;

    for (j = 0, x = (2 - i) * dx / 2, y = -i * dy; j < i; j++, x += dx, y += 0) {
        data.push([x, y]);
    }

    for (j = 0, x = (1 + i) * dx / 2, y = (1 - i) * dy; j < i; j++, x += dx / 2, y += dy) {
        data.push([x, y]);
    }

    for (j = 0, x = (2 * i - 1) * dx / 2, y = dy; j < i; j++, x -= dx / 2, y += dy) {
        data.push([x, y]);
    }

    for (j = 0, x = i * dx / 2 - dx, y = i * dy; j < i; j++, x -= dx, y += 0) {
        data.push([x, y]);
    }

    for (j = 0, x = (-i - 1) * dx / 2, y = (i - 1) * dy; j < i; j++, x -= dx / 2, y -= dy) {
        data.push([x, y]);
    }

    for (j = 0, x = -i * dx + dx / 2, y = -dy; j < i; j++, x += dx / 2, y -= dy) {
        data.push([x, y]);
    }
}

var hexes = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + [d[0] + width, d[1] + height] + ")";
    })
    .append("path")
    .attr("fill", "#fff")
    .attr("fill-opacity", 0.8)
    .attr("d", "M" + hexagon(r).join("L") + "Z");

d3.timer(function(t) {
    hexes.attr("transform", function(d, i) {
        return "scale(" + (Math.sin(t * (i + 1) / 50000) + 1) / 2 + ")";
    });
});

function hexagon(radius) {
    return d3.range(0, 2 * Math.PI, Math.PI / 3).map(function(angle) {
        var x1 = Math.sin(angle) * radius,
            y1 = -Math.cos(angle) * radius;
        return [x1, y1];
    });
}
