(function() {

var root = {
  demvotes: 0,
  repvotes: 0,
  probability: 1,
  party: null,
  state: {}
};

var stateById = {},
    swingStates,
    swingStatesById = {FL: 1, OH: 1, NC: 1, VA: 1, WI: 1, CO: 1, IA: 1, NV: 1, NH: 1},
    states,
    oldStates;

var numbers = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
    formatCandidate = {dem: "Obama", rep: "Romney"},
    formatNumber = function(d) { return numbers[d] || d; },
    formatPercent = d3.format(".2p");

var margin = {top: 85, right: 10, bottom: 40, left: 60},
    width = 970 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

var y = d3.scale.pow()
    .exponent(2 / 3)
    .domain([0, 9])
    .rangeRound([0, height]);

var w = d3.scale.linear()
    .domain([0, 1])
    .range([1, 32]);

var nodesByKey,
    oldNodesByKey,
    activeOutcome,
    bisect = d3.bisector(function(d) { return d.index; }).left,
    nodes = [],
    links = [];

var tree = d3.layout.tree()
    .separation(function(a, b) { return (a.probability + b.probability + .1) * (states.length - a.depth + 1); })
    .children(function(d, i) {
      if (i < states.length) {
        var s = states[i];
        return Math.max(d.demvotes, d.repvotes) < 270 && [
          {party: "dem", state: s, probability: d.probability / 2, demvotes: d.demvotes + s.votes, repvotes: d.repvotes},
          {party: "rep", state: s, probability: d.probability / 2, demvotes: d.demvotes, repvotes: d.repvotes + s.votes}
        ];
      }
    });

var svg = d3.select(".g-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Per-type markers, as they don't inherit styles.
svg.append("defs").selectAll("marker")
    .data(["dem", "rep", "dem-active", "rep-active"])
  .enter().append("marker")
    .attr("id", function(d) { return "g-arrowhead-" + d; })
    .attr("viewBox", "-.1 -5 10 10")
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M-.1,-4L3.9,0L-.1,4")
    .attr("class", function(d) { return "g-marker g-" + d; });

var node = svg.selectAll(".g-node"),
    link = svg.selectAll(".g-link"),
    state = svg.selectAll(".g-state"),
    controlButton;

var resetButton = d3.select(".g-controls").append("a")
    .attr("class", "g-reset")
    .text("Reset")
    .on("click", function() { reset(); transition(); });

var scoreboard = svg.append("g")
    .attr("class", "g-scoreboard")
    .attr("transform", "translate(" + ((width + margin.left + margin.right) / 2 - margin.left) + ",0)");

var kicker = scoreboard.append("text")
    .attr("class", "g-kicker")
    .attr("y", -52);

scoreboard.append("rect")
    .attr("x", -280)
    .attr("y", -80)
    .attr("width", 280 * 2)
    .attr("height", 80)

scoreboard.append("path")
    .attr("d", "M-280,0H-20l20,20L20,0H280");

var candidateScores = [
  {party: "dem", position: -280, align: "start"},
  {party: "rep", position: 280, align: "end"},
  {party: "tie", position: null, align: "middle"}
];

scoreboard.selectAll(".g-prefix")
    .data(candidateScores)
  .enter().append("text")
    .attr("class", function(d) { return "g-" + d.party + " g-prefix"; })
    .attr("x", function(d) { return d.position; })
    .attr("y", "-1.8em")
    .style("text-anchor", function(d) { return d.align; })
    .text(function(d) { return d.party === "tie" ? "" : formatCandidate[d.party] + " has "; });

scoreboard.selectAll(".g-prefix").append("tspan")
    .attr("class", "g-score");

scoreboard.selectAll(".g-prefix").append("tspan")
    .attr("class", "g-suffix");

scoreboard.append("text")
    .attr("class", "g-ratio g-dem")
    .attr("y", "-1.2em")
    .attr("x", -168);

scoreboard.append("text")
    .attr("class", "g-ratio g-rep")
    .attr("y", "-1.2em")
    .attr("x", 170);

scoreboard.append("text")
    .attr("class", "g-ratio g-tie")
    .attr("y", "-1.2em");

var endAlert = svg.append("text")
    .attr("class", "g-alert")
    .attr("transform", "translate(" + ((width + margin.left + margin.right) / 2 - margin.left) + ",45)");

endAlert.append("tspan")
    .attr("x", 0)
    .text("With these selections and no upsets in remaining states,");

endAlert.append("tspan")
    .attr("class", "g-output")
    .attr("x", 0)
    .attr("y", "1.5em")
    .attr("class", "g-output");

d3.json(_root.replace(/\/$/, "") + "/results/president/big-board.json", function(error, board) {

  allStates = board.races.map(function(race) {
    var winner = race.results.filter(function(result) { return result.winner; })[0];
    return stateById[race.state_id] = {
      id: race.state_id,
      party: race.state_id in swingStatesById ? null : winner.party_id.toLowerCase(),
      votes: race.state_electoral_votes,
      abbreviation: race.state_abbr,
      name: race.state_name
    };
  });

  swingStates = allStates
      .sort(function(a, b) { return b.votes - a.votes || a.name.localeCompare(b.name); })
      .filter(function(d, i) { d.index = i; return d.party ? (root[d.party + "votes"] += d.votes, false) : true; });

  states = swingStates.slice();
  oldStates = states.slice();

  var control = d3.select(".g-controls").selectAll(".g-control")
      .data(states)
    .enter().append("div")
      .attr("class", "g-control");

  control.append("h4")
      .text(function(d) { return d.abbreviation; });

  controlButton = control.append("div")
      .attr("class", "g-buttons")
    .selectAll("button")
      .data(function(d) {
        return ["dem", "rep"].map(function(o) {
          return {state: d, outcome: o};
        });
      })
    .enter().append("button")
      .attr("class", function(d) { return "g-button g-" + d.outcome; })
      .text(function(d) { return d.outcome; })
      .on("click", function(view) { change(view); transition(); });

  var controlResult = control.append("div")
      .attr("class", "g-results");

  var controlDemResult = controlResult.append("span")
      .attr("class", "g-dem");

  var controlRepResult = controlResult.append("span")
      .attr("class", "g-rep");

  board.races.forEach(function(race) {
    var state = stateById[race.state_id],
        winners = race.results.filter(function(d) { return d.winner; });

    state.reporting = race.pct_report_percent / 100;
    race.results.forEach(function(result) {
      state[result.party_id.toLowerCase() + "report"] = result.pct / 100;
    });

    if (winners.length) {
      var party = winners[0].party_id.toLowerCase();
      if (state.party !== party) {
        if (state.party !== null && !state.enabledParty) {
          root[state.party + "votes"] -= state.votes;
          root[party + "votes"] += state.votes;
        }
        state.override = true;
        state.party = party;
      }
    } else if (state.party && state.override) {
      if (!state.enabledParty) root[state.party + "votes"] -= state.votes;
      state.party = null;
    }
  });

  controlDemResult
      .text(function(d) { return formatPercent(d.demreport); })
      .classed("g-leading", function(d) { return d.demreport > d.repreport; });

  controlRepResult
      .text(function(d) { return formatPercent(d.repreport); })
      .classed("g-leading", function(d) { return d.demreport < d.repreport; });

  update();
});

function update() {
  root.children = null;
  nodes = tree.size([width, 1]).nodes(root);
  links = tree.links(nodes).reverse();
  root.x = (width + margin.right - margin.left) / 2;

  //
  nodesByKey = {};
  nodes.forEach(function(d) { nodesByKey[d.key = key(d)] = d; });

  updateStates();
  updateNodes();
  updateLinks();
  updateVoronoi();
  updateScoreboard();
}

function updateStates() {
  state = state.data(states, function(d) { return d.id; });

  d3.transition(state.exit())
      .style("fill-opacity", 1e-6)
      .attr("transform", function(d) { return "translate(" + (-margin.left + 10) + "," + y(bisect(states, d.index)) + ")"; })
      .remove();

  var stateEnter = state.enter().insert("g", ".g-scoreboard,.g-node,.g-link")
      .style("fill-opacity", 1e-6)
      .attr("class", "g-state")
      .attr("transform", function(d) { return "translate(" + (-margin.left + 10) + "," + y(bisect(oldStates, d.index)) + ")"; });

  d3.transition(state)
      .style("fill-opacity", 1)
      .attr("transform", function(d, i) { return "translate(" + (-margin.left + 10) + "," + y(i + 1) + ")"; });

  stateEnter.append("line")
      .attr("x2", width + margin.left - 10);

  stateEnter.append("rect")
      .attr("y", -16)
      .attr("width", 12)
      .attr("height", 12);

  stateEnter.selectAll("text")
      .data(["dem", "rep"])
    .enter().append("text")
      .attr("class", function(d) { return "g-" + d; })
      .attr("y", -6)
      .attr("x", 6)
      .style("text-anchor", "middle")
      .text(function(d) { return d.substring(0, 1).toUpperCase(); });

  stateEnter.append("text")
      .attr("x", 16)
      .attr("y", -6)
      .text(function(d) { return d.name; });
}

function updateLinks() {
  link = link.data(links, function(d) { return d.target.key; });

  var linkEnter = link.enter().insert("path", ".g-node")
      .attr("d", function(d) { var p = findOldParent(d.target); return diagonal({source: p, target: p}); })
      .attr("class", function(d) { return "g-link g-" + d.target.party; })
      .attr("marker-end", function(d) { return "url(#g-arrowhead-" + d.target.party + ")"; });

  d3.transition(link.exit())
      .attr("d", function(d) { var p = findParent(d.target); return diagonal({source: p, target: p}); })
      .remove();

  d3.selectAll(".g-link")
      .sort(ascendingDepth);

  d3.transition(link)
      .attr("d", diagonal)
      .style("stroke-width", function(d) { return w(d.target.probability) + "px"; });
}

function updateNodes() {
  node = node.data(nodes.slice(1), function(d) { return d.key; })
      .each(function(d) { d.update = true; });

  var nodeExit = d3.transition(node.exit())
      .attr("class", function(d) { return "g-node g-" + d.party; })
      .attr("transform", function(d) { var p = findParent(d); return "translate(" + p.x + "," + y(p.depth) + ")"; })
      .remove();

  var nodeEnter = node.enter().insert("g", ".g-scoreboard")
      .attr("class", function(d) { return "g-node g-" + d.party; })
      .attr("transform", function(d) { var p = findOldParent(d); return "translate(" + p.x + "," + y(p.depth) + ")"; });

  d3.transition(node)
      .attr("class", function(d) { return "g-node g-" + d.party + (d.depth === 1 ? " g-first" : ""); })
      .attr("transform", function(d) { return "translate(" + d.x + "," + y(d.depth) + ")"; });

  updateLabels(nodeEnter, nodeExit);
  updateLeaves(nodeEnter, nodeExit);
}

function updateLabels(nodeEnter, nodeExit) {
  var textEnter = nodeEnter.append("text").classed("g-label", true).attr("y", -6);
  textEnter.append("tspan").attr("class", "g-label-line1");
  textEnter.append("tspan").attr("class", "g-label-line2").attr("x", 0).attr("dy", ".71em");

  node.select(".g-label-line1")
      .attr("y", function(d) { return d.children ? null : -radius(d.depth) - 3; })
      .text(function(d) {
        var firstOfParty = true, p = d.parent;

        while (p && p.parent && firstOfParty) {
          if (p.party === d.party) firstOfParty = false;
          p = p.parent;
        }

        return firstOfParty ? "If " + formatCandidate[d.party] + " wins " + d.state.name + "\u2026"
            : d.children ? " " + d.state.abbreviation + ","
            : " and " + d.state.abbreviation + ",";
      });

  node.select(".g-label-line2")
      .attr("y", function(d) { return radius(d.depth) + 3; })
      .text(function(d) {
        return d.children ? null : (d.demvotes === d.repvotes ? " the candidates tie." : formatCandidate[d.party] + " wins.");
      });
}

function updateLeaves(nodeEnter, nodeExit) {
  var leaf = node.selectAll(".g-leaf")
      .data(function(d) { return d.children ? [] : [d]; });

  var leafEnter = leaf.enter().insert("g", "text")
      .attr("class", function(d) { return "g-leaf" + (d.demvotes === d.repvotes ? " g-tie" : ""); })
      .attr("transform", "scale(0)");

  leafEnter.append("circle")
      .attr("r", 50);

  leafEnter.append("path")
      .attr("class", "g-check")
      .attr("transform", "translate(-8,16)")
      .attr("d", "M-20,-20L0,0L38,-38");

  d3.transition(leaf.exit())
      .attr("transform", "scale(0)")
      .remove();

  nodeExit.select(".g-leaf")
      .attr("transform", "scale(0)");

  d3.transition(leaf)
      .attr("transform", function(d) { return "scale(" + radius(d.depth) + ")scale(.02)"; });
}

function updateVoronoi() {
  svg.select(".g-voronoi").remove();

  svg.append("g")
      .attr("class", "g-voronoi")
      .call(voronoi, nodes);
}

function updateScoreboard() {
  var demPaths = 0,
      repPaths = 0,
      tiePaths = 0;

  nodes.forEach(function(d) {
    if (!d.children) {
      var n = Math.pow(2, states.length - d.depth);
      if (d.demvotes > d.repvotes) demPaths += n;
      else if (d.repvotes > d.demvotes) repPaths += n;
      else tiePaths += n;
    }
  });

  //
  kicker.text("With " + formatNumber(states.length) + " state" + (states.length > 1 ? "s" : "") + " undecided:");
  scoreboard.select(".g-prefix.g-dem .g-score").text(demPaths);
  scoreboard.select(".g-prefix.g-dem .g-suffix").text(" way" + ((demPaths === 1) ? "" : "s") + " to win");
  scoreboard.select(".g-prefix.g-rep .g-score").text(repPaths);
  scoreboard.select(".g-prefix.g-rep .g-suffix").text(" way" + ((repPaths === 1) ? "" : "s") + " to win");
  scoreboard.select(".g-prefix.g-tie .g-score").text(tiePaths);
  scoreboard.select(".g-prefix.g-tie .g-suffix").text(" tie" + ((tiePaths === 1) ? "" : "s"));

  //
  var totalPaths = 1 << states.length;
  scoreboard.select(".g-dem.g-ratio").text(formatPercent(demPaths / totalPaths) + " of paths");
  scoreboard.select(".g-rep.g-ratio").text(formatPercent(repPaths / totalPaths) + " of paths");
  scoreboard.select(".g-tie.g-ratio").text(formatPercent(tiePaths / totalPaths) + " of paths");

  if (nodes.length === 1) {
    endAlert.select(".g-output").text(root.demvotes > root.repvotes ? "Obama would capture the White House."
      : root.demvotes < root.repvotes ? "Romney would capture the White House."
      : "the candidates would tie.");

    endAlert.transition().style("opacity", 1);
    if (root.demvotes > root.repvotes) {
      d3.select(".g-heads .g-dem").style("opacity", 1).style("left", "-100px");
      d3.select(".g-heads .g-rep").style("opacity", 0).style("left", "-100px");
    } else if (root.demvotes < root.repvotes) {
      d3.select(".g-heads .g-rep").style("opacity", 1).style("left", "-100px");
      d3.select(".g-heads .g-dem").style("opacity", 0).style("left", "-100px");
    } else {
      d3.select(".g-heads .g-dem").style("opacity", 1).style("left", "-220px");
      d3.select(".g-heads .g-rep").style("opacity", 1).style("left", "20px");
    }
  } else {
    endAlert.transition().style("opacity", 0);
    d3.select(".g-heads .g-dem").style("opacity", 0);
    d3.select(".g-heads .g-rep").style("opacity", 0);
  }
}

function reset() {
  controlButton.filter(function(d) { return d.outcome === d.state.enabledParty; }).each(change);
}

function change(view) {
  var key = view.state.id + "=" + view.outcome;

  if (view.state.enabledParty) {
    root[view.state.enabledParty + "votes"] -= view.state.votes;
    states.splice(bisect(states, view.state.index), 0, view.state);
  }

  var i = bisect(oldStates, view.state.index) + 1;

  if (view.outcome === view.state.enabledParty) {
    view.state.enabledParty = null;

    // Add the exiting state to nodes below.
    nodes.forEach(function(d) {
      if (d.depth >= i) d.key = d.key.split("&").concat(key).sort().join("&");
    });
  } else {
    if ((root[view.outcome + "votes"] += view.state.votes) >= 270) root.party = view.outcome;
    view.state.enabledParty = view.outcome;
    states.splice(states.indexOf(view.state), 1);

    // Remove the entering state from nodes below.
    var k = new RegExp("&" + key + "|" + key + "&");
    nodes.forEach(function(d) {
      if (d.depth > i) d.key = d.key.replace(k, "");
    });
  }
}

function transition() {
  controlButton.classed("g-active", function(d) { return d.state.enabledParty === d.outcome; });
  resetButton.style("display", allStates.some(function(d) { return d.enabledParty; }) ? "block" : "none");

  // Old node positions indexed by new key are needed for enter transitions.
  oldNodesByKey = {};
  nodes.forEach(function(d) { oldNodesByKey[d.key] = d; });

  mouseout();
  d3.transition().duration(d3.event && d3.event.altKey ? 7500 : 750).each(update);

  // The previous states are needed when multiple changes are made pre-transition.
  oldStates = states.slice();
}

function click(d) {
  var p = d.parent;
  while (p) {
    if (p.parent === root) { d = p; break; }
    p = p.parent;
  }
  if (d !== root) {
    change({state: d.state, outcome: d.party});
    transition();
  }
}

function mouseover(d) {
  activate(activeOutcome = d, true);
  svg.attr("class", "g-" + d.party);
  node.filter(function(d) { return d.active; }).classed("g-active", true);
  link.filter(function(d) { return d.target.active; }).classed("g-active", true).attr("marker-end", function(d) { return "url(#g-arrowhead-" + d.target.party + "-active)"; });
  state.attr("class", function(d) { return "g-state" + (d.activeParty ? " g-" + d.activeParty : ""); });
}

function mouseout() {
  node.filter(function(d) { return d.active; }).classed("g-active", false);
  link.filter(function(d) { return d.target.active; }).classed("g-active", false).attr("marker-end", function(d) { return "url(#g-arrowhead-" + d.target.party + ")"; });
  state.attr("class", "g-state");
  if (activeOutcome) {
    activate(activeOutcome, false);
    activeOutcome = null;
  }
}

function activate(d, active) {
  d.active = active;
  d.state.activeParty = active ? d.party : null;
  d.parent && activate(d.parent, active);
}

function voronoi(g, nodes) {
  nodes = nodes.filter(function(d) { return !d.children; });

  var x0 = -margin.left, y0 = 0,
      x1 = width + margin.right, y1 = height + margin.left,
      xy = d3.geom.polygon([[x0, y0], [x0, y1], [x1, y1], [x1, y0]]);

  var path = g.selectAll("path")
      .data(d3.geom.voronoi(nodes.map(function(d) { return [d.x, y(d.depth)]; })));

  path.enter().append("path")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("mousedown", function() { d3.event.preventDefault(); })
      .on("dblclick", click);

  path.attr("d", function(d) { return "M" + xy.clip(d).join("L") + "Z"; })
      .datum(function(d, i) { return nodes[i]; });

  path.exit().remove();
}

function key(d) {
  if (!d.parent) return "_root";
  var k = [], p = d;
  while (p && p.party) k.push(p.state.id + "=" + p.party), p = p.parent;
  return k.sort().join("&");
}

function findParent(d) {
  var p = d.parent;
  while (p) {
    if ((d = nodesByKey[p.key]) && d.update) return d;
    p = p.parent;
  }
  return root;
}

function findOldParent(d) {
  var p = findParent(d);
  return oldNodesByKey ? oldNodesByKey[p.key] : p;
}

function ascendingDepth(b, a) {
  return a.target.depth - b.target.depth;
}

function radius(depth) {
  return Math.pow(2, 5.8 - depth / 2);
}

function diagonal(d) {
  var x0 = d.source.x, y0 = y(d.source.depth),
      x1 = d.target.x, y1 = y(d.target.depth);
  if (x0 < x1) x0 += w(d.target.probability) / 2;
  else if (x0 > x1) x0 -= w(d.target.probability) / 2;
  return "M" + x0 + "," + y0
      + "C" + x0 + "," + (y0 + y1) / 2
      + "," + x1 + "," + (y0 + y1) / 2
      + "," + x1 + "," + y1;
}

})();
