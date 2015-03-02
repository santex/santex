// Copyright 2014, Jason Davies, http://www.jasondavies.com
// Requires rbush.js, https://github.com/mourner/rbush
(function(exports) {

// Based on topojson.presimplify, http://github.com/mbostock/topojson
exports.visvalingam = function() {
  var triangleArea = cartesianArea,
      intersectSegments = cartesianIntersect;

  function simplify(lines) {
    var heap = minHeap(),
        tree = rbush(),
        maxArea = 0;

    for (var j = 0, m = lines.length; j < m; ++j) {
      var points = lines[j],
          previous = null,
          boxes = [];

      var i = 0,
          n = points.length - 1,
          p = points[i];
      while (++i <= n) boxes.push(bbox(p, p = points[i]));
      tree.load(boxes);

      for (i = 1; i < n; ++i) {
        var triangle = {
          a: points[i - 1],
          b: points[i],
          c: points[i + 1],
          index: 0,
          previous: previous,
          next: null,
          ab: boxes[i - 1],
          bc: boxes[i]
        };
        triangle.b[2] = triangleArea(triangle);
        if (previous) previous.next = triangle;
        previous = triangle;
        heap.push(triangle);
      }

      points[0][2] = points[n][2] = Infinity;
    }

    var intersecting = [], t;

    while (triangle = heap.pop()) {
      // If the area of the current point is less than that of the previous point
      // to be eliminated, use the latter’s area instead. This ensures that the
      // current point cannot be eliminated without eliminating previously-
      // eliminated points.
      if (triangle.b[2] < maxArea) triangle.b[2] = maxArea;
      else maxArea = triangle.b[2];

      if (intersect(tree, triangle)) {
        intersecting.push(triangle);
        continue;
      }
      while (t = intersecting.pop()) heap.push(t);

      tree.remove(triangle.ab);
      tree.remove(triangle.bc);

      var box = bbox(triangle.a, triangle.c);
      tree.insert(box);

      var previous = triangle.previous,
          next = triangle.next;

      if (previous) {
        previous.bc = box;
        previous.next = next;
        previous.c = triangle.c;
        update(previous);
      }

      if (next) {
        next.ab = box;
        next.previous = previous;
        next.a = triangle.a;
        update(next);
      }
    }

    function update(triangle) {
      heap.remove(triangle);
      triangle.b[2] = triangleArea(triangle);
      heap.push(triangle);
    }

    return lines;
  }

  simplify.intersectSegments = function(_) {
    return arguments.length ? (intersectSegments = _, simplify) : intersectSegments;
  };

  simplify.triangleArea = function(_) {
    return arguments.length ? (triangleArea = _, simplify) : triangleArea;
  };

  return simplify;

  function intersect(tree, triangle) {
    if (!intersectSegments) return false;
    var a = triangle.a,
        c = triangle.c,
        candidates = tree.search(bbox(a, c));
    for (var i = 0, n = candidates.length; i < n; ++i) {
      var candidate = candidates[i],
          ca = candidate[4],
          cb = candidate[5];
      if (!equal(ca, a) && !equal(ca, c) && !equal(cb, a) && !equal(cb, c) && intersectSegments(ca, cb, a, c)) {
        return true;
      }
    }
    return false;
  }
};

exports.visvalingam.cartesianIntersect = cartesianIntersect;
exports.visvalingam.cartesianArea = cartesianArea;

function bbox(a, b) {
  var x0 = a[0], y0 = a[1],
      x1 = b[0], y1 = b[1],
      t;
  if (x0 > x1) t = x0, x0 = x1, x1 = t;
  if (y0 > y1) t = y0, y0 = y1, y1 = t;
  return [x0, y0, x1, y1, a, b];
}

function equal(a, b) {
  return a[0] === b[0]
      && a[1] === b[1];
}

function cartesianIntersect(p1, p2, p3, p4) {
  return (ccw(p1, p3, p4) ^ ccw(p2, p3, p4)) & (ccw(p1, p2, p3) ^ ccw(p1, p2, p4));
}

function ccw(p1, p2, p3) {
  var a = p1[0], b = p1[1],
      c = p2[0], d = p2[1],
      e = p3[0], f = p3[1];
  return (f - b) * (c - a) > (d - b) * (e - a);
}

function cartesianArea(t) {
  var a = t.a, b = t.b, c = t.c;
  return Math.abs((a[0] - c[0]) * (b[1] - a[1]) - (a[0] - b[0]) * (c[1] - a[1]));
}

function compare(a, b) {
  return a.b[2] - b.b[2];
}

// By Mike Bostock, http://bost.ocks.org/mike/simplify/
function minHeap() {
  var array = [],
      size = 0;

  var heap = {

    push: function(object) {
      array.push(object);
      up(array, object.index = size++);
      return size;
    },

    pop: function() {
      if (size <= 0) return;
      var removed = array[0],
          object = array.pop();
      if (--size) {
        array[object.index = 0] = object;
        down(array, 0);
      }
      return removed;
    },

    remove: function(removed) {
      var i = removed.index,
          object = array.pop();
      if (i !== --size) {
        array[object.index = i] = object;
        (compare(object, removed) < 0 ? up : down)(array, i);
      }
      return i;
    }
  };

  return heap;
}

function up(array, i) {
  var object = array[i];
  while (i > 0) {
    var up = ((i + 1) >> 1) - 1,
        parent = array[up];
    if (compare(object, parent) >= 0) break;
    array[parent.index = i] = parent;
    array[object.index = i = up] = object;
  }
}

function down(array, i) {
  var object = array[i];
  while (true) {
    var right = (i + 1) << 1,
        left = right - 1,
        down = i,
        child = array[down];
    if (left < array.length && compare(array[left], child) < 0) child = array[down = left];
    if (right < array.length && compare(array[right], child) < 0) child = array[down = right];
    if (down === i) break;
    array[child.index = i] = child;
    array[object.index = i = down] = object;
  }
}

})(this);
