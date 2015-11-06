

var width = 500,
    height = 500,
    rows = 40,
    cols = 40,
    r = 5,
    π = Math.PI,
    p = 10000;

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
    .attr("fill", "#000");

d3.timer(function(t) {
    moons.attr("d", function(d) {
        var x = cols / 2 - d.x,
            y = cols / 2 - d.y;
        return moon(3 * π * Math.cos(x * t / 20000) +
                    2 * π * Math.cos(y * t / 30000));
    });

    moons.attr("transform", "rotate(" + (360 * (Math.cos(t / 10000) + 1)) + ")");
});

function moon(θ) {
    θ %= 2 * π;

    var rx0 = θ < π ? r : -r,
        s0  = θ < π ? 0 : 1,
        rx1 = r * Math.cos(θ),
        s1  = θ < π/2 || (π <= θ && θ < 3*π/2) ? 0 : 1;

    return "M" + [                  0,  r] +
           "A" + [rx0, r, 0, 0, s0, 0, -r] +
           "A" + [rx1, r, 0, 0, s1, 0,  r];
}
