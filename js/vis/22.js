

var width = 500,
    height = 500,
    n = 50,
    period = 4000;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color);

var stars = svg.selectAll("text")
    .data(d3.range(0, n))
    .enter().append("text")
    .attr("fill", "#d1d1d1")
    .attr("font-size", 14)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function() { return ("✦★✶✸✹").charAt(Math.random() * 5); })
  .transition()
    .delay(function(d) { return d * period / n; })
    .duration(period / 2)
    .each(twinkle);

function twinkle() {
    var star = d3.select(this);
    (function repeat() {
        var x = Math.random() * width,
            y = Math.random() * height,
            translate = "translate(" + [x, y] + ")";

        star = star.transition()
            .each(function() {
                d3.select(this).attr("transform", translate + "scale(0)");
            })
            .attr("transform", translate + "scale(1)")
          .transition()
            .attr("transform", translate + "scale(0)")
            .each("end", repeat);
    })();
}
