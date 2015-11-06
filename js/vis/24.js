

var width =window.innerHeight*0.65,
    height = window.innerHeight*0.65,
    cols = 100,
    a = 1,
    b = 0.3;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color)
    .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var spiral = svg.selectAll("path")
    .data(d3.range(0, 4 * Math.PI, Math.PI / 4))
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 2);

var range = d3.range(0, 5.5 * Math.PI, 0.1);

d3.timer(function(t) {
    spiral.attr("d", function(d, i) {
        return "M" +
            range.map(function(θ) {
                var r = a * Math.exp(b * θ);
                return [
                    (r + 100 * (Math.cos(t / 2000) - 1)) * Math.cos(θ - t / 1000 + d),
                    (r + 100 * (Math.sin(t / 2000) - 1)) * Math.sin(θ - t / 1000 + d)
                ];
            }).join("L");
    });
})
