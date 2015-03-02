var w = 500,
    h = 500,
    p = 5,
    n = 100,
    n2 = n * n,
    dx = w / (2 * n),
    dy = h / (2 * n),
    data = [];

for (var a=-n; a<n; a++)
  for (var b=-n; b<n; b++)
    if (a * a + b * b < n2 && isGaussianPrime(a, b))
      data.push({a: a, b: b});

var vis = d3.select("#vis").append("svg")
    .attr("width", w + 2 * p)
    .attr("height", h + 2 * p)
  .append("g")
    .attr("transform", "translate(" + (p + w / 2) + "," + (p + h / 2) + ")");

vis.append("circle")
    .attr("r", w / 2 + p / 2);

vis.selectAll("rect")
    .data(data)
  .enter().append("rect")
    .attr("x", function(d) { return (d.a - .5) * dx; })
    .attr("y", function(d) { return (d.b - .5) * dy; })
    .attr("width", dx)
    .attr("height", dy)

// a + bi
function isGaussianPrime(a, b) {
  return (
    a === 0 ? isPrime(a = Math.abs(a)) && a % 4 === 3 :
    b === 0 ? isPrime(b = Math.abs(b)) && b % 4 === 3 :
    isPrime(a * a + b * b));
}

function isPrime(n) {
  if (2 > n) return false;
  if (0 === n % 2) return 2 === n;
  for (var index = 3; n / index >= index; index += 2)
    if (0 === n % index) return false;
  return true;
}
