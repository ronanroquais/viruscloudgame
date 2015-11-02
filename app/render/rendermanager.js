var settings = require('../settings');
var mediaAssets = require('../mediaAssets');

var RenderManager	= function()
{
	// WideCanvas object
	this.canvas;

	this.init	= function(canvas)
	{
		this.canvas	= canvas;
	};

	this.render	= function(entityList, time)
	{
		this.canvas.clear();

		this._renderBg();
		this._renderEntities(entityList);
		// this._renderEntitiesDEBUG(entityList);
//			this._renderTime(time);
	};


	this._renderBg			= function()
	{
		/*
		this.canvas.ctx.fillStyle= "#222";
		this.canvas.ctx.fillRect(settings.width/2 - 4, 0, 8, settings.height)
		*/
		this.canvas.ctx.drawImage(mediaAssets.white, 0,0);

	};

	this._renderEntities	= function(entityList)
	{
		entityList.forEach(function(e) {
			// get position and dimensions of entity
			var physicsBody	= e.physicsBody;
			// get image for entity
			var image		= e.image;
			// draw image for entity at position
			if (image != null)
			{
				var drawX	= physicsBody.x - (physicsBody.width / 2);
				var drawY	= this.canvas.getYRepereForDrawing(physicsBody.y, physicsBody.height);

				// horrible hackyness to tile the image of platforms, but not players
				if (physicsBody.isFixed)
				{
					this.canvas.ctx.fillStyle	= this.canvas.ctx.createPattern(image, "repeat");
					this.canvas.ctx.fillRect(
						drawX, drawY,
						physicsBody.width, physicsBody.height
					);
				}
				else
				{
					this.canvas.ctx.drawImage(image, drawX, drawY, physicsBody.width, physicsBody.height);
				}
			}
		}.bind(this));
	};

	this._renderTime			= function(time)
	{
		this.canvas.ctx.font	= "30px Verdana";
		this.canvas.ctx.fillText(time, 10, 30);
	};

	this._renderEntitiesDEBUG	= function(entityList)
	{
		entityList.forEach(function(e) {
			// get position of entity
			var physicsBody		= e.physicsBody;
			// get image for entity
			var image			= document.createElement("canvas");

			image.width   = physicsBody.width;
			image.height  = physicsBody.height;

			var ctx = image.getContext("2d");
			
			ctx.beginPath();
			ctx.fillStyle = "#00ff00";
			ctx.fillRect(0, 0, image.width, image.height);
			ctx.closePath();

			// draw image for entity at position
			this.canvas.ctx.drawImage(
				image,
				physicsBody.x - (physicsBody.width / 2),
				this.canvas.getYRepereForDrawing(physicsBody.y, physicsBody.height)
			);
		}.bind(this));
	};
};

module.exports = RenderManager;