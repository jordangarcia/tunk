angular.module('tunk')
.factory('playerFactory', ['$filter', function($filter) {
	var pid = 0;

	var Player = function(name) {
		this.id        = pid++;
		this.name      = name;
		this.hand      = [];
		this.score     = 0;
		this.isFrozen  = false;
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
