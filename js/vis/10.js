

var width = 500,
    height = 500,
    cols = 8,
    rows = 50,
    duration = 2000;

var scale = d3.scale.ordinal()
    .domain(d3.range(0, cols))
    .rangeBands([0, width], 0.1, 0.1);

var y = function(d) { return d * 4 };

var pad = scale(0),
    band = scale.rangeBand();

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color);

var columns = svg.selectAll("g")
    .data(d3.range(0, 8))
    .enter().append("g")
    .attr("transform", function(d) { return "translate(" + scale(d) + "," + pad + ")"});

var paths = columns.selectAll("g")
    .data(d3.range(0, rows))
    .enter().append("g")
    .attr("transform", function(d) { return "translate(0," + y(d) + ")"; })

paths.append("path")
    .attr("stroke", "#"+((1<<24)*Math.random()|0).toString(16))
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("line-cap", "round")
    .attr("d", "M0,0 L" + band + ",0");

columns.transition()
    .delay(function(d) { return d * 200; })
    .each("start", function(d) {
        var paths = d3.select(this).selectAll("g");

        function down() {
            paths.transition()
                .duration(duration)
                .delay(function(d) { return (rows - d - 1) * duration / rows; })
                .attr("transform", function(d) {
                    var y1 = height - 2 * pad - y(rows - d - 1);
                    return "translate(0," + y1 + ")";
                })
                .each("end", function(d) {
                    if (d === 0) up();
                });
        }

        function up() {
            paths.transition()
                .duration(duration)
                .delay(function(d) { return d * duration / rows; })
                .attr("transform", function(d) {
                    return "translate(0," + y(d) + ")";
                })
                .each("end", function(d) {
                    if (d === rows - 1) down();
                });
        }

        down();
    });
