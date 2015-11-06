

var width = 500,
    height = 500,
    cols = 50;

var scale = d3.scale.ordinal()
    .domain(d3.range(0, cols))
    .rangePoints([0, width], 2);

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color);

var data = d3.range(0, cols * cols)
    .map(function(d) {
        return { x: d % cols, y: ~~(d / cols) };
    });

var dots = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("fill","#"+((1<<24)*Math.random()|0).toString(16))
    .attr("cx", function(d) { return scale(d.x); })
    .attr("cy", function(d) { return scale(d.y); })
    .attr("r", 2);

var drops = [],
    t = 0;

(function drop() {
    drops.push([Math.random() * cols, Math.random() * cols, t]);
    drops = drops.filter(function(p) { return (t - p[2]) < 20000; });
    setTimeout(drop, Math.random() * 7500);
})();

d3.timer(function(elapsed) {
    t = elapsed;
    dots.attr("r", function(d) {
        return Math.max(0, 2 + d3.sum(drops, function(p) {
            var dx = d.x - p[0],
                dy = d.y - p[1],
                dt = t   - p[2],
                z = Math.max(0, dt / 200 - Math.sqrt(dx*dx + dy*dy));
            return Math.exp(-z/15) * Math.sin(z);
        }));
    });
});
