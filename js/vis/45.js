


var width = 500,
    height = 500,
    τ = 2 * Math.PI,
    n = 10;

var pie = d3.layout.pie()
    .value(Math.random)
    .sort(null);

var data = pie(d3.range(0, n)).map(function(d) {
    d.innerRadius = Math.random() * width / 4;
    d.outerRadius = Math.random() * width / 4 + d.innerRadius;
    return d;
});

var arc = d3.svg.arc();

var g = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")rotate(0)");

(function loop1() {
    g.transition()
        .ease("linear")
        .duration(30000)
        .attrTween("transform", function() {
            return function(t) {
                return "translate(" + width / 2 + "," + height / 2 + ")rotate(" + 360 * t + ")"
            }
        })
        .each("end", loop1)
})();

var path = g.selectAll("path")
    .data(pie(data))
  .enter().append("path")
    .attr("d", arc)
    .attr("fill","#000")
    .attr("fill-opacity", function(d) { return Math.random(); });

(function loop2() {
    path.transition()
        .duration(1000)
        .attr("fill-opacity", function(d) { return Math.random(); })
        .attrTween("d", tweenArc(function(d, i) {
            var inner = Math.random() * width / 4,
                outer = Math.random() * width / 4 + inner;
            return {
                innerRadius: inner,
                outerRadius: outer
            };
        }));

    setTimeout(loop2, 1000);
})();

function tweenArc(b) {
  return function(a, i) {
    var d = b.call(this, a, i), i = d3.interpolate(a, d);
    for (var k in d) a[k] = d[k]; // update data
    return function(t) { return arc(i(t)); };
  };
}
