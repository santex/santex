

var width = 500,
    height = 500,
    rows = 50,
    cols = 30;

var scale = d3.scale.ordinal()
    .domain(d3.range(0, cols))
    .rangePoints([0, width], 2);

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .attr("shape-rendering", "crispEdges");

var data = d3.range(0, rows)
    .map(function(y) {
        return d3.range(0, cols).map(function(x) {
            return [x, y];
        });
    });

var g = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + (i * height / rows + 0.5) + ")"; });

var paths = g.selectAll("path")
    .data(function(d) { return d; })
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke","#000")
    .attr("d", function(d) {
        var x0 =  d[0] *      width / cols,
            x1 = (d[0] + 1) * width / cols;
        return "M" + [x0, 0] + "L" + [x1, 0];
    });

var drops = d3.range(0, 8).map(function() {
    return [Math.random() * cols, Math.random() * rows];
});

d3.timer(function(t) {
    t /= 10000;
    paths.attr("stroke-width", function(d) {
        return Math.max(1, 3 + d3.sum(drops, function(p) {
            var dx = d[0] - p[0],
                dy = d[1] - p[1];
            return Math.sin(t + 1000 - Math.sqrt(dx*dx + dy*dy));
        }));
    });
});
