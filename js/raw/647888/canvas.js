(function() {
  var po = org.polymaps;

  po.canvas = function() {
    var canvas = po.layer(load, unload),
        image = po.svg("image"), // dummy image
        url;

    function load(tile) {
      var size = canvas.map().tileSize(),
          o = tile.element = po.svg("foreignObject"),
          c = o.appendChild(document.createElement("canvas")),
          w = size.x,
          h = size.y;

      o.setAttribute("width", w);
      o.setAttribute("height", h);
      c.setAttribute("width", w);
      c.setAttribute("height", h);

      tile.request = po.queue.image(image, url(tile), function(img) {
        var g = c.getContext("2d"),
            d = g.createImageData(w, h),
            e;
        delete tile.request;
        tile.ready = true;
        g.drawImage(img, 0, 0);
        e = g.getImageData(0, 0, w, h);
        for (var i = 0, n = w * h * 4; i < n; i++) d.data[i] = e.data[i] / 2; // e.g.
        g.putImageData(d, 0, 0);
        canvas.dispatch({type: "load", tile: tile});
      });
    }

    function unload(tile) {
      if (tile.request) tile.request.abort(true);
    }

    canvas.url = function(x) {
      if (!arguments.length) return url;
      url = po.url(x);
      return canvas.reload();
    };

    return canvas;
  };
})();
