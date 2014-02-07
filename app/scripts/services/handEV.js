angular.module('tunk')
.factory('handEV', ['handScore', function() {

	var DEFAULTS = {
		handSize: 5,

	};

	/**
	 * @param {Array} hand of cards ('2h', 'Td', etc)
	 * @param {Object} config
	 * @returns {Number} Expected value of hand
	 */
	return function handEV(hand, config) {
		var baseScore = handScore(hand);

		var handEV = baseScore - (probOfCompletingSet * scoreWithoutSet);
		return handEV;

	};
}]);
