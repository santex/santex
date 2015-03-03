var w = 960,
    h = 680,
    p = 10,
    scale = 2,
    fill = d3.scale.category20b(),
    format = d3.format(",d"),
    exampleX;

var blocks = [
  [],
  [[-.5, -.5], [.5, -.5], [.5, .5], [-.5, .5]],
  [[0, -1], [1, 0], [0, 1], [-1, 0]],
  [[-1, -1], [1, -1], [1, 1], [-1, 1]],
  [[-1, -1], [0, -1], [0, 1], [-1, 1]],
  [[-1, -1], [1, -1], [-1, 1]],
  [[0, -1], [1, 1], [-1, 1]],
  [[-1, -1], [1, 0], [1, 1], [0, 1]],
  [[0, -1], [-1, 1], [0, 1], [-.5, 0], [.5, 0], [0, 1], [1, 1]],
  [[-1, -1], [1, 0], [0, 1]],
  [[-1, 1], [-1, 0], [0, 0], [0, -1], [1, -1]],
  [[-1, -1], [0, -1], [0, 0], [-1, 0]],
  [[-1, 0], [1, 0], [0, 1]],
  [[-1, 1], [1, 1], [0, 0]],
  [[-1, 0], [0, -1], [0, 0]],
  [[-1, -1], [0, -1], [-1, 0]]
];

d3.selectAll("#vis, #primitives, #binary").selectAll("img").remove();
var vis = d3.select("#vis").append("svg")
    .attr("width", w + 2 * p)
    .attr("height", h + 2 * p)
  .append("g")
    .attr("transform", "translate(" + [p, p] + ")");

update();

d3.select("#more").on("click", update);
d3.selectAll("input[name=size]").on("change", function() {
  scale = +this.value;
  update();
});

function updateExample(x) {
  exampleX = x == null ? ~~(1 + Math.random() * (1 << 14 - 1)) : x;
  var example = d3.select("#example").selectAll("svg")
      .data([0]);
  var exampleEnter = example.enter().append("svg")
      .attr("width", 101)
      .attr("height", 101)
      .on("click", (function(angle) {
        return function() {
          example.select("g")
              .transition()
              .duration(500)
              .attrTween("transform", function() { return d3.interpolateString(
                "translate(" + [50/3, 50/3] + ")rotate(" +  angle        + " " + [50-50/3, 50-50/3] + ")",
                "translate(" + [50/3, 50/3] + ")rotate(" + (angle += 90) + " " + [50-50/3, 50-50/3] + ")"
              ); });
        };
      })(0));
  exampleEnter.append("rect")
      .attr("class", "mouse")
      .attr("width", 100)
      .attr("height", 100);
  exampleEnter.append("g")
      .attr("transform", "translate(" + [50/3, 50/3] + ")");
  example.select("g")
      .data([exampleX])
      .style("fill", fill)
      .call(drawBlock, 50 / 3);

  var primitives = d3.select("#primitives").selectAll("svg")
      .data([0]);
  var primitivesEnter = primitives.enter().append("svg")
      .attr("width", 15 * 30 * 2)
      .attr("height", 30 * 2 + 8)
    .selectAll("g")
      .data(blocks)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + (1 + i * 55) + ",1)"; });

  primitivesEnter.append("path")
      .attr("transform", function(d, i) { return "scale(" + 25 + ")translate(" + 1 + "," + 1 + ")"; })
      .style("fill", function(d, i) { return fill(i); })
      .attr("d", path);

  primitivesEnter.append("rect")
      .attr("width", 50)
      .attr("height", 50);
  primitives.selectAll("rect")
      .classed("selected", function(d, i) {
        return i === (exampleX & 3) ||
            i === (exampleX >> 2 & 0xf) ||
            i === (exampleX >> 6 & 0xf);
      });

  primitivesEnter.append("text")
      .attr("x", 25)
      .attr("y", 50)
      .attr("dy", "1.3em")
      .attr("text-anchor", "middle")
      .text(function(d, i) {
        var s = i.toString(2);
        while (s.length < 4) s = "0" + s;
        return s;
      });

  var binary = d3.select("#binary").selectAll("svg")
      .data([0]);
  var binaryEnter = binary.enter().append("svg")
      .attr("width", 14 * 30)
      .attr("height", 75)
    .selectAll("g")
      .data(d3.range(14))
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * 30 + ")"; });

  binaryEnter.append("rect")
      .attr("width", 20)
      .attr("height", 30)
      .on("click", function(d, i) {
        updateExample(exampleX ^ (1 << 13 - i));
      });
  binary.selectAll("rect")
      .classed("on", function(d, i) { return exampleX >> 13 - i & 1; });

  binaryEnter.append("text")
      .attr("class", "digit")
      .attr("text-anchor", "middle")
      .attr("x", 10)
      .attr("y", 40);
  binary.selectAll("text.digit")
      .text(function(d, i) { return exampleX >> 13 - i & 1; });

  var group = binary.selectAll("g.group")
      .data([
        ["edge", 0, 1],
        ["corner", 2, 3],
        ["edge", 4, 7],
        ["corner", 8, 11],
        ["centre", 12, 13],
        ["rotation", 0, 3, 1],
        ["shape", 4, 13, 1]
      ])
    .enter().append("g")
      .attr("class", "group")
      .attr("transform", function(d) { return d[3] ? "translate(0,15)" : null; });
  group.append("path")
      .attr("d", function(d) {
        return "M" + [d[1] * 30, 40] + "V45H" + (d[2] * 30 + 20) + "V40";
      });
  group.append("text")
      .attr("x", function(d) { return 30 * d[1] + 10; })
      .attr("y", 55)
      .text(function(d) { return d[0]; });
}

function update() {
  // 10,816 is the magic number of uniques.
  var dx = scale < 1 ? Math.sqrt(w * h / 10816) : 3 * scale * 2 * 1.5,
      bw = ~~(w / dx),
      bh = ~~(h / dx),
      data;

  if (scale >= 1) {
    data = d3.range(bw * bh).map(function(d) { return ~~(Math.random() * (1 << 14)); });
  } else {
    scale = dx / (3 * 2 * 1.5);
    data = d3.range(1 << 14).filter(function(d) {
      if (d >> 12     && (d >> 6 & 0xf) < 4 ||
          d >> 10 & 3 && (d >> 2 & 0xf) < 4) return false;
      return true;
    });
  }

  var g = vis.selectAll("g").data(data);
  g.enter().append("g")
  g.exit().remove();
  g.attr("transform", function(d, i) { return "translate(" + (i % bw) * dx + "," + ~~(i / bw) * dx + ")"; })
   .style("fill", fill)
   .call(drawBlock, scale);

  d3.select("#count").text(format(data.length) + " blocks");
  updateExample();
}

function drawBlock(g, scale) {
  var block = g.selectAll("path")
       .data(nineblock);
  block.enter().append("path");
  block.exit().remove();
  block.attr("transform", function(d, i) { return "scale(" + scale + ")translate(" + (i % 3) * 2 + "," + ~~(i / 3) * 2 + ")"; })
       .attr("d", function(d) { return d; });
}

function nineblock(i) {
  var corner = rotate(blocks[(i >> 2) & 0xf], (i >> 10) & 3),
      edge   = rotate(blocks[(i >> 6) & 0xf],  i >> 12);
  return [
    corner,
    edge,
    corner.map(rotate1),
    edge.map(rotate3),
    blocks[i & 3],
    edge.map(rotate1),
    corner.map(rotate3),
    edge.map(rotate2),
    corner.map(rotate2)
  ].map(path);
}

function path(d) {
  return d.length ? "M" + d.join("L") + "Z" : null;
}

// Rotate coordinates about [0, 0] by some multiple of 90°.
function rotate1(d) { return [-d[1],  d[0]]; };
function rotate2(d) { return [-d[0], -d[1]]; };
function rotate3(d) { return [ d[1], -d[0]]; };
function rotate(b, a) {
  if (!a) return b;
  return b.map(
      a === 1 ? rotate1 :
      a === 2 ? rotate2 : rotate3);
}
