var w = 960,
    h = 500,
    fill = d3.scale.category20();

var vis = d3.select("#chart")
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h);

d3.json("miserables.json", function(json) {
  var force = d3.layout.force()
      .nodes(json.nodes)
      .links(json.links)
      .size([w, h])
      .start();

  var link = vis.selectAll("line.link")
      .data(json.links)
    .enter().append("svg:line")
      .attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
    
  var node = vis.selectAll("circle.node")
        .data(json.nodes)
        .enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return d.level*5; })
        .style("fill", function(d) { return fill(d.group); })
        .call(force.drag);
        
//     var p = node.enter().append("svg:text")
//         .text(function(d){ return d.name; });
        
  var text = vis.selectAll("text.node")
     .data(json.nodes)
     .enter().append("svg:text")
        .attr("class", "txt")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .text(function(d){ return d.name; })
        .call(force.drag);
         
  vis.attr("opacity", 0)
    .transition()
      .duration(1000)
      .attr("opacity", 1);

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    
    text.attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
  });
});
