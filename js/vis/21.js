

var width = 500,
    height = 500;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color)
    .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var spiral = svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "#111")
    .attr("stroke-opacity", 0.8)
    .attr("stroke-width", 1);

var range = d3.range(0, 64 * Math.PI, 0.1);

d3.timer(function(t) {
    spiral.attr("d", "M" + range.map(function(p) {
        var a = (Math.sin(t / 200000) + 1) / 2,
            b = (Math.cos(t / 150000) + 1) / 2;
        return [
            0.4 * width * Math.sin(a * p + Math.cos(t / 4000)),
            0.4 * height * Math.sin(b * p)
        ];
    }).join("L"));
})
