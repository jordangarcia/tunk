angular.module('tunk')
.factory('playerFactory', ['$filter', function($filter) {
	var Player = function(user) {
		this.user       = user;
		this.hand       = [];
		this.playedSets = [];
		this.score      = 0;
		this.isFrozen   = false;
	};

	/**
	 * @return {Integer}
	 */
	Player.prototype.handScore = function() {
		return $filter('handScore')(this.hand);
	}

	return {
		create: function(name) {
			return new Player(name);
		}
	}
}]);
