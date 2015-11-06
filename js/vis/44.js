

var width = 500,
    height = 500,
    rows = 20,
    cols = 20,
    r = 10,
    π = Math.PI,
    p = 40000;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var data = d3.range(0, rows * cols)
    .map(function(d) {
        return { x: d % cols, y: ~~(d / cols) };
    });

var scale = d3.scale.ordinal()
    .domain(d3.range(0, cols))
    .rangePoints([0, width], 1);

var g = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + [scale(d.x), scale(d.y)] + ")";
    });

var moons = g.append("path")
    .attr("fill","#000");

d3.timer(function(t) {
    t = t % p / p;

    var x = (cols + 8) * t - 4,
        y = rows - rows / 3 - 6 * Math.sin(t * π);

    moons.attr("transform", function(d) {
        return "rotate(" + (180 + Math.atan2(d.y - y, d.x - x) * 180 / π) + ")";
    });

    moons.attr("d", function(d) {
        var dx = d.x - x,
            dy = d.y - y,
            z = Math.sqrt(dx*dx + dy*dy);
        return moon(Math.min(0.9 * z, π));
    });
});
function moon(θ) {
    var rx0 = θ < π ? r : -r,
        s0  = θ < π ? 0 : 1,
        rx1 = r * Math.cos(θ),
        s1  = θ < π/2 || (π <= θ && θ < 3*π/2) ? 0 : 1;

    return "M" + [                  0,  r] +
           "A" + [rx0, r, 0, 0, s0, 0, -r] +
           "A" + [rx1, r, 0, 0, s1, 0,  r];
}
