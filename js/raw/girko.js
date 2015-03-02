var w = 500,
    p = 40,
    n = 50,
    gaussian = science.stats.distribution.gaussian().sigma(1 / Math.sqrt(n)),
    decompose = science.vector.decompose(),
    x = d3.scale.linear().domain([-1, 1]),
    iterations = 0,
    maxIterations = 100;

var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    imageData,
    data,
    dataWidth;

if (context) {
  var fallback = document.getElementById("fallback");
  fallback.parentNode.removeChild(fallback);

  context.fillRect(0, 0, w, w);
  imageData = context.getImageData(0, 0, w, w);
  data = imageData.data;
  x.range([0, dataWidth = Math.sqrt(data.length >> 2)]);

  d3.timer(girko);
}

function girko() {
  decompose(d3.range(n).map(function() {
    return d3.range(n).map(gaussian);
  })).D.forEach(function(d, i) {
    var index = (~~x(d[i]) + ~~x(d[i + 1] || d[i - 1] || 0) * dataWidth) * 4;
    for (var j=0; j<4; j++) data[index++] = 0;
  });
  context.putImageData(imageData, 0, 0);
  if (iterations++ >= maxIterations) return true;
}
