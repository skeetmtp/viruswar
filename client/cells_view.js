var onlineColors = [
"#00FF00",
"#FF5EAA",
"#FBB829",
"#ADD8C7",
"#CDD7B6",
"#C3FF68",
"#FF9900",
"#F9CDAD",
];

function CellsView(canvas) {
	var self = this;
  self.canvas = canvas;
  self.ctx = canvas.getContext('2d');
	self.width = canvas.width;
	self.height = canvas.height;


  self.canvas.onmouseup = function(e) {

    var pos = findPos(this);
    var res = {};
    res.x = e.pageX - pos.x;
    res.y = e.pageY - pos.y;

    res.i = Math.floor(res.x / defines.cellWidth);
    res.j = Math.floor(res.y / defines.cellHeight);

    console.log(res);
    addCell(res.i, res.j);
  }

};

CellsView.prototype.emptyCell = function (i, j) {
  var self = this;
  var ctx = self.ctx;
  ctx.fillStyle = defines.backgroundColor;
  ctx.beginPath();
  ctx.rect(1+i*defines.cellWidth, 1+j*defines.cellHeight, defines.cellWidth-1, defines.cellHeight-1);
  ctx.closePath();
  ctx.fill();
}

CellsView.prototype.drawCell = function (cell) {
  
  var user = Meteor.users.findOne(cell.userId);

  var color = onlineColors[0];
  if(user === undefined)  {
    color = "#999999";
  }
  else {
    if(user._id !== Meteor.userId()) {
      var crc = 0;
      for ( var i = 0; i < user._id.length; i++ ){
        var c = user._id.charAt(i).charCodeAt(0);;
        crc = crc + c;
      }
      var colorId = 1 + crc % (onlineColors.length - 1);
      color = onlineColors[colorId];
    }
    else {
      //console.log("me");
    }
  }
  
  var self = this;
  var ctx = self.ctx;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.rect(1+cell.i*defines.cellWidth, 1+cell.j*defines.cellHeight, defines.cellWidth-1, defines.cellHeight-1);
  ctx.closePath();
  ctx.fill();

  if(cell.home) {
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    var x = 0.5 + (cell.i+0.5) * defines.cellWidth;
    var y = 0.5 + (cell.j+0.5) * defines.cellHeight;
    var r = 0.75 * defines.cellWidth / 2.0;
    ctx.arc( x, y, r, 0 , 2 * Math.PI, false );
    ctx.fill();
  }


}

CellsView.prototype.toto = function () {
	
}
