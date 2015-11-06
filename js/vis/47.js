

var width = 500,
    height = 500,
    n = 10,
    c = width / n;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#222");

var g = svg.selectAll("g")
    .data(d3.range(0, n + 1))
    .enter().append("g")
    .attr("transform", function(d) { return "translate(0," + (d - 1) * c + ")" });

var rects = g.selectAll("rect")
    .data(d3.range(0, n + 1))
    .enter().append("rect")
    .attr("x", function(d) { return (d - 1) * c; })
    .attr("y", 0)
    .attr("rx", c)
    .attr("ry", c)
    .attr("width", c * 2)
    .attr("height", c * 2)
    .attr("fill", "#fff")
    .attr("fill-opacity", 0.2);

(function loop() {
    g.transition()
        .duration(n * 500)
        .delay(function(d) { return d * 200; })
        .each("start", function() {
            d3.select(this).selectAll("rect")
              .transition()
                .duration(3000)
                .delay(function(d) { return d * 200; })
                .attr("rx", 0)
                .attr("ry", 0)
                .attr("fill-opacity", 0.3)
              .transition()
                .attr("rx", c)
                .attr("ry", c)
                .attr("fill-opacity", 0.2);
        })
        .each("end", function(d) {
            if (d === n) {
                loop();
            }
        });
})();
