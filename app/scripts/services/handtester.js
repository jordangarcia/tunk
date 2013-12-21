'use strict';

var SET_MINIMUM = 3;
var RUN_MINIMUM = 3;

angular.module('tunk')
.factory('handTester', ['$filter', 'deck', function($filter, deck) {
	var sortHand = $filter('sortHand');
	var getValue = $filter('cardValue');
	var getSuit = $filter('suit');
	var getOrder = $filter('cardOrder')

	/**
	 * Returns an array of sets (cards)
	 *
	 * @param {Array} cards
	 * @return {Array}
	 */
	function getSets(hand) {
		return _.values(_.groupBy(hand, function(card) {
			return getValue(card);
		})).filter(function(group) {
			return group.length >= SET_MINIMUM;
		});
	}

	/**
	 * @param {Array} cards
	 * @return {Boolean}
	 */
	function isSameSuit(cards) {
		if (!cards.length) return false;

		var suit = getSuit(cards.shift());
		return _.every(cards, function(card) {
			return getSuit(card) === suit;
		});
	}

	/**
	 * ['Ah', '2h', '3h', '5h, '8h', '9h', '10h'] => [['Ah', '2h', '3h'], ['5h'], ['8h', '9h', '10h']]
	 *
	 * @param {Array} cards of the same suit
	 * @return {Array} of array of cards
	 */
	function groupSeqs(cards) {
		var seqs = [];
		cards = sortHand(cards);

		// add ace to end of array
		if (getOrder(cards[0]) == 1) {
			cards.push(cards[0]);
		}

		function isSeq(a, b) {
			if (getOrder(a) === 13 && getOrder(b) === 1) {
				// aces go both ways
				return true;
			}

			return (getOrder(a) === getOrder(b) - 1);
		}

		for (var i = 0; i < cards.length; i++) {
			if (!seqs.length) {
				// initialize the seqs
				seqs.push([cards[i]])
				continue;
			}

			var lastCard = _.last(_.last(seqs));
			// if the last element in the last group is card[i] - 1
			if (isSeq(lastCard, cards[i])) {
				seqs[seqs.length - 1].push(cards[i]);
			} else {
				// isn't in the current sequence add a new group
				seqs.push([cards[i]]);
			}
		}

		return seqs;
	}

	/**
	 * Returns an array of runs (cards)
	 *
	 * @param {Array} cards
	 * @return {Array}
	 */
	function getRuns(cards) {
		// generates an array map function to add suit to card value
		function addSuit(suit) {
			return function(val) {
				return val + suit;
			}
		}

		var runs = []

		_.each(_.groupBy(cards, getSuit), function(cards, suit) {
			groupSeqs(cards)
			// [[Ah,2h,3h], [5h,6h,7h], [9h]]
				.filter(function(seq) {
					return seq.length >= RUN_MINIMUM;
				})
				// [[Ah,2h,3h], [5h,6h,7h]]
				.map(function(seq) {
					runs.push(seq);
				});
		});

		return runs;
	}

	return {
		getSets: getSets,
		getRuns: getRuns
	};
}]);
