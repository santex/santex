

var width = 500,
    height = 500,
    n = 16,
    r = 25,
    π = Math.PI,
    p = 10000;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var g = svg.selectAll("g")
    .data(d3.range(0, 2 * π, 2 * π / n))
    .enter().append("g")
    .attr("transform", function(d) {
        var x = width  * (0.35 * Math.cos(d) + 0.5),
            y = height * (0.35 * Math.sin(d) + 0.5);
        return "translate(" + [x, y] + ")rotate(" + d * 180 / π + ")";
    });

var moons = g.append("path")
    .attr("fill","#"+((1<<24)*Math.random()|0).toString(16));

d3.timer(function(t) {
    var θ = 2 * π * (t % p / p);
    moons.attr("d", function(d) { return moon((θ + d) % (2 * π)); });
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
