

var width = 500,
    height = 500,
    rows = 10,
    cols = 10;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var data = d3.range(0, rows)
    .map(function(i) {
        return d3.range(0, cols)
            .map(function() { return i * height / rows; });
    });

var area = d3.svg.area()
    .x(function(_, i) { return i * (width / (cols - 1)); })
    .y1(function(y) { return y; })
    .interpolate("basis");

var paths = svg.selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("fill", "#D1D1D1")
    .attr("fill-opacity", 0.1);

d3.timer(function(elapsed) {
    paths.each(function(bins) {
        var path = d3.select(this),
            mean = d3.sum(bins) / cols,
            min = d3.min(bins);

        if (min >= height) {
            for (var i = 0; i < cols; i++)
                 bins[i] = 0;
            path.attr("d", area(bins))
                .attr("fill-opacity", 0.1);
        } else {
            bins[Math.floor(Math.random() * cols)] += 1;
            path.attr("d", area(bins))
                .attr("fill-opacity", 0.15 * (1 - (mean / height)));
        }
    });
});
