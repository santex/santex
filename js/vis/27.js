

var width = 500,
    height = 500,
    n = 100,
    period = 2000;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var flakes = svg.selectAll("text")
    .data(d3.range(0, n))
    .enter().append("text")
    .attr("fill","#000")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function() { return ("❅❆❄︎").charAt(Math.random() * 3); })
  .transition()
    .ease("linear")
    .delay(function(d) { return d * period / n; })
    .each(fall);

var snow = d3.range(0, 100)
    .map(function() { return 0; });

var area = d3.svg.area()
    .x(function(_, i) { return i == 99 ? width : i * (width / snow.length); })
    .y0(height)
    .y1(function(y) { return height - 2 * y; })
    .interpolate("basis");

var path = svg.append("path")
    .attr("fill", color);

function fall() {
    var flake = d3.select(this);
    (function repeat() {
        var x = Math.random() * width;

        flake = flake.transition()
            .duration(period + Math.random() * 2000 - 100)
            .each(function() {
                d3.select(this)
                    .attr("font-size", 10 + Math.random() * 5)
                    .attr("transform", "translate(" + x + ",-10)");
            })
            .attr("transform", "translate(" + x + "," + (height + 10) + ")")
            .each("end", function() {
                snow[Math.floor(x / (width / snow.length))]++;
                path.transition()
                    .duration(100)
                    .attr("d", area(snow));
                repeat();
            });
    })();
}
