var canvas = d3.select("#vis").append("canvas"),
    context = canvas[0][0].getContext("2d");

d3.select("#about-link").on("click", function() {
  d3.select("#center").style("display", "table");
  return false;
});

d3.select("#center").on("click", function() {
  d3.select("#center").style("display", "none");
});

window.addEventListener("resize", resize, false);
resize();

function resize() {
  var w = document.body.clientWidth,
      h = document.body.clientHeight;

  canvas
      .style("position", "absolute")
      .attr("width", w)
      .attr("height", h);

  var image = context.createImageData(w, h),
      dataWidth = Math.sqrt(image.data.length / (4 * w * h)),
      colour = d3.scale.linear().domain([0, Math.ceil(Math.log(Math.max(w, h)) / Math.LN2)]);

  for (var y=0, i=0; y<h*dataWidth; y++) {
    for (var x=0; x<w*dataWidth; x++) {
      var d = 1 - colour(hamming(x, y));
      image.data[i++] = d * 0x88;
      image.data[i++] = d * 0x56;
      image.data[i++] = d * 0xa7;
      image.data[i++] = 0xff;
    }
  }
  context.putImageData(image, 0, 0);
}

function hamming(a, b) {
  var distance = 0,
      v = a ^ b;
  while (v) {
    distance++;
    v &= v - 1;
  }
  return distance;
}
