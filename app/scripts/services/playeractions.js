angular.module('tunk')
.factory('playerActions', ['$filter', 'handTester', 'gameEnd'
function($filter, handTester, gameEnd) {

	/**
	 * Draws a card from the game deck and gives to player
	 * No validation
	 *
	 * @param {Object} game
	 * @param {Object} player
	 */
	function drawCard(game, player) {
	}

	/**
	 * Draws a card from the discard pile and gives to player
	 * No validation
	 *
	 * @param {Object} game
	 * @param {Object} player
	 * @param {String} card
	 */
	function drawDiscard(game, player, card) {
	}

	/**
	 * Removes set of cards from players hand and adds to player
	 * No validation
	 *
	 * @param {Object} game
	 * @param {Object} player
	 * @param {Array} card
	 */
	function playSet(game, player, set) {
		// remove the set from player's hand
		player.hand = _.difference(player.hand, set);
		// add set to playedSets
		player.playedSets.push(set);
		// check win
		if (player.hand.length === 0) {
			gameEnd.tunkOut(game, player);
		}
	}

	/**
	 * Removes card from hand and plays on set
	 *
	 * @param {Object} game
	 * @param {Object} player
	 * @param {Array} set
	 * @param {String} card
	 */
	function playOnSet(game, player, set, card) {
		player.hand.splice(player.hand.indexOf(card), 1);
		set.push(card);
		// check win
		if (player.hand.length === 0) {
			gameEnd.outOfCards(game, player);
		}
	}

	/**
	 * Removes card from hand and puts in discard
	 * Checks outOfCards win
	 *
	 * @param {Object} game
	 * @param {Object} game
	 * @param {String} card
	 */
	function discard(game, player, card) {
		player.hand.splice(player.hand.indexOf(card), 1);
		game.discardPile.push(card);

		if (player.hand.length === 0) {
			gameEnd.outOfCards(game, player);
		}
	}

	/**
	 * Removes card from hand and plays on set
	 *
	 * @param {Object} game
	 * @param {Object} player
	 * @param {Object} opponent
	 * @param {Array} set
	 * @param {String} card
	 */
	function freeze(game, player, opponent, set, card) {
		opponent.isFrozen = true;
		playOnSet(game, player, set, card);
	}

	function goDown() {
	}

	return {
		drawCard: drawCard,
		drawDiscard: drawDiscard,
		discard: discard,
		playSet: playSet,
		freeze: freeze,
		playOnSet: playOnSet,
		goDown: goDown,
	};
}]);
