

var width = 500,
    height = 500,
    cols = 50,
    theta = -25 * Math.PI / 180,
    length = 8.5,
    x0 = width/2.8,
    y0 = height,
    t0 = Math.PI / 2;

function tree(string) {
    var stack = [],
        root = { path: "M" + x0 + "," + y0, children: [] },
        state = { x: x0, y: y0, t: t0, branch: root };

    var commands = {
        'F': function() {
            state.x -= length * Math.cos(state.t);
            state.y -= length * Math.sin(state.t);
            state.branch.path += "L" + state.x + "," + state.y;
        },
        '+': function() {
            state.t += theta;
        },
        '-': function() {
            state.t -= theta;
        },
        '[': function() {
            stack.push(state);
            state = Object.create(state);
            var branch = { path: "M" + state.x + "," + state.y, children: [] };
            state.branch.children.push(branch);
            state.branch = branch;
        },
        ']': function() {
            state = stack.pop();
        }
    };

    string.split('').forEach(function(c) { commands[c](); });
    return root;
}

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .datum(tree(l(4, {"F": "FF-[-F+F+F]+[+F-F-F]"}, "F")))
    .each(grow);

function grow(d) {
    d3.select(this).append("path")
        .attr("stroke", "black")
        .attr("stroke-opacity", 0.65)
        .attr("stroke-width", 3)
        .attr("fill", "none")
        .attr("d", function(d) { return d.path; })
        .each(function() { d3.select(this).attr("stroke-dasharray", "0," + this.getTotalLength()); })
      .transition()
        .duration(1000)
        .attrTween("stroke-dasharray", tweenDash)

    d3.select(this).selectAll("g")
        .data(d.children)
        .enter().append("g")
      .transition()
        .delay(function(d, i) { return 200 + i * 200; })
        .each("start", grow);
}

function l(n, rules, str) {
    return n === 0 ? str : l(--n, rules, str.replace(/./g, function(c) { return rules[c] || c; }));
}

// http://bl.ocks.org/mbostock/5649592
function tweenDash() {
  var l = this.getTotalLength(),
      i = d3.interpolateString("0," + l, l + "," + l);
  return function(t) { return i(t); };
}
