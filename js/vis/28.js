

var width = 500,
    height = 500,
    rows = 10;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

svg.append("filter")
    .attr("id", "blur")
    .attr("x", -10)
    .attr("y", -10)
    .attr("width", width + 20)
    .attr("height", height + 20)
    .attr("filterUnits", "userSpaceOnUse")
    .append("feGaussianBlur")
    .attr("stdDeviation", 1);

svg.selectAll("g")
    .data([75, 175])
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + [d, 0] + ")";
    })
    .attr("filter", "url(#blur)")
    .append("path")
    .attr("fill", "#fff")
    .attr("fill-opacity", 0.2)
    .attr("d", "M0,0 L75,0 L200,500 L25,500 Z");

var clip = svg.append("defs")
    .append("clipPath")
    .attr("id", "clip");

clip.selectAll("g")
    .data([75, 175])
    .enter()
    .append("path")
    .attr("d", function(d) {
        return "M" + [0+d,0] + "L" + [75+d,0] + "L" + [200+d,500] + "L" + [25+d,500] + "Z"
    });

var data = d3.range(500).map(function() {
    return {
        p: [Math.random() * width, Math.random() * height],
        v: [(30 + 9  * Math.random()) / 50,
            (10 + 11 * Math.random()) / 50]
    }
});

var motes = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("r", 1)
    .attr("fill", "#fff")
    .attr("fill-opacity", 1)
    .attr("filter", "url(#blur)")
    .attr("clip-path", "url(#clip)");

d3.timer(function() {
    motes.each(function(d) {
        d.p[0] += d.v[0];
        d.p[1] += d.v[1];
        if (d.p[0] > width) d.p[0] -= width;
        if (d.p[1] > height) d.p[1] -= height;
    });

    motes
        .attr("cx", function(d) { return d.p[0]; })
        .attr("cy", function(d) { return d.p[1]; })
});

