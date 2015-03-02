// From Knuth's Combinatorial Algorithms (F3B) 7.2.1.5,
// Algorithm H (Restricted growth strings in lexicographic order).
function partitions(n, visit) {
  var result = [],
      a = fillArray(n + 1, 0),
      b = fillArray(n + 1, 1),
      m = 1;
  while (1) {
    visit(a.slice(1));
    while (a[n] < m) a[n]++;
    var j = n - 1;
    while (a[j] === b[j]) j--;
    if (j === 0) return;
    a[j]++;
    m = b[j] + (a[j] === b[j] ? 1 : 0);
    j++;
    while (j < n) {
      a[j] = 0;
      b[j] = m;
      j++;
    }
    a[n] = 0;
  }
}

function fillArray(n, d) {
  var a = [];
  for (var i = 0; i < n; i++) a[i] = d;
  return a;
}
