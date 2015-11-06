
var width = 500,
    height = 500;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var gradient = svg.append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("y1", "0%")
    .attr("y2", "100%");

gradient.append("stop")
    .attr("offset", 0)
    .attr("stop-color", "#fff")
    .attr("stop-opacity", 0.7);

gradient.append("stop")
    .attr("offset", 1)
    .attr("stop-color", "#fff")
    .attr("stop-opacity", 0);

svg.append("filter")
    .attr("id", "blur")
    .attr("x", "-20%")
    .attr("y", "-20%")
    .attr("width", "140%")
    .attr("height", "140%")
    .append("feGaussianBlur")
    .attr("stdDeviation", 4);

var lights = svg.selectAll("g")
    .data([{
        origin: [-100, width / 2],
        target: [width / 2, width / 2]
    }, {
        origin: [width + 100, width / 2],
        target: [width / 2, width / 2]
    }])
    .enter().append("g")
    .attr("transform", function(d) {
        return transform(d.origin, d.target);
    });

lights.append("path")
    .attr("fill", "url(#gradient)")
    .attr("filter", "url(#blur)")
    .attr("d", function() {
        var a = 100,
            h = a * Math.sqrt(3) / 2;
        return "M" + [0,    0] +
               "L" + [+a/2, h] +
               "L" + [-a/2, h] + "Z";
    });

lights.append("ellipse")
    .attr("transform", "translate(0,100)")
    .attr("rx", 50)
    .attr("ry", 25)
    .attr("fill", "#fff")
    .attr("fill-opacity", 0.5)
    .attr("filter", "url(#blur)");

lights.each(function loop() {
    d3.select(this)
        .transition()
        .duration(2000)
        .attrTween("transform", function(d) {
            var a = d.target,
                b = d.target = [
                    Math.random() * (width - 200) + 100,
                    Math.random() * (height - 200) + 100
                ],
                interpolate = d3.interpolate(a, b);

            return function(t) {
                return transform(d.origin, interpolate(t));
            }
        })
        .each("end", loop);
});

function transform(origin, target) {
    var θ = Math.atan2(target[1] - origin[1], target[0] - origin[0]) * (180 / Math.PI) - 90,
        k = 1 + (5 * target[0] / width);
    return "translate(" + origin + ")rotate(" + θ + ")scale(1," + k + ")";
}
