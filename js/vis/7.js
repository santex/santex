
var width = 500,
    height = 500,
    n = 30,
    r = width / 14;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var ms = 1000,
    s  = ms * 60,
    m  = s  * 60,
    h  = m  * 24;

var data = [
    function(t) {
        var b = +new Date(t.getFullYear(), 0, 1),
            e = +new Date(t.getFullYear() + 1, 0, 1);
        return (t - b) / (e - b);
    },
    function(t) {
        var b = +new Date(t.getFullYear(), t.getMonth(), 1),
            e = +new Date(t.getFullYear(), t.getMonth() + 1, 1);
        return (t - b) / (e - b);
    },
    function(t) { return (t.getMilliseconds() + t.getSeconds() * ms + t.getMinutes() * s + t.getHours() * m) / h; },
    function(t) { return (t.getMilliseconds() + t.getSeconds() * ms + t.getMinutes() * s) / m; },
    function(t) { return (t.getMilliseconds() + t.getSeconds() * ms) / s; },
    function(t) { return t.getMilliseconds() / ms; }
];

var g = svg.append("g")
    .attr("transform", "translate(" + [width/2, height/2] + ")");

data.forEach(function(d, i) {
    g = g.append("g")
        .datum(function() { return d; })
        .attr("class", "dial");

    g.append("circle")
        .attr("r", width/2  * (1 - (i + 1) / (data.length + 1)))
        .attr("fill", "#fff")
        .attr("fill-opacity", 0.25)
});

g = d3.selectAll("g.dial");

d3.timer(function() {
    var t = new Date();
    g.attr("transform", function(d) {
        var p = d(t) * 2 * Math.PI - Math.PI / 2,
            x = r * Math.cos(p),
            y = r * Math.sin(p);
        return "translate(" + [x, y] + ")";
    });
});
