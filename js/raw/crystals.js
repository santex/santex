// Animated quasicrystals by Jason Davies:
//   http://www.jasondavies.com/animated-quasicrystals/
// Licensed under the BSD license, see:
//   http://www.jasondavies.com/toys/LICENSE.txt
var w = 500,
    h = 500,
    canvas = d3.select("#vis").append("canvas")
      .attr("id", "c")
      .attr("width", w)
      .attr("height", h),
    off = 0,
    scale = 3,
    frame = 0,
    frames = 60,
    time,
    t,
    c;

PhiloGL.unpack();

if (!PhiloGL.hasWebGL()) {
  fallback();
} else {
  PhiloGL("c", {
    program: [{
      id: "quasip",
      from: "ids",
      vs: "shader-vs",
      fs: "shader-fs"
    }],
    onError: function(e) {
      console.log(e);
    },
    onLoad: function(app) {
      time = Date.now();

      draw();

      function draw() {
        t = ((Date.now() - time) / 300) % (2 * Math.PI);

        Media.Image.postProcess({
          width: w,
          height: h,
          toScreen: true,
          program: "quasip",
          uniforms: {t: t}
        });

        Fx.requestAnimationFrame(draw);
      }
    }
  });
}

function fallback() {
  d3.select("#patience").style("display", null);
  var context = canvas[0][0].getContext("2d");
  var cache = [];
  var quasicrystal = combine(d3.range(0, Math.PI, Math.PI / 7).map(wave));

  d3.timer(redraw);

  function redraw() {
    var image = cache[frame];
    if (!image) {
      image = cache[frame] = context.createImageData(w, h);
      var data = image.data;
      var dataWidth = Math.sqrt(data.length >> 2);
      for (var y=0, i=0; y<dataWidth; y++) {
        for (var x=0; x<dataWidth; x++) {
          var d = quasicrystal(tx(x), ty(y));
          data[i++] = d * 0x88;
          data[i++] = d * 0x56;
          data[i++] = d * 0xa7;
          data[i++] = 0xff;
        }
      }
    }
    context.putImageData(image, 0, 0);

    function tx(x) {
      return (x - w / 2) / scale;
    }

    function ty(y) {
      return (y - h / 2) / scale;
    }

    frame++;
    if (frame >= frames) frame = 0;
    off = 2 * Math.PI * frame / frames;
  }

  function wave(theta) {
    var c = Math.cos(theta),
        s = Math.sin(theta);
    return function(x, y) {
      return (Math.cos(c * x + s * y + off) + 1) / 2;
    };
  }

  function combine(fs) {
    var n = fs.length;
    return function(x, y) {
      var s = 0,
          i = -1;
      while (++i < n) {
        s += fs[i](x, y);
      }
      var v = s % 1,
          k = s - v;
      return (k & 1) === 0 ? v : 1 - v;
    };
  }
}
