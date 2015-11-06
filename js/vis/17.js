

var width = 500,
    height = 500,
    n = 10;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color);

var scale = d3.scale.ordinal()
    .domain(d3.range(0, n))
    .rangePoints([0, width], 1.3);

var data = d3.range(0, n * n)
    .map(function(d) {
        var x = d % n + 1,
            y = ~~(d / n) + 1;
        return { x: x, y: y, max: 2 * Math.PI / gcd(x, y) };
    });

var spiral = svg.selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("transform", function(d) {
        return "translate(" + [scale(d.x - 1), scale(d.y - 1)] + ")";
    })
    .attr("fill", "none")
    .attr("stroke", "#"+((1<<24)*Math.random()|0).toString(16))
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 0.5);


d3.timer(function(t) {
    spiral.attr("d", function(d) {
        var x = d.x,
            y = d.y,
            r = "M",
            z = 2 * Math.PI * (t / 20000 % 20000) + (d.x + d.y) * Math.PI / 16;

        for (var i = 0; i < d.max; i += (d.max * 0.01)) {
            r += 20 * Math.sin(x * i + z);
            r += ",";
            r += 20 * Math.sin(y * i);
            r += "L";
        }

        r += 20 * Math.sin(z);
        r += ",";
        r += 20 * Math.sin(0);

        return r;
    });
});

function gcd(a, b) {
    if (!b) return a;
    return gcd(b, a % b);
}

