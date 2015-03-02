var plotSpectrum = (function() {
  var w = 500,
      h = 150,
      p = [10, 20, 50, 40],
      x = d3.scale.linear().domain([0, 2]).range([0, w]),
      y = d3.scale.linear().range([h, 0]),
      xAxis = d3.svg.axis().orient("bottom").scale(x),
      yAxis = d3.svg.axis().orient("left").scale(y).tickFormat(d3.format("d")),
      duration = 500;

  var spectrum = d3.select("#spectrum").append("svg")
      .attr("width", w + p[1] + p[3])
      .attr("height", h + p[0] + p[2])
    .append("g")
      .attr("transform", "translate(" + [p[3], p[0]] + ")");

  spectrum.append("g")
      .attr("class", "bottom axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis);

  spectrum.append("g")
      .attr("class", "left axis")
      .call(yAxis);

  spectrum.append("text")
      .attr("text-anchor", "middle")
      .attr("x", w / 2)
      .attr("y", h)
      .attr("dy", "2.5em")
      .text("Eigenvalue");

  spectrum.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(0," + h / 2 + ")rotate(-90)")
      .attr("dy", "-1.5em")
      .text("Occurrences");

  return plotSpectrum;

  function plotSpectrum(tally) {
    var data = tally.data,
        counts = tally.counts;

    y.domain([0, d3.max(counts)]);

    var line = spectrum.selectAll("line.spectrum")
        .data(data);
    line.enter().append("line")
        .attr("class", "spectrum")
        .attr("y1", h)
        .attr("y2", h);
    line.exit().remove();
    line.transition()
        .duration(duration)
        .attr("x1", x)
        .attr("x2", x)
        .attr("y2", function(d, i) { return y(counts[i]); });

    var circle = spectrum.selectAll("circle")
        .data(data);
    circle.enter().append("circle")
        .attr("r", 5.5)
        .attr("cy", h);
    circle.exit().remove();
    circle.transition()
        .duration(duration)
        .attr("cx", x)
        .attr("cy", function(d, i) { return y(counts[i]); });

    spectrum.select(".bottom.axis").call(xAxis);
    spectrum.select(".left.axis").call(yAxis);
  }
})();
