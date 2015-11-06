

var width = 500,
    height = 500,
    n = 100;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var circles = svg.selectAll("circle")
    .data(d3.range(0, n))
    .enter().append("circle")
    .attr("fill", "none")
    .attr("stroke", "#222")
    .attr("stroke-opacity", 0.8)
    .attr("r", width / 4);

d3.timer(function(t) {
    circles.attr("cx", function(d) {
        var a = d * Math.PI * 2 / n,
            r = width / 4 * Math.sin(d * t / 1000 / n);
        return r * Math.cos(a);
    });

    circles.attr("cy", function(d) {
        var a = d * Math.PI * 2 / n,
            r = width / 4 * Math.sin(d * t / 1000 / n);
        return r * Math.sin(a);
    });
});
