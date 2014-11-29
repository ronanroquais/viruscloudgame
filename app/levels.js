define(function()
{
    var allowedValues = [1,2,4,1,2,4,1,2,4,1,2,4,3,5,6,3,5,6,7];
    var beginnerValues = [1,2,4];
	var levels = {
		story: [],
		endless: [],
		versus: []
	};
	var StoryLevel = function(options) {
		if(!options)
			options = {};
		this.startingLines = options.startingLines || 0;
		this.movableBlocks = options.movableBlocks || allowedValues;
		this.penaltyBlocks = options.penaltyBlocks || allowedValues;
		this.speed = options.speed || 1;
		this.target = options.target || 1000;
	}
	var EndlessLevel = function(options)
	{
		if(!options)
			options = {};
		this.movableBlocks = options.movableBlocks || allowedValues;
		this.penaltyBlocks = options.penaltyBlocks || allowedValues;
		this.speed = options.speed || 1;
	}
	levels.story.push(new StoryLevel({movableBlocks:beginnerValues, target: 100}));
	levels.story.push(new StoryLevel({movableBlocks:beginnerValues, target: 200, startingLines: 2}));
	levels.story.push(new StoryLevel({movableBlocks:beginnerValues, target: 400, startingLines: 3}));
	levels.story.push(new StoryLevel({movableBlocks:beginnerValues, target: 400, startingLines: 5}));
	levels.story.push(new StoryLevel({movableBlocks:allowedValues, target: 200}));
	levels.story.push(new StoryLevel({movableBlocks:allowedValues, target: 400, startingLines: 2}));
	levels.story.push(new StoryLevel({movableBlocks:allowedValues, speed: 1.5, target: 200}));

	levels.endless.push(new EndlessLevel({movableBlocks: beginnerValues}));
	levels.endless.push(new EndlessLevel({movableBlocks: beginnerValues, speed: 1.3}));
	levels.endless.push(new EndlessLevel({movableBlocks: beginnerValues, speed: 1.6}));
	levels.endless.push(new EndlessLevel());
	levels.endless.push(new EndlessLevel({speed : 1.3}));
	levels.endless.push(new EndlessLevel({speed : 1.6}));

	levels.versus.push(new EndlessLevel({movableBlocks:beginnerValues}));
	levels.versus.push(new EndlessLevel());
	levels.versus.push(new EndlessLevel({speed: 1.3}));
	return levels;
});