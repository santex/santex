var r = 800 / 2;

var cluster = d3.layout.cluster()
    .size([360, r - 40])
    .separation(function(a, b) {
      if (a.left ^ b.left) return 90;
      return 2;
    });

d3.select("#vis").selectAll("*").remove();

var vis = d3.select("#vis").append("svg")
    .attr("width", r * 2)
    .attr("height", r * 2)
  .append("g")
    .attr("transform", "translate(" + r + "," + r + ")");

var nodes = cluster.nodes(calkin(1, 1, 6));

// Breadth-first traversal.
nodes.sort(function(a, b) {
  return a.y - b.y || a.x - b.x;
});

vis.append("svg:path")
    .data([nodes])
    .attr("d", function(d) {
      var path = ["M", [0, 0]],
          i = 0,
          n = d.length,
          x,
          a,
          r;
      while (++i < n) {
        x = d[i];
        a = Math.PI * (x.x - 90) / 180;
        r = (x.y + d[i - 1].y) / 2;
        path.push("A", [r, r], [0, 0, 1], [x.y * Math.cos(a), x.y * Math.sin(a)]);
      }
      return path.join(" ");
    });

vis.selectAll("path.link")
    .data(cluster.links(nodes))
  .enter().append("path")
    .attr("class", "link")
    .attr("d", d3.svg.diagonal().projection(project));

vis.selectAll("g.node")
    .data(nodes)
  .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
  .append("circle")
    .attr("r", 4.5);

vis.selectAll("text")
    .data(nodes)
  .enter().append("text")
    .attr("dy", ".31em")
    .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
    .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ")rotate(" + (d.x < 180 ? 0 : 180) + ")"; })
    .text(function(d) { return d.a + "/" + d.b; });

// Returns a Calkin-Wilf subtree of depth n for a/b.
function calkin(a, b, n, left) {
  left = a === 1 && b === 2 || left;
  return {
    a: a, b: b,
    left: left,
    children: n === 0 ? [] : [calkin(a, a + b, n - 1, left), calkin(a + b, b, n - 1, left)]
  };
}

function project(d) {
  var r = d.y, a = (d.x - 90) / 180 * Math.PI;
  return [r * Math.cos(a), r * Math.sin(a)];
}
