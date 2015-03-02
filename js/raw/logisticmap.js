var logistic = function(){          
      var t = 400;
      var runs = 400;
      var run = 1;
      var seed = Math.random();
      var output = [];
      while (run < runs) {            
            var seed = 0.5;
            var map = [seed];
            var r = run/100;
            if (r < 1) {
                type = "Population dies";
            } else if (r < 2) {
                type = "Population approaches (r-1)/r";
            }else if (r < 3) {
                type = "Population fluctuates and approaches (r-1)/r";
            } else if (r < 3.44949) {
                type = "Permanent oscillation between two values";
            }  else if (r < 3.54409) {
                type = "Permanent oscillation between four values";
            } else if (r < 3.54409) {
                type = "Permanent oscillation between four values";
            }  else {
                type = "Chaos";
            }
            for (i = 0; i < t; i++){ 
                  var x=r*map[i]*(1-map[i]).toFixed(5);
                  map.push(x);            
                  output.push({"r":r,"seed":seed,"x":map[i+1],"type":type});            
            }           
            //console.log(map);
      run++;      
      }
      return output;
}

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category20c();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tooltip = d3.select("body").append("div")
    .attr("class", "tip-d3")
    .style("opacity", 0);

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var data = logistic();


  x.domain(d3.extent(data, function(d) { return d.r; })).nice();
  y.domain(d3.extent(data, function(d) { return d.x; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -10)
      .style("text-anchor", "end")
      .text("r");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("x")

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 1)
      .attr("cx", function(d) { return x(d.r); })
      .attr("cy", function(d) { return y(d.x); })
      .style("fill", function(d) { return color(d.type); })
      .on("mouseover", function(d,i) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("Type: " + d.type 
              + "<br/> Coordenates(r,x): (" + d.r  + ", " +d.x.toFixed(2) + ")"
              + "<br/> Population seed: " + d.seed.toFixed(2)
              +"<br/> Datapoint: "+ i)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  var legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(-850," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width + 10)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "right")
      .text(function(d) { return d; });