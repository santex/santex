
function graph1(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    rows = 10;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var filter = svg.append("filter")
    .attr("id", "blur")
    .attr("x", -100)
    .attr("y", -100)
    .attr("width", width + 200)
    .attr("height", 300)
    .attr("filterUnits", "userSpaceOnUse")
    .append("feGaussianBlur")
    .attr("stdDeviation", 20);

var data = d3.range(rows).map(function() {
    var x = Math.random() * width;
    return [[0, 0], [x - 50, 0], [x, -100], [x + 50, 0], [width, 0]];
});

var area = d3.svg.area()
    .y0(height)
    .interpolate("basis");

var scale = d3.scale.linear()
    .domain([0, rows])
    .range([color, "#222"]);

var groups = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) {
        return "translate(" + [0, i * height / rows] + ")"
    });

groups.append("path")
    .attr("fill", function(d, i) { return scale(i); })
    .attr("d", area);

var circles = groups
    .filter(function(d, i) { return i != rows - 1; })
    .append("g")
    .attr("filter", "url(#blur)")
    .selectAll("circle")
    .data(function(d, i) {
        return d3.range(7).map(function() {
            return {
                i: i,
                x: Math.random() * (width + 200) - 100
            };
        });
    })
    .enter().append("ellipse")
    .attr("cy", 20)
    .attr("ry", 20)
    .attr("rx", 60)
    .style("fill", function(d) {
        return scale(d.i - 5);
    })
    .attr("fill-opacity", 0.2);

d3.timer(function() {
    circles.each(function(d, i) {
        d.x += d.i / 3 + Math.min(i / 2, 1);
        if (d.x > width + 100) d.x = -100;
    });
    circles.attr("cx", function(d) { return d.x; })
});
}
function graph2(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5;

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
}
function graph3(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 10,
    a = width / n,
    h = a * Math.sqrt(3) / 2;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var rows = svg.selectAll("g")
    .data(d3.range(0, 2 * height / h + 1))
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + [(d % 2) * a / 4 + 10, d * h / 2] + ")";
    });

var cols = rows.selectAll("g")
    .data(d3.range(0, n + 1))
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + [d * a, 0] + ")";
    });

cols.append("path")
    .attr("fill", "#fff")
    .attr("fill-opacity", 0.33)
    .attr("d", "M" + [0,   -2*h/3] +
               "L" + [-a/2,   h/3] +
               "L" + [+a/2,   h/3] + "Z");

(function loop() {
    rows.transition()
        .delay(function(d) { return d * 30; })
        .each("start", function() {
            var t = d3.select(this).selectAll("path")
                .transition()
                .delay(function(d) { return d * 30; });

            d3.range(0, 6).forEach(function(k) {
                t = t.transition()
                    .duration(1000)
                    .attr("transform", function(d) { return "rotate(" + (d % 2 === 0 ? 1 : -1) * 60 * k + ")"; });
            });
        });

    setTimeout(loop, 6000);
})();
}
function graph4(color){
var data = d3.range(0, 45).map(function () { return 1; });

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
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

}
function graph5(color){


var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 10,
    r = width / n / 2,
    dx = r * 2 * Math.sin(Math.PI / 3),
    dy = r * 1.5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color);

var data = [];

for (var y = -r, odd = false; y < height + 2 * r; y += dy, odd = !odd) {
    for (var x = odd ? -dx / 2 : 0; x < width + dx; x += dx) {
        data.push([x, y]);
    }
}

var hexes = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + d + ")";
    })
    .append("path")
    .attr("fill", "#111")
    .attr("fill-opacity", 0.2)
    .attr("d", "M" + hexagon(r).join("l") + "Z");

d3.timer(function(t) {
    hexes.attr("transform", function(d, i) {
        return "scale(" + (Math.sin(i / 3.5 + t / 2000) + 1) + ")";
    });
});

function hexagon(radius) {
    var x0 = 0, y0 = 0;
    return d3.range(0, 2 * Math.PI, Math.PI / 3).map(function(angle) {
        var x1 = Math.sin(angle) * radius,
            y1 = -Math.cos(angle) * radius,
            dx = x1 - x0,
            dy = y1 - y0;
        x0 = x1;
        y0 = y1;
        return [dx, dy];
    });
}
}

function graph6(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 35,
    r = width / n / 2,
    dx = r * 2 * Math.sin(Math.PI / 3),
    dy = r * 1.5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .append("g")
    .attr("transform", "translate(" + [-width / 2, -height / 2] + ")");

var data = [[0, 0]], x, y, j;

for (var i = 1; i <= 17; i++) {
    var odd = i % 2 === 1;

    for (j = 0, x = (2 - i) * dx / 2, y = -i * dy; j < i; j++, x += dx, y += 0) {
        data.push([x, y]);
    }

    for (j = 0, x = (1 + i) * dx / 2, y = (1 - i) * dy; j < i; j++, x += dx / 2, y += dy) {
        data.push([x, y]);
    }

    for (j = 0, x = (2 * i - 1) * dx / 2, y = dy; j < i; j++, x -= dx / 2, y += dy) {
        data.push([x, y]);
    }

    for (j = 0, x = i * dx / 2 - dx, y = i * dy; j < i; j++, x -= dx, y += 0) {
        data.push([x, y]);
    }

    for (j = 0, x = (-i - 1) * dx / 2, y = (i - 1) * dy; j < i; j++, x -= dx / 2, y -= dy) {
        data.push([x, y]);
    }

    for (j = 0, x = -i * dx + dx / 2, y = -dy; j < i; j++, x += dx / 2, y -= dy) {
        data.push([x, y]);
    }
}

var hexes = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + [d[0] + width, d[1] + height] + ")";
    })
    .append("path")
    .attr("fill", "#fff")
    .attr("fill-opacity", 0.8)
    .attr("d", "M" + hexagon(r).join("L") + "Z");

d3.timer(function(t) {
    hexes.attr("transform", function(d, i) {
        return "scale(" + (Math.sin(t * (i + 1) / 50000) + 1) / 2 + ")";
    });
});

function hexagon(radius) {
    return d3.range(0, 2 * Math.PI, Math.PI / 3).map(function(angle) {
        var x1 = Math.sin(angle) * radius,
            y1 = -Math.cos(angle) * radius;
        return [x1, y1];
    });
}
}
function graph7(color){
var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 30,
    r = width / 14;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var ms = 1000,
    s  = ms * 60,
    m  = s  * 60,
    h  = m  * 24;

var data = [
    function(t) {
        var b = +new Date(t.getFullYear(), 0, 1),
            e = +new Date(t.getFullYear() + 1, 0, 1);
        return (t - b) / (e - b);
    },
    function(t) {
        var b = +new Date(t.getFullYear(), t.getMonth(), 1),
            e = +new Date(t.getFullYear(), t.getMonth() + 1, 1);
        return (t - b) / (e - b);
    },
    function(t) { return (t.getMilliseconds() + t.getSeconds() * ms + t.getMinutes() * s + t.getHours() * m) / h; },
    function(t) { return (t.getMilliseconds() + t.getSeconds() * ms + t.getMinutes() * s) / m; },
    function(t) { return (t.getMilliseconds() + t.getSeconds() * ms) / s; },
    function(t) { return t.getMilliseconds() / ms; }
];

var g = svg.append("g")
    .attr("transform", "translate(" + [width/2, height/2] + ")");

data.forEach(function(d, i) {
    g = g.append("g")
        .datum(function() { return d; })
        .attr("class", "dial");

    g.append("circle")
        .attr("r", width/2  * (1 - (i + 1) / (data.length + 1)))
        .attr("fill", "#fff")
        .attr("fill-opacity", 0.25)
});

g = d3.selectAll("g.dial");

d3.timer(function() {
    var t = new Date();
    g.attr("transform", function(d) {
        var p = d(t) * 2 * Math.PI - Math.PI / 2,
            x = r * Math.cos(p),
            y = r * Math.sin(p);
        return "translate(" + [x, y] + ")";
    });
});
}
function graph8(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    cols = 50;

var scale = d3.scale.ordinal()
    .domain(d3.range(1, cols))
    .rangePoints([0, width], 2);

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background","#"+((1<<24)*Math.random()|0).toString(16));

var data = d3.range(0, cols * cols)
    .map(function(d) {
        return { x: d % cols, y: ~~(d / cols) };
    });

var dots = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("fill",color)
    .attr("cx", function(d) { return scale(d.x); })
    .attr("cy", function(d) { return scale(d.y); });

d3.timer(function(t) {
    dots.attr("r", function(d) { return (((Math.cos(t / 10000) + 1) * d.x * d.y) % 10) / 5; });
});
}


function graph9(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    mx = 320,
    my = 90,
    n = 8,
    R2D = 180 / Math.PI;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var defs = svg.select("defs");

var moon = svg.append("circle")
    .attr("class", "moon")
    .attr("fill", "#"+((1<<24)*Math.random()|0).toString(16))
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
    .attr("fill","#"+((1<<24)*Math.random()|0).toString(16));

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
}
function graph10(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
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

}
function graph11(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 16,
    r = 25,
    π = Math.PI,
    p = 10000;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var g = svg.selectAll("g")
    .data(d3.range(0, 2 * π, 2 * π / n))
    .enter().append("g")
    .attr("transform", function(d) {
        var x = width  * (0.35 * Math.cos(d) + 0.5),
            y = height * (0.35 * Math.sin(d) + 0.5);
        return "translate(" + [x, y] + ")rotate(" + d * 180 / π + ")";
    });

var moons = g.append("path")
    .attr("fill","#"+((1<<24)*Math.random()|0).toString(16));

d3.timer(function(t) {
    var θ = 2 * π * (t % p / p);
    moons.attr("d", function(d) { return moon((θ + d) % (2 * π)); });
});

function moon(θ) {
    var rx0 = θ < π ? r : -r,
        s0  = θ < π ? 0 : 1,
        rx1 = r * Math.cos(θ),
        s1  = θ < π/2 || (π <= θ && θ < 3*π/2) ? 0 : 1;

    return "M" + [                  0,  r] +
           "A" + [rx0, r, 0, 0, s0, 0, -r] +
           "A" + [rx1, r, 0, 0, s1, 0,  r];
}
}
function graph12(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
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
}
function graph13(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

setInterval(function () {
    var paths = svg.selectAll(".line")
        .data(d3.range(0, 5))
        .enter().append("g");

    paths.append("path")
        .attr("stroke", "black")
        .attr("fill", "none")
        .attr("d", function() {
            var y = boxMuller(0.2) * 250;
            return "M0,0 Q250," + (y/2 + Math.random() * 20) + " 500," + y;
        })
        .attr("stroke-width", function() { return boxMuller(0.2) + 1.5; });

    paths
        .attr("transform", "translate(0,1000)")
        .transition()
        .ease("linear")
        .delay(function() { return Math.random() * height; })
        .duration(function () { return 2000 + (Math.random() * 1000 - 500) })
        .attr("transform", "translate(0,-500)")
        .remove();
}, 1000);

function boxMuller(variance) {
    var u1 = Math.random(),
        u2 = Math.random();
    return Math.sqrt(variance * -2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
}
function graph14(color){
var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    cols = 100,
    w = 20;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#888")
    .append("g")
    .attr("transform", "rotate(" + [-25, width / 2, height / 2] + ")");

var gradient = svg.selectAll("linearGradient")
    .data([[color, "#444"], ["#333", color], ["#333", "#444"], ["#d1d1d1", "#eee"]])
    .enter().append("linearGradient")
    .attr("id", function(d, i) { return "gradient" + i; })
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "5%")
    .attr("y2", "0%");

gradient.append("stop")
    .attr("offset", 0.9)
    .attr("stop-color", function(d) { return d[0]; });

gradient.append("stop")
    .attr("offset", 1)
    .attr("stop-color", function(d) { return d[1]; });

var g = svg.selectAll("g")
    .data(d3.range(0, 33))
    .enter().append("g");

g.selectAll("path")
    .data(function(d) { return [d, d] })
    .enter().append("path")
    .attr("fill", function(d, i) {
        return i ? ((d % 2) ? "url(#gradient0)" : "url(#gradient1)")
                 : ((d % 2) ? "url(#gradient2)" : "url(#gradient3)");
    })
    .attr("transform", function(d, i) {
        return i ? "" : "translate(500)scale(-1 1)";
    })
    .attr("d", function() {
        return "M-300,0 L180,0 Q220,0 250,12.5 L250,12.5 Q220,25 180,25 L-300,25 Z";
    });

d3.timer(function(t) {
    g.attr("transform", function(d) {
        return "translate(" + [200 * Math.sin(t / 2000 + 0.6 * d), (d - 4) * w - 3] + ")";
    })
});
}
function graph15(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    cols = 100,
    w = 20;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#888")
    .append("g")
    .attr("transform", "rotate(" + [-25, width / 2, height / 2] + ")");

var gradient = svg.selectAll("linearGradient")
    .data([[color, "#444"], ["#333", color], ["#333", "#444"], ["#d1d1d1", "#eee"]])
    .enter().append("linearGradient")
    .attr("id", function(d, i) { return "gradient" + i; })
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "5%")
    .attr("y2", "0%");

gradient.append("stop")
    .attr("offset", 0.9)
    .attr("stop-color", function(d) { return d[0]; });

gradient.append("stop")
    .attr("offset", 1)
    .attr("stop-color", function(d) { return d[1]; });

var g = svg.selectAll("g")
    .data(d3.range(0, 33))
    .enter().append("g");

g.selectAll("path")
    .data(function(d) { return [d, d] })
    .enter().append("path")
    .attr("fill", function(d, i) {
        return i ? ((d % 2) ? "url(#gradient0)" : "url(#gradient1)")
                 : ((d % 2) ? "url(#gradient2)" : "url(#gradient3)");
    })
    .attr("transform", function(d, i) {
        return i ? "" : "translate(500)scale(-1 1)";
    })
    .attr("d", function() {
        return "M-300,0 L180,0 Q220,0 250,12.5 L250,12.5 Q220,25 180,25 L-300,25 Z";
    });

d3.timer(function(t) {
    g.attr("transform", function(d) {
        return "translate(" + [200 * Math.sin(t / 2000 + 0.6 * d), (d - 4) * w - 3] + ")";
    })
});
}
function graph16(color){
var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 32,
    r = 0.45 * width,
    π = Math.PI;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var g = svg.append("g");

var moons = g.selectAll("path")
    .data(d3.range(0, n))
    .enter().append("path")
    .attr("fill", "#000")
    .attr("fill-opacity", 0.05);

d3.timer(function(t) {
    g.attr("transform", "translate(" + [width / 2, height / 2] + ")");

    moons.attr("transform", function(d) {
        return "rotate(" + 360 * d * t / 60000 + ")";
    });

    moons.attr("d", function(d) {
        return moon(0.5 * π * Math.sin(d * t / 70000));
    });
});

function moon(θ) {
    var rx0 = θ < π ? r : -r,
        s0  = θ < π ? 0 : 1,
        rx1 = r * Math.cos(θ),
        s1  = θ < π/2 || (π <= θ && θ < 3*π/2) ? 0 : 1;

    return "M" + [                  0,  r] +
           "A" + [rx0, r, 0, 0, s0, 0, -r] +
           "A" + [rx1, r, 0, 0, s1, 0,  r];
}
}
function graph17(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
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

}
function graph18(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    cols = 50;

var scale = d3.scale.ordinal()
    .domain(d3.range(0, cols))
    .rangePoints([0, width], 2);

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color);

var data = d3.range(0, cols * cols)
    .map(function(d) {
        return { x: d % cols, y: ~~(d / cols) };
    });

var dots = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("fill","#"+((1<<24)*Math.random()|0).toString(16))
    .attr("cx", function(d) { return scale(d.x); })
    .attr("cy", function(d) { return scale(d.y); })
    .attr("r", 2);

var drops = [],
    t = 0;

(function drop() {
    drops.push([Math.random() * cols, Math.random() * cols, t]);
    drops = drops.filter(function(p) { return (t - p[2]) < 20000; });
    setTimeout(drop, Math.random() * 7500);
})();

d3.timer(function(elapsed) {
    t = elapsed;
    dots.attr("r", function(d) {
        return Math.max(0, 2 + d3.sum(drops, function(p) {
            var dx = d.x - p[0],
                dy = d.y - p[1],
                dt = t   - p[2],
                z = Math.max(0, dt / 200 - Math.sqrt(dx*dx + dy*dy));
            return Math.exp(-z/15) * Math.sin(z);
        }));
    });
});
}
function graph19(color){

// Math from https://github.com/d3/d3-plugins/tree/master/hexbin
var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 10,
    r = width / n / 2,
    dx = r * 2 * Math.sin(Math.PI / 3),
    dy = r * 1.5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color);

var data = [];

for (var y = -r, odd = false; y < height + 2 * r; y += dy, odd = !odd) {
    for (var x = odd ? -dx / 2 : 0; x < width + dx; x += dx) {
        data.push([x, y]);
    }
}

var hexes = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + d + ")";
    })
    .append("path")
    .attr("transform", "scale(1.02)")
    .attr("fill", "#"+((1<<24)*Math.random()|0).toString(16))
    .attr("fill-opacity", 1)
    .attr("d", "M" + hexagon(r).join("l") + "Z");

var transition = hexes.transition()
    .delay(function(d, i) {
        return i * 50;
    });

(function loop() {
    transition = transition.transition()
        .duration(2500)
        .attrTween("transform", function() {
            return d3.interpolate("scale(1.2)", "scale(0)");
        })
        .each("end", function() {
            d3.select(this)
                .attr("d", "M" + rectangle(dx, dy).join("l") + "Z");
        })
        .transition()
        .attrTween("transform", function () {
            return d3.interpolate("scale(0)", "scale(1.2)");
        })
        .each("end", function(d, i) {
            d3.select(this)
                .attr("d", "M" + hexagon(r).join("l") + "Z");
            if (i === 0) loop();
        });
})();
}

function hexagon(radius) {
    var x0 = 0, y0 = 0;
    return d3.range(0, 2 * Math.PI, Math.PI / 3).map(function(angle) {
        var x1 = Math.sin(angle) * radius,
            y1 = -Math.cos(angle) * radius,
            dx = x1 - x0,
            dy = y1 - y0;
        x0 = x1;
        y0 = y1;
        return [dx, dy];
    });
}

function rectangle(dx, dy) {
    return [[-dx / 2, -dy / 2],
            [ dx,  0],
            [ 0,  dy],
            [-dx,  0]];
}
function graph20(color){


var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    rows = 16,
    cols = 3;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var g = svg.selectAll("g")
    .data(d3.range(1, rows))
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + [0, (d - 1) * height / rows] + ")";
    });

var paths = g.append("path")
    .attr("fill", "#fff")
    .attr("fill-opacity", 0.05);

d3.timer(function(t) {
    paths.attr("d", function(r) {
        return d3.svg.area()
            .interpolate("basis")
            .y0(height)
            .y1(function(d, i) { return 300 * (i % 2) - 150 + 20 * Math.sin(r + t / 500); })
            .x(function(d) { return (r * t / 100) % (width / (cols - 2)) + d * width / (cols - 1); })
            (d3.range(-3, cols + 2));
    });
});
}
function graph21(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color)
    .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var spiral = svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "#111")
    .attr("stroke-opacity", 0.8)
    .attr("stroke-width", 1);

var range = d3.range(0, 64 * Math.PI, 0.1);

d3.timer(function(t) {
    spiral.attr("d", "M" + range.map(function(p) {
        var a = (Math.sin(t / 200000) + 1) / 2,
            b = (Math.cos(t / 150000) + 1) / 2;
        return [
            0.4 * width * Math.sin(a * p + Math.cos(t / 4000)),
            0.4 * height * Math.sin(b * p)
        ];
    }).join("L"));
})
}
function graph22(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
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
}
function graph23(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    cols = 50,
    mid = cols / 2,
    duration = 5000,
    τ = 2 * Math.PI;

var scale = d3.scale.ordinal()
    .domain(d3.range(0, cols))
    .rangePoints([0, width], 2);

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var data = d3.range(0, cols * cols)
    .map(function(d) {
        return { x: d % cols, y: ~~(d / cols) };
    });

var dots = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("fill","#000")
    .attr("cx", function(d) { return scale(d.x); });

d3.timer(function(elapsed) {
    var t = cols * (elapsed % duration) / duration; // [0, cols)

    function f(d) {
        return Math.cos(τ * (d.x - t) / cols);
    }

    dots.attr("cy", function(d) { return scale(d.y) + 4 * (mid - d.y) * (1 + f(d)); })
        .attr("r", function(d) { return 1.5 - 1.4 * f(d); });
});
}
function graph24(color){

var width =window.innerHeight*0.55,
    height = window.innerHeight*0.55,
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
}

function graph25(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    cols = 50,
    theta = -25 * Math.PI / 180,
    length = 8.5,
    x0 = width/2.8,
    y0 = height,
    t0 = Math.PI / 2;

function tree(string) {
    var stack = [],
        root = { path: "M" + x0 + "," + y0, children: [] },
        state = { x: x0, y: y0, t: t0, branch: root };

    var commands = {
        'F': function() {
            state.x -= length * Math.cos(state.t);
            state.y -= length * Math.sin(state.t);
            state.branch.path += "L" + state.x + "," + state.y;
        },
        '+': function() {
            state.t += theta;
        },
        '-': function() {
            state.t -= theta;
        },
        '[': function() {
            stack.push(state);
            state = Object.create(state);
            var branch = { path: "M" + state.x + "," + state.y, children: [] };
            state.branch.children.push(branch);
            state.branch = branch;
        },
        ']': function() {
            state = stack.pop();
        }
    };

    string.split('').forEach(function(c) { commands[c](); });
    return root;
}

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .datum(tree(l(4, {"F": "FF-[-F+F+F]+[+F-F-F]"}, "F")))
    .each(grow);

function grow(d) {
    d3.select(this).append("path")
        .attr("stroke", "black")
        .attr("stroke-opacity", 0.65)
        .attr("stroke-width", 3)
        .attr("fill", "none")
        .attr("d", function(d) { return d.path; })
        .each(function() { d3.select(this).attr("stroke-dasharray", "0," + this.getTotalLength()); })
      .transition()
        .duration(1000)
        .attrTween("stroke-dasharray", tweenDash)

    d3.select(this).selectAll("g")
        .data(d.children)
        .enter().append("g")
      .transition()
        .delay(function(d, i) { return 200 + i * 200; })
        .each("start", grow);
}

function l(n, rules, str) {
    return n === 0 ? str : l(--n, rules, str.replace(/./g, function(c) { return rules[c] || c; }));
}

// http://bl.ocks.org/mbostock/5649592
function tweenDash() {
  var l = this.getTotalLength(),
      i = d3.interpolateString("0," + l, l + "," + l);
  return function(t) { return i(t); };
}
}
function graph26(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 100;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var paths = svg.selectAll("path")
    .data(d3.range(0, n))
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-width", width / 2)
    .attr("stroke-opacity", 0.02);

d3.timer(function(t) {
    paths.attr("d", function(d) {
        var a  = d * Math.PI * 2 / n,
            r0 = width / 2 * Math.sin(d * t / 2500 / n),
            r1 = width / 2 * Math.cos(d * t / 2500 / n) / 4;
        return "M" + [r0 * Math.cos(a), r0 * Math.sin(a)] +
               "L" + [r1 * Math.cos(a), r1 * Math.sin(a)];
    });
});
}
function graph27(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 100,
    period = 2000;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var flakes = svg.selectAll("text")
    .data(d3.range(0, n))
    .enter().append("text")
    .attr("fill","#000")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function() { return ("❅❆❄︎").charAt(Math.random() * 3); })
  .transition()
    .ease("linear")
    .delay(function(d) { return d * period / n; })
    .each(fall);

var snow = d3.range(0, 100)
    .map(function() { return 0; });

var area = d3.svg.area()
    .x(function(_, i) { return i == 99 ? width : i * (width / snow.length); })
    .y0(height)
    .y1(function(y) { return height - 2 * y; })
    .interpolate("basis");

var path = svg.append("path")
    .attr("fill", color);

function fall() {
    var flake = d3.select(this);
    (function repeat() {
        var x = Math.random() * width;

        flake = flake.transition()
            .duration(period + Math.random() * 2000 - 100)
            .each(function() {
                d3.select(this)
                    .attr("font-size", 10 + Math.random() * 5)
                    .attr("transform", "translate(" + x + ",-10)");
            })
            .attr("transform", "translate(" + x + "," + (height + 10) + ")")
            .each("end", function() {
                snow[Math.floor(x / (width / snow.length))]++;
                path.transition()
                    .duration(100)
                    .attr("d", area(snow));
                repeat();
            });
    })();
}
}
function graph28(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    rows = 10;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

svg.append("filter")
    .attr("id", "blur")
    .attr("x", -10)
    .attr("y", -10)
    .attr("width", width + 20)
    .attr("height", height + 20)
    .attr("filterUnits", "userSpaceOnUse")
    .append("feGaussianBlur")
    .attr("stdDeviation", 1);

svg.selectAll("g")
    .data([75, 175])
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + [d, 0] + ")";
    })
    .attr("filter", "url(#blur)")
    .append("path")
    .attr("fill", "#fff")
    .attr("fill-opacity", 0.2)
    .attr("d", "M0,0 L75,0 L200,500 L25,500 Z");

var clip = svg.append("defs")
    .append("clipPath")
    .attr("id", "clip");

clip.selectAll("g")
    .data([75, 175])
    .enter()
    .append("path")
    .attr("d", function(d) {
        return "M" + [0+d,0] + "L" + [75+d,0] + "L" + [200+d,500] + "L" + [25+d,500] + "Z"
    });

var data = d3.range(500).map(function() {
    return {
        p: [Math.random() * width, Math.random() * height],
        v: [(30 + 9  * Math.random()) / 50,
            (10 + 11 * Math.random()) / 50]
    }
});

var motes = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("r", 1)
    .attr("fill", "#fff")
    .attr("fill-opacity", 1)
    .attr("filter", "url(#blur)")
    .attr("clip-path", "url(#clip)");

d3.timer(function() {
    motes.each(function(d) {
        d.p[0] += d.v[0];
        d.p[1] += d.v[1];
        if (d.p[0] > width) d.p[0] -= width;
        if (d.p[1] > height) d.p[1] -= height;
    });

    motes
        .attr("cx", function(d) { return d.p[0]; })
        .attr("cy", function(d) { return d.p[1]; })
});

}
function graph29(color){


var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    cols = 100;

var scale = d3.scale.ordinal()
    .domain(d3.range(0, cols))
    .rangePoints([0, width], 2);

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var data = d3.range(0, cols * cols)
    .map(function(d) {
        var x = d % cols,
            y = ~~(d / cols),
            dx = cols / 2 - x,
            dy = cols / 2 - y;
        return { x: x, y: y, d: Math.sqrt(dx*dx + dy*dy) };
    });

var dots = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("fill","#000")
    .attr("cx", function(d) { return scale(d.x); })
    .attr("cy", function(d) { return scale(d.y); });

d3.timer(function(t) {
    dots.attr("r", function(d) {
        return Math.min(2, 10 / d.d) +
            (Math.sin((t + 100000) * d.d / 10000) + 1) / 2;
    });
});
}
function graph30(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 2000,
    π = Math.PI;

var data = d3.range(0, n).map(function(i) {
    return {
        i: i,
        r: d3.random.logNormal(0, 0.3)() * (width / 10),
        θ: Math.random() * π * 2,
        l: 20 - 2 * d3.random.logNormal()(),
        w: Math.random() * 3,
        o: Math.random()
    };
});

var g = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
  .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var paths = g.selectAll("path")
    .data(data, function(d) { return d.i; })
  .enter().append("path")
    .attr("stroke", "#FFF")
    .attr("stroke-linecap", "round")
    .attr("stroke-opacity", function(d) { return d.o; })
    .attr("stroke-width", function(d) { return d.w; })
    .attr("d", function(d) {
        return "M" + [0, -d.l/2] + "L" + [0, d.l/2];
    });

d3.timer(function (t) {
    t /= 2000;

    data = data.filter(function(d) {
        d.r += Math.min(2, (d.r * d.r) / 100000);
        return d.r < width;
    });

    var paths = g.selectAll("path")
        .data(data, function(d) { return d.i; });

    paths.exit()
        .remove();

    paths.attr("transform", function(d) {
        return "rotate(" + (d.θ * 180 / π + d.r / 5) % 360 + ")translate(" + [d.r, 0] + ")";
    });

    return data.length === 0;
});
}
function graph31(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 100;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var circles = svg.selectAll("circle")
    .data(d3.range(0, n))
    .enter().append("circle")
    .attr("fill", "none")
    .attr("stroke", "#222")
    .attr("stroke-opacity", 0.8)
    .attr("r", width / 4);

d3.timer(function(t) {
    circles.attr("cx", function(d) {
        var a = d * Math.PI * 2 / n,
            r = width / 4 * Math.sin(d * t / 1000 / n);
        return r * Math.cos(a);
    });

    circles.attr("cy", function(d) {
        var a = d * Math.PI * 2 / n,
            r = width / 4 * Math.sin(d * t / 1000 / n);
        return r * Math.sin(a);
    });
});
}
function graph32(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    r = 0.3 * width,
    n = 16,
    π = Math.PI;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var g = svg.append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var paths = g.selectAll("path")
    .data(d3.range(0, n))
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke","#000")
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 0.5);

d3.timer(function(t) {
    paths.attr("d", function(d) {
        var circle = d3.svg.line()
            .x(function(θ) { return 6 * d * Math.sin(16 * θ + t / 10000 * d) + r * Math.cos(θ); })
            .y(function(θ) { return 6 * d * Math.cos(16 * θ + t / 10000 * d) + r * Math.sin(θ); });

        var u = 2 * π / 256;
        return circle(d3.range(0, 2 * π + u, u));
    });
});
}
function graph33(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    depth = 500,
    n = 30,
    c = 30;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var boids = d3.range(0, 100).map(Boid);

var circles = svg.selectAll("circle")
    .data(boids)
    .enter().append("circle")
    .attr("fill", "#000")
    .attr("fill-opacity", 0.1);

d3.timer(function() {
    circles
        .each(function(d) { d.step(boids); })
        .attr("cx", function(d) { return d.l.x; })
        .attr("cy", function(d) { return d.l.y; })
        .attr("r", function(d) { return d.l.z / 10; });
});

// Ported from http://harry.me/blog/2011/02/17/neat-algorithms-flocking/ by Harry Brundage

function Vector(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

Vector.prototype.distance = function(other) {
    var dx = Math.abs(this.x - other.x);
    var dy = Math.abs(this.y - other.y);
    var dz = Math.abs(this.z - other.z);
    return Math.sqrt(dx*dx + dy*dy + dz*dz);
}

Vector.prototype.add = function(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
}

Vector.prototype.subtract = function(other) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
}

Vector.prototype.multiply = function(n) {
    this.x *= n;
    this.y *= n;
    this.z *= n;
    return this;
}

Vector.prototype.magnitude = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
}

Vector.prototype.normalize = function() {
    var m = this.magnitude();
    if (m > 0) this.multiply(1/m);
    return this;
}

Vector.prototype.limit = function(max) {
    if (this.magnitude() <= max)
        return this;
    return this.normalize().multiply(max);
}

Vector.subtract = function(a, b) {
    return new Vector(a.x, a.y, a.z).subtract(b);
}

var DESIRED_SEPARATION = 20,
    NEIGHBOR_RADIUS    = 50,
    MAX_SPEED          = 2,
    MAX_FORCE          = 0.5,
    SEPARATION_WEIGHT  = 2,
    ALIGNMENT_WEIGHT   = 1,
    COHESION_WEIGHT    = 1;

function Boid() {
    var v = new Vector(Math.random()*2 - 1, Math.random()*2 - 1, Math.random()*2 - 1),
        l = new Vector(Math.random() * width, Math.random() * height, Math.random() * depth);

    function separate(neighbors) {
        var mean = new Vector(),
            count = 0;

        for (var i = 0; i < neighbors.length; i++) {
            var b = neighbors[i],
                d = l.distance(b.l);
            if (d > 0 && d < DESIRED_SEPARATION) {
                mean.add(Vector.subtract(l, b.l).normalize().multiply(1/d));
                count++;
            }
        }

        if (count > 0) mean.multiply(1/count);
        return mean;
    }

    function align(neighbors) {
        var mean = new Vector(),
            count = 0;

        for (var i = 0; i < neighbors.length; i++) {
            var b = neighbors[i],
                d = l.distance(b.l);
            if (d > 0 && d < NEIGHBOR_RADIUS) {
                mean.add(b.v);
                count++;
            }
        }

        if (count > 0) mean.multiply(1/count);
        mean.limit(MAX_FORCE);
        return mean;
    }

    function cohere(neighbors) {
        var mean = new Vector(),
            count = 0

        for (var i = 0; i < neighbors.length; i++) {
            var b = neighbors[i],
                d = l.distance(b.l);
            if (d > 0 && d < NEIGHBOR_RADIUS) {
                mean.add(b.l);
                count++;
            }
        }

        if (count == 0)
            return mean;

        mean.multiply(1/count);

        var desired = Vector.subtract(mean, l),
            d = desired.magnitude();

        if (d <= 0)
            return new Vector();

        return desired
            .normalize()
            .multiply(MAX_SPEED * (d < 100 ? d / 100 : 1))
            .subtract(v)
            .limit(MAX_FORCE);
    }

    function step(neighbors) {
        var s = separate(neighbors).multiply(SEPARATION_WEIGHT),
            a = align(neighbors).multiply(ALIGNMENT_WEIGHT),
            c = cohere(neighbors).multiply(COHESION_WEIGHT);

        v.add(s).add(a).add(c).limit(MAX_SPEED);
        l.add(v);

        while (l.x < 0)
            l.x += width;
        while (l.x > width)
            l.x -= width;
        while (l.y < 0)
            l.y += height;
        while (l.y > height)
            l.y -= height;
        while (l.z < 0)
            l.z += depth;
        while (l.z > depth)
            l.z -= depth;
    }

    return { v: v, l: l, step: step };
}
}
function graph34(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 100;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var paths = svg.selectAll("path")
    .data(d3.range(0, n))
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke","#000")
    .attr("stroke-width", 4)
    .attr("stroke-opacity", 0.6);

d3.timer(function(t) {
    paths.attr("d", function(d) {
        var a  = d * Math.PI * 2 / n,
            r0 = width / 2 * Math.sin(d * t / 500 / n),
            r1 = width / 2 * Math.cos(d * t / 500 / n) / 4;
        return "M" + [r0 * Math.cos(a), r0 * Math.sin(a)] +
               "L" + [r1 * Math.cos(a), r1 * Math.sin(a)];
    });
});
}
function graph35(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 10;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .append("g");

var g = svg.selectAll("g")
    .data([
        "scale(1)",
        "scale(1,-1)translate(0,-500)",
        "rotate(90,250,0)translate(250,-250)",
        "rotate(-90,250,0)translate(-250,-250)"
    ])
    .enter().append("g")
    .attr("transform", function(d) { return d; });

var circles = g.selectAll("circle")
    .data(function (d, i) { return d3.range(0, 25).map(function(d) { return [d, i]; }) })
    .enter().append("circle")
    .attr("cx", function(d) {
        return 0.5 * width;
    })
    .attr("cy", function(d) {
        return 0.25 * height - d[0] * 5;
    })
    .attr("r", function(d) {
        return 0.25 * height - d[0] * 5;
    })
    .attr("fill", "none")
    .attr("stroke","#000")
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 0.5);

d3.timer(function(t) {
    svg.attr("transform", "rotate(" + [Math.sin(t / 10000) * 180 / Math.PI, width / 2, height / 2] + ")");

    circles.attr("cy", function(d) {
        return 0.25 * width + 50 * Math.sin(d[0] * t / 7000) + 50 * Math.sin(50 * d[1] + t / 1000);
    });
});
}
function graph36(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    rows = 40,
    cols = 40,
    r = 5,
    π = Math.PI,
    p = 10000;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var data = d3.range(0, rows * cols)
    .map(function(d) {
        return { x: d % cols, y: ~~(d / cols) };
    });

var scale = d3.scale.ordinal()
    .domain(d3.range(0, cols))
    .rangePoints([0, width], 1);

var g = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + [scale(d.x), scale(d.y)] + ")";
    });

var moons = g.append("path")
    .attr("fill", "#000");

d3.timer(function(t) {
    moons.attr("d", function(d) {
        var x = cols / 2 - d.x,
            y = cols / 2 - d.y;
        return moon(3 * π * Math.cos(x * t / 20000) +
                    2 * π * Math.cos(y * t / 30000));
    });

    moons.attr("transform", "rotate(" + (360 * (Math.cos(t / 10000) + 1)) + ")");
});

function moon(θ) {
    θ %= 2 * π;

    var rx0 = θ < π ? r : -r,
        s0  = θ < π ? 0 : 1,
        rx1 = r * Math.cos(θ),
        s1  = θ < π/2 || (π <= θ && θ < 3*π/2) ? 0 : 1;

    return "M" + [                  0,  r] +
           "A" + [rx0, r, 0, 0, s0, 0, -r] +
           "A" + [rx1, r, 0, 0, s1, 0,  r];
}
}
function graph37(color){

var w = 500,
    h = 500,
    n = 30;

var svg = d3.select("#vis").append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("background", color);

var g = svg.selectAll("g")
    .data([
        [0, 0],
        [w, 0],
        [w, h],
        [0, h]
    ])
    .enter().append("g")
    .attr("transform", function(d) { return "translate(" + d + ")" });

var circles = g.selectAll("circle")
    .data(d3.range(1,n))
    .enter().append("circle")
    .attr("r", function(d) { return d * (w / n); })
    .attr("fill", "#000")
    .attr("fill-opacity", 0);

(function loop() {
    var duration = Math.random() * 2000 + 3000,
        delay    = Math.random() * 100  + 200;
    circles
      .transition()
        .ease("linear")
        .duration(duration)
        .delay(function(d) { return d * delay; })
        .attr("fill-opacity", 0.05)
      .transition()
        .attr("fill-opacity", 0)
        .each("end", function(d) {
            if (d === 1) {
                loop();
            }
        });
})();
}
function graph38(color){
var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 30,
    r = width / n / 2,
    dx = r * 2 * Math.sin(Math.PI / 3),
    dy = r * 1.5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var data = [];

for (var y = -r, odd = false; y < height + 2 * r; y += dy, odd = !odd) {
    for (var x = odd ? -dx / 2 : 0; x < width + dx; x += dx) {
        data.push([x, y]);
    }
}

var hexes = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + d + ")";
    })
    .append("path")
    .attr("fill","#000")
    .attr("fill-opacity", 0.2)
    .attr("d", "M" + hexagon(r).join("l") + "Z");

d3.timer(function(t) {
    hexes.attr("transform", function(d, i) {
        return "scale(" + (Math.sin(i * t / 70000) + 1) + ")";
    });
});

function hexagon(radius) {
    var x0 = 0, y0 = 0;
    return d3.range(0, 2 * Math.PI, Math.PI / 3).map(function(angle) {
        var x1 = Math.sin(angle) * radius,
            y1 = -Math.cos(angle) * radius,
            dx = x1 - x0,
            dy = y1 - y0;
        x0 = x1;
        y0 = y1;
        return [dx, dy];
    });
}
}
function graph39(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    cols = 50;

var scale = d3.scale.ordinal()
    .domain(d3.range(0, cols))
    .rangePoints([0, width], 2);

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var data = d3.range(0, cols * cols)
    .map(function(d) {
        return { x: d % cols, y: ~~(d / cols) };
    });

var dots = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("fill", "#000")
    .attr("cx", function(d) { return scale(d.x); })
    .attr("cy", function(d) { return scale(d.y); })
    .attr("r", 3);

function repeat() {
    dots.transition()
        .ease("linear")
        .duration(2000)
        .attr("r", function(d) {
            var x = cols / 2 - d.x,
                y = cols / 2 - d.y;
            return Math.max(7 - Math.sqrt(x*x + y*y) / 10, 3);
        })
        .transition()
        .delay(3000)
        .attr("r", 3)
        .each("end", function(d, i) { if (i === 0) setTimeout(repeat, 1000); });
}

setTimeout(repeat, 1000);
}
function graph40(color){


var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    rows = 32,
    cols = 5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var g = svg.selectAll("g")
    .data(d3.range(1, rows + 1))
    .enter().append("g")
    .attr("transform", function(d, i) {
        return "translate(" + [0, i * height / rows] + ")";
    });

var paths = g.append("path")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-opacity", 0.7);

d3.timer(function(t) {
    paths.attr("d", function(r) {
        return d3.svg.line()
            .interpolate("basis")
            .y(function(d) { return 5 * Math.cos(d + r * t / 10000); })
            .x(function(d) { return d * width / (cols - 1); })
            (d3.range(-3, cols + 2));
    });
});
}
function graph41(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    rows = 50,
    cols = 30;

var scale = d3.scale.ordinal()
    .domain(d3.range(0, cols))
    .rangePoints([0, width], 2);

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .attr("shape-rendering", "crispEdges");

var data = d3.range(0, rows)
    .map(function(y) {
        return d3.range(0, cols).map(function(x) {
            return [x, y];
        });
    });

var g = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + (i * height / rows + 0.5) + ")"; });

var paths = g.selectAll("path")
    .data(function(d) { return d; })
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke","#000")
    .attr("d", function(d) {
        var x0 =  d[0] *      width / cols,
            x1 = (d[0] + 1) * width / cols;
        return "M" + [x0, 0] + "L" + [x1, 0];
    });

var drops = d3.range(0, 8).map(function() {
    return [Math.random() * cols, Math.random() * rows];
});

d3.timer(function(t) {
    t /= 10000;
    paths.attr("stroke-width", function(d) {
        return Math.max(1, 3 + d3.sum(drops, function(p) {
            var dx = d[0] - p[0],
                dy = d[1] - p[1];
            return Math.sin(t + 1000 - Math.sqrt(dx*dx + dy*dy));
        }));
    });
});
}
function graph42(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 4,
    r = width / n / 2,
    dx = r * 2 * Math.sin(Math.PI / 3),
    dy = r * 1.5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var hexes = svg.append("g")
    .attr("transform", "translate(" + [-20, -15] + ")")
    .append("path")
    .attr("fill", "#fff")
    .attr("fill-opacity", 0.8)
    .attr("fill-rule", "evenodd");

d3.timer(function(t) {
    hexes.attr("d", function() {
        var d = "";
        for (var y = -r, odd = false; y < height + 2 * r; y += dy, odd = !odd) {
            for (var x = odd ? -dx / 2 : 0; x < width + dx; x += dx) {
                d += "M" + [x, y];
                d += "m" + hexagon(r + r * Math.sin(t / 10000)).join("l") + "z";
            }
        }
        return d;
    });
});
}
function hexagon(radius) {
    var x0 = 0, y0 = 0;
    return d3.range(0, 2 * Math.PI, Math.PI / 3).map(function(angle) {
        var x1 = Math.sin(angle) * radius,
            y1 = -Math.cos(angle) * radius,
            dx = x1 - x0,
            dy = y1 - y0;
        x0 = x1;
        y0 = y1;
        return [dx, dy];
    });
}


function graph43(color){


var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
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
}
function graph44(color){


var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    rows = 20,
    cols = 20,
    r = 10,
    π = Math.PI,
    p = 40000;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var data = d3.range(0, rows * cols)
    .map(function(d) {
        return { x: d % cols, y: ~~(d / cols) };
    });

var scale = d3.scale.ordinal()
    .domain(d3.range(0, cols))
    .rangePoints([0, width], 1);

var g = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + [scale(d.x), scale(d.y)] + ")";
    });

var moons = g.append("path")
    .attr("fill","#000");

d3.timer(function(t) {
    t = t % p / p;

    var x = (cols + 8) * t - 4,
        y = rows - rows / 3 - 6 * Math.sin(t * π);

    moons.attr("transform", function(d) {
        return "rotate(" + (180 + Math.atan2(d.y - y, d.x - x) * 180 / π) + ")";
    });

    moons.attr("d", function(d) {
        var dx = d.x - x,
            dy = d.y - y,
            z = Math.sqrt(dx*dx + dy*dy);
        return moon(Math.min(0.9 * z, π));
    });
});
function moon(θ) {
    var rx0 = θ < π ? r : -r,
        s0  = θ < π ? 0 : 1,
        rx1 = r * Math.cos(θ),
        s1  = θ < π/2 || (π <= θ && θ < 3*π/2) ? 0 : 1;

    return "M" + [                  0,  r] +
           "A" + [rx0, r, 0, 0, s0, 0, -r] +
           "A" + [rx1, r, 0, 0, s1, 0,  r];
}
}
function graph45(color){


var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
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
}
function graph46(color){
var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    cols = 50;

var scale = d3.scale.ordinal()
    .domain(d3.range(0, cols))
    .rangePoints([0, width], 2);

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var data = d3.range(0, cols * cols)
    .map(function(d) {
        return { x: d % cols, y: ~~(d / cols) };
    });

var dots = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("fill", "#000")
    .attr("cx", function(d) { return scale(d.x); })
    .attr("cy", function(d) { return scale(d.y); });

d3.timer(function(t) {
    dots.attr("r", function(d) {
        var x = cols / 2 - d.x,
            y = cols / 2 - d.y;
        return Math.cos(Math.sqrt(x * x + y * y) / 4 - t / 4000 +
                        Math.sin(d.x * d.y + t / 1000) +
                        Math.sin(d.x * d.y + t / 2000)) + 1;
    });
});
}
function graph47(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 10,
    c = width / n;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#222");

var g = svg.selectAll("g")
    .data(d3.range(0, n + 1))
    .enter().append("g")
    .attr("transform", function(d) { return "translate(0," + (d - 1) * c + ")" });

var rects = g.selectAll("rect")
    .data(d3.range(0, n + 1))
    .enter().append("rect")
    .attr("x", function(d) { return (d - 1) * c; })
    .attr("y", 0)
    .attr("rx", c)
    .attr("ry", c)
    .attr("width", c * 2)
    .attr("height", c * 2)
    .attr("fill", "#fff")
    .attr("fill-opacity", 0.2);

(function loop() {
    g.transition()
        .duration(n * 500)
        .delay(function(d) { return d * 200; })
        .each("start", function() {
            d3.select(this).selectAll("rect")
              .transition()
                .duration(3000)
                .delay(function(d) { return d * 200; })
                .attr("rx", 0)
                .attr("ry", 0)
                .attr("fill-opacity", 0.3)
              .transition()
                .attr("rx", c)
                .attr("ry", c)
                .attr("fill-opacity", 0.2);
        })
        .each("end", function(d) {
            if (d === n) {
                loop();
            }
        });
})();
}
function graph48(color){
var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    cols = 50,
    theta = 25 * Math.PI / 180,
    length = 2.5,
    x0 = width/6,
    y0 = height,
    t0 = .7 * Math.PI,
    n = 6;

function tree(string) {
    var stack = [],
        root = { path: [[x0, y0]], children: [] },
        state = { x: x0, y: y0, t: t0, branch: root };

    var commands = {
        'X': function() {},
        'F': function() {
            state.x -= length * Math.cos(state.t);
            state.y -= length * Math.sin(state.t);
            state.branch.path[1] = [state.x, state.y];
        },
        '+': function() {
            state.t += theta;
        },
        '-': function() {
            state.t -= theta;
        },
        '[': function() {
            stack.push(state);
            state = Object.create(state);
            state.depth += 1;
            var branch = { path: [[state.x, state.y]], children: [] };
            state.branch.children.push(branch);
            state.branch = branch;
        },
        ']': function() {
            state = stack.pop();
            state = Object.create(state);
            state.depth += 1;
            var branch = { path: [[state.x, state.y]], children: [] };
            state.branch.children.push(branch);
            state.branch = branch;
        }
    };

    string.split('').forEach(function(c) { commands[c](); });
    return root;
}

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .datum(tree(l(n, {"X": "F-[[X]-X]+F[+FX]-X", "F": "FF"}, "X")))
    .each(grow(3));

function grow(weight) {
    return function(d) {
        if (d.path[1]) {
            d3.select(this).append("path")
                .attr("stroke", "black")
                .attr("stroke-opacity", 0.9)
                .attr("stroke-width", weight)
                .attr("fill", "none")
                .attr("d", "M" + d.path[0] + "L" + d.path[1])
                .each(function() { d3.select(this).attr("stroke-dasharray", "0," + this.getTotalLength()); })
              .transition()
                .ease("linear")
                .duration(400)
                .attrTween("stroke-dasharray", tweenDash)
        }

        d3.select(this).selectAll("g")
            .data(d.children)
            .enter().append("g")
          .transition()
            .delay(400)
            .each("start", grow(weight - 0.25));
    }
}

function l(n, rules, str) {
    return n === 0 ? str : l(--n, rules, str.replace(/./g, function(c) { return rules[c] || c; }));
}

// http://bl.ocks.org/mbostock/5649592
function tweenDash() {
  var l = this.getTotalLength(),
      i = d3.interpolateString("0," + l, l + "," + l);
  return function(t) { return i(t); };
}
}
function graph49(color){
var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color);

var scale = d3.scale.ordinal()
    .domain(d3.range(-n / 2, n / 2 + 1))
    .rangePoints([0, width], 6);

var data = [];
for (var x = -n / 2; x <= n / 2; x++) {
    for (var y = -n / 2; y <= n / 2; y++) {
        data.push({x: x, y: y});
    }
}

var squares = svg.selectAll("g")
    .data(data)
    .enter().append("g");

squares.append("rect")
    .attr("fill","#000")
    .attr("fill-opacity", 0.1)
    .attr("x", -80)
    .attr("y", -80)
    .attr("width", 160)
    .attr("height", 160);

d3.timer(function(t) {
    squares.attr("transform", function(d) {
        return "translate(" + [scale(d.x), scale(d.y)] + ")rotate(" + 360 * (t % 20000 / 20000) + ")";
    });
});

}
function graph50(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    cols = 100;

var scale = d3.scale.ordinal()
    .domain(d3.range(0, cols))
    .rangePoints([0, width], 2);

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color);

var data = d3.range(0, cols * cols)
    .map(function(d) {
        return { x: d % cols, y: ~~(d / cols) };
    });

var dots = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("fill", "#d1d1d1")
    .attr("cx", function(d) { return scale(d.x); })
    .attr("cy", function(d) { return scale(d.y); })
    .attr("r", 2);

var drops = [],
    t = 0;

(function drop() {
    drops.push([Math.random() * cols, Math.random() * cols, t]);
    drops = drops.filter(function(p) { return (t - p[2]) < 20000; });
    setTimeout(drop, Math.random() * 1000);
})();

d3.timer(function(elapsed) {
    t = elapsed;
    dots.attr("r", function(d) {
        return Math.max(0, 2 + d3.sum(drops, function(p) {
            var dx = d.x - p[0],
                dy = d.y - p[1],
                dt = t   - p[2],
                z = Math.max(0, dt / 200 - Math.sqrt(dx*dx + dy*dy));
            return Math.exp(-z/15) * Math.sin(z);
        }));
    });
});
}
function graph51(color){
var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var spiral = svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 0.5);

// Equation from http://goatlink.deviantart.com/art/lissajous-curves-338721857

var range = d3.range(-30 * Math.PI, 30 * Math.PI, 0.02);

d3.timer(function(t) {
    var d = "M";

    for (var i = 0; i < range.length; i++) {
        var p = range[i];
        d += 0.23 * width * (Math.sin((2 + 0.2 * Math.cos(t / 10000))  * p) + Math.sin(4.02 * p));
        d += ",";
        d += 0.23 * height * (Math.sin((3 + 0.2 * Math.cos(t / 10000)) * p) + Math.sin(6.02 * p));
        if (i != range.length - 1) d += "L";
    }

    d.length--;
    spiral.attr("d", d);

    svg.attr("transform", "translate(250,250)rotate(" + 360 * (t % 100000 / 100000) + ")")
})
}
function graph52(color){
  var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 200;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var data = d3.range(0, 2 * Math.PI, 2 * Math.PI / n);

var circles = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("fill", "#d1d1d1")
    .attr("fill-opacity", 0.5);

d3.timer(function(t) {
    t /= 10000;

    circles.attr("r", function(d) {
        return 7 * (Math.sin(d * t + d) + 2);
    });

    circles.attr("cx", function(d) {
        return 200 * Math.sin(3 * d * t);
    });

    circles.attr("cy", function(d) {
        return 200 * Math.sin(2 * d * t);
    });
});
}
function graph53(color){

var num = 20000;

var canvas = document.getElementById("canvas");
var width = canvas.width = window.innerHeight*0.5;
var height = canvas.height = window.innerHeight*0.5;
var ctx = canvas.getContext("2d");

var particles = d3.range(num).map(function(i) {
  return [Math.round(width*Math.random()), Math.round(height*Math.random())];
});

d3.timer(step);

function step() {
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(0,0,width,height);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  particles.forEach(function(p) {
    p[0] += Math.round(2*Math.random()-1);
    p[1] += Math.round(2*Math.random()-1);
    if (p[0] < 0) p[0] = width;
    if (p[0] > width) p[0] = 0;
    if (p[1] < 0) p[1] = height;
    if (p[1] > height) p[1] = 0;
    drawPoint(p);
  });
};

function drawPoint(p) {
  ctx.fillRect(p[0],p[1],1,1);
};

}

 function graph54(color)
 {


    var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 10;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color);

var data = d3.range(0, n * n)
    .map(function(d, i) {
        var x = d % n,
            y = ~~(d / n);
        return { x: x, y: y, i: i };
    });

var g = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + [d.x * width / n, d.y * height / n] + ")";
    });

g.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width / n)
    .attr("height", height / n / 2)
    .attr("fill-opacity", 0.9)
    .attr("fill", "#d1d1d1");

g.append("rect")
    .attr("x", 0)
    .attr("y", height / n / 2)
    .attr("width", width / n)
    .attr("height", height / n / 2)
    .attr("fill-opacity", 0.9)
    .attr("fill", "#111");

d3.timer(function(t) {
    g.attr("transform", function(d) {
        return "translate(" + [d.x * width / n, d.y * height / n] + ")skewX(" + 20 * Math.cos(d.x + d.y + t / 200) + ")skewY(" + 20 * Math.sin(d.x + d.y + t / 200) + ")";
    });
});
}



function graph55(color){
var w = window.innerHeight*0.5,
    h = window.innerHeight*0.5,
    p = 10,
    scale = 2,
    fill = d3.scale.category20b(),
    format = d3.format(",d"),
    exampleX;

var blocks = [
  [],
  [[-.5, -.5], [.5, -.5], [.5, .5], [-.5, .5]],
  [[0, -1], [1, 0], [0, 1], [-1, 0]],
  [[-1, -1], [1, -1], [1, 1], [-1, 1]],
  [[-1, -1], [0, -1], [0, 1], [-1, 1]],
  [[-1, -1], [1, -1], [-1, 1]],
  [[0, -1], [1, 1], [-1, 1]],
  [[-1, -1], [1, 0], [1, 1], [0, 1]],
  [[0, -1], [-1, 1], [0, 1], [-.5, 0], [.5, 0], [0, 1], [1, 1]],
  [[-1, -1], [1, 0], [0, 1]],
  [[-1, 1], [-1, 0], [0, 0], [0, -1], [1, -1]],
  [[-1, -1], [0, -1], [0, 0], [-1, 0]],
  [[-1, 0], [1, 0], [0, 1]],
  [[-1, 1], [1, 1], [0, 0]],
  [[-1, 0], [0, -1], [0, 0]],
  [[-1, -1], [0, -1], [-1, 0]]
];

d3.selectAll("#vis, #primitives, #binary").selectAll("img").remove();
var vis = d3.select("#vis").append("svg")
    .attr("width", w + 2 * p)
    .attr("height", h + 2 * p)
  .append("g")
    .attr("transform", "translate(" + [p, p] + ")");

update();

d3.select("#more").on("click", update);
d3.selectAll("input[name=size]").on("change", function() {
  scale = +this.value;
  update();
});

function updateExample(x) {
  exampleX = x == null ? ~~(1 + Math.random() * (1 << 14 - 1)) : x;
  var example = d3.select("#example").selectAll("svg")
      .data([0]);
  var exampleEnter = example.enter().append("svg")
      .attr("width", 101)
      .attr("height", 101)
      .on("click", (function(angle) {
        return function() {
          example.select("g")
              .transition()
              .duration(500)
              .attrTween("transform", function() { return d3.interpolateString(
                "translate(" + [50/3, 50/3] + ")rotate(" +  angle        + " " + [50-50/3, 50-50/3] + ")",
                "translate(" + [50/3, 50/3] + ")rotate(" + (angle += 90) + " " + [50-50/3, 50-50/3] + ")"
              ); });
        };
      })(0));
  exampleEnter.append("rect")
      .attr("class", "mouse")
      .attr("width", 100)
      .attr("height", 100);
  exampleEnter.append("g")
      .attr("transform", "translate(" + [50/3, 50/3] + ")");
  example.select("g")
      .data([exampleX])
      .style("fill", fill)
      .call(drawBlock, 50 / 3);

  var primitives = d3.select("#primitives").selectAll("svg")
      .data([0]);
  var primitivesEnter = primitives.enter().append("svg")
      .attr("width", 15 * 30 * 2)
      .attr("height", 30 * 2 + 8)
    .selectAll("g")
      .data(blocks)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + (1 + i * 55) + ",1)"; });

  primitivesEnter.append("path")
      .attr("transform", function(d, i) { return "scale(" + 25 + ")translate(" + 1 + "," + 1 + ")"; })
      .style("fill", function(d, i) { return fill(i); })
      .attr("d", path);

  primitivesEnter.append("rect")
      .attr("width", 50)
      .attr("height", 50);
  primitives.selectAll("rect")
      .classed("selected", function(d, i) {
        return i === (exampleX & 3) ||
            i === (exampleX >> 2 & 0xf) ||
            i === (exampleX >> 6 & 0xf);
      });

  primitivesEnter.append("text")
      .attr("x", 25)
      .attr("y", 50)
      .attr("dy", "1.3em")
      .attr("text-anchor", "middle")
      .text(function(d, i) {
        var s = i.toString(2);
        while (s.length < 4) s = "0" + s;
        return s;
      });

  var binary = d3.select("#binary").selectAll("svg")
      .data([0]);
  var binaryEnter = binary.enter().append("svg")
      .attr("width", 14 * 30)
      .attr("height", 75)
    .selectAll("g")
      .data(d3.range(14))
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * 30 + ")"; });

  binaryEnter.append("rect")
      .attr("width", 20)
      .attr("height", 30)
      .on("click", function(d, i) {
        updateExample(exampleX ^ (1 << 13 - i));
      });
  binary.selectAll("rect")
      .classed("on", function(d, i) { return exampleX >> 13 - i & 1; });

  binaryEnter.append("text")
      .attr("class", "digit")
      .attr("text-anchor", "middle")
      .attr("x", 10)
      .attr("y", 40);
  binary.selectAll("text.digit")
      .text(function(d, i) { return exampleX >> 13 - i & 1; });

  var group = binary.selectAll("g.group")
      .data([
        ["edge", 0, 1],
        ["corner", 2, 3],
        ["edge", 4, 7],
        ["corner", 8, 11],
        ["centre", 12, 13],
        ["rotation", 0, 3, 1],
        ["shape", 4, 13, 1]
      ])
    .enter().append("g")
      .attr("class", "group")
      .attr("transform", function(d) { return d[3] ? "translate(0,15)" : null; });
  group.append("path")
      .attr("d", function(d) {
        return "M" + [d[1] * 30, 40] + "V45H" + (d[2] * 30 + 20) + "V40";
      });
  group.append("text")
      .attr("x", function(d) { return 30 * d[1] + 10; })
      .attr("y", 55)
      .text(function(d) { return d[0]; });
}

function update() {
  // 10,816 is the magic number of uniques.
  var dx = scale < 1 ? Math.sqrt(w * h / 10816) : 3 * scale * 2 * 1.5,
      bw = ~~(w / dx),
      bh = ~~(h / dx),
      data;

  if (scale >= 1) {
    data = d3.range(bw * bh).map(function(d) { return ~~(Math.random() * (1 << 14)); });
  } else {
    scale = dx / (3 * 2 * 1.5);
    data = d3.range(1 << 14).filter(function(d) {
      if (d >> 12     && (d >> 6 & 0xf) < 4 ||
          d >> 10 & 3 && (d >> 2 & 0xf) < 4) return false;
      return true;
    });
  }

  var g = vis.selectAll("g").data(data);
  g.enter().append("g")
  g.exit().remove();
  g.attr("transform", function(d, i) { return "translate(" + (i % bw) * dx + "," + ~~(i / bw) * dx + ")"; })
   .style("fill", fill)
   .call(drawBlock, scale);

  d3.select("#count").text(format(data.length) + " blocks");
  updateExample();
}

function drawBlock(g, scale) {
  var block = g.selectAll("path")
       .data(nineblock);
  block.enter().append("path");
  block.exit().remove();
  block.attr("transform", function(d, i) { return "scale(" + scale + ")translate(" + (i % 3) * 2 + "," + ~~(i / 3) * 2 + ")"; })
       .attr("d", function(d) { return d; });
}

function nineblock(i) {
  var corner = rotate(blocks[(i >> 2) & 0xf], (i >> 10) & 3),
      edge   = rotate(blocks[(i >> 6) & 0xf],  i >> 12);
  return [
    corner,
    edge,
    corner.map(rotate1),
    edge.map(rotate3),
    blocks[i & 3],
    edge.map(rotate1),
    corner.map(rotate3),
    edge.map(rotate2),
    corner.map(rotate2)
  ].map(path);
}

function path(d) {
  return d.length ? "M" + d.join("L") + "Z" : null;
}

// Rotate coordinates about [0, 0] by some multiple of 90Â°.
function rotate1(d) { return [-d[1],  d[0]]; };
function rotate2(d) { return [-d[0], -d[1]]; };
function rotate3(d) { return [ d[1], -d[0]]; };
function rotate(b, a) {
  if (!a) return b;
  return b.map(
      a === 1 ? rotate1 :
      a === 2 ? rotate2 : rotate3);
}


}

function graph56(color){


var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color);

var gradients = svg.append("linearGradient")
    .attr("id", "gradient");

gradients.append("stop")
    .attr("offset", 0)
    .attr("stop-color", "rgba(0,0,0,0)");

gradients.append("stop")
    .attr("offset", 1)
    .attr("stop-color", "rgba(0,0,0,1)");

var rect = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width * 2)
    .attr("height", height)
    .attr("fill", "url(#gradient)");

svg.append("path")
    .attr("fill", "none")
    .attr("stroke-width", 100)
    .attr("stroke", "#888")
    .attr("d", "M" + [0, height / 2] + "L" + [width, height / 2]);

d3.timer(function(t) {
    rect.attr("transform", "translate(" + (0.5 * width * Math.cos(t / 2000) - width * 0.5) + ",0)");
});
}


function graph57(color){


var width = window.innerHeight*0.7,
    height = window.innerHeight*0.7;
    n = 3,
    r = width / n / 2,
    dx = r * 2 * Math.sin(Math.PI / 3),
    dy = r * 1.5;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color);

var hexes = svg.append("g")
    .attr("transform", "translate(" + [-20, -15] + ")")
    .append("path")
    .attr("fill", "#"+((1<<24)*Math.random()|0).toString(16))
    .attr("fill-opacity", 0.8)
    .attr("fill-rule", "evenodd");

setInterval(function(){
       hexes.attr("fill", "#"+((1<<24)*Math.random()|0).toString(16));
       svg.attr("background", "#"+((1<<24)*Math.random()|0).toString(16));
           }, 1000);


d3.timer(function(t) {

    hexes.attr("d", function() {
        var d = "";
        for (var y = -r, odd = false; y < height + 2 * r; y += dy, odd = !odd) {
            for (var x = odd ? -dx / 2 : 0; x < width + dx; x += dx) {
                d += "M" + [x, y];
                d += "m" + dodecagon(200 + 100 * Math.sin(t / 4000), t / 3000).join("l") + "z";
            }

        }


        return d;
    });


});

function dodecagon(radius, r) {
    var x0 = 0, y0 = 0;
    return d3.range(0 + r, 2 * Math.PI + r, Math.PI / 6).map(function(angle) {
        var x1 = Math.sin(angle) * radius,
            y1 = -Math.cos(angle) * radius,
            dx = x1 - x0,
            dy = y1 - y0;
        x0 = x1;
        y0 = y1;
        return [dx, dy];
    });
}

}

function graph58(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 32;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color);

var circles = svg.selectAll("circle")
    .data(d3.range(n))
    .enter().append("circle")
    .attr("fill", "#fff");

d3.timer(function(t) {
    circles.attr("fill-opacity", 0.04)

    circles.attr("cx", function(d) {
        return width / 2 + width / 2 * Math.cos(2 * Math.PI * d / n + (d % 8) * t / 200000);
    })

    circles.attr("cy", function(d) {
        return width / 2 + width / 2 * Math.sin(2 * Math.PI * d / n + (d % 8) * t / 200000);
    })

    circles.attr("r", function(d) {
        return 250 + 150 * Math.sin(3 * Math.PI / 2 + t / 10000)
    });
});

}



function graph59(color){


var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 50,
    data = d3.range(1, n + 1);

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#fff");

var gradients = svg.selectAll("linearGradient")
    .data(data)
    .enter().append("linearGradient")
    .attr("id", function(d) { return "gradient" + d; });

gradients.append("stop")
    .attr("offset", 0)
    .attr("stop-color", "rgba(0,0,0,0)");
var stops = gradients.append("stop")
    .attr("stop-color", "rgba(0,0,0,0.05)");
gradients.append("stop")
    .attr("offset", 1)
    .attr("stop-color", "rgba(0,0,0,0)");

var rects = svg.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("fill", function(d) { return "url(#gradient" + d + ")"; });

function ease(t) {
    return t < 0.5 ? 2 * t : 1 - (2 * t - 1);
}

d3.timer(function(t) {
    stops.attr("offset", function(d) {
        return ease(t * d % 100000 / 100000);
    });
});


}





function graph60(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 20;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color);

var g = svg.selectAll("g")
    .data(d3.range(n))
    .enter().append("g");

g.append("path")
    .attr("fill", "none")
    .attr("stroke","#000")
    .attr("stroke-width", 3)
    .attr("d", "M-150,0L150,0");

g.selectAll("ellipse")
    .data([-150, 150])
    .enter().append("ellipse")
    .attr("cx", function(d) { return d; })
    .attr("cy", 0)
    .attr("rx", 10)
    .attr("ry", 7)
    .attr("fill", "#bbb");

d3.timer(function(t) {
    g.attr("transform", function(d) {
        return "translate(" + [width / 2, (d + 1) * height / (n + 1)] + ")scale(" + (Math.sin(d / 2 - t / 1000) + 1) / 2 + ",1)";
    });
});

}

function graph61(color){

var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 22,
    m = 30,
    r = 3,
    dr = 20,
    g = 137.5 * Math.PI / 180;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color)
    .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var data = [];

for (var r = 1; r <= n; r++) {
    for (var ø = 0; ø < Math.PI * 2; ø += 2 * Math.PI / m) {
        data.push({r: r, ø: ø});
    }
}

var seeds = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", function(d) { return d.r * d.r * Math.cos(d.ø + g * d.r); })
    .attr("cy", function(d) { return d.r * d.r * Math.sin(d.ø + g * d.r); })
    .attr("fill", "#"+((1<<24)*Math.random()|0).toString(16))
    .attr("fill-opacity", 0.3);

d3.timer(function(t) {
    seeds.attr("r", function(d) { return 0.3 * (Math.sin(t / 2000) + 1) * Math.pow(d.r, 2); });
});

}


function graph62(color){


var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 22,
    m = 30,
    r = 3,
    dr = 20,
    cols = 100,
    a = 1,
    b = 0.3,
    g = 137.5 * Math.PI / 180;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color)
    .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var spiral = svg.selectAll("g")
    .data(d3.range(20))
    .enter().append("g");

var r1 = d3.range(0, 7 * Math.PI, 0.1),
    r2 = r1.slice().reverse();

spiral.append("path")
    .attr("fill", "#fff")
    .attr("fill-opacity", 0.1)
    .attr("d", function(d, i) {
        return "M" +
            r1.map(function(θ) {
                var r = a * Math.exp(b * θ);
                return [
                    r * Math.cos(θ),
                    r * Math.sin(θ)
                ];
            }).join("L")
            + "L" +
            r2.map(function(θ) {
                var r = a * Math.exp(b * θ);
                return [
                    r * Math.cos(θ + 2),
                    r * Math.sin(θ + 2)
                ];
            }).join("L") + "Z";
    });

d3.timer(function(t) {
    spiral.attr("transform", function(d, i) {
        return "rotate(" + [(d * t / 200) % 360] + ")"
    });
});
}
function graph63(color){


var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 22,
    m = 30,
    r = 3,
    dr = 20,
    cols = 100,
    a = 1,
    b = 0.3,
    g = 137.5 * Math.PI / 180;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color)
    .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");

var spiral = svg.selectAll("g")
    .data(d3.range(20))
    .enter().append("g");

var r1 = d3.range(0, 7 * Math.PI, 0.1),
    r2 = r1.slice().reverse();

spiral.append("path")
    .attr("fill", "#fff")
    .attr("fill-opacity", 0.1)
    .attr("d", function(d, i) {
        return "M" +
            r1.map(function(θ) {
                var r = a * Math.exp(b * θ);
                return [
                    r * Math.cos(θ),
                    r * Math.sin(θ)
                ];
            }).join("L")
            + "L" +
            r2.map(function(θ) {
                var r = a * Math.exp(b * θ);
                return [
                    r * Math.cos(θ + 3),
                    r * Math.sin(θ + 3)
                ];
            }).join("L") + "Z";
    });

d3.timer(function(t) {
    spiral.attr("transform", function(d, i) {
        return "rotate(" + [(d * t / 200) % 360] + ")"
    });
});

}
function graph64(color){


var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,
    n = 25;

noise.seed(Math.random());



var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background",color)
    .append("g")


var scale = d3.scale.ordinal()
    .domain(d3.range(-n / 2, n / 2 + 1))
    .rangePoints([0, width], 1.3);

var data = [];
for (var x = -n / 2; x <= n / 2; x++) {
    for (var y = -n / 2; y <= n / 2; y++) {
        data.push({x: x, y: y});
    }
}

var lines = svg.selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("fill", "#111")
    .attr("d", "M-6,2,L12,0L-6,-2Z");

d3.timer(function(t) {
    lines.attr("transform", function(d) {
        var r = 360 * noise.simplex3(d.x / 60, d.y / 60, t / 7000);
        return "translate(" + [scale(d.x), scale(d.y)] + ")rotate(" + r + ")";
    });
});


}


function graph65(color){


var width = 350,
    height = 350,
    n = 30,
    r = width / n / 2,
    dx = r * 2 * Math.sin(Math.PI / 3),
    dy = r * 1.5;

noise.seed(Math.random());

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#d1d1d1");

var data = [];

for (var y = -r, odd = false; y < height + 2 * r; y += dy, odd = !odd) {
    for (var x = odd ? -dx / 2 : 0; x < width + dx; x += dx) {
        data.push([x, y]);
    }
}

var hexes = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + d + ")";
    })
    .append("path")
    .attr("stroke", "#111")
    .attr("stroke-width", 0.5)
    .attr("fill", "none")
    .attr("d", "M" + hexagon(r).join("l") + "Z");

d3.timer(function(t) {
    hexes.attr("transform", function(d, i) {
        return "scale(" + (1 + 1 * noise.simplex3(d[0] / 100, d[1] / 100, t / 4000)) + ")";
    });
});

function hexagon(radius) {
    var x0 = 0, y0 = 0;
    return d3.range(0, 2 * Math.PI, Math.PI / 3).map(function(angle) {
        var x1 = Math.sin(angle) * radius,
            y1 = -Math.cos(angle) * radius,
            dx = x1 - x0,
            dy = y1 - y0;
        x0 = x1;
        y0 = y1;
        return [dx, dy];
    });
}


}


function graph65(color){
var width = window.innerHeight*0.5,
    height = window.innerHeight*0.5,

    n = 20,
    m = 20,
    r = 3,
    dr = 20,
    g = 137.5 * Math.PI / 180;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .append("g");

var data = [];

for (var r = 1; r <= n; r++) {
    for (var ø = 0; ø < Math.PI * 2; ø += 2 * Math.PI / m) {
        data.push({r: r, ø: ø});
    }
}

var seeds = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", function(d) { return d.r * d.r * Math.cos(d.ø + g * d.r); })
    .attr("cy", function(d) { return d.r * d.r * Math.sin(d.ø + g * d.r); })
    .attr("fill", "#"+((1<<24)*Math.random()|0).toString(16))
    .attr("fill-opacity", 0.3);

d3.timer(function(t) {
    seeds.attr("r", function(d, i) { return 0.12 * (Math.sin(i * t / 50000) + 1) * Math.pow(d.r, 1.9); });

    svg.attr("transform", "translate(" + [width / 2, height / 2] + ")rotate(" + t / 100 % 360 + ")");
});
}
