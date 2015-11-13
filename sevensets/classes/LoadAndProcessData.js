onLoadCenters = function(e){
	var xCoordinates = StringOperators.allTextsBetweenStrings(e.result, "cx=\"", "\"").toNumberList();
	var yCoordinates = StringOperators.allTextsBetweenStrings(e.result, "cy=\"", "\"").toNumberList();
	loadedCenters = GeometryConvertions.twoNumberListsToPolygon(xCoordinates, yCoordinates).factor(10);
	
	c.log("loadedCenters.length", loadedCenters.length);
	
	Loader.loadData(URL_PIECES, onLoadPaths, this);
	Loader.loadData(URL_SETS, onLoadPaths, this);
}

onLoadPaths = function(e){
	var polygons = e.url==URL_PIECES?piecesBases:sets;
	var paths = StringOperators.allTextsBetweenStrings(e.result, "<path", ">").surround("<path", ">");
	
	var iPath = 0;
	
	for(var i=0; i<paths.length; i++){
		polygons.push(SVGdecode.pathToBezierPolygon(paths[i]));
	}
	
	if(piecesBases.length>0 && sets.length>0){
		var inSet;
		var rgb;
		var setRgb;
		var nSets;
		var binNumber;
		var binNumbers = new NumberList();
		
		var piece;
		var pieceBase;
		var pieceBase10;
		//var centerBase;
		//var centerPiece;
		var colorList;
		
		var angle;
		
		piecesColors = new ColorList();
		piecesColorsRGB = new List();
		
		colorTable = new Table();
		
		pieces[0]=piecesBases[0];
		centers[0] = new Point(0,0);
		
		colorTable.push(setsColors.clone());
		piecesColors.push(ColorOperators.RGBtoHEX(123,123,123));
		piecesColorsRGB.push([255,255,255]);
		binNumbers.push(Math.pow(2,7)-1);
				
		for(var i=1; piecesBases[i]!=null; i++){
			pieceBase = piecesBases[i];
			pieceBase10 = pieceBase.factor(10);
			//centerBase = PolygonOperators.getBezierPolygonBestCenter(pieceBase.factor(10), 500);
			//centerBase = centerBase.factor(0.1);
			for(var k=0;loadedCenters[k]!=null;k++){
				if(PolygonOperators.bezierPolygonContainsPoint(pieceBase10, loadedCenters[k])){
					centerBase = loadedCenters[k].factor(0.1);
					c.log(i, centerBase);
					break;
				}
			}
			for(var j=0; j<7; j++){
				angle = j*TwoPi/7;
				
				piece = j==0?pieceBase:pieceBase.getRotated(angle);
				centerPiece = j==0?centerBase:centerBase.getRotated(angle);
				
				centers.push(centerPiece);
				
				pieces.push(piece);
				
				binNumber=0;
				
				rgb = [0,0,0];
				
				colorList = new ColorList();
				colorTable.push(colorList);
				
				nSets = 0;
				
				for(var k=0; sets[k]!=null; k++){
					inSet = PolygonOperators.polygonContainsPoint(sets[k], centerPiece);
					binNumber += inSet?Math.pow(2, k):0;
					if(inSet){
						nSets++;
						setRgb = setsColorsRGB[k];
						rgb[0]+=setRgb[0];
						rgb[1]+=setRgb[1];
						rgb[2]+=setRgb[2];
						
						colorList.push(ColorOperators.RGBtoHEX(setRgb[0], setRgb[1], setRgb[2]));
					}
				}
				
				binNumbers.push(binNumber);
				
				switch(COLOR_ADDITION_MODE){
					case 0:
						rgb[0]/=nSets*configuration.opaquePieces;
						rgb[1]/=nSets*configuration.opaquePieces;
						rgb[2]/=nSets*configuration.opaquePieces;
						break;
					case 1:
						rgb[0] = Math.min(rgb[0], 255);
						rgb[1] = Math.min(rgb[1], 255);
						rgb[2] = Math.min(rgb[2], 255);
						break;
				}
				
				piecesColors.push(ColorOperators.RGBtoHEX(Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2])));
				piecesColorsRGB.push(rgb);	
			}
		}
		
		pieceBase = pieceBase;
		
		if(configuration.delicious){
			Loader.loadData("./resources/deliciousALL.xml", onLoadDeliciousData, this);
		}
		
		pieces = ListOperators.sortListByNumberList(pieces, binNumbers, false);
		piecesColors = ListOperators.sortListByNumberList(piecesColors, binNumbers, false);
		piecesColorsRGB = ListOperators.sortListByNumberList(piecesColorsRGB, binNumbers, false);
		colorTable = ListOperators.sortListByNumberList(colorTable, binNumbers, false);
		centers = ListOperators.sortListByNumberList(centers, binNumbers, false);
		
		binNumbers = ListOperators.sortListByNumberList(binNumbers, binNumbers, false);
		
		
		if(configuration.colornames) ColorNames.load();
		
	}
	resizeWindow();
}

colorsLoaded = function(){
	piecesColorReferences = ColorNames.getNamesAndColorsFromColorList(piecesColors);
	setsColorReferences = ColorNames.getNamesAndColorsFromColorList(setsColors);
}


//////////////////////////////////////

onLoadDeliciousData = function(e){
	c.log(e);
	
	var posts = StringOperators.allTextsBetweenStrings(e.result, "<post description=\"", "/>");
	
	c.log('posts.length', posts.length);
	
	var description;
	var tagsString;
	var dna;
	var i;
	var j;
	
	var sums = new NumberList();
	for(j=0; sevenBases[j]!=null; j++){
		sums[j]=0;
	}
	
	var binaryNumbers = new NumberList();
	var nBinary = Math.pow(2, sevenBases.length);
	
	c.log("nBinary", nBinary);
	
	for(i=0; i<nBinary; i++){
		binaryNumbers[i]=0;
	}
	
	var binNumber;
	var active;
	
	for(i=0; posts[i]!=null; i++){
	//for(var i=0; i<3; i++){
		description = posts[i].substr(0, posts[i].indexOf("\""));
		tagsString = StringOperators.firstTextBetweenStrings(posts[i], 'tag=\"', '"');
		dna="";
		binNumber=0;
		for(j=0; sevenBases[j]!=null; j++){
			active = tagsString.search(sevenBases[j])!=-1 && (requireFilter.indexOf(j)==-1 || tagsString.search("!")!=-1);
			dna+=active?"X":" ";
			if(active) sums[j]++;
			binNumber += active?Math.pow(2, j):0;
		}
		//c.log(dna, binNumber);
		binaryNumbers[binNumber]++;
	}
	
	weights = binaryNumbers.clone();
	
	c.log(sums);
	c.log(binaryNumbers);
	
	binaryNumbers.shift();
	
	deliciousColors = ColorListOperators.colorListFromColorScaleFunctionAndNumberList(deliciousColorFunction, binaryNumbers, true);
	//piecesColors = deliciousColors;
	
	alphas = binaryNumbers.getNormalizedToMax();
	
	points = new Polygon();
	for(i=0; pieces[i]!=null; i++){
		c.log(i, binaryNumbers[i]);
		points = points.concat(PolygonOperators.placePointsInsideBezierPolygon(pieces[i], binaryNumbers[i], 0, 10));
		//points = points.concat(PolygonOperators.placePointsInsidePolygon(pieces[i], binaryNumbers[i]));
	}
	c.log('points.length', points.length);
	
	// for(i=0; piecesColors[i]!=null; i++){
		// piecesColors[i] = ColorOperators.addAlpha(piecesColors[i], Math.pow(alphas[i], 0.1));
	// }
}
// deliciousColorFunction = function(n){
	// n = Math.pow(n, 0.2);
	// return 'rgb('+Math.floor(n*256)+','+Math.floor(n*256)+','+Math.floor(n*256)+')';
// }

deliciousColorFunction = function(n){
	n = Math.pow(n, 0.1);
	//return ColorOperators.grayscale(n);
	return ColorOperators.grayToOrange(Math.pow(n, 3));
}
