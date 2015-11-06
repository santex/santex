

var width = 500,
    height = 500,
    n = 10;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .append("g");

var g = svg.selectAll("g")
    .data([
        "scale(1)",
        "scale(1,-1)translate(0,-500)",
        "rotate(90,250,0)translate(250,-250)",
        "rotate(-90,250,0)translate(-250,-250)"
    ])
    .enter().append("g")
    .attr("transform", function(d) { return d; });

var circles = g.selectAll("circle")
    .data(function (d, i) { return d3.range(0, 25).map(function(d) { return [d, i]; }) })
    .enter().append("circle")
    .attr("cx", function(d) {
        return 0.5 * width;
    })
    .attr("cy", function(d) {
        return 0.25 * height - d[0] * 5;
    })
    .attr("r", function(d) {
        return 0.25 * height - d[0] * 5;
    })
    .attr("fill", "none")
    .attr("stroke","#000")
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 0.5);

d3.timer(function(t) {
    svg.attr("transform", "rotate(" + [Math.sin(t / 10000) * 180 / Math.PI, width / 2, height / 2] + ")");

    circles.attr("cy", function(d) {
        return 0.25 * width + 50 * Math.sin(d[0] * t / 7000) + 50 * Math.sin(50 * d[1] + t / 1000);
    });
});
