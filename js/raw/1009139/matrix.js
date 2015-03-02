var w = 960,
    h = 500;

// Matrix Layout
// ------------

var Matrix = function() {
  var width = 1,
      height = 1,
      cols = 4;

  // Simple matrix layout algorithm
  // Computes a suitable column count to fit the matrix
  // dimensions (width x height)
  function computeCols(n, width, height) {
    var cols = 1, // number of cols
        a, // edge length
        rows; // number of rows

    while(true) {
      a = width / cols;
      rows = Math.ceil(n/cols);
      if (rows*a <= height && n*a*a <= width*height)
        return cols;
      else {
        cols += 1;
      }
    }
  }

  function matrix(data, i) {
    var cols = computeCols(data.length, width, height);
    var size = Math.floor(width / cols);
    data.forEach(function(d, i) {
      d.x = parseInt((i % cols)*size, 10);
      d.y = Math.floor(i / cols)*size;
      d.dx = size;
      d.dy = size;
    });
    return data;
  }

  matrix.size = function(w, h) {
    width = w;
    height = h;
    return matrix;
  };

  return matrix;
};


// Matrix Plot
// ------------

var MatrixPlot = function(el, options) {
  var vis, matrix, cells, collection;
  var initialized = false;

  function init() {
    vis = d3.select("#canvas")
      .append("svg:svg")
        .attr("width", w)
        .attr("height", h);

    matrix = Matrix()
        .size(700, 500);
    initialized = true;
  }

  function cell() {
    this
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("width", function(d) { return d.dx-5; })
      .attr("height", function(d) { return d.dy-5; });
  }

  function update(options) {
    collection = options.collection;
    if (!initialized) init();

    cells = vis.data([collection.items()]).selectAll("rect")
      .data(matrix);

    // Transition of new (arriving cells)
    cells.enter().append("svg:rect")
        .attr("x", function(d) { return 0; })
        .attr("y", function(d) { return 0; })
        .attr("width", function(d) { return 0; })
        .attr("height", function(d) { return 0; })
      .transition()
        .delay(function(d, i) { return i * 20; })
        .duration(1500)
        .call(cell);

    // Transition of existing cells
    cells.transition()
      .delay(function(d, i) { return i * 20; })
      .duration(1500)
      .call(cell);

    // Exit transition
    cells.exit().transition()
      .delay(function(d, i) { return i * 20; })
      .duration(1500)
      .attr("x", function(d, i) { return -400; })
      .attr("y", function(d, i) { return -400; })
      .remove();

  }

  // Expose Public API
  return {
    update: update
  }
};
