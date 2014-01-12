angular.module('tunk')
.factory('playerFactory', ['$watch', function($watch) {
	var pid = 0;
	var self;

	var Player = function(name) {
		self = this;
		this.id        = pid++;
		this.name      = name;
		this.hand      = [];
		this.score     = 0;
		this.handScore = 0;
		this.isFrozen  = false;
	};

	return {
		create: function(name) {
			return new Player(name);
		}
	}
}]);
