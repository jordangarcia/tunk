angular.module('tunk')
.factory('playerFactory', ['$filter', function($filter) {
	var Player = function(user) {
		this.id         = user.id;
		this.user       = user;
		this.hand       = [];
		this.playedSets = [];
		this.score      = 0;
		this.isFrozen   = false;
		this.isHuman    = true;
	};

	return {
		create: function(user) {
			return new Player(user);
		}
	}
}]);
