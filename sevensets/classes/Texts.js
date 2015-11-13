Texts.prototype.constructor=Texts;

function Texts(){
	Loader.loadImage('./resources/dragarrow.png', this.onLoadImage, this);
	
	this.arrow;
	
	var title = "<fcWhite><fs16>7 sets Venn Diagram</f>"
	+"&nbsp;<fs11>128 color combinations from mixing 7 colors</f></f>";
	
	var text = "<fcWhite><fs18>" +
  //Out of this <ehttp://www.informationisbeautiful.net/2012/7-way-venn/*seven sets Venn Diagram> (who's the author?) I created my own isomorphic version (meaning that I kept the same topology) trying to balance surface areas, so each piece has a similar visual importance.</f>"
	//+"<br><br><fs18>Inspired by <ehttp://www.webexhibits.org/colorart/bh.html*Newton's theories on light and color spectrum> I decided to use colors rather than numbers or letters to identify each basic set, though I didn't use the same colors Newton did; mine are equidistant in the hue circle.</f>"
	//+"<br><br><fs18>I named the colors using <ehttp://en.wikipedia.org/wiki/List_of_colors*this table>, in each case identifying the closest and borrowing his name.</f>"
	//+"<br><br><fs18>Yes, it's a Mandala, and it has two different sides (drag it to check!)</f>"
	//+"<br><br><br><fs12>a playful object for the mind created by <ehttp://moebio.com*Santiago Ortiz></f>"
	"</f>";
	
	var flipText = "<fcWhite><fs24>Side A </f><fs18>drag to spin and see the other side</f></f>";
	
	this.titletBox = new TextFieldHTML({
		'text':title,
		x:20,
		y:20,
		width:400,
		height:4000
	});
	
	this.textBox = new TextFieldHTML({
		'text':text,
		x:20,
		y:110,
		width:300,
		height:4000
	});
	
	this.flipText = new TextFieldHTML({
		'text':flipText,
		width:350,
		height:4000
	});
	
	this.titletBox.draw();
	this.textBox.draw();
	
	this.resizeWindow();
}

Texts.prototype.onLoadImage=function(e){
	this.arrow = e.result;
}

Texts.prototype.resizeWindow = function(){
	this.flipText.x = canvasWidth - 370;
	this.flipText.y = canvasHeight - 40;
	
	this.flipText.draw();
}

Texts.prototype.draw = function(){
	if(this.arrow!=null) context.drawImage(this.arrow, canvasWidth - 376, canvasHeight - 65);
}

Texts.prototype.setSide = function(sideA){
	this.flipText.setText("<fcWhite><fs24>Side "+(sideA?"A":"B")+" </f><fs18>drag to spin and see the other side</f></f>");
	//this.flipText.draw();
}
