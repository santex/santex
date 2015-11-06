
var width = 500,
    height = 500,
    cols = 50,
    theta = 25 * Math.PI / 180,
    length = 2.5,
    x0 = width/6,
    y0 = height,
    t0 = .7 * Math.PI,
    n = 6;

function tree(string) {
    var stack = [],
        root = { path: [[x0, y0]], children: [] },
        state = { x: x0, y: y0, t: t0, branch: root };

    var commands = {
        'X': function() {},
        'F': function() {
            state.x -= length * Math.cos(state.t);
            state.y -= length * Math.sin(state.t);
            state.branch.path[1] = [state.x, state.y];
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
            state.depth += 1;
            var branch = { path: [[state.x, state.y]], children: [] };
            state.branch.children.push(branch);
            state.branch = branch;
        },
        ']': function() {
            state = stack.pop();
            state = Object.create(state);
            state.depth += 1;
            var branch = { path: [[state.x, state.y]], children: [] };
            state.branch.children.push(branch);
            state.branch = branch;
        }
    };

    string.split('').forEach(function(c) { commands[c](); });
    return root;
}

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", color)
    .datum(tree(l(n, {"X": "F-[[X]-X]+F[+FX]-X", "F": "FF"}, "X")))
    .each(grow(3));

function grow(weight) {
    return function(d) {
        if (d.path[1]) {
            d3.select(this).append("path")
                .attr("stroke", "black")
                .attr("stroke-opacity", 0.9)
                .attr("stroke-width", weight)
                .attr("fill", "none")
                .attr("d", "M" + d.path[0] + "L" + d.path[1])
                .each(function() { d3.select(this).attr("stroke-dasharray", "0," + this.getTotalLength()); })
              .transition()
                .ease("linear")
                .duration(400)
                .attrTween("stroke-dasharray", tweenDash)
        }

        d3.select(this).selectAll("g")
            .data(d.children)
            .enter().append("g")
          .transition()
            .delay(400)
            .each("start", grow(weight - 0.25));
    }
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
