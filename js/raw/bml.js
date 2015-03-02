// Biham-Middleton-Levine Traffic Model
(function() {

var players = 2,
    turn = 0,
    density = .31,
    w = 13,
    h = 8,
    dx = 25,
    x = d3.scale.linear().range([0, dx]),
    X,
    Y,
    id,
    cars,
    timer;

var svg = d3.select("#example").append("svg")
    .attr("width", w * dx)
    .attr("height", h * dx)
    .on("click", function() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
        play.attr("visibility", null);
      } else {
        play.attr("visibility", "hidden");
        draw();
      }
    });
var vis = svg.append("g");
var play = svg.append("g")
    .attr("class", "play");
play.append("rect")
    .attr("width", w * dx)
    .attr("height", h * dx);
play.append("path")
    .attr("transform", "translate(" + [w * dx / 2, h * dx / 2] + ")")
    .attr("d", "M-30,-30L30,0L-30,30Z");

setup();

function setup() {
  X = [];
  Y = [];
  id = 0;
  cars = d3.range(players).map(function() { return []; });
  for (var i = 0; i < w; i++) {
    X[i] = [];
    Y[i] = [];
    for (var j = 0; j < h; j++) X[i][j] = Y[i][j] = 0;
  }
  var n,
      x,
      y;
  for (var i = 0; i < density * h * w / 2; i++){
    do {
      n = ~~(Math.random() * h * w);
    } while(X[~~(n / w)][n % w]);
    Y[x = ~~(n / w)][y = n % w] = 1;
    cars[0].push({x: x, y: y, id: ++id});
    do {
      n = ~~(Math.random() * h * w);
    } while(X[~~(n / w)][n % w]);
    X[x = ~~(n / w)][y = n % w] = 2;
    cars[1].push({x: x, y: y, id: ++id});
  }
  turn = 0;
  draw(true);
  draw(true);
}
 
function draw(immediate) {
  for (var i=0; i<w; i++) {
    for (var j=0; j<h; j++) {
      Y[i][j] = X[i][j] !== turn+1 ? X[i][j] : 0;
    }
  }
  cars[turn].forEach(function(c) {
    var x = c.x,
        y = c.y;
    if (turn) x = (x + 1) % w;
    else y = (y + 1) % h;
    if (!X[x][y]) {
      Y[x][y] = turn+1;
      if (turn) c.x = x < c.x ? (cars[turn].push({x: x, y: y, id: ++id}), c.x + 1) : x;
      else c.y = y < c.y ? (cars[turn].push({x: x, y: y, id: ++id}), c.y + 1) : y;
    } else {
      Y[c.x][c.y] = turn+1;
    }
  });
  var tmp = X;
  X = Y;
  Y = tmp;
  var car = vis.selectAll("rect.car-" + turn)
      .data(cars[turn], function(d) { return d.id; });
  car.enter().append("rect")
      .attr("class", "car-" + turn)
      .attr("x", turn ? x(-1) : function(d) { return x(d.x); })
      .attr("y", turn ? function(d) { return x(d.y); } : x(-1))
      .attr("width", dx)
      .attr("height", dx);
  car.exit().remove();
  (immediate ? car : car.transition().duration(750))
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return x(d.y); });
  cars[turn] = cars[turn].filter(function(c) { return c.x < w && c.y < h; });
  turn = (turn + 1) % players;
  if (!immediate) timer = setTimeout(draw, 1000);
}

})();
