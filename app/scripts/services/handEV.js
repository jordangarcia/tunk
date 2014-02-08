angular.module('tunk')
.factory('handEV', ['$filter', 'handTester',
function($filter, handTester) {
	var handScore = $filter('handScore');

	var DEFAULTS = {
		handSize: 5,
	};

	/**
	 * Takes an array of cards and removes each array of cards in an array
	 * cards:['2c', '2h', '2s', '4c', '5c']
	 * toRemove: [['2c', '2h'], ['4c']]
	 * result: ['2s', '5c']
	 *
	 * @param {Array} cards
	 * @param {Array} toRemove of array of cards
	 */
	function withoutCards(cards, toRemove) {
		console.log(cards, toRemove);
		return toRemove.reduce(function(prev, curr) {
			return _.without.apply(null, [prev].concat(curr));
		}, cards);
	}

	/**
	 * Calculates the handEV if the sets in the hand were played
	 */
	function handWithoutSets(cards) {
		var runs = handTester.getRuns(cards);
		var books = handTester.getBooks(cards);

		var withoutRuns = withoutCards(cards, runs);
		var withoutBooks = withoutCards(cards, books);
		console.log('withoutRuns ', withoutRuns);
		console.log('withoutBooks ', withoutBooks);

		// in the case of a tie return the runs because they can be played on more
		return (handScore(withoutRuns) > handScore(withoutBooks))
			? withoutBooks
			: withoutRuns;
	}

	/**
	 * @param {Array} hand of cards ('2h', 'Td', etc)
	 * @param {Object} config
	 * @returns {Number} Expected value of hand
	 */
	function handEV(hand, config) {
		return handWithoutSets(hand);
	};

	handEV.handWithoutSets = handWithoutSets;

	return handEV;
}]);
