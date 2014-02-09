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
		return toRemove.reduce(function(prev, curr) {
			return _.without.apply(null, [prev].concat(curr));
		}, cards);
	}

	/**
	 * Determines the best way to play the sets in a hand
	 *
	 * return data structure:
	 *	hand - without the played sets
	 *	score - score of the hand without sets
	 *	playedSets - the sets that were played to get the optimal hand
	 *
	 * @param {Array} cards
	 * @return {Object}
	 */
	function findOptimalSets(cards) {
		var runs = handTester.getRuns(cards);
		var books = handTester.getBooks(cards);

		var handWithoutRuns = withoutCards(cards, runs);
		var handWithoutBooks = withoutCards(cards, books);

		var withoutRuns = {
			hand: handWithoutRuns,
			score: handScore(handWithoutRuns),
			playedSets: runs
		};

		var withoutBooks = {
			hand: handWithoutBooks,
			score: handScore(handWithoutBooks),
			playedSets: books
		};

		// in the case of a tie return the runs because they can be played on more
		return (withoutRuns.score > withoutBooks.score)
			? withoutBooks
			: withoutRuns;
	}

	/**
	 * @param {Array} hand of cards ('2h', 'Td', etc)
	 * @param {Object} config
	 * @returns {Number} Expected value of hand
	 */
	function handEV(hand, config) {
		return findOptimalSets(hand).score;
	};

	handEV.findOptimalSets = findOptimalSets;

	return handEV;
}]);
