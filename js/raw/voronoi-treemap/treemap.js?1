(function() {

var ε = 1e-15;

d3.layout.voronoiTreemap = function() {
  var iterations = 100, // TODO use convergence criteria too
      alpha = .5,
      polygon = [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]];

  var hierarchy = d3.layout.hierarchy().sort(null);

  function treemap(d) {
    var nodes = hierarchy(d),
        root = nodes[0];
    root.polygon = polygon;
    recurse(root);
    return nodes;
  }

  treemap.polygon = function(_) {
    return arguments.length ? (polygon = _, treemap) : polygon;
  };

  treemap.iterations = function(_) {
    return arguments.length ? (iterations = +_, treemap) : iterations;
  };

  treemap.alpha = function(_) {
    return arguments.length ? (alpha = +_, treemap) : alpha;
  };

  return d3.rebind(treemap, hierarchy, "children", "value");

  function recurse(node) {
    var children = node.children, n;
    if (!children || !(n = children.length)) return;
    var clip = node.polygon,
        value = node.value,
        b = bounds(clip),
        area = polygonArea(clip),
        vertices = children.map(function(child) {
          var point = child.point;
          if (!point) {
            point = child.point = randomPointInPolygon(clip, b);
            point.push(area * child.value / value);
          }
          point.area = area * child.value / value;
          return point;
        }).concat(corners(b[0], b[1], b[2], b[3])), // TODO move the dummy corner vertices (which are only necessary for the power diagram) to power.js
        cells;
    for (var i = 0; i < iterations; ++i) {
      cells = d3.geom.power(vertices, weight);
      adaptPositionsWeights(cells, vertices, clip, alpha);
    }
    for (var i = 0; i < n; ++i) {
      var child = children[i],
          cell = cells[i];
      if (cell) {
        child.polygon = clipCell(clip, cell);
        if (child.polygon) {
          recurse(child);
          continue;
        }
      }
      // This happens if the parent layer doesn’t converge and the cell falls
      // outside the clipping polygon: in this case the whole subtree becomes
      // invisible.
      clearPolygon(child);
    }
  }
};

function adaptPositionsWeights(cells, vertices, clip, alpha) {
  for (var i = 0, n = vertices.length - 4; i < n; ++i) {
    var cell = cells[i];
    if (cell == null) continue;
    var clipped = clipCell(clip, cell.slice()),
        vertex = vertices[i];
    if (clipped) {
      // Compute centroid and area.
      var x = 0,
          y = 0,
          a = clipped[0],
          area = 0;
      for (var j = 1, m = clipped.length; j < m; ++j, a = b) {
        var b = clipped[j],
            c = a[0] * b[1] - b[0] * a[1];
        x += (a[0] + b[0]) * c;
        y += (a[1] + b[1]) * c;
        area += c;
      }
      if ((area *= .5) > ε) {
        var k = 1 / (6 * area);
        vertex[0] = x * k, vertex[1] = y * k;
      }
      vertex[2] += alpha * (vertex.area - area);
    } else {
      var point = randomPointInPolygon(clip, bounds(clip));
      vertex[0] = point[0], vertex[1] = point[1], vertex[2] = vertex.area;
    }
  }
}

function weight(d) { return d[2]; }

// Assume clockwise winding order.
function pointInPolygon(p, polygon) {
  for (var i = 1, n = polygon.length; i < n; ++i) {
    var a = polygon[i - 1], b = polygon[i];
    if ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) < 0) return false;
  }
  return true;
}

function bounds(polygon) {
  var x0, y0, x1, y1;
  x1 = y1 = -(x0 = y0 = Infinity);
  for (var i = 0, n = polygon.length; i < n; ++i) {
    var point = polygon[i],
        x = point[0],
        y = point[1];
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  return [x0, y0, x1, y1];
}

function randomPointInPolygon(polygon, b) {
  var x0 = b[0], y0 = b[1], x1 = b[2], y1 = b[3], safety = 1e4;
  do {
    var p = [x0 + Math.random() * (x1 - x0), y0 + Math.random() * (y1 - y0)];
  } while (!pointInPolygon(p, polygon) && --safety);
  if (!safety) throw new Error("could not find random point in polygon within 10,000 iterations!");
  return p;
}

function corners(x0, y0, x1, y1) {
  var width = x1 - x0, height = y1 - y0;
  return [
    [x0 - width, y0 - height, 0],
    [x1 + width, y0 - height, 0],
    [x0 - width, y1 + height, 0],
    [x1 + width, y1 + height, 0]
  ];
}

function clipCell(clip, cell) {
  var clipped = d3_geom_polygonClip(clip, cell.slice());
  if (clipped && clipped.length > 1) {
    var p0 = clipped[0],
        p1 = clipped[clipped.length - 1];
    if (p0[0] !== p1[0] || p0[1] !== p1[1]) clipped.push(p0);
    return clipped;
  }
}

function clearPolygon(node) {
  node.polygon = null;
  var children = node.children;
  if (children) children.forEach(clearPolygon);
}

function polygonArea(polygon) {
  var n = polygon.length,
      a = polygon[0],
      area = 0;

  for (var i = 1; i < n; ++i, a = b) {
    var b = polygon[i];
    area += a[0] * b[1] - a[1] * b[0];
  }

  return .5 * area;
}

// The Sutherland-Hodgman clipping algorithm.
// Note: requires the clip polygon to be clockwise and convex.
function d3_geom_polygonClip(clip, subject) {
  var i = clip.length,
      a = clip[--i];

  while (--i >= 0) {
    var input = subject.slice();
    subject.length = 0;
    var b = clip[i],
        m = input.length,
        c = input[0],
        j = 0;
    while (++j < m) {
      var d = input[j];
      if (d3_geom_polygonInside(d, a, b)) {
        if (!d3_geom_polygonInside(c, a, b)) {
          subject.push(d3_geom_polygonIntersect(c, d, a, b));
        }
        subject.push(d);
      } else if (d3_geom_polygonInside(c, a, b)) {
        subject.push(d3_geom_polygonIntersect(c, d, a, b));
      }
      c = d;
    }
    subject.push(subject[0]);
    a = b;
  }

  return subject;
}

function d3_geom_polygonInside(p, a, b) {
  return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);
}

// Intersect two infinite lines cd and ab.
function d3_geom_polygonIntersect(c, d, a, b) {
  var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3,
      y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3,
      ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
  return [x1 + ua * x21, y1 + ua * y21];
}

})();
