function ColorNames(){};

ColorNames._colors;
ColorNames._rgbArrays;
ColorNames._names;

ColorNames.load = function(){
	Loader.loadData(URL_COLORSNAMES, ColorNames.onLoadColorsnames, this);
	//Loader.loadData("http://en.wikipedia.org/wiki/List_of_colors", ColorNames.onLoadColorsnames, this);
}

ColorNames.onLoadColorsnames = function(e){
	
	// var block = StringOperators.firstTextBetweenStrings(e.result, "Edit section: A", "Colors by shade");
// 	
	// var blocks = StringOperators.allTextsBetweenStrings(block, '<tr>', '</tr>');
// 	
	// c.log('blocks.length', blocks.length);
// 	
	// var name;
	// var color;
	// var part;
// 	
	// ColorNames._colors = new ColorList();
	// ColorNames._names = new StringList();
// 	
	// for(var i=0; blocks[i]!=null; i++){
		// color = StringOperators.firstTextBetweenStrings(blocks[i], "monospace;\">", "</td>");
		// if(color!=null){
			// //part = StringOperators.firstTextBetweenStrings(part, ">", ";");
			// name = StringOperators.firstTextBetweenStrings(blocks[i], "title=", "/a>");
			// name = StringOperators.firstTextBetweenStrings(name, ">", "<");
			// //c.log('name, color:', name, color);
// 			
			// ColorNames._colors.push(color);
			// ColorNames._names.push(name);
		// }
	// }
// 	
	// var colorsNamesTable = new Table();
	// colorsNamesTable[0] = ColorNames._names;
	// colorsNamesTable[1] = ColorNames._colors;
	// c.log('........');
	// c.log(TableEncodings.TableToCSV(colorsNamesTable,',',false));
	// c.log('........');
	
	
	var colorNamesTable = TableEncodings.CSVtoTable(e.result);
	c.log(colorNamesTable);
	
	ColorNames._colors = ColorList.fromArray(colorNamesTable[1]);
	ColorNames._names = colorNamesTable[0];
	
	c.log('ColorNames._colors', ColorNames._colors);


	ColorNames._rgbArrays = ColorNames._colors.getRgbArrays(); 	
	c.log('ColorNames._rgbArrays.length', ColorNames._rgbArrays.length);
	
	colorsLoaded(); //<-- provisional
}

ColorNames.getNameAndColorFromColor = function(color){
	if(ColorNames._rgbArrays==null) return null;
	
	var rgb = ColorOperators.HEXtoRGB(color);
	var d;
	var dMin = 99999;
	var iMin;
	for(var i=0; ColorNames._rgbArrays[i]!=null; i++){
		d = Math.pow(ColorNames._rgbArrays[i][0]-rgb[0], 2)+Math.pow(ColorNames._rgbArrays[i][1]-rgb[1], 2)+Math.pow(ColorNames._rgbArrays[i][2]-rgb[2], 2);
		if(d<dMin){
			iMin = i;
			dMin = d;
		}
	}
	return {
		name:ColorNames._names[iMin],
		color:ColorNames._colors[iMin]
	}
}

ColorNames.getNamesAndColorsFromColorList = function(colorList){
	var list = new List();
	for(var i=0; colorList[i]!=null; i++){
		list[i] = ColorNames.getNameAndColorFromColor(colorList[i]);
	}
	return list;
}


