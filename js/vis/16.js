
var width = 500,
    height = 500,
    n = 32,
    r = 0.45 * width,
    π = Math.PI;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var g = svg.append("g");

var moons = g.selectAll("path")
    .data(d3.range(0, n))
    .enter().append("path")
    .attr("fill", "#000")
    .attr("fill-opacity", 0.05);

d3.timer(function(t) {
    g.attr("transform", "translate(" + [width / 2, height / 2] + ")");

    moons.attr("transform", function(d) {
        return "rotate(" + 360 * d * t / 60000 + ")";
    });

    moons.attr("d", function(d) {
        return moon(0.5 * π * Math.sin(d * t / 70000));
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
