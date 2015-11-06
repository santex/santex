
  var width = 500,
    height = 500,
    n = 200;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var data = d3.range(0, 2 * Math.PI, 2 * Math.PI / n);

var circles = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("fill", "#d1d1d1")
    .attr("fill-opacity", 0.5);

d3.timer(function(t) {
    t /= 10000;

    circles.attr("r", function(d) {
        return 7 * (Math.sin(d * t + d) + 2);
    });

    circles.attr("cx", function(d) {
        return 200 * Math.sin(3 * d * t);
    });

    circles.attr("cy", function(d) {
        return 200 * Math.sin(2 * d * t);
    });
});
