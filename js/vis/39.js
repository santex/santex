

var width = 500,
    height = 500,
    cols = 50;

var scale = d3.scale.ordinal()
    .domain(d3.range(0, cols))
    .rangePoints([0, width], 2);

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var data = d3.range(0, cols * cols)
    .map(function(d) {
        return { x: d % cols, y: ~~(d / cols) };
    });

var dots = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("fill", "#000")
    .attr("cx", function(d) { return scale(d.x); })
    .attr("cy", function(d) { return scale(d.y); })
    .attr("r", 3);

function repeat() {
    dots.transition()
        .ease("linear")
        .duration(2000)
        .attr("r", function(d) {
            var x = cols / 2 - d.x,
                y = cols / 2 - d.y;
            return Math.max(7 - Math.sqrt(x*x + y*y) / 10, 3);
        })
        .transition()
        .delay(3000)
        .attr("r", 3)
        .each("end", function(d, i) { if (i === 0) setTimeout(repeat, 1000); });
}

setTimeout(repeat, 1000);
