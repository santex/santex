
var width = 500,
    height = 500;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var spiral = svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 0.5);

// Equation from http://goatlink.deviantart.com/art/lissajous-curves-338721857

var range = d3.range(-30 * Math.PI, 30 * Math.PI, 0.02);

d3.timer(function(t) {
    var d = "M";

    for (var i = 0; i < range.length; i++) {
        var p = range[i];
        d += 0.23 * width * (Math.sin((2 + 0.2 * Math.cos(t / 10000))  * p) + Math.sin(4.02 * p));
        d += ",";
        d += 0.23 * height * (Math.sin((3 + 0.2 * Math.cos(t / 10000)) * p) + Math.sin(6.02 * p));
        if (i != range.length - 1) d += "L";
    }

    d.length--;
    spiral.attr("d", d);

    svg.attr("transform", "translate(250,250)rotate(" + 360 * (t % 100000 / 100000) + ")")
})
