define(function() {
	// var WideCanvas		= require("lib/widecanvas");
	var settings = require('settings');

	var RenderManager	= function()
	{
		// WideCanvas object
		this.canvas;

		this.init	= function(canvas)
		{
			this.canvas	= canvas;
		};

		this.render	= function(entityList)
		{
			this.canvas.clear();

			this._renderBg();
			this._renderEntitiesDEBUG(entityList);
		};


		this._renderBg			= function()
		{
			this.canvas.ctx.fillStyle= "#222";
			this.canvas.ctx.fillRect(settings.width/2 - 4, 0, 8, settings.height)
		};

		this._renderEntities	= function(entityList)
		{
			entityList.forEach(function(e) {
				// get position of entity
				var pos		= {
					x:100,
					y:100
				};
				// get image for entity
				// var image	= e.image;
				var image	= e.image;
				// draw image for entity at position
				this.canvas.ctx.drawImage(image, pos.x, pos.y);
			}.bind(this));
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
					image, physicsBody.x - (physicsBody.width / 2),
					this.canvas.getYRepereForDrawing(physicsBody.y, physicsBody.height)
				);
			}.bind(this));
			image = document.createElement("canvas");
		};
	};

	return RenderManager;
});