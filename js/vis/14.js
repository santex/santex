
var width = 500,
    height = 500,
    cols = 100,
    w = 20;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#888")
    .append("g")
    .attr("transform", "rotate(" + [-25, width / 2, height / 2] + ")");

var gradient = svg.selectAll("linearGradient")
    .data([[color, "#444"], ["#333", color], ["#333", "#444"], ["#d1d1d1", "#eee"]])
    .enter().append("linearGradient")
    .attr("id", function(d, i) { return "gradient" + i; })
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "5%")
    .attr("y2", "0%");

gradient.append("stop")
    .attr("offset", 0.9)
    .attr("stop-color", function(d) { return d[0]; });

gradient.append("stop")
    .attr("offset", 1)
    .attr("stop-color", function(d) { return d[1]; });

var g = svg.selectAll("g")
    .data(d3.range(0, 33))
    .enter().append("g");

g.selectAll("path")
    .data(function(d) { return [d, d] })
    .enter().append("path")
    .attr("fill", function(d, i) {
        return i ? ((d % 2) ? "url(#gradient0)" : "url(#gradient1)")
                 : ((d % 2) ? "url(#gradient2)" : "url(#gradient3)");
    })
    .attr("transform", function(d, i) {
        return i ? "" : "translate(500)scale(-1 1)";
    })
    .attr("d", function() {
        return "M-300,0 L180,0 Q220,0 250,12.5 L250,12.5 Q220,25 180,25 L-300,25 Z";
    });

d3.timer(function(t) {
    g.attr("transform", function(d) {
        return "translate(" + [200 * Math.sin(t / 2000 + 0.6 * d), (d - 4) * w - 3] + ")";
    })
});
