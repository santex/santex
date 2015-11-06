

var width = 500,
    height = 500,
    rows = 10;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var filter = svg.append("filter")
    .attr("id", "blur")
    .attr("x", -100)
    .attr("y", -100)
    .attr("width", width + 200)
    .attr("height", 300)
    .attr("filterUnits", "userSpaceOnUse")
    .append("feGaussianBlur")
    .attr("stdDeviation", 20);

var data = d3.range(rows).map(function() {
    var x = Math.random() * width;
    return [[0, 0], [x - 50, 0], [x, -100], [x + 50, 0], [width, 0]];
});

var area = d3.svg.area()
    .y0(height)
    .interpolate("basis");

var scale = d3.scale.linear()
    .domain([0, rows])
    .range([color, "#222"]);

var groups = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) {
        return "translate(" + [0, i * height / rows] + ")"
    });

groups.append("path")
    .attr("fill", function(d, i) { return scale(i); })
    .attr("d", area);

var circles = groups
    .filter(function(d, i) { return i != rows - 1; })
    .append("g")
    .attr("filter", "url(#blur)")
    .selectAll("circle")
    .data(function(d, i) {
        return d3.range(7).map(function() {
            return {
                i: i,
                x: Math.random() * (width + 200) - 100
            };
        });
    })
    .enter().append("ellipse")
    .attr("cy", 20)
    .attr("ry", 20)
    .attr("rx", 60)
    .style("fill", function(d) {
        return scale(d.i - 5);
    })
    .attr("fill-opacity", 0.2);

d3.timer(function() {
    circles.each(function(d, i) {
        d.x += d.i / 3 + Math.min(i / 2, 1);
        if (d.x > width + 100) d.x = -100;
    });
    circles.attr("cx", function(d) { return d.x; })
});
