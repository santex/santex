// Copyright 2014 Jason Davies, http://www.jasondavies.com/
(function() {

var ε = 1e-15; // TODO analyse this value

// TODO parameter n for no. of dimensions.
d3.geom.nhull = function() {
  function hull(points) {
    var n = points.length;

    if (n < 4) return []; // coplanar points

    for (var i = 0; i < n; ++i) points[i].i = i;
    d3.shuffle(points);

    var a = points[0],
        b = points[1],
        c = points[2],
        t = new Triangle(a, b, c);

    // Find non-coplanar fourth point.
    for (var i = 3; i < n && coplanar(t, points[i]); ++i);

    if (i === n) return []; // coplanar points

    // Create a tetrahedron.
    var d = points[i];
    points[i] = points[3], points[3] = d;

    if (visible(t, d)) {
      var tmp = b; b = c; c = tmp;
    }

    var ta = new Triangle(a, b, c, 0),
        tb = new Triangle(d, b, a, 1),
        tc = new Triangle(c, d, a, 2),
        td = new Triangle(b, d, c, 3),
        triangles = [ta, tb, tc, td];

    neighbors(ta.a, tb.b);
    neighbors(ta.b, td.c);
    neighbors(ta.c, tc.c);

    neighbors(tb.a, td.a);
    neighbors(td.b, tc.a);
    neighbors(tc.b, tb.c);

    // Initialise conflict graph.
    for (var i = 4; i < n; ++i) {
      var p = points[i];
      addConflict(ta, p, i);
      addConflict(tb, p, i);
      addConflict(tc, p, i);
      addConflict(td, p, i);
    }

    for (var i = 4; i < n; ++i) {
      var p = points[i], h = p.visible;
      if (!h) continue;

      // Find horizon.
      var horizon = null, a = h;
      do a.t.marked = true; while (a = a.nextF);

      a = h; do {
        var t = a.t;
        if (horizon = findHorizon(t.a) || findHorizon(t.b) || findHorizon(t.c)) break;
      } while (a = a.nextF);

      if (!horizon) continue;

      for (var j = 0, m = horizon.length, prev = null, first = null; j < m; ++j) {
        var e = horizon[j],
            f1 = e.triangle, f2 = e.neighbor.triangle,
            t = new Triangle(p, e.neighbor.p, e.p, triangles.length);
        neighbors(t.b, e);
        if (prev) neighbors(prev.a, t.c);
        else first = t;
        addConflicts(t, f1, f2);
        triangles.push(prev = t);
      }
      neighbors(prev.a, first.c);

      a = h; do {
        var t = a.t;
        for (var j = 0, m = t.visible.length; j < m; ++j) t.visible[j].remove();
        t.visible.length = 0;
        removeElement(triangles, t.index);
      } while (a = a.nextF);
    }
    return triangles;
  }

  return hull;
};

function removeElement(array, i) {
  var x = array.pop();
  if (i < array.length) (array[i] = x).index = i;
}

function norm(p) { return Math.sqrt(dot(p, p)); }

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]];
}

function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function visible(t, p) {
  return dot(t.n, p) - dot(t.n, t.a.p) > ε;
}

function coplanar(t, p) {
  return Math.abs(dot(t.n, p) - dot(t.n, t.a.p)) <= ε;
}

function normalise(d) {
  var m = 1 / norm(d);
  d[0] *= m, d[1] *= m, d[2] *= m;
  return d;
}

function Arc(t, v, i) {
  var head;
  this.t = t;
  this.v = v;
  this.i = i;
  this.prevF = null;
  if (head = this.nextF = v.visible) head.prevF = this;
  v.visible = this;
}

Arc.prototype.remove = function() {
  if (this.prevF) this.prevF.nextF = this.nextF;
  else this.v.visible = this.nextF;
  if (this.nextF) this.nextF.prevF = this.prevF;
};

function addConflict(t, p, i) {
  if (visible(t, p)) t.visible.push(new Arc(t, p, i));
}

// Maintain order of vertices in facet conflict lists when merging.
function addConflicts(t, a, b) {
  var av = a.visible,
      bv = b.visible,
      an = av.length,
      bn = bv.length,
      ai = 0,
      bi = 0;
  while (ai < an || bi < bn) {
    if (ai < an) {
      var ax = av[ai];
      if (bi < bn) {
        var bx = bv[bi];
        if (ax.i > bx.i) {
          addConflict(t, bx.v, bx.i), ++bi;
          continue;
        }
        if (ax.i === bx.i) ++bi;
      }
      addConflict(t, ax.v, ax.i), ++ai;
    } else {
      var bx = bv[bi];
      addConflict(t, bx.v, bx.i), ++bi;
    }
  }
}

function Triangle(a, b, c, index) {
  this.visible = [];
  this.marked = false;
  this.n = normalise(cross(subtract(c, a), subtract(b, a)));
  (((this.a = new Edge(this, a)).next = this.b = new Edge(this, b)).next = this.c = new Edge(this, c)).next = this.a;
  this.index = index;
}

function Edge(triangle, p) {
  this.triangle = triangle;
  this.p = p;
  this.neighbor = this.next = null;
}

function onHorizon(e) {
  return !e.triangle.marked && e.neighbor.triangle.marked;
}

// Assume e is marked.
function findHorizon(e) {
  if ((e = e.neighbor).triangle.marked) return;
  var horizon = [e], h0 = e;
  do {
    if (onHorizon(e = e.next)) {
      if (e === h0) return horizon;
      horizon.push(e);
    } else {
      e = e.neighbor;
    }
  } while (1);
}

function neighbors(a, b) {
  (a.neighbor = b).neighbor = a;
}

})();
