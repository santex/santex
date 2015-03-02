// This is mainly to share functionality for retroazimuthal maps.
// TODO make more useful!
function canvasMap() {
  var ratio = window.devicePixelRatio || 1,
      width = 960 * ratio,
      height = 600 * ratio,
      ε = 1e-6,
      land,
      listeners = [];

  d3.json("../world-110m.json", function(error, world) {
    land = topojson.feature(world, world.objects.countries);
    listeners.forEach(function(f) { f(); });
  });

  var projection,
      outline = {type: "Sphere"},
      outlineRotate = [0, 0],
      outlinePrecision = 1,
      graticule = d3.geo.graticule()(),
      event = d3.dispatch("drag"),
      point = null;

  function map(g) {
    // TODO use extent to find centre?
    var scale = projection.scale();
    projection.scale(scale * ratio).translate([width / 2, height / 2]).scale(scale);

    var canvas = g.selectAll("canvas")
        .data([{x: 2 * projection.rotate()[0], y: -2 * projection.rotate()[1]}]);

    canvas.enter().append("canvas")
        .attr("width", width)
        .attr("height", height)
        .style("width", width / ratio + "px")
        .style("height", height / ratio + "px")
        .each(function() { listeners.push(update); });

    var context = canvas.node().getContext("2d");

    var path = d3.geo.path()
        .context(context)
        .projection(projection);

    canvas
        .on("mousedown", mousedown)
        .on("touchstart", mousedown)
        .call(d3.behavior.drag()
          .origin(Object)
          .on("drag", function(d) {
            if (!projection.invert) return;
            var target = [d3.event.x / 2, -d3.event.y / 2, projection.rotate()[2]];
            event.drag(target);
            d.x = 2 * target[0];
            d.y = -2 * target[1];
            update();
          }));
    event.drag(projection.rotate());
    update();

    function mousedown() {
      if (projection.invert) {
        var m = d3.event.changedTouches ? d3.touches(this, d3.event.changedTouches)[0] : d3.mouse(this),
            scale = projection.scale();
        projection.scale(scale * ratio);
        m[0] *= ratio;
        m[1] *= ratio;
        mouse = projection.invert(m);
        projection.scale(scale);
      }
    }

    function update(target) {
      if (outline) drawOutline(outline, outlineRotate);
      canvas.each(function(d, i) {
        var scale = projection.scale(),
            precision = projection.precision();
        projection.scale(scale * ratio);
        context.lineWidth = .5 * ratio;
        context.fillStyle = "#e4e5e7";
        context.fillRect(0, 0, width, height);
        context.strokeStyle = "#000";
        context.fillStyle = "#e1c999";
        if (land) context.beginPath(), path(land), context.fill(), context.stroke();
        context.beginPath(), path(graticule), context.stroke();
        context.fillStyle = "#000";
        if (point) context.beginPath(), path(point), context.fill();
        context.restore();
        context.lineWidth = 2 * ratio;
        if (outline) {
          var rotate = projection.rotate();
          if (outlineRotate != null) projection.rotate(outlineRotate);
          projection.precision(outlinePrecision);
          context.beginPath(), path(outline), context.stroke();
          projection.rotate(rotate);
        }
        projection.precision(precision).scale(scale);
      });
    }

    function drawOutline(outline, outlineRotate) {
      var scale = projection.scale(),
          rotate = projection.rotate(),
          precision = projection.precision();
      if (outlineRotate != null) projection.rotate(outlineRotate);
      projection.scale(scale * ratio).precision(outlinePrecision);
      context.clearRect(0, 0, width, height);
      context.save();
      context.lineWidth = 1.5 * ratio;
      context.beginPath(), path(outline), context.clip();
      projection.precision(precision).scale(scale).rotate(rotate);
    }
  }

  map.projection = function(_) {
    if (!arguments.length) return projection;
    projection = _;
    return map;
  };

  map.outline = function(_) {
    if (!arguments.length) return outline;
    outline = _;
    return map;
  };

  map.outlineRotate = function(_) {
    if (!arguments.length) return outlineRotate;
    outlineRotate = _;
    return map;
  };

  map.outlinePrecision = function(_) {
    if (!arguments.length) return outlinePrecision;
    outlinePrecision = _;
    return map;
  };

  map.graticule = function(_) {
    if (!arguments.length) return graticule;
    graticule = _;
    return map;
  };

  map.point = function(_) {
    if (!arguments.length) return point;
    point = _ === true ? {type: "Point", coordinates: null} : _;
    return map;
  };

  map.width = function(_) {
    if (!arguments.length) return width / ratio;
    width = _ * ratio;
    return map;
  };

  map.height = function(_) {
    if (!arguments.length) return height / ratio;
    height = _ * ratio;
    return map;
  };

  return d3.rebind(map, event, "on")
      .on("drag", function(target) {
        projection.rotate(target);
        if (point) point.coordinates = [-target[0], -target[1]];
      });
}
