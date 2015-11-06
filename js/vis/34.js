

var width = 500,
    height = 500,
    n = 100;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var paths = svg.selectAll("path")
    .data(d3.range(0, n))
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke","#000")
    .attr("stroke-width", 4)
    .attr("stroke-opacity", 0.6);

d3.timer(function(t) {
    paths.attr("d", function(d) {
        var a  = d * Math.PI * 2 / n,
            r0 = width / 2 * Math.sin(d * t / 500 / n),
            r1 = width / 2 * Math.cos(d * t / 500 / n) / 4;
        return "M" + [r0 * Math.cos(a), r0 * Math.sin(a)] +
               "L" + [r1 * Math.cos(a), r1 * Math.sin(a)];
    });
});
