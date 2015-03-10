
var width = 500,
    height = 500;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#fff");

var gradients = svg.append("linearGradient")
    .attr("id", "gradient");

gradients.append("stop")
    .attr("offset", 0)
    .attr("stop-color", "rgba(0,0,0,0)");

gradients.append("stop")
    .attr("offset", 1)
    .attr("stop-color", "rgba(0,0,0,1)");

var rect = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width * 2)
    .attr("height", height)
    .attr("fill", "url(#gradient)");

svg.append("path")
    .attr("fill", "none")
    .attr("stroke-width", 100)
    .attr("stroke", "#888")
    .attr("d", "M" + [0, height / 2] + "L" + [width, height / 2]);

d3.timer(function(t) {
    rect.attr("transform", "translate(" + (0.5 * width * Math.cos(t / 2000) - width * 0.5) + ",0)");
});
