var data = d3.range(0, 45).map(function () { return 1; });

var width = 500,
    height = 500,
    τ = 2 * Math.PI;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var pie = d3.layout.pie();

var arc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(width);

var path = svg.selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("fill", "#000");

var ease = d3.ease("linear"),
    duration = 7500;

d3.timer(function(elapsed) {
    var t0 = ease((elapsed % duration) / duration),
        t1 = ease(1 - Math.abs((elapsed % duration) / duration - .5) * 2);
    path
        .data(pie
            .startAngle(t0 * τ / data.length)
            .endAngle(τ + t0 * τ / data.length)
            .padAngle(t1 * τ / data.length)
            (data))
        .attr("d", arc);
});

