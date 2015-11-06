

var width = 500,
    height = 500,
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
