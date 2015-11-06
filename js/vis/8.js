

var width = 500,
    height = 500,
    cols = 50;

var scale = d3.scale.ordinal()
    .domain(d3.range(1, cols))
    .rangePoints([0, width], 2);

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background","#"+((1<<24)*Math.random()|0).toString(16));

var data = d3.range(0, cols * cols)
    .map(function(d) {
        return { x: d % cols, y: ~~(d / cols) };
    });

var dots = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("fill",color)
    .attr("cx", function(d) { return scale(d.x); })
    .attr("cy", function(d) { return scale(d.y); });

d3.timer(function(t) {
    dots.attr("r", function(d) { return (((Math.cos(t / 10000) + 1) * d.x * d.y) % 10) / 5; });
});
