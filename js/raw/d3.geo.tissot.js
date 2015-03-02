(function() {

var ε = 1e-6,
    radians = Math.PI / 180,
    degrees = 180 / Math.PI;

d3.geo.tissot = function() {
  var dr = Math.pow(10, -5.2),
      dr0 = .5 * dr,
      projection = null,
      stream,
      ellipse;

  function tissot(object) {
    var point,
        stream = projection.stream({
          point: function(x, y) { point = [x, y]; },
          lineStart: noop,
          lineEnd: noop,
          polygonStart: noop,
          polygonEnd: noop
        }),
        ellipses = [];
    d3.geo.stream(object, {
      point: function(λ, φ) {
        var cosφ = Math.cos(φ * radians);
        if (cosφ < ε) return;

        var p = (point = null, stream.point(λ, φ), point);
        if (!point) return;

        var λ0 = λ > 0 ? λ - dr : λ + dr,
            φ0 = φ > 0 ? φ - dr : φ + dr;

        var pλ = (point = null, stream.point(λ0, φ), point);
        if (!point) return;

        var pφ = (point = null, stream.point(λ, φ0), point);
        if (!point) return;

        var dλ = λ - λ0,
            dφ = φ - φ0,
            δxδφ = (p[0] - pφ[0]) / dφ,
            δyδφ = (p[1] - pφ[1]) / dφ,
            δxδλ = (p[0] - pλ[0]) / dλ,
            δyδλ = (p[1] - pλ[1]) / dλ;

        var s = svd(multiply([δxδλ, δxδφ, δyδλ, δyδφ], [1 / cosφ, 0, 0, 1]));
        ellipses.push({
          coordinates: [λ, φ],
          a: s.singular[0],
          b: s.singular[1],
          rotate: s.angle * degrees
        });
      }
    });
    return ellipses;
  }

  tissot.projection = function(_) {
    if (!arguments.length) return projection;
    projection = _;
    return tissot;
  };

  return tissot;
};

// Decompose A = UΣV'
function svd(a) {
  var a_ = transpose(a),
      su = multiply(a, a_),
      φ = .5 * Math.atan2(su[2] + su[1], su[0] - su[3]),
      susum = su[0] + su[3],
      sudiff = Math.sqrt((su[0] - su[3]) * (su[0] - su[3]) + 4 * su[1] * su[2]),
      svals = [Math.sqrt((susum + sudiff) / 2), Math.sqrt((susum - sudiff) / 2)];
  return {
    angle: φ,
    singular: svals
  };
}

function transpose(a) {
  return [
    a[0], a[2],
    a[1], a[3]
  ];
}

function multiply(a, b) {
  return [
    a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3],
    a[2] * b[0] + a[3] * b[2], a[2] * b[1] + a[3] * b[3]
  ];
}

function noop() {}

})();
