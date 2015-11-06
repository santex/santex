


var width = 500,
    height = 500,
    n = 1000;

var data = d3.range(0, n).map(function() {
    return {
        r: Math.random() * width * 1.5,
        t: Math.random() * Math.PI * 2
    };
});

var g = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
  .append("g")
    .attr("transform", "translate(" + (Math.random() * width / 2) + "," +
                                      (Math.random() * height / 2) + ")");

g.selectAll("path")
    .data(data)
  .enter().append("path")
    .attr("fill", "none")
    .attr("stroke", "#FFF")
    .attr("stroke-linecap", "round")
    .attr("stroke-opacity", function() { return Math.random(); })
    .attr("stroke-width", function() { return Math.random() * 3; })
  .transition()
    .ease("linear")
    .duration(1000000)
    .attrTween("d", pathTween);



function pathTween(d) {
    function p(t) {
        return [d.r * Math.cos(d.t + t), d.r * Math.sin(d.t + t)];
    }
    return function(t) {
        return "M" + p(0) + " A" + d.r + "," + d.r + " 0 " + (t < 0.5 ? 0 : 1) + " 1 " + p(t * Math.PI * 2);
    }
}
