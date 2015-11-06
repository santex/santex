
var width = 500,
    height = 500,
    n = 10,
    a = width / n,
    h = a * Math.sqrt(3) / 2;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var rows = svg.selectAll("g")
    .data(d3.range(0, 2 * height / h + 1))
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + [(d % 2) * a / 4 + 10, d * h / 2] + ")";
    });

var cols = rows.selectAll("g")
    .data(d3.range(0, n + 1))
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + [d * a, 0] + ")";
    });

cols.append("path")
    .attr("fill", "#fff")
    .attr("fill-opacity", 0.33)
    .attr("d", "M" + [0,   -2*h/3] +
               "L" + [-a/2,   h/3] +
               "L" + [+a/2,   h/3] + "Z");

(function loop() {
    rows.transition()
        .delay(function(d) { return d * 30; })
        .each("start", function() {
            var t = d3.select(this).selectAll("path")
                .transition()
                .delay(function(d) { return d * 30; });

            d3.range(0, 6).forEach(function(k) {
                t = t.transition()
                    .duration(1000)
                    .attr("transform", function(d) { return "rotate(" + (d % 2 === 0 ? 1 : -1) * 60 * k + ")"; });
            });
        });

    setTimeout(loop, 6000);
})();
