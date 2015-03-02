var w = 170,
    symbols = "GOOGL,AAPL,ADBE,NTFL,AMZN,INTC,ARMH,A".split(",");

update();

function update() {
  var svg = d3.select("#vis").selectAll("div.chart")
    .data(symbols, String);
  
  var chart = svg.enter().append("div")
      .attr("class", "chart")
    .append("svg")
      .attr("class", "hilbert")
      .attr("opacity", 1)
      .attr("width", w+10)
      .attr("height", w+30)
      .call(loadStocks);

  svg.exit().remove();

  var horizon = d3.select("#horizon").selectAll("div.horizon")
    .data(symbols, String);

  horizon.enter().append("div")
      .attr("class", "horizon");
  horizon.exit().remove();
}

function loadStocks(g) {
  // Alternative (but only allows a very limited number of rows):
  // http://query.yahooapis.com/v1/public/yql?format=json&q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22YHOO%22%20and%20startDate%20%3D%20%221996-09-11%22%20and%20endDate%20%3D%20%222010-03-10%22&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys
  // Originally used this, but isn’t public and doesn’t support CORS:
  /*
  var from = '2004-07-01';
  var to = '2014-07-01';
  from = from.split(/-/g);
  to = to.split(/-/g);
  var url = "http://ichart.finance.yahoo.com/table.csv?s=" +
      encodeURIComponent(code) +
      "&d=" + encodeURIComponent(to[1]) +
      "&e=" + encodeURIComponent(to[2]) +
      "&f=" + encodeURIComponent(to[0]) +
      "&g=d&a=6&b=13&c=2001&ignore=.csv",
  */
  g.each(function(code, i) {
    var g = d3.select(this);
    d3.csv(encodeURIComponent(code) + ".csv", function(error, rows) {
      var level = 12;
      plot(g, i, code, level, rows.map(function(d, i) {
        return hilbert.d2xy(level, i);
      }), rows);
    });
  });
}

function plot(chart, index, code, level, curve, data) {
  data = data.map(function(d) {
    return parseFloat(d.Open);
  });
  var x = d3.scale.linear().domain([-.5, 1 << (level/2)]).range([0, w]),
      colour = d3.scale.log().domain([Math.max(.0001, d3.min(data)), d3.max(data)]).range(["#00c", "#f90"]);

  // Give browser some breathing space!
  setTimeout(function() {
    plotHorizon(data, index, code, colour);
  }, 1);

  chart.append("text")
      .attr("x", "5")
      .attr("dy", "1em")
      .text(String);

  var vis = chart.append("g")
      .attr("transform", "translate(5,25)");

  var square = vis.selectAll("rect").data(curve);
  square.enter().append("rect");
  square.exit().remove();

  vis.selectAll("rect")
      .style("fill", function(d, i) {
        return isNaN(data[i]) ? "#000" : colour(data[i]);
      })
      .attr("x", function(d) { return x(d[0] - .5); })
      .attr("y", function(d) { return x(d[1] - .5); })
      .attr("width", x(1) - x(0) + 1)
      .attr("height", x(1) - x(0) + 1);
}
