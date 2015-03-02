(function() {
  //http://stackoverflow.com/a/901144/678708
  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regexS = "[\\?&]" + name + "=([^&#]*)";
      var regex = new RegExp(regexS);
      var results = regex.exec(parent.window.location.href);
      if(results == null) {
        return "";
      } else {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
      }
  }

  ENV = { RAISE_ON_DEPRECATION: true }

  App = Em.Application.create({
    ready: function() {
      $("textarea.steppable,input.steppable[type=text]").live('keydown mousewheel', function(e){
        if (event.which == 38 || event.which == 40 || event.type == 'mousewheel') {
          e.preventDefault();
          var val = $(this).val();
          var cursorIndex = $(this).caret().start;
          var cursorString = [val.slice(0, cursorIndex), 'CURSOR', val.slice(cursorIndex)].join('');
          var re = /(-?\d*)CURSOR\s*(-?\d*)/g
          var matches = re.exec(cursorString);
          var number = 1
          if(event.altKey) number *= 10
          if(event.ctrlKey) number *= 10
          if(event.shiftKey) number *= 10
          var result = parseInt(matches[1] + matches[2]) + (event.which == 40 || event.wheelDelta < 0 ? -number : number);
          if(!isNaN(result)){
            $(this).val(cursorString.replace(re, result));
          }
          $(this).caret(matches.index, matches.index);
        }
      });

      $(window).resize(function () {
        App.graph.resize($(window).height(), $(window).width())
      });

      $("#charge").live('change', function() {
        App.graph.set('charge', $(this).val())
      })

      App.graph.svg = d3.select("#chart").append("svg:svg").attr("width", App.graph.width).attr("height", App.graph.height);

      this.initialize();
    },
    Router: Ember.Router.extend({
      //enableLogging: true,
      root: Ember.Route.extend({
        index: Ember.Route.extend({
          route: '/',
          connectOutlets: function(router, params) {
            router.transitionTo('paramsRoute', {
              lcfCode: lcfCode,
              animationSpeed: animationSpeed,
              freezeFrameAt: 0
            });
          },
          deserialize: function(router, params) {
            // TODO make root route work w/o globals
            if(getParameterByName('lcfCode') != '') {
              lcfCode = getParameterByName('lcfCode')
              animationSpeed = getParameterByName('animationSpeed')
              var freezeFrameAt = getParameterByName('lockVertices') == 1 ? 1 : 0
            } else {
              lcfCode = '[10]50'
              animationSpeed = App.animationSpeedsController.objectAt(1).speed
              var freezeFrameAt = 0
            }
            router.transitionTo('paramsRoute', {
              lcfCode: lcfCode,
              animationSpeed: animationSpeed,
              freezeFrameAt: freezeFrameAt
            });

            App.graph.lcfCode = lcfCode
            App.graph.animationSpeed = animationSpeed
            App.graph.freezeFrameAt = freezeFrameAt
            App.graph.redraw()
          }
        }),
        paramsRoute: Ember.Route.extend({
          route: '/:lcfCode/:animationSpeed/:freezeFrameAt',
          moveElsewhere: Ember.Route.transitionTo('paramsRoute'),
          deserialize: function(router, params) {
            App.graph.lcfCode = params.lcfCode
            App.graph.animationSpeed = params.animationSpeed
            App.graph.freezeFrameAt = params.freezeFrameAt
            App.graph.redraw()

            return params
          },
          serialize: function(router, context) {
            return {
              lcfCode: context.lcfCode,
              animationSpeed: context.animationSpeed,
              freezeFrameAt: context.freezeFrameAt
            }
          },
          random: Ember.Route.transitionTo('paramsRoute')
        })
      })
    }),

    ApplicationView: Ember.View.extend({
      templateName: 'application',
      showPermalink: function() {
        App.controls.set('showPermalink', !App.controls.get('showPermalink'))
      },
      redraw: function() {
        App.graph.redraw()
      },
      prevFrame: function() {
        if(App.graph.get('prevFrame') <= 0) return
          App.graph.set('freezeFrameAt', App.graph.get('prevFrame'))
      },
      nextFrame: function() {
        // don't use set so graph observer isn't alerted 
        App.graph.freezeFrameAt = App.graph.get('nextFrame')

        App.get('router').send('moveElsewhere', {
          lcfCode: App.graph.get('lcfCode'),
          animationSpeed: App.graph.get('animationSpeed'),
          freezeFrameAt: App.graph.get('nextFrame')
        })
        App.graph.force.start()
        App.graph.force.tick()
        App.graph.force.stop()
      },
      random: function() {
        function randomBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
        var min_step = -100
        var max_step = 100
        var num_steps = randomBetween(1, 50)
        var max_repeats = 25
        var arr = []
        for (i = 0; i < num_steps; i++) {
          arr.push(randomBetween(min_step, max_step))
        }
        App.graph.set('lcfCode', '['+arr.join(',')+']'+(randomBetween(1, max_repeats)))
      },
      fullscreen: function() {
        window.open(window.location.href)
      }
    }),
    ApplicationController: Ember.Controller.extend({
    })
  });

  App.controls = Em.Object.create({
    lcfCodeError: null,
    showPermalink: false,
    isFullscreen: window.location == window.parent.location,
    permalink: function() {
      return window.location.href
    }.property('App.graph.lcfCode', 'App.graph.animationSpeed', 'App.graph.freezeFrame'),
  });

  App.lcfCodeObject = Ember.Object.extend({
    lcfCode: null,
    init: function() {
      this._super()
      this.steps = []
      this.edges = []
      this.numVertices = 0
      this.numRepeats = 0
      this.parse()
    },
    parse: function() {
      this.lcfCode = this.lcfCode.replace(/ /g,"").replace(/−/g,"-")
      // TODO validate repeats and steps also match repeats
      var match = this.lcfCode.match(/\[(.*?)\]/)
      if(match == null) throw "Invalid Syntax"

        if(match[1] != "") {
          this.steps = match[1].split(',').filter(Number).map(function(e) {return +e});
        } else {
          throw "Must have at least one step"
        }
        this.numRepeats = parseInt(this.lcfCode.split(']')[1]) || 0
        if(this.numRepeats < 0) throw "Repeats must be positive"
          this.numVertices = this.steps.length * (this.numRepeats || 1)

        var numSteps = this.steps.length
        var dupCache = {}
        for(var vertex=0; vertex<this.numVertices; vertex++){
          var source = vertex % this.numVertices
          var target = (this.numVertices+vertex+this.steps[vertex % numSteps]) % this.numVertices
          var hp_target = (source + 1) % this.numVertices
          if(target < 0) target = this.numVertices + target

            // hamiltonian path
            if (!dupCache[source+','+hp_target] && !dupCache[hp_target+','+source]) {
              this.edges.push({source: source, target: hp_target});
              dupCache[source+','+hp_target] = 1
            }

            if (!dupCache[source+','+target] && !dupCache[target+','+source]) {
              this.edges.push({source: source, target: target});
              dupCache[source+','+target] = 1
            }
        }
    },
  });

  App.graph = Ember.Object.create({
    init: function() {
      this._super();

      this.width =  $(window).width()
      this.height = $(window).height()
      this.rcx = this.width/2 + 110
      this.rcy = this.height/2
      this.radius = 240
      this.numEdges = 0
      this.numVertices = 0
      this.colors = d3.scale.category10().range()
      this.nodes = [] // the node with index 0 is fixed to the center and has a high charge
      this.links = []
      this.lcfStepsAndRepeats = []
      this.lcfEdges = null
      this.animationSpeed = 0
      this.freezeFrameAt = 0
      this.currentFrame = 0
      this.charge = 100
      this.interval = null

      this.force = d3.layout.force().charge(function(d, i) {
        return i == 0 ? 0 : -App.graph.get('charge')
      }).size([this.rcx*2, this.height]);

      //TODO
      this.force.on("tick", function(e) {
        var graph = App.graph
        if(graph.get('currentFrame') == graph.get('freezeFrameAt')) {
          graph.force.stop()
          return
        }

        graph.svg.selectAll("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

        graph.svg.selectAll("line.link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

        //this line causes metamorph problems
        graph.set('currentFrame', graph.get('currentFrame') + 1)
      });
    },
    isFrozen: function() {
      return this.get('freezeFrameAt') > 0
    }.property('freezeFrameAt'),
    resize: function(height, width){
      this.svg.attr('height', height).attr('width', width)
      this.set('height', height)
      this.set('width', width)
      this.set('rcx', width/2 + 110)
      this.set('rcy', height/2)
      this.force.size([this.rcx*2, height]);
      this.redraw()
    },
    prevFrame: function() {
      return this.get('currentFrame') - 1
    }.property('currentFrame'),
    nextFrame: function() {
      return this.get('currentFrame') + 1
    }.property('currentFrame'),
    draw: function(lcfCodeObject){
      numVertices = lcfCodeObject.numVertices
      stepsArray = lcfCodeObject.steps
      var numRepeats = lcfCodeObject.numRepeats
      var lcfEdges = lcfCodeObject.edges

      if(numVertices + lcfEdges.length > 50000){
        if(!confirm(lcfEdges.length+' edges and '+numVertices+' vertices will be drawn. Continue?')) {
          return
        }
      }

      this.setProperties({
        numVertices: numVertices,
        numEdges: lcfEdges.length
      })

      var graph = App.graph
      clearInterval(this.interval)

      // magic vertex
      this.nodes = [{fixed: true, x: this.rcx, y: this.rcy}]
      // arrange nodes in a circle
      this.nodes = this.nodes.concat(d3.range(numVertices).map(function(d, i) {
        return {
          x: App.graph.rcx+App.graph.radius*Math.cos((i*2*Math.PI/numVertices) - Math.PI/2),
          y: App.graph.rcy+App.graph.radius*Math.sin((i*2*Math.PI/numVertices) - Math.PI/2)
        }
      }))

      this.links = []

      this.currentVertex = 0
      this.currentVertexOffset = 0

      this.force.nodes(this.nodes)
      this.force.start()
      if(this.get('animationSpeed') == 0){
        this.svg.selectAll(".vertex").style("fill", this.colors[0])
        var nodes = this.nodes.slice(1)
        lcfEdges.forEach(function(edge, i) {
          graph.links.push({source: nodes[edge.source], target: nodes[edge.target]}); 
        });
        this.drawLines()
        this.force.links(this.links)
        this.force.start()
      }else{
        // hamiltonian path
        this.nodes.slice(1).forEach(function(target, i) {
          App.graph.links.push({source: App.graph.nodes[i == App.graph.nodes.length - 2 ? 1 : i+2], target: target, linkDistance: 0})
        });
        this.svg.selectAll(".vertex").style("fill", "white")
        this.drawLines()
        this.interval = setTimeout(this.animateLcf, this.get('animationSpeed'))
      }
      // drawn last so it has the highest z-index
      this.drawCircles()
    },
    animateLcf: function() {
      var graph = App.graph
      var stepInstruction = stepsArray[graph.currentVertex % stepsArray.length]
      graph.currentStep = (graph.currentVertex + graph.currentVertexOffset) - numVertices * Math.floor((graph.currentVertex + graph.currentVertexOffset) / numVertices)
      var circles = graph.svg.selectAll(".vertex")
      if(graph.currentVertexOffset == 0){
        circles.filter(function(d,i){return graph.currentVertex == i}).style("fill", graph.colors[2])
        circles.filter(function(d,i){return graph.currentVertex > i}).style("fill", graph.colors[0])
        circles.filter(function(d,i){return graph.currentVertex < i}).style("fill","white")
        graph.currentVertexOffset += (stepInstruction > 0 ? 1 : -1);
      }else if(graph.currentVertexOffset != stepInstruction){
        circles.filter(function(d,i){return graph.currentStep == i}).style("fill", graph.colors[1])
        graph.currentVertexOffset += (stepInstruction > 0 ? 1 : -1)
      }else{
        circles.filter(function(d,i){return graph.currentStep == i}).style("fill", graph.colors[1])
        graph.links.push({source: graph.nodes.slice(1)[graph.currentVertex], target: graph.nodes.slice(1)[graph.currentStep]});
        graph.drawLines()
        graph.currentVertex++
        graph.currentVertexOffset = 0;
      }
      if(graph.currentVertex != numVertices){
        graph.interval = setTimeout(function(){ App.graph.animateLcf() }, App.graph.get('animationSpeed'));
      } else {
        graph.interval = null
        graph.svg.selectAll(".vertex").style("fill", graph.colors[0])
      }
      graph.force.links(graph.links)
      graph.force.start()
    },
    drawCircles: function() {
      var circles = this.svg.selectAll("circle")
      .data(this.nodes)
      circles.enter()
      .append("svg:circle")
      circles.attr("r", function(d, i) { return i == 0 ? 0 : 5 })
      .attr("class", function(d, i) { return i == 0 ? 'magic-vertex' : 'vertex' })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .call(this.force.drag);
      circles.exit().remove();
    },
    drawLines: function(){
      var lines = this.svg.selectAll("line.link")
      .data(this.links)
      lines.enter()
      .append("svg:line")
      lines.attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
      lines.exit().remove()
    },
    redraw: function() {
      App.graph.set('currentFrame', 1)
      try {
        App.controls.set('lcfCodeError', null)
        var lcfCodeObject = App.lcfCodeObject.create({ lcfCode: this.get('lcfCode') });
        this.draw(lcfCodeObject)
      } catch(error) {
        App.controls.set('lcfCodeError', error)
      }
      App.get('router').transitionTo('paramsRoute', {
        lcfCode: this.get('lcfCode'),
        animationSpeed: this.get('animationSpeed'),
        freezeFrameAt: this.get('freezeFrameAt')
      });
    }.observes('lcfCode', 'animationSpeed', 'charge', 'freezeFrameAt')
  });

  App.lcfCodesController = Ember.ArrayController.create({
    content: Ember.A([ { code: '[2]4', name: 'Tetrahedral graph' }, { code: '[3]6', name: 'Utility graph' }, { code: '[3,-3]4', name: 'Cubical graph' }, { code: '[4]8', name: 'Wagner graph' }, { code: '[6,4,-4]4', name: 'Bidiakis cube' }, { code: '[5,-5]6', name: 'Franklin graph' }, { code: '[-5,-2,-4,2,5,-2,2,5,-2,-5,4,2]', name: 'Frucht graph' }, { code: '[2,6,-2]4', name: 'Truncated tetrahedral graph' }, { code: '[5,-5]7', name: 'Heawood graph' }, { code: '[5,-5]8', name: 'Mobius-Kantor graph' }, { code: '[5,7,-7,7,-7,-5]3', name: 'Pappus graph' }, { code: '[5,-5,9,-9]5', name: 'Desargues graph' }, { code: '[10,7,4,-4,-7,10,-4,7,-7,4]2', name: 'Dodecahedral graph' }, { code: '[12,7,-7]8', name: 'McGee graph' }, { code: '[2,9,-2,2,-9,-2]4', name: 'Truncated cubical graph' }, { code: '[3,-7,7,-3]6', name: 'Truncated octahedral graph' }, { code: '[5,-9,7,-7,9,-5]4', name: 'Nauru graph' }, { code: '[-7,7]13', name: 'F26A graph' }, { code: '[-13,-9,7,-7,9,13]5', name: 'Tutte–Coxeter graph' }, { code: '[5,-5,13,-13]8', name: 'Dyck graph' }, { code: '[-25,7,-7,13,-13,25]9', name: 'Gray graph' }, { code: '[30,-2,2,21,-2,2,12,-2,2,-12,-2,2,-21,-2,2,30,-2,2,-12,-2,2,21,-2,2,-21,-2,2,12,-2,2]2', name: 'Truncated dodecahedral graph' }, { code: '[-29,-19,-13,13,21,-27,27,33,-13,13,19,-21,-33,29]5', name: 'Harries graph' }, { code: '[9,25,31,-17,17,33,9,-29,-15,-9,9,25,-25,29,17,-9,9,-27,35,-9,9,-17,21,27,-29,-9,-25,13,19,-9,-33,-17,19,-31,27,11,-25,29,-33,13,-13,21,-29,-21,25,9,-11,-19,29,9,-27,-19,-13,-35,-9,9,17,25,-9,9,27,-27,-21,15,-9,29,-29,33,-9,-25]', name: 'Harries–Wong graph' }, { code: '[-9,-25,-19,29,13,35,-13,-29,19,25,9,-29,29,17,33,21,9,-13,-31,-9,25,17,9,-31,27,-9,17,-19,-29,27,-17,-9,-29,33,-25,25,-21,17,-17,29,35,-29,17,-17,21,-25,25,-33,29,9,17,-27,29,19,-17,9,-27,31,-9,-17,-25,9,31,13,-9,-21,-33,-17,-29,29]', name: 'Balaban 10-cage' }, { code: '[17,-9,37,-37,9,-17]15', name: 'Foster graph' }, { code: '[16,24,-38,17,34,48,-19,41,-35,47,-20,34,-36,21,14,48,-16,-36,-43,28,-17,21,29,-43,46,-24,28,-38,-14,-50,-45,21,8,27,-21,20,-37,39,-34,-44,-8,38,-21,25,15,-34,18,-28,-41,36,8,-29,-21,-48,-28,-20,-47,14,-8,-15,-27,38,24,-48,-18,25,38,31,-25,24,-46,-14,28,11,21,35,-39,43,36,-38,14,50,43,36,-11,-36,-24,45,8,19,-25,38,20,-24,-14,-21,-8,44,-31,-38,-28,37]', name: 'Biggs-Smith graph' }, { code: '[44,26,-47,-15,35,-39,11,-27,38,-37,43,14,28,51,-29,-16,41,-11,-26,15,22,-51,-35,36,52,-14,-33,-26,-46,52,26,16,43,33,-15,17,-53,23,-42,-35,-28,30,-22,45,-44,16,-38,-16,50,-55,20,28,-17,-43,47,34,-26,-41,11,-36,-23,-16,41,17,-51,26,-33,47,17,-11,-20,-30,21,29,36,-43,-52,10,39,-28,-17,-52,51,26,37,-17,10,-10,-45,-34,17,-26,27,-21,46,53,-10,29,-50,35,15,-47,-29,-41,26,33,55,-17,42,-26,-36,16]', name: 'Balaban 11-cage' }, { code: '[47,-23,-31,39,25,-21,-31,-41,25,15,29,-41,-19,15,-49,33,39,-35,-21,17,-33,49,41,31,-15,-29,41,31,-15,-25,21,31,-51,-25,23,9,-17,51,35,-29,21,-51,-39,33,-9,-51,51,-47,-33,19,51,-21,29,21,-31,-39]2', name: 'Ljubljana graph' }, { code: '[17,27,-13,-59,-35,35,-11,13,-53,53,-27,21,57,11,-21,-57,59,-17]7', name: 'Tutte 12-cage' } ]),
    selectedChange: function(event) {
      if(event.selected != null && event.selected != App.graph.get('lcfCode')){
        App.graph.set('lcfCode', event.selected)
      }
    }.observes('selected')
  });

  App.ApplicationView.lcfCodes = Ember.Select.extend({
    contentBinding: "App.lcfCodesController",
    optionLabelPath: "content.name",
    optionValuePath: "content.code",
    valueBinding: "App.lcfCodesController.selected",
    prompt: " "
  })

  App.ApplicationView.lcfCode = Ember.TextArea.extend({
    rows: "5",
    classNames: ['steppable'],
    valueBinding: 'App.graph.lcfCode',
    // TODO respond to mousewheel
    valueChanged: function(event) {
      if($.inArray(event.keyCode, [9, 17, 18, 32, 37, 39, 188]) == -1) {
        App.lcfCodesController.set('selected', event.value)
      }
    }.observes('value')
  })

  App.animationSpeedsController = Ember.ArrayController.create({
    content: Ember.A([ { speed: '0', name: 'Instant' }, { speed: '1', name: 'Fast' }, { speed: '100', name: 'Slow' } ]),
  });

  App.ApplicationView.animationSpeeds = Ember.Select.extend({
    contentBinding: "App.animationSpeedsController",
    optionLabelPath: "content.name",
    optionValuePath: "content.speed",
    valueBinding: "App.graph.animationSpeed",
    valueChange: function(event) {
      if(App.graph.get('freezeFrameAt') != 0 && event.selection != null && event.selection != App.animationSpeedsController.objectAt(0)){
        $('.freezeFrameCheckbox').trigger('click')
      }
    }.observes('value')
  })

  App.ApplicationView.freezeFrame = Ember.Checkbox.extend({
    classNames: ['freezeFrameCheckbox'],
    init: function() {
      this._super();
      Ember.set(this, 'checked', App.graph.get('freezeFrameAt') != 0);
    },
    checkedChange: function(event) {
      if(event.checked) {
        App.graph.set('animationSpeed', App.animationSpeedsController.objectAt(0).speed)
        if(App.graph.get('freezeFrameAt') == 0) {
          App.graph.set('freezeFrameAt', 1)
        }
      } else {
        App.graph.set('freezeFrameAt', 0)
      }
    }.observes('checked')
  })
})();
