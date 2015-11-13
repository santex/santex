var configuration = {
	backGroundColor:'black',
	colors:true,
	mousewheel:true,
	delicious:true        ,
	opaquePieces:1,
	colorAdditionMode:0,
	crows:false,
	centers:false,
	colornames:true,
	transformationDefault:{
		k:0.02,
		q:0
	}
}


var URL_SETS = './resources/sets.svg';
var URL_PIECES = './resources/pieces.svg';
var URL_CENTERS = './resources/centers.svg';
var URL_COLORSNAMES = './resources/colorsNames.csv';

var COLOR_ADDITION_MODE = configuration.colorAdditionMode;

var piecesBases = new PolygonList();
var pieces = new PolygonList();
var sets = new PolygonList();

var piecesT = new PolygonList();
var setsT = new PolygonList();

var piecesColors;
var setsColors;
var setsColorsRGB;
var piecesColorsRGB;

var piecesColorReferences;
var setsColorReferences;

var colorTable;
var loadedCenters;
var centers = new Polygon();
var centersT = new Polygon();
var weights;

var deliciousColors;

var colorNamesTable;

//k=0.018 | q=0

var k=configuration.transformationDefault.k;
var q=configuration.transformationDefault.q;
var q2=q+1;

var follow_mX = 0;
var follow_mY = 0;

var R;
var center;

var dragging;
var engine3D;
var rotationVector = new Point(0,0);
var pA = new Point3D(0,0,100); //used to check side
var limA = 0.99;//0.6;
var limB = 1.01;//3;
var sideA = false;
var currentAngles = new Point3D(0,0,0);

var binNumber = 0;
var lastBinNumber;
var colorsToFollow;
var colorsFollowers;
var timerToStartColorsFollowing=0;


var texts;


// ART INTERFACE SCIENCE LANGUAGE TECHNOLOGY HUMANISM NETWORKS

var categories = [
	'ART',
	'INTERFACE',
	'SCIENCE',
	'LANGUAGE',
	'TECHNOLOGY',
	'HUMANISM',
	'NETWORKS'
];

var protowords = [
	'ART',
	'INTER',
	'SCI',
	'LAN',
	'TECH',
	'HUMA',
	'NET'
];

var sevenBases = [
	/art|design|illustration|sculpture|paper|origami|typography|digital_arts|animation|photography|color|music|dance/,
	/interaction|interface|games|tool|cybernetics|usability|toy/,
	/science|math|algorithm|numbers|biology|physics|astronomy|chemistry|genetics|bacteria|emergence|chaos|geology|ethology|evolution|bioinformatics|brain|neuroscience|electromagnetism|energy|temperature/,
	/philosophy|literature|text|language|linguistics|books|narrative|folksonomy|humor|hypernarrative|typography/,
	/technology|geek|internet|code|digital_arts|gis|cybernetics|java|algorithm|electromagnetism|electricity|iphone|twitter|facebook|microsoft|html5|flickr/,
	/psychology|sociology|geek|software|community|cognition|perception|education|politics|religion|city|history/,
	/network|graph|social_network/
];

var requireFilter = [];

init=function(){
	setBackgroundColor(configuration.backGroundColor);
	
	
	
	setsColors = new ColorList();
	setsColorsRGB = new List();
	var rgb;
	for(var i=0; sevenBases[i]!=null; i++){
		rgb = ColorOperators.HSVtoRGB(360*i/sevenBases.length, 1, 1);
		setsColorsRGB[i] = rgb;
		setsColors[i] = ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
	}
	
	if(configuration.mousewheel) addInteractionEventListener('mousewheel', wheel, this);
	
	addInteractionEventListener("mouseup", this.onMouse, this);
	
	texts = new Texts();
	
	//3D
	engine3D = new Engine3D();
	dragging = new DragDetection(0, draggingListener, this);
	dragging.factor = 0.1;
	
	Loader.loadData(URL_CENTERS, onLoadCenters, this);
	
	END_CYCLE_DELAY = 3000;
	
	cycleOnMouseMovement(true);
}

draggingListener=function(draggingVector){
	rotationVector = draggingVector;
}
onMouse=function(event){
	currentAngles = engine3D.eulerAngles();
	dragging.dragging = false;
}

wheel=function(e){
	q2 = Math.min(Math.max(q2*(1-0.03*e.value), 1), 11);
	q = q2-1;
}

resizeWindow = function(){
	var leftMargin = 210;
	var w = canvasWidth-leftMargin;
	
	R = 0.86*Math.min(canvasHeight, w)*0.5;
	center = new Point(w*0.5+leftMargin, canvasHeight*0.47);
	
	piecesT = pieces.factor(2*R/100).add(center);
	setsT = sets.factor(2*R/100).add(center);
	centersT = centers.factor(2*R/100).add(center);
	
	engine3D.lens = R*1.1;
	
	pA = new Point3D(0,0,R);
	
	texts.resizeWindow();
	
	enterFrame();
}


cycle=function(){
	//context.fillStyle='white';context.fillText(String(nFrame), 10, 10);
	
	texts.draw();
	
	var zpA = engine3D.projection3D(pA).z;
	var flept = (sideA!=(zpA<1));
	sideA = zpA<1;
	var crows = sideA;
	
	if(!dragging.dragging){
		if(zpA<limA || zpA>limB){
			rotationVector.x=0;
			rotationVector.y=0;
			rotationVector.z=0;
				
			if(zpA<limA){
				if(currentAngles.x>Math.Pi){
					currentAngles.x-=TwoPi;
				} else if(currentAngles.x<-Math.Pi){
					currentAngles.x+=TwoPi;
				}
				
				if(currentAngles.y>Math.Pi){
					currentAngles.y-=TwoPi;
				} else if(currentAngles.y<-Math.Pi){
					currentAngles.y+=TwoPi;
				}
				
				if(currentAngles.z>Math.Pi){
					currentAngles.z-=TwoPi;
				} else if(currentAngles.z<-Math.Pi){
					currentAngles.z+=TwoPi;
				}
				
				currentAngles.x = 0.8*currentAngles.x;
				currentAngles.y = 0.8*currentAngles.y;
				currentAngles.z = 0.8*currentAngles.z;
			} else {				
				if(currentAngles.x>0){
					currentAngles.x-=TwoPi;
				} else if(currentAngles.x<-TwoPi){
					currentAngles.x+=TwoPi;
				}
				
				if(currentAngles.y>Math.Pi){
					currentAngles.y-=TwoPi;
				} else if(currentAngles.y<-Math.Pi){
					currentAngles.y+=TwoPi;
				}
				
				if(currentAngles.z>0){
					currentAngles.z-=TwoPi;
				} else if(currentAngles.z<-TwoPi){
					currentAngles.z+=TwoPi;
				}
				
				currentAngles.x = 0.8*currentAngles.x-0.2*Math.PI;
				currentAngles.y = 0.8*currentAngles.y;
				currentAngles.z = 0.8*currentAngles.z-0.2*Math.PI;
			}
			
			engine3D.setAngles(currentAngles);
		} else {
			engine3D.applyRotation(rotationVector);
		}
	} else {
		engine3D.applyRotation(rotationVector);
	}
	
	follow_mX = 0.8*follow_mX+0.2*mouseX;
	follow_mY = 0.8*follow_mY+0.2*mouseY;
	
	
	
	
	//////////binNumber and inSet
	lastBinNumber = binNumber;
	
	var inSet;
	var dna="";
	binNumber = 0;
	var tags = "";
	var inSets = [];
	
	for(var i=0; setsT[i]!=null; i++){
		inSet = PolygonOperators.polygonContainsPoint(setsT[i], mousePoint);
		dna+=inSet?"X":" ";
		binNumber += inSet?Math.pow(2, i):0;
		if(inSet){
			tags+=", "+categories[i];
			inSets.push(i);
		}
	}
	
	
	//////////pieces
	
	var pColors;
	var set;
	var subCenter;
	var subBinNumber;
	
	context.lineWidth = 1;
	context.strokeStyle=crows?'rgba(255,255,255,0.1)':'black';
	
	if(flept){
		timerToStartColorsFollowing = 0;
		texts.setSide(sideA);
	}
	
	if(!crows && !dragging.dragging && inSets.length>0){
		if(lastBinNumber!=binNumber){
			colorsFollowers = piecesColors.clone();
			colorsToFollow= new ColorList();
			for(var j=0; centersT[j]!=null; j++){
				subCenter = centersT[j];
				subBinNumber = 0;
				for(i=0; inSets[i]!=null; i++){
					set = setsT[inSets[i]];
					subBinNumber += PolygonOperators.polygonContainsPoint(set, subCenter)?Math.pow(2, inSets[i]):0;
				}
				colorsToFollow[j] = (subBinNumber>0)?piecesColors[subBinNumber-1]:'black';
			}
			timerToStartColorsFollowing = 0;
		}
		
		timerToStartColorsFollowing++;
		
		if(timerToStartColorsFollowing>30){
			if(colorsToFollow==null) colorsToFollow = piecesColors;
			if(colorsFollowers==null) colorsFollowers = new ColorList();
			for(j=0; colorsToFollow[j]!=null; j++){
				colorsFollowers[j] = ColorOperators.interpolateColors(colorsFollowers[j], colorsToFollow[j], 0.1);
			}
			pColors = colorsFollowers;
		} else {
			pColors = piecesColors;
		}
	} else {
		pColors = piecesColors;
	}
	
	
	drawPolygonList(piecesT, crows?null:pColors);

	
	
	
	//////////sets
	
	var angle;
	var pC;
	var r = R+25;
	
	var xC = center.x + r*Math.cos(Math.PI*0.3);
	var yC = center.y + R - 20;
	
	context.lineWidth = 2;
	context.strokeStyle = 'white';//'rgb(80,80,80)';//
	
	var refColorObject;
	
	for(i=0; inSets[i]!=null; i++){
		context.strokeStyle=crows?setsColors[inSets[i]]:'black';
		drawPolygon(setsT[inSets[i]]);
		
		angle = -TwoPi*inSets[i]/7-Math.PI*0.44;
		pC = transformation3D(center.add(new Point(r*Math.cos(angle), r*Math.sin(angle))));
		
		
		//peripherical circle
		
		context.fillStyle = setsColors[inSets[i]];
		context.beginPath();
		context.arc(pC.x, pC.y, 10*pC.z, 0, TwoPi);
		context.fill();
		
		
		
		
		//equation circles
		
		context.beginPath();
		context.arc(xC + i*30, yC, 9, 0, TwoPi);
		context.fill();
		
		//equation texts
		
		if(setsColorReferences!=null){
			refColorObject = setsColorReferences[inSets[i]];
			DrawTexts.setContextTextProperties('white', 13, LOADED_FONT);
			DrawTexts.fillTextRotated(context, refColorObject.name, xC + i*30+6, yC-15, -0.25*Math.PI);
		}
		
		//equation symbols
		
		DrawTexts.setContextTextProperties('white', 14, LOADED_FONT, 'center', 'middle');
		context.fillStyle = 'white';
		context.fillText((inSets[i+1]!=null)?'+':'=', xC + (i+0.5)*30, yC);
	}
	
	//highlighted polygon
	
	if(binNumber!=0){
		context.lineWidth = 4;
		context.strokeStyle=crows?piecesColors[binNumber-1]:'white';
		drawPolygon(piecesT[binNumber-1]);
	}
	
	
	//last equation circle and text
	
	if(binNumber!=0){
		context.fillStyle = piecesColors[binNumber-1];
		context.beginPath();
		context.arc(xC + i*30+5, yC, 12, 0, TwoPi);
		context.fill();
		
		if(setsColorReferences!=null){
			refColorObject = piecesColorReferences[binNumber-1];
			DrawTexts.setContextTextProperties('white', 14, LOADED_FONT);
			DrawTexts.fillTextRotated(context, refColorObject.name, xC + i*30+12, yC-20, -0.25*Math.PI);
		}
	}
	
	
	//crows
	
	if(crows || configuration.centers){
		for(var i=0;centersT[i]!=null;i++){
			if(crows) drawCrow(centersT[i], colorTable[i]);
			if(configuration.centers) drawBigPoint(centersT[i], 'white');
		}
	}
}

drawPolygonList = function(polygonList, colors){	
	for(var i=0; polygonList[i]!=null; i++){
		drawPolygon(polygonList[i], colors!=null?colors[i]:null);
	}
}

drawPolygon = function(polygon, color){
	if(color!=null) context.fillStyle = color;
	context.beginPath();
	Draw.drawBezierPolygonTransformed(context, polygon, transformation3D);
	context.stroke();
	if(color!=null) context.fill();
}

drawPoint = function(p, color){
	p = transformation3D(p).clone();
	context.fillStyle = color;
	context.beginPath();
	context.arc(p.x, p.y, 0.5*p.z, 0, TwoPi);
	context.fill();
}

drawBigPoint = function(p, color){
	p = transformation3D(p).clone();
	context.fillStyle = color;
	context.beginPath();
	context.arc(p.x, p.y, 5*p.z, 0, TwoPi);
	context.fill();
}

drawCrow = function(p, colors){
	var angle0 = Math.atan2(p.y-center.y, p.x-center.x);
	var angle;
	var r = colors.length*2+1;
	var pC;
	for(var i=0; colors[i]!=null; i++){
		angle = angle0 + (TwoPi*i/colors.length);
		pC = transformation3D(p.add(new Point(r*Math.cos(angle), r*Math.sin(angle))));
		
		context.fillStyle = colors[i];
		context.beginPath();
		context.arc(pC.x, pC.y, 5*pC.z, 0, TwoPi);
		context.fill();
	}
}


//3D

transformation3D = function(p){
	var p3D = engine3D.projection3D(new Point3D((sideA?(p.x-center.x):(center.x-p.x)), p.y-center.y, 0));
	return new Point3D(p3D.x + center.x, p3D.y+center.y, p3D.z);
}


//ZOOM
zoomTransformation = function(point){
	//return new Point3D(point.x, point.y, 1);
	
	var v = new Point(point.x-follow_mX, point.y-follow_mY);
	var norm = v.getNorm();
	var factor = expand(norm)/norm;
	var p = v.factor(factor);
	
	return new Point3D(follow_mX+p.x, follow_mY+p.y, factor);
}
expand = function(d){
	return d + (q*d/(1+(Math.pow(k*d,2))));
}



