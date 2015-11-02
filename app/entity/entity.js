var Entity	= function()
{
	this.owner;
	// physics body object
	this.physicsBody;
	// Image object
	this.image;
	// entity hit points
	this.life;

	this.init		= function()
	{
		this.life	= 1.0;
	};

	this.update	= function(time)
	{
		this.physicsBody.update(time);
	};
}

module.exports = Entity;