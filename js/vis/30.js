

var width = 500,
    height = 500,
    n = 2000,
    π = Math.PI;

var data = d3.range(0, n).map(function(i) {
    return {
        i: i,
        r: d3.random.logNormal(0, 0.3)() * (width / 10),
        θ: Math.random() * π * 2,
        l: 20 - 2 * d3.random.logNormal()(),
        w: Math.random() * 3,
        o: Math.random()
    };
});

var g = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
  .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var paths = g.selectAll("path")
    .data(data, function(d) { return d.i; })
  .enter().append("path")
    .attr("stroke", "#FFF")
    .attr("stroke-linecap", "round")
    .attr("stroke-opacity", function(d) { return d.o; })
    .attr("stroke-width", function(d) { return d.w; })
    .attr("d", function(d) {
        return "M" + [0, -d.l/2] + "L" + [0, d.l/2];
    });

d3.timer(function (t) {
    t /= 2000;

    data = data.filter(function(d) {
        d.r += Math.min(2, (d.r * d.r) / 100000);
        return d.r < width;
    });

    var paths = g.selectAll("path")
        .data(data, function(d) { return d.i; });

    paths.exit()
        .remove();

    paths.attr("transform", function(d) {
        return "rotate(" + (d.θ * 180 / π + d.r / 5) % 360 + ")translate(" + [d.r, 0] + ")";
    });

    return data.length === 0;
});
