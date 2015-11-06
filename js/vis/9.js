

var width = 500,
    height = 500,
    mx = 320,
    my = 90,
    n = 8,
    R2D = 180 / Math.PI;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#1e1e1e");

var defs = svg.select("defs");

var moon = svg.append("circle")
    .attr("class", "moon")
    .attr("fill", color)
    .attr("cx", mx)
    .attr("cy", my)
    .attr("r", 45);

svg.append("rect")
    .attr("class", "snow")
    .attr("fill", "url(#snow)")
    .attr("x", -20)
    .attr("y", 0.45 * height)
    .attr("width", width + 20)
    .attr("height", 100)
    .attr("transform", "rotate(5,250,250)");

svg.append("rect")
    .attr("class", "snow")
    .attr("fill", "url(#snow)")
    .attr("x", 0)
    .attr("y", 0.45 * height)
    .attr("width", width + 20)
    .attr("height", 100)
    .attr("transform", "rotate(-5,250,250)");

svg.append("rect")
    .attr("class", "snow")
    .attr("fill", "url(#snow)")
    .attr("x", 0)
    .attr("y", 0.5 * height)
    .attr("width", width)
    .attr("height", height);

var data = d3.range(0, n)
    .map(function(i) {
        var gradient = defs.append("linearGradient")
            .attr("id", "g" + i);

        d = {
            stops: [
                gradient.append("stop"),
                gradient.append("stop")
            ]
        };

        randomize(d);
        d.x += i * (width / n);

        return d;
    });


var g = svg.selectAll("g")
    .data(data)
    .enter().append("g");

g.append("path")
    .attr("class", "shadow")
    .attr("fill", "rgba(16,16,16,.8)");

g.append("path")
    .attr("class", "tree");

function tree(d, i) {
    var g = d3.select(this),
        x = d.x,
        y = d.y,
        w = d.w,
        h = height,
        p = "M" + [-w/2,0] + "C" + [-w/2,5] + " " + [w/2,5] + " " + [w/2,0]
          + "L" + [w/2-d.r1+d.r3,-h] + "L" + [-w/2+d.r2+d.r3,-h] + "Z",
        a = 90 - R2D * Math.atan2(y - my, mx - x);

    g.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
    });

    if (x > mx) {
        d.stops[0].attr("offset", "0%").attr("stop-color", "#666");
        d.stops[1].attr("offset", 0.12 * (x - mx) + "%").attr("stop-color", color);
    } else {
        d.stops[0].attr("offset", 100 - 0.1 * (mx - x) + "%").attr("stop-color", color);
        d.stops[1].attr("offset", "100%").attr("stop-color", "#666");
    }

    g.selectAll(".tree")
        .attr("d", p)
        .attr("fill", "url(#g" + i + ")")

    g.selectAll(".shadow")
        .attr("transform", "scale(1,-1)skewX(" + a + ")")
        .attr("d", p);
};
function randomize(d) {
    d.x = Math.random() * -30;
    d.y = 0.65 * height + Math.random() * 15;
    d.w = 20 + Math.random() * 8;
    d.r1 = Math.random() * 5;
    d.r2 = Math.random() * 5;
    d.r3 = Math.random() * 10;
    return d;
}

var t0 = 0;

d3.timer(function(t1) {
    dt = t1 - t0;
    t0 = t1;

    data.forEach(function(d) {
        d.x += 0.15 * dt;
        if (d.x > width + 25) {
            d.x = d.x % width - 50;
        }
    });

    g.each(tree);
});
