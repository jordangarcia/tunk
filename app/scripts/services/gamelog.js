/**
 * GameLog service
 *
 * Levels:
 *	1 - normal message
 *	2 - emphasized
 *	3 - shown as alert
 */
angular.module('tunk')
.factory('gamelog', [function() {
	var log = [];

	function write(msg, level) {
		level = level || 1;
		log.push({
			message: msg,
			level: level
		});
	}

	return {
		log: log,
		write: write
	};
}]);
