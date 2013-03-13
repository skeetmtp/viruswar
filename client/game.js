
(function (window) {
	function VirusGame(stage, contentManager) {

        this.reset();

        createjs.Ticker.addListener(this);
	};

    VirusGame.prototype.reset = function () {
    }

	VirusGame.prototype.tick = function (timeElapsed) {
    };

    VirusGame.prototype.onMouseMove = function (event) {
        /*
            var x = event.rawX;
            var y = event.rawY;
            var cx = Math.round(x / cellWidth  - 0.5);
            var cy = Math.round(y / cellHeight - 0.5);
            
            //var visible = true;
            //if(cx>=this.tileCountX)
            //    visible = false;
            //if(cy>=this.tileCountY)
            //    visible = false;
            //this.cursor.sprite.visible = visible;
            
            this.cursor.cellX = cx;
            this.cursor.cellY = cy;
            */
    };

    VirusGame.prototype.onClick = function (event) {
            //console.log('ok');
            /*
            var cx = this.cursor.cellX;
            var cy = this.cursor.cellY;
            if(cx>=this.tileCountX)
                return;
            if(cy>=this.tileCountY)
                return;

            var myUnit = new Unit(window.stage, null, this); 
            myUnit.x = cx * cellWidth;
            myUnit.y = cy * cellHeight;
            */
    };

	window.VirusGame = VirusGame;
} (window));





	