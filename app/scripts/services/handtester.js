'use strict';

var SET_MINIMUM = 3;
var RUN_MINIMUM = 3;

var BOOKS_ALLOWED = true;
var RUNS_ALLOWED = true;

angular.module('tunk')
.factory('handTester', ['$filter', function($filter) {
	var sortHand = $filter('sortHand');
	var getValue = $filter('cardValue');
	var getSuit = $filter('suit');
	var getOrder = $filter('cardOrder')

	/**
	 * Checks if two cards are a sequence
	 *
	 * @param {String} a
	 * @param {String} b
	 */
	function isSeq(a, b) {
		var sorted = sortHand([a, b]);
		var low = sorted[0];
		var high = sorted[1];

		if (getSuit(low) !== getSuit(high)) {
			return false;
		}
		if (getOrder(low) === 1 && getOrder(high) === 13) {
			// aces go both ways
			return true;
		}

		return (getOrder(low) === getOrder(high) - 1);
	}


	/**
	 * ['2h', '2c', '4d', '5c', '6c', '6d', '6h']  => [['2h', '2c'], ['4d'], ['5c'], ['6c', '6d', '6h']]
	 *
	 * @param {Array} cards
	 * @return {Array} of array of cards grouped in books
	 */
	function groupBooks(cards) {
		return _.values(_.groupBy(cards, getValue));
	}

	/**
	 * ['Ah', '2h', '3h', '5h, '8h', '9h', '10h'] => [['Ah', '2h', '3h'], ['5h'], ['8h', '9h', '10h']]
	 *
	 * @param {Array} cards
	 * @return {Array} of array of cards
	 */
	function groupSeqs(cards) {
		var bySuit = _.groupBy(cards, getSuit);
		var seqs = [];

		_.each(bySuit, function(seq) {
			seqs = seqs.concat(groupSeqsSameSuit(seq));
		});

		return seqs;
	}

	/**
	 * ['Ah', '2h', '3h', '5h, '8h', '9h', '10h'] => [['Ah', '2h', '3h'], ['5h'], ['8h', '9h', '10h']]
	 *
	 * @param {Array} cards of the same suit
	 * @return {Array} of array of cards
	 */
	function groupSeqsSameSuit(cards) {
		cards = sortHand(cards);

		var seqs = [];
		// number of aces added to check ace high-low
		var extraAces = 0;

		// add ace to end of array
		var containsKing = _.contains(_.map(cards, getOrder), 13);
		if (containsKing && getOrder(cards[0]) == 1) {
			cards.push(cards[0]);
			extraAces++;
		}

		cards.forEach(function(card) {
			if (seqs.length === 0) {
				// initialize the sequence
				seqs.push([card])
				return;
			}

			// last card in last seq
			var lastCard = _.last(_.last(seqs));
			// if the last element in the last group is card[i] - 1

			if (isSeq(lastCard, card)) {
				if (getOrder(card) === 1 && _.contains(_.last(seqs), card)) {
					// if the extra ace gets added twice to sequence return and skip
					return;
				}
				_.last(seqs).push(card);
			} else {
				// isn't in the current sequence add a new group
				seqs.push([card]);
			}
		});

		// filter out the lone ['Ac'] that was added to test high and low
		return _.filter(seqs, function(seq) {
			// no need to filter out seq if there were no aces added
			if (extraAces === 0) {
				return true;
			}
			// if there were aces added and the seq is a lone ace remove until extraAces are 0
			if (extraAces > 0 && (seq.length === 1 && getOrder(seq[0]) === 1)) {
				extraAces--;
				return false;
			}

			// otherwise its fine
			return true;
		});
	}


	/**
	 * Returns an array of sets (cards)
	 *
	 * @param {Array} cards
	 * @return {Array}
	 */
	function getBooks(hand) {
		return groupBooks(hand).filter(function(group) {
			return group.length >= SET_MINIMUM;
		});
	}

	/**
	 * Returns an array of runs (cards)
	 *
	 * @param {Array} cards
	 * @return {Array}
	 */
	function getRuns(cards) {
		return groupSeqs(cards).filter(function(seq) {
			return seq.length >= RUN_MINIMUM;
		});
	}

	/**
	 * Get all potential sets and runs for an array of cards
	 *
	 * @param {Array} cards
	 * @return {Array}
	 */
	function getSets(cards) {
		var sets = [];
		if (BOOKS_ALLOWED) {
			sets = sets.concat(getBooks(cards));
		}
		if (RUNS_ALLOWED) {
			sets = sets.concat(getRuns(cards));
		}
		return sets;
	}

	/**
	 * Explicit check if a set of cards is a book
	 *
	 * @param {Array} cards
	 * @return {Boolean}
	 */
	function isBook(cards) {
		if (cards.length < SET_MINIMUM) {
			return false;
		}

		var rank = getValue(cards[0]);
		return _.every(cards, function(card) {
			return getValue(card) === rank;
		});
	}

	/**
	 * Explicit check if a set of cards is a run
	 *
	 * @param {Array} cards
	 * @return {Boolean}
	 */
	function isRun(cards) {
		if (cards.length < RUN_MINIMUM) {
			return false;
		}

		function matchesSuit(suit) {
			return function(card) {
				return getSuit(card) === suit;
			}
		}

		// for all cards to form a run groupSeqs returns a single sequence
		// true => [['2h', '3h', '4h']]
		// false => [['2h', '3h', '4h'], ['6h']
		return (
			// every card must be the same suit
			_.every(cards, matchesSuit(getSuit(cards[0]))) &&
			// the cards must form only one sequence
			groupSeqs(cards).length === 1
		);
	}

	/**
	 * Checks whether a group of cards is a set
	 *
	 * @param {Array} cards
	 * @return {Boolean}
	 */
	function isSet(cards) {
		return isBook(cards) || isRun(cards);
	}

	return {
		getBooks: getBooks,
		getRuns: getRuns,
		groupBooks: groupBooks,
		groupSeqs: groupSeqs,
		getSets: getSets,
		isSet: isSet
	};
}]);
