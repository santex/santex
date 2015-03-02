<!DOCTYPE html>
<meta charset="utf-8">
<title>Random Points on a Sphere</title>
<style>
@import url(../maps.css);
path {
  fill: none;
}
path.graticule {
  stroke: #999;
  stroke-width: .5px;
}
circle.mouse {
  fill: none;
  stroke: #000;
  cursor: move;
  pointer-events: all;
}
div.sphere {
  clear: left;
  position: relative;
  text-align: justify;
}
div.wrap {
  float: left;
  clear: left;
  height: 20px;
}
svg {
  position: absolute;
  left: 0;
}
div.clear {
  clear: left;
}
.wrapper {
  width: 800px;
}
</style>
<p class="breadcrumbs"><a href="http://www.jasondavies.com/">Jason Davies</a> → <a href="../">Maps</a>
<h1>Random Points on a Sphere</h1>

<div class="wrapper">
<div class="sphere">
  <p>Suppose we want to generate uniformly distributed points on a sphere.
  We might start off by picking spherical coordinates (λ,&nbsp;φ) from two uniform distributions, λ&nbsp;∈&nbsp;[-180°,&nbsp;180°) and φ&nbsp;∈&nbsp;[-90°,&nbsp;90°).
  <p>However, we can quickly see that this will result in an uneven distribution, with the density increasing as we get closer to the poles.
  <p>One way to explain this is to look at the how the area of a given “square” of width Δλ and height Δφ varies with φ.
  <p>Try picking any square on the graticule (the spherical grid).
  See how the squares get smaller towards the poles?
</div>
<div class="sphere">
  <p>If we want any area on the sphere to contain approximately the same density of points,
  there are a <a href="http://mathworld.wolfram.com/SpherePointPicking.html">number of solutions</a>.
  <p>One solution is to pick λ&nbsp;∈&nbsp;[-180°,&nbsp;180°) as before and then set φ&nbsp;=&nbsp;cos<sup>-1</sup>(2x&nbsp;-&nbsp;1),
  where x is uniformly distributed and x&nbsp;∈&nbsp;[0, 1).
  <p>Although we’ve successfully generated uniformly distributed points on a sphere, it <i>feels</i> messy.
  Some points seem too close together, and some seem too far apart.
  <p>Perhaps we can drop our requirement for points to be <i>uniformly</i> distributed, but keep them well-distributed.
</div>
<div class="sphere">
  <p>A more æsthetically pleasing pattern can be generated using Poisson-disc sampling, where no points are less than a minimum distance apart.
  <p>This produces spectral characteristics similar to <a href="http://en.wikipedia.org/wiki/Colors_of_noise#Blue_noise">blue noise</a>, i.e. less clusters of high and low density.
  <p>Note that the points are no longer independent of each other, hence they are no longer uniformly distributed.
  <p><a href="http://bl.ocks.org/mbostock/1893974">Mitchell’s best-candidate algorithm</a> is a straightforward approximation.
  Generate a number of candidate samples and pick the furthest from all previous samples.
  <p>Poisson-disc sampling can of course be applied to other surfaces too e.g. it is often used on 2D planes.
  <p>Oh, and don’t forget to drag the spheres!
</div>
<div class="clear"></div>
</div>
<script src="../../d3.min.js?3.0.0"></script>
<script>
var n = 4e2,
    id = 0,
    width = 310,
    height = 310,
    graticule = d3.geo.graticule(),
    rotate = {x: 0, y: 90},
    projection = d3.geo.orthographic()
      .translate([width / 2, height / 2])
      .clipAngle(90)
      .rotate([rotate.x / 2, -rotate.y / 2]),
    path = d3.geo.path().projection(projection).pointRadius(1.5),
    degrees = 180 / Math.PI,
    λ = d3.scale.linear().range([-180, 180]),
    φ = d3.scale.linear().range([-90, 90]),
    radius = projection([90, 0])[0] - projection([0, 0])[0];

var div = d3.selectAll(".sphere")
    .data([wrong(), uniform(), poisson(50)]);

var svg = div.insert("svg", ":first-child")
    .attr("width", width)
    .attr("height", height);

// Wrap the text around the spheres!
var dy = 20;
div.selectAll("div.wrap")
    .data(d3.range(height / dy))
  .enter().insert("div", ":first-child")
    .attr("class", "wrap")
    .style("width", function(d) {
      var r = 10 + width / 2,
          y = width / 2 - d * dy;
      return width / 2 + ~~Math.sqrt(r * r - y * y) + "px";
    });

svg.append("path")
    .attr("class", "graticule")
    .datum(graticule)
    .attr("d", path);
svg.append("circle")
    .datum(rotate)
    .attr("class", "mouse")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")")
    .attr("r", radius)
    .call(d3.behavior.drag()
      .origin(Object)
      .on("drag", function(d) {
        projection.rotate([(d.x = d3.event.x) / 2, -(d.y = d3.event.y) / 2]);
        svg.selectAll("path").attr("d", path);
      }));
var point = svg.append("g")
    .style("stroke", function(d, i) { return ["red", "green", "blue"][i]; })
    .selectAll("path.point");

d3.timer(function() {
  point = point.data(function(random) { return random(); }, pointId);
  point.exit().remove();
  point.enter().append("path")
      .attr("class", "point")
      .attr("d", path);
});

// Poisson-disc sampling. Best of k candidates.
// Based on Mike Bostock’s http://bl.ocks.org/mbostock/1893974
function poisson(k) {
  var radius = 10,
      points = [],
      geometries = [],
      findClosest = finder(points, radius * 2);
  return function() {
    var best = null;

    // Create k candidates, picking the best (furthest away).
    for (var i = 0; i < k; ++i) {
      var candidate = {x: λ(Math.random()), y: 180 * Math.acos(Math.random() * 2 - 1) / Math.PI - 90};
      findClosest(candidate);
      if (!best || candidate.radius > best.radius) best = candidate;
    }

    best.radius = 5;
    points.push(best);
    geometries.push({type: "Point", coordinates: [best.x, best.y], id: nextId()});
    if (geometries.length > n) geometries.shift(), points.shift();
    return geometries;
  };
}

// Find the closest circle to the candidate.
function finder(points) {
  var arc = d3.geo.greatArc().target(Object);

  return function(candidate) {
    candidate.radius = Infinity;
    arc.source([candidate.x, candidate.y]);

    points.forEach(function(point) {
      var radius = Math.max(0, arc.distance([point.x, point.y]) * 180 / Math.PI - point.radius);
      if (radius < candidate.radius) candidate.radius = radius;
    });
  };
}

function wrong() {
  var points = [];
  return function() {
    points.push({type: "Point", coordinates: [λ(Math.random()), φ(Math.random())], id: nextId()});
    if (points.length > n) points.shift();
    return points;
  };
}

function uniform() {
  var points = [];
  return function() {
    points.push({type: "Point", coordinates: [λ(Math.random()), Math.acos(2 * Math.random() - 1) * degrees - 90], id: nextId()});
    if (points.length > n) points.shift();
    return points;
  };
}

function pointId(d) { return d.id; }
function nextId() { return id = ~~(id + 1); } // Just in case we overflow…

</script>
