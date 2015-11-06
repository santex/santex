

var width = 500,
    height = 500;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

setInterval(function () {
    var paths = svg.selectAll(".line")
        .data(d3.range(0, 5))
        .enter().append("g");

    paths.append("path")
        .attr("stroke", "black")
        .attr("fill", "none")
        .attr("d", function() {
            var y = boxMuller(0.2) * 250;
            return "M0,0 Q250," + (y/2 + Math.random() * 20) + " 500," + y;
        })
        .attr("stroke-width", function() { return boxMuller(0.2) + 1.5; });

    paths
        .attr("transform", "translate(0,1000)")
        .transition()
        .ease("linear")
        .delay(function() { return Math.random() * height; })
        .duration(function () { return 2000 + (Math.random() * 1000 - 500) })
        .attr("transform", "translate(0,-500)")
        .remove();
}, 1000);

function boxMuller(variance) {
    var u1 = Math.random(),
        u2 = Math.random();
    return Math.sqrt(variance * -2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
