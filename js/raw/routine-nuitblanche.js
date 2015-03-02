// this is the example model: 
// initially, 42% countries of the world are not free, 32% are partly free, 26% are free
// at the end of each decade, 
// 5% not free and 10% partly free become free
// 5% free and 15% not free become partly free
// 10% partly free become not free

var w=960,h=520,root=d3.select("#chart").append("svg").attr({width:w,height:h});
root.append("defs").append("clipPath").attr("id","frame").append("rect").attr({x:-5,y:-5,width:510,height:510,rx:5,ry:5});
var svg=root.append("g").attr("transform","translate(25,10)").style("visibility","hidden");
var legend=d3.select("#legend").append("svg").attr({width:w,height:100});
root.append("text").text("Preparing model...").attr("id","killme");
var params={};
var paramNames=["night","duration","nbPeople","stepAvg","stepStd","timePerVisit","nbAttractions","o","minCap","maxCap"];
var wCity=500,hCity=500;
var tickPerDecision=1000 // deprecated
var cScale=d3.scale.linear().range(["#ccc","blue","black"]);

var tick=0;
var hood=false;
var statuses=[],monitoring=[],visitStats=[];
var total=[];



var people=[]; 
var install=[]; 
var indexInstall=0,indexPeople=0;

reset();
makeLegend();

function reset() {

	console.log("reset.");
	readForm();
	d3.select("#success").html("");
	d3.selectAll("button").classed("active",0);
	running=0;
	tick=0;
	stop();
	indexPeople=-1;
	indexInstall=-1;
	people=[]; d3.range(params.nbPeople ).forEach(function() {people.push(generatePeople())});
	installs=[]; d3.range(params.nbAttractions ).forEach(function() {installs.push(generateInstall())});

	statuses=[
		{id:[0,1,6],status:"Moving"},
		{id:[3],status:"Waiting"},
		{id:[4],status:"Visiting"},
		{id:[8],status:"At home"}
	]


	total=[0,0,0];
	visitStats=d3.range(params.nbAttractions ).map(function(d) {return 0;})
	visitStats[0]=params.nbPeople ;

	monitoring=[[],[],[],[]];
	statusUpdate();
	drawGrid();
}


function readForm() {
	var h=location.hash.slice(1).split("&");
	var hash="#";

	if (h.length) {
		var myParams={};
		h.forEach(function (item) {
			item=item.split("=");
			if(item.length===2) {
				myParams[item[0]]=item[1];
			}
		})
		paramNames.forEach(function(id) {
			if(id in myParams&&(!(id in params))) { // meaning: it's in the hash, but not yet in the parameters... 
												   // in other words, once the page is loaded, the form takes precedence over the hash.
				console.log(id,myParams[id]);
				d3.select("#"+id).property("value",(id=="mode"?myParams[id]:+myParams[id]));
			}
		})

		if (myParams.lyak) {d3.select("#lyak").property("checked","true");}
		if (myParams.mode) {d3.select("#mode").property("checked","true");}

		if (myParams.small) { // special case, not accessible via form :) 
			params.small=true;
		}
 	}

	params.night=+d3.select("#night").property("value");
	params.duration=+d3.select("#duration").property("value");
	params.nbPeople =+d3.select("#nbPeople").property("value");
	params.step= +d3.select("#stepAvg").property("value");
	params.stepStd =+d3.select("#stepStd").property("value");
	params.timePerVisit =+d3.select("#timePerVisit").property("value");params.timePerVisitO=Math.round(params.timePerVisit /10);
	params.nbAttractions =+d3.select("#nbAttractions").property("value");cScale.domain([0,10,params.nbAttractions ]);
	params.o=+d3.select("#o").property("value");
	params.minCap =+d3.select("#minCap").property("value");
	params.maxCap =+d3.select("#maxCap").property("value");
	params.mode= d3.select("#mode").property("checked");

	
	d3.select("#night").on("change",reset);
	d3.select("#duration").on("change",reset);
	d3.select("#nbPeople").on("change",reset);
	d3.select("#stepAvg").on("change",reset);
	d3.select("#stepStd").on("change",reset);
	d3.select("#timePerVisit").on("change",reset);
	d3.select("#nbAttractions").on("change",reset);
	d3.select("#o").on("change",reset);
	d3.select("#minCap").on("change",reset);
	d3.select("#maxCap").on("change",reset);
	d3.select("#mode").on("change",reset);


	d3.select("#changeSettings").style("display",function() {return hood?"block":"none";})
	d3.select("#switchSettings").on("click",function() {
		hood=!hood;
		d3.select("#changeSettings").style("display",function() {return hood?"block":"none";})
		d3.select(this).html(hood?"Click to hide model settings":"Under the hood"); 
	})  

	params.lyak=  d3.select("#lyak").property("checked");
	d3.select("#lyak").on("change",reset);
	
	d3.select("#run").on("click",function() {run(params.lyak) ;})

	d3.select("#stop").on("click",stop)
	d3.select("#reset").on("click",reset)

	d3.keys(params).forEach(function(param,i) {hash=hash+(i?"&":"")+param+"="+params[param];})
	location.hash=hash;

}

function makeLegend() {
	if(!params.small){
	legend.append("text").classed("dashtitle",1).text("Legend:").attr("y",15);
	legend.append("text").text("Installations:").attr("y",60);
	legend.append("circle").attr({cx:125,cy:57,r:18}).style({fill:"none",stroke:"#ccc","stroke-opacity":.5});
	legend.append("circle").attr({cx:125,cy:57,r:12.72}).style({fill:"darkgreen",stroke:"none","fill-opacity":.5});
	legend.append("text").text("size = capacity").attr({x:125,y:25,"text-anchor":"middle"}).style("font-size","10px");
	legend.append("text").text("size/color = # of visitors").attr({x:125,y:95,"text-anchor":"middle"}).style("font-size","10px");
	legend.append("circle").attr({cx:225,cy:57,r:25.45}).style({"fill":"red",stroke:"none","fill-opacity":.5});
	legend.append("circle").attr({cx:225,cy:57,r:18}).style({"fill":"none",stroke:"#ccc","stroke-opacity":.5});
	legend.append("text").text("over capacity").attr({x:225,y:25,"text-anchor":"middle"}).style("font-size","10px");
	legend.append("text").text("(queuing)").attr({x:225,y:95,"text-anchor":"middle"}).style("font-size","10px");
	legend.append("rect").attr({x:325,y:54.5,height:5,width:5}).style({fill:"black"})
	legend.append("text").text("can be seen from outside").attr({x:325,y:25,"text-anchor":"middle"}).style("font-size","10px");
	legend.append("text").text("(no queue)").attr({x:325,y:95,"text-anchor":"middle"}).style("font-size","10px");
	legend.append("text").text("Visitors:").attr({x:395,y:60})
	legend.selectAll("dots").data(d3.range(8)).enter().append("circle").attr({cx:function(d) {return 460+10*d;},cy:57,r:2})
	.style({"fill":
		d3.scale.linear().range(["#ccc","blue","black"]).domain([0,3,10])
	,stroke:"none",opacity:.5})
	legend.append("text").text("bluer with every visit").attr({x:490,y:95,"text-anchor":"middle"}).style("font-size","10px");
	}

}

function generatePeople() {
	var x=Math.random()*wCity,
		y=Math.random()*hCity,
		start=d3.max([0,(norm()-.5)])*params.night*.3,
		end=d3.min([params.night,start+(.2+norm())*params.night]),
		r=~~(255*norm()),g=~~(255*norm()),b=~~(255*norm()),gr=~~((r+g+b)/3),
		color="#ccc";//rgb(0,0,"+b+")";
		if(!params.mode) {start=0;end=params.night;}

		indexPeople=indexPeople+1;
		return {status:(start>0)?8:0, // if this person's starting point is after the start of the night their initial status is at hom
				active:(start>0)?false:true, // ditto
				visible:(start>0)?"hidden":"visible",
				homex:x,
				homey:y,
				r:r,g:g,b:b,gr:gr,
				x:x,
				y:y,
				start:start,
				end:end,
				destx:x,
				desty:y,
				stepx:x,
				stepy:y,
				speed:.8*params.step+ .4*params.step* norm(),
				steps:0,
				tickPerDecision:~~(.8+.4*norm())*tickPerDecision,
				destination:-1,
				nbVisited:0,
				timeInInstall:0,
				color:color,visited:d3.range(params.nbAttractions ).map(function() {return 0;}),
				id:indexPeople
			};
}

function generateInstall() {
	var posx=Math.random()*wCity,
		posy=Math.random()*hCity,
		outside=Math.random()<params.o,
		capacity=params.minCap +Math.random()*(params.maxCap -params.minCap ),
		occupancy=0;
		visited=0;
		indexInstall=indexInstall+1;
		return {x:posx,visited:visited,y:posy,outside:outside,capacity:Math.round(capacity),occupancy:occupancy,line:[],id:indexInstall};
}


function norm() {
	return (Math.random()+Math.random()+Math.random())/3;
}

function stop() {
	if(!running&&tick){running=1;run(params.lyak) ;} // if paused, resume
	running=0;console.log("stop");
	if(typeof(timer)!=="undefined") {
	clearInterval(timer);
	timer=undefined;}
}


function statusUpdate() {
	statuses.forEach(function(s,i) {
		s.nb=people.filter(function(p) {return s.id.indexOf(p.status)>-1;}).length;
		monitoring[i].push(s.nb);
	});
}

function run(flag) {
	if(running&&flag!=params.lyak)  {reset();run(flag);}
	params.lyak= flag;
	if(!running&&tick){running=1;run(params.lyak) ;}
	if(running&&tick){stop();}
	d3.select("#run").classed("disabled",0)
	running=1;
	d3.select("#lyak").classed("active",flag);
	d3.select("#launch").classed("active",!flag);
	
	timer=setInterval(update, params.duration);

}

function dist(a,b) {
	// technically returns square of distance but since only used for comparing it's not worth throwing in a sqrt calculation
	return (a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y); 
}

function homeDist(p) {
	return Math.sqrt((p.x-p.homex)*(p.x-p.homex)+(p.y-p.homey)*(p.y-p.homey));
	// distance to home
}

function update() {
	tick=tick+1;

	installs.forEach(function(i) {
		if(!i.outside) {
			if(i.occupancy<i.capacity) { // some room, finally!
				//console.log(d3.min([i.capacity-i.occupancy, i.line.length]))
				d3.range(d3.min([i.capacity-i.occupancy, i.line.length])).forEach(function(j) { // we are going to let as many people as we can:
																							   // if the line is long enough, up to full capacity, else, everyone in the line
					p=people[i.line.shift()]; // first in, first out. 
					//console.log(p.id+" out of line of installation #"+i.id);
					p.status=4; // freed from line.
					i.occupancy=i.occupancy+1;
				})
			}
		}	
	})

	people.forEach(function(p) {
		if (tick>=p.start) { // it's not time until it's time.
			p.x=p.stepx;p.y=p.stepy; // each params.step  counts. If you moved last tick, it's updated here.
			if(!p.active&&tick<p.end) {
				p.active=true;
				p.status=0;
			}
			if(p.status===0) { // seeking installation to visit

				p.visible="visible";
				remainingAttr=installs.filter(function(d,j) {return !p.visited[j];}) // we compare the installations not yet seen
				if (params.lyak)  {
					remainingAttr.sort(function (i,j) {return (i.line.length)*params.timePerVisit /i.capacity+Math.sqrt(dist(p,i))/p.speed-Math.sqrt(dist(p,j))/p.speed-params.timePerVisit *(j.line.length)/j.capacity;})	
																										// line length taken into account for choice of attraction.
																										// calculation still naive, can be tweaked.	
				} else {
					remainingAttr.sort(function (i,j) {return dist(p,i)-dist(p,j);}) // line length not taken into account, only distance.
				}
				p.destination=remainingAttr[0].id;
				p.destx=installs[p.destination].x; // waypoint set
				p.desty=installs[p.destination].y;
				//console.log(p.id+ "set on destination "+p.destination);
				p.status=1; // now go
				if (params.lyak)  {
					var i=installs[p.destination];
					if ((i.line.length)*params.timePerVisit /i.capacity+Math.sqrt(dist(p,i))/p.speed+tick>p.end+homeDist(p)/p.speed) {
						p.status=6 // too late, fuck it: going home
						// this evaluation only works under the lyakunov model. for the naive model we'll add the test upon reaching the place.
					}
				}
				p.steps=0; // a new journey.
			}

			if(p.status===1) { // going towards an installation
				p.steps+=1;
				/*if(params.lyak& &!(p.params.step% p.tickPerDecision)) {
					// re eavaluating the closest destination every "tickPerDecision" steps.
					remainingAttr=installs.filter(function(d,j) {return !p.visited[j];})
					remainingAttr.sort(function (i,j) {return (i.line.length)*params.timePerVisit /i.capacity+Math.sqrt(dist(p,i))/p.speed-Math.sqrt(dist(p,j))/p.speed-params.timePerVisit *(j.line.length)/j.capacity;})	
					p.destination=remainingAttr[0].id;
					p.destx=installs[p.destination].x; 
					p.desty=installs[p.destination].y;
				}*/

				var d=Math.sqrt(dist(p, installs[p.destination])),
				px=p.x,dx=installs[p.destination].x,py=p.y,dy=installs[p.destination].y;
				//console.log(p.id+ "going towards installation "+p.destination);

				if (d<p.speed) { // the eagle has landed
					p.stepx=installs[p.destination].x;
					p.stepy=installs[p.destination].y;
					p.status=2; // now try to enter
				} else {
					p.stepx=px+(dx-px)*p.speed/d; // that could be handled by d3 scale but intuitively calculating by hand should be quicker
					p.stepy=py+(dy-py)*p.speed/d;
				}
			}

			if(p.status===2) { // trying to enter
				//console.log(p.id+" reached installation "+p.destination);
				p.visible="hidden";
				var i=installs[p.destination];
				if(i.occupancy<i.capacity || i.outside) { // and we're in! (or out, if an outside installation)
					p.status=4;
					i.occupancy=i.occupancy+1;
					p.timeInInstall=0;
					//console.log(p.id+" entered installation "+p.destination+" (visitor "+i.occupancy+"/"+i.capacity+")");
				} else { // line up, sucker
					if(i.line.length*params.timePerVisit /i.capacity+tick>p.end+homeDist(p)/p.speed) { // line too scary. 
																							   // note: this shouldn't be happening if under lyakunov hypothesis, 
																							   // by which we wouldn't have bothered going to find out it's going to be too long.
						p.status=6; // going home
					} else {
						p.status=3;
						i.line.push(p.id);	
					}
					 
				}
			}

			if(p.status===3) { // waiting in line
				// sucks to be you. 
				// for this model we consider that if you start waiting in line you are stuck there until you can get in. 
				// we may change that to : if line too long when you arrive, you select another attraction. we may.
			}

			if(p.status===4) { // enjoying the sight
				var i=installs[p.destination];
				p.timeInInstall=p.timeInInstall+1;
				if(p.timeInInstall>params.timePerVisit ||i.outside&&p.timeInInstall>params.timePerVisitO) { // time to go
					p.status=5; // what to do next?
					i.occupancy=i.occupancy-1;
					p.visited[i.id]=1;
					visitStats[p.nbVisited]=visitStats[p.nbVisited]-1;
					p.nbVisited=p.nbVisited+1; // another one down.
					visitStats[p.nbVisited]=visitStats[p.nbVisited]+1;
				}
			}

			if(p.status===5) { // shall we go try another one?
				//p.color="rgb("+p.r+",0,0)";
				var i=installs[p.destination];
				i.visited=i.visited+1;
				p.visible="visible";
				p.color=cScale(p.nbVisited);
				if (p.nbVisited===params.nbAttractions ) { // home run!
					p.status=6; // going home in style.
				} else {
					p.status=0; // back for more.
				}
			}

			if(p.status===6) { // going home
				var d=homeDist(p);
				//p.color="rgb(0,"+p.g+",0)";
				var px=p.x,py=p.y,hx=p.homex,hy=p.homey;
				if(d<p.speed) { // Home, bitches!
					p.stepx=p.homex;
					p.stepy=p.homey;
					p.status=7;
				} else {
					p.stepx=px+(hx-px)*(p.speed/d);
					p.stepy=py+(hy-py)*(p.speed/d);
				}
			}

			if(p.status===7) { // arriving home. 
				p.score=tick;
				p.visible="hidden";
				//p.color="rgb("+p.gr+","+p.gr+","+p.gr+")";
				p.status=8;
			}

			if(p.status===1||p.status===6){total[0]=total[0]+1;}
			if(p.status===3){total[1]=total[1]+1;}
			if(p.status===4){total[2]=total[2]+1;}

		}
	})
	

	// monitoring

	statusUpdate();


	// now draw the scene.
	draw();

	// until the end.
	if(tick>=params.night) {success();}
}

function success() {
	console.log("let's call it a night");
	d3.select("#success").html("The size of the circles is proportional to the number of visitors over the duration of the model.");
	stop();
	svg.selectAll(".people").transition().style("opacity",0).each("end",function() {d3.select(this).remove();})
	svg.selectAll(".install").select("circle").transition().style("opacity",0).each("end",function() {d3.select(this).remove();});
	svg.selectAll(".install").select("circle").transition().style("fill-opacity",0);
	svg.selectAll(".install").append("circle").attr({cx:function(d) {return d.x;},cy:function(d) {return d.y;},r:0}).style("stroke","black").style("fill","green").style("opacity",.25)
		.transition().attr("r",function(d) {return Math.sqrt(d.visited);})	
}

function key(d) {
	return d.id;
}
function drawGrid() {
	svg.selectAll("*").remove();
	svg.append("rect").attr({x:-5,y:-5,width:510,height:510,rx:5,ry:5}).style({stroke:"#ccc",fill:"none"});

	var y=d3.scale.linear().range([0,125]).domain([0,params.nbPeople ]);
	var x=d3.scale.linear().range([0,300]).domain([0,params.nbAttractions ]);



	var installSprites=svg.selectAll(".installs").data([1]).enter().append("g").classed("installs",1).style("clip-path", "url(#frame)")
		.selectAll(".install").data(installs).enter()
			.append("g").classed("install",1);
	
	installSprites.append("circle")
			.attr({cx:function(d) {return d.x},cy:function(d) {return d.y},r:0/*function(d) {return Math.sqrt(d.capacity+d.line.length)*/,class:"line"})
			.style({stroke:"none",fill:"palegreen", "fill-opacity":1})
	installSprites.append("circle")
			.attr({cx:function(d) {return d.x},cy:function(d) {return d.y},r:function(d) {return Math.sqrt(d.capacity)},class:"capacity"})
			.style({stroke:"black",fill:"green", "fill-opacity":0,"stroke-opacity":.5})

	installSprites.append("rect")
		.attr({x:function(d) {return d.x-2.5;},y:function(d) {return d.y-2.5;},height:5,width:5}).style("fill","black");
	installSprites.selectAll("circle").style("visibility",function(d) {return  d.outside?"hidden":"visible"}) // installs outside got the rect, so no circle.
	installSprites.selectAll("rect").style("visibility",function(d)   {return !d.outside?"hidden":"visible"}) // installs inside got the circles, so no rect.
		

	var peopleSprites=svg.selectAll(".people").data([1]).enter().append("g").classed("people",1).style("clip-path", "url(#frame)")
		.selectAll(".person").data(people,key).enter()
		.append("circle")
		.attr({cx:function(d) {return d.x},cy:function(d) {return d.y},r:1,class:"person"})
		.style({"fill":function(d) {return "#ccc";/*rgb("+d.gr+")";*/}, opacity:.25})

	/*var bars=svg.selectAll(".bars").data([1]).enter().append("g").classed("bars",1).attr("transform","translate(600,50)")
		.selectAll(".bar").data(statuses).enter()
			.append("g").classed("bar",1).attr("transform",function(d,i) {return "translate("+(25*i)+",0)";});
	bars.append("rect")
		.attr({width:20,height:function(d) {return y(d.nb);},y:function(d) {return 125-y(d.nb);}})
		.style("fill","steelblue");
	bars.append("text").attr("transform","rotate(90) translate(135,-5)").text(function(d) {return d.status;}).style("font","10px")*/
	if(!params.small) {
		var monitorChart=svg.selectAll(".mcharts").data([1]).enter().append("g").attr("transform","translate(550,50)").classed("mcharts",1);
			var mCharts=monitorChart.selectAll("path").data(statuses).enter().append("path")
				.classed("mchart",1).style("stroke",function(d,i) {return ["steelblue","firebrick","limegreen","#ccc"][i];}).style("fill","none")
				.style("visibility",function(d,i) {return i===2?"visible":"hidden"})
			var mTexts=monitorChart.selectAll("text").data(statuses).enter().append("text")
				.classed("mText",1).style("fill",function(d,i) {return ["steelblue","firebrick","limegreen","#ccc"][i];}).attr("x",310).style("font-size","10px")
				.style("visibility",function(d,i) {return i===2?"visible":"hidden"})
		;
			monitorChart.append("g").attr("class","axis").attr("transform","translate(0,125)").style("visibility","hidden").call(d3.svg.axis().scale(x).tickSubdivide(1).tickSize(2));
			monitorChart.append("text").text("How many people are visiting an installation ?").classed("dashtitle",1)//.attr("y",-10)
		
		var time=svg.append("g").attr("transform","translate(550,0)").classed("time",1);
			time.append("path").attr("d","M48,12v-2h254v2").style("stroke","black").style("fill","none");
			time.append("path").classed("cursor",1).attr({"transform":"translate(50,10)",d:"M-2,0v-2l2,-2l2,2v2z"}).style({stroke:"black",fill:"black"});
			time.append("text").text("Time: ").classed("dashtitle",1).attr("y",10);
			time.append("text").attr({id:"timetick","text-anchor":"middle"}).text(tick).attr("x",50);
			time.append("text").style("font-size","10px").attr({x:50,y:22,"text-anchor":"middle"}).text("0");
			time.append("text").style("font-size","10px").attr({x:300,y:22,"text-anchor":"middle"}).text(params.night);
		var indics=svg.append("g").attr("transform","translate(550,220)").classed("indics",1);
		var indic=indics.selectAll("g").data(statuses).enter().append("g").classed("indic",1).attr("transform",function(d,i) {return "translate("+60*(i+1)+",0)";});
			indic.append("text").attr({x:60,"text-anchor":"end"}).classed("dashtitle",1).text(function(d) {return d.status;}).style("fill",function(d,i) {return ["steelblue","firebrick","limegreen","#ccc"][i];});
			indic.append("text").attr({x:60,y:20,"text-anchor":"end"}).text(function(d) {return d.nb;}).classed("nb",1).style("font-size","10px")
		var itotal=indics.append("g");
			itotal.append("text").attr({x:30,"text-anchor":"end"}).text("Total").classed("dashtitle",1);
			itotal.append("text").attr({x:30,y:20,"text-anchor":"end"}).text(params.nbPeople ).style("font-size","10px");
		
		var indBars=indics.selectAll(".indbar").data(total).enter().append("g").classed("indbar",1).attr("transform","translate(0,70)");
			indBars.append("rect").style("fill",function(d,i) {return ["steelblue","firebrick","limegreen"][i];}).attr("height",15)
			indBars.append("text").text(function(d,i) {return ["Moving","Waiting","Visiting"][i]}).attr("y",25).style({"visibility":"hidden","font-size":"10px"});
		indics.append("text").classed("dashtitle",1).text("Globally, everyone spent their time:").attr({x:0,y:50})

		var vStats=svg.selectAll(".vStats").data([1]).enter().append("g").classed("vStats",1).attr("transform","translate(550,370)");
			vStats.append("text").text("How many attractions have people visited?").attr("y",-10).classed("dashtitle",1)
			var vStat=vStats.selectAll(".vStat").data(visitStats)
			.enter()
				.append("g").classed("vStat",1).attr("transform",function(d,i) {return "translate("+x(i)+",0)";})
			vStat.append("rect")
			.attr({width:(300/params.nbAttractions )-1,height:y,y:function(d) {return 125-y(d);}})
			.style("fill","steelblue");
			//vStats.append("text").attr("transform","translate("+((300/params.nbAttractions -1)/2)+",140)").attr("text-anchor","middle").text(function(d,i) {return i;}).style("font","8px");
			vStats.append("g")
	    		.attr("class", "axis")
	    		.attr("transform", "translate(0,125)")
	    		.call(d3.svg.axis().scale(x).tickSubdivide(1).tickSize(2));
    }
    d3.select("#killme").remove();
    svg.style("visibility","visible");
}

function draw() {
	var y=d3.scale.linear().range([0,125]).domain([0,params.nbPeople ]);
	var x=d3.scale.linear().range([0,300]).domain([0,tick]);

	var installSprites=svg.selectAll(".install").data(installs);
	//installSprites.select(".capacity").transition().duration(duration).style("fill-opacity",function(d) {return d.occupancy/d.capacity;});
	installSprites.select(".line")//.style("fill-opacity",function(d) {return d.line.length?1:0})
		.style("fill",function(d) {return d3.scale.linear().range(["palegreen","darkgreen","orange","red"]).domain([0,d.capacity/2,d.capacity,1.5*d.capacity])(d.occupancy+d.line.length);})
		//.transition().duration(duration)
		.attr("r",function(d) {return Math.sqrt(d.occupancy+d.line.length);})

	var peopleSprites=svg.selectAll(".person");
	peopleSprites
		.style("visibility",function(d) {return d.visible;})
		.style("fill",function(d) {return d.color;})
		.attr("r",function(d) {return (d.status&&d.status<8&&d.visible)?2:1})
	peopleSprites
	//.filter(function(d) {return (d.status in [0,5,6])})
	//.transition().duration(duration)
	.attr("cx",function(d) {return d.stepx;}).attr("cy",function(d) {return d.stepy;});

	d3.selectAll(".mchart").attr("d",function(d,i) {var path=d3.svg.line().interpolate("basis")
			.x(function(p,j) {return x(j);})
			.y(function(p,j) {return 125-y(p);})
			(monitoring[i]);
			//console.log(path);
			return path;
	});
	d3.selectAll(".mText").text(function(d) {return d.status+" ("+d.nb+")";}).attr("y",function(d) {return 125-y(d.nb);})
	d3.select(".mcharts").select(".axis").call(d3.svg.axis().scale(x).tickSubdivide(1).tickSize(2)).style("visibility","visible");

	
	bars=svg.selectAll(".bar").select("rect").transition().duration(params.duration).attr({height:function(d) {return y(d.nb);},y:function(d) {return 125-y(d.nb);}});
	vStats=svg.selectAll(".vStat").data(visitStats).select("rect").transition().duration(params.duration).attr({height:y,y:function(d) {return 125-y(d);}})
	d3.select("#timetick").text(tick).attr("x",50+250*(tick/params.night));
	d3.select(".time").select(".cursor").attr("transform","translate("+(50+250*(tick/params.night))+",10)");
	d3.selectAll(".indic").data(statuses).select(".nb").text(function(d) {return d.nb;})

	d3.selectAll(".indbar").data(total).attr("transform",function(d,i) {var a=i?d3.sum(total.slice(0,i)):0;a=a*300/d3.sum(total);return "translate("+a+",60)";});
	d3.selectAll(".indbar").select("rect").attr("width",function(d) {return 300*d/d3.sum(total);})
	d3.selectAll(".indbar").select("text").style("visibility",function(d) {return d/d3.sum(total)>.125?"visible":"hidden";})

}
