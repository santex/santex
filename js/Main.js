var network;
var frame;
var weights;
var transRelations = new RelationList();

var W0 = "http://info.cern.ch/hypertext/WWW/TheProject.html";
var webby = "http://www.webbyawards.com";
var NSA = "http://www.nsa.gov";
var wathwg = "http://www.whatwg.org";
var nyt = "http://www.nytimes.com";
var curiosity = "http://www.nasa.gov/mission_pages/msl/";
var wikipedia_curiosity = "http://en.wikipedia.org/wiki/Curiosity";
var cern = "http://home.web.cern.ch";
var eyeo = "http://eyeofestival.com";

var START_URL = W0;//wathwg;//NSA;//webby;//eyeo;//wikipedia_curiosity;//curiosity;//cern;//"http://infosthetics.com/";//"https://www.google.com/search?q=science";//"http://moebio.com";////"http://en.wikipedia.org/wiki/Tim_Berners-Lee";//W0;//webby;//"https://www.goodreads.com";//"http://en.wikipedia.org/wiki/Internet";////"http://en.wikipedia.org/wiki/Bob_Greenberg";//  
var ROOT;
var n_chars_ROOT;
var allLinks = new StringList();
var circles = {};
var circlesList = new List();
var circlesLoadedList = new List();
var nCircles = 0;

var LOADING_MODE = 1;//0:level, 1:links order, 2:random, 3:favor root, 4:favor root and level, 5:favor root, then random, 6:mix favor root and random

var maxLinks = 0;
var maxLevel = 0;
var nodesLinked;

var containerFrame;

var lastUrlLoaded = "";

var MODE = 1;// 0:2D, 1:3D

var NODES_LIMIT = 800;
var MIN_LINKS_TO_CREATE_NODE = 1;

var LENS_3D = 500;

var nF0=0;

var dimFact = 1;

var CIRCLES_FILL_RGB;
var NODES_TRANSPARENT;

var mouseIsOnWords = false;

/////
///

var initView = true;

var FILE_NAME = './resources/data/linksNet_1.txt';
var LOAD_FILE = false;
var COLORS = ['333333', 'white', 'green', 'red'];//['black', 'white', 'magenta', 'cyan'];
var NODES_IN_LEVELS = false;

init=function(){
	setBackgroundColor(COLORS[0]);

	CIRCLES_FILL = ColorOperators.addAlpha(COLORS[0], 0.5);

	NODES_TRANSPARENT = ColorOperators.addAlpha(COLORS[1], 0.5);

	CIRCLES_FILL_RGB = ColorOperators.colorStringToRGB(COLORS[0]);

	initInit();

	switch(MODE){
		case 0:
			break;
		case 1:
			init3D();
			break;
	}

	network = new Network();

	resizeWindow();

	addEventListener('mousemove', mMove, false);
}

start = function(){
	if(LOAD_FILE){
		initLoadingFile();
	} else {
		startLoading(START_URL);
	}
}

restart = function(url){

	START_URL = url;

	network = new Network();
	sortedNodes = new NodeList();
	nLoaded = 0;
	weights = null;
	transRelations = new RelationList();
	spheres=null;
	allLinks = new StringList();
	circles = {};
	circlesList = new List();
	circlesLoadedList = new List();
	nCircles = 0;

	startLoading(START_URL);
}


resizeWindow = function(){
	if(initView){
		resizeWindowInit();
		return;
	}

	frame = new Rectangle((cW-cH)*0.5,0,cH,cH);

	switch(MODE){
		case 0:
			//containerFrame = new Rectangle((cW-cH-20)*0.5,10,(cW-cH)-20,cH-20);
			buildTagCloud();
			break;
		case 1:
			break;
	}
	
	//drawDiv();
}


cycle=function(){
	if(initView){
		drawInit();
		return;
	}

	if(network==null || circlesLoadedList.length==0) return;


	switch(MODE){
		case 0:
			draw2D();
			break;
		case 1:
			draw3D();
			break;
	}

	drawInfo();
}

drawInfo = function(){
	setText(COLORS[1], 12);
	fText('n nodes: '+network.nodeList.length, 20, cH - 125);
	fText('n relations: '+network.relationList.length, 20, cH - 110);
	fText('n webs loaded: '+nLoaded, 20, cH - 95);
	fText('n links crawled: '+allLinks.length, 20, cH - 80);
	fText('n domains: '+circlesList.length, 20, cH - 65);
	fText('n domains with pages loaded (cricles): '+circlesLoadedList.length, 20, cH - 50);
	fText('last site loaded: '+lastUrlLoaded, 20, cH - 35);
	fText('seed: '+START_URL, 20, cH - 20);
}

printData = function(){
	text = "";
	network.nodeList.forEach(function(node){
		text+=node.id+"\n";
		node.nodeList.forEach(function(node1){
			text+=" "+node1.id+"\n";
		})
	});

	c.log(text);
}

mMove = function(){
	mouseIsOnWords = false;
}
mouseOnWords = function(){
	mouseIsOnWords = true;
}
