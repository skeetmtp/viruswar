var game = null;




function Game() {
  var self = this;

  self.canvas = document.getElementById('canvas');
  self.width = defines.cellWidth * defines.mapTileCountX;
  self.height = defines.cellHeight * defines.mapTileCountY;
  self.canvas.width = self.width + 1;
  self.canvas.height = self.height + 1;
  self.ctx = self.canvas.getContext('2d');

  self.cellsView = new CellsView(self.canvas);

};

Game.prototype.drawCell = function (x, y) {
  var self = this;
  var ctx = self.ctx;
  ctx.fillStyle = "#FF0000";
  ctx.beginPath();
  ctx.rect(x, y, defines.cellWidth, defines.cellHeight);
  ctx.closePath();
  ctx.fill();
}


Game.prototype.clearBackground = function () {
  var self = this;
  var ctx = self.ctx;

  ctx.fillStyle = defines.backgroundColor;
  ctx.clearRect(0, 0, self.width, self.height);
  ctx.beginPath();
  ctx.rect(0, 0, self.width, self.height);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 1;
  for (var i = 0; i < defines.mapTileCountX + 1; i++) {
    ctx.beginPath();
    var x = 0.5 + i*defines.cellWidth;
    ctx.moveTo(x,0);
    ctx.lineTo(x,self.height);
    ctx.stroke();
  };
  for (var j = 0; j < defines.mapTileCountY + 1; j++) {
    ctx.beginPath();
    var y = 0.5 + j*defines.cellHeight;
    ctx.moveTo(0,y);
    ctx.lineTo(self.width, y);
    ctx.stroke();
  };

}

Game.prototype.loop = function () {

  //console.log("loop");

}
    
function gameLoop() {
  
  game.loop();

  setTimeout(gameLoop, 1000);
}

function gameInit() {

  game = new Game();
  game.clearBackground();
  

/*
  $('#canvas').mousemove(function(e) {
    var pos = findPos(this);
    var x = e.pageX - pos.x;
    var y = e.pageY - pos.y;
    var coordinateDisplay = "x=" + x + ", y=" + y;
    console.log(coordinateDisplay); 
  });
*/

}

Meteor.startup(function () {
  gameInit();
  gameLoop();

});

