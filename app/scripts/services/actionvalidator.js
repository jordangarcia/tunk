angular.module('tunk')
.factory('actionValidator', ['PICKUP_DISCARD_LIMIT', 'handTester',
function(PICKUP_DISCARD_LIMIT, handTester) {
	/**
	 * @param {Game} game
	 * @param {Player} game
	 * @return {Boolean}
	 */
	function isPlayersTurn(game, player) {
		return (game.turn.currentPlayer === player);
	}

	/**
	 * Check if the card can be picked up by the configured PICKUP_DISCARD_LIMIT
	 *
	 * @param {Game} game
	 * @param {Player} player
	 * @param {String} card
	 * @return {Boolean}
	 */
	function canDrawDiscard(game, player, card) {
		var offset = game.discardPile.getOffsetFromEnd(card);

		return (
			isPlayersTurn(game, player) &&
			offset < PICKUP_DISCARD_LIMIT
		);
	}

	/**
	 * Check the turn state if a player can draw a card
	 *
	 * @param {Game} pile
	 * @param {Player} player
	 * @return {Boolean}
	 */
	function canDrawCard(game, player) {
		return (isPlayersTurn(game, player) && !game.turn.hasDrawn);
	}

	/**
	 * @param {Game} game
	 * @param {Player} player
	 * @return {Boolean}
	 */
	function canGoDown(game, player) {
		return (
			isPlayersTurn(game, player) &&
			!game.turn.hasDrawn &&
			!player.isFrozen
		);
	}

	/**
	 * @param {Game} game
	 * @param {Player} player
	 * @param {Array} set
	 * @return {Boolean}
	 */
	function canPlaySet(game, player, set) {
		return (
			isPlayersTurn(game, player) &&
			game.turn.hasDrawn &&
			!game.turn.hasDiscarded &&
			handTester.isSet(set)
		);
	}

	/**
	 * @param {Game} game
	 * @param {Player} player
	 * @param {Array} set
	 * @param {string} card
	 * @return {Boolean}
	 */
	function canPlayOnSet(game, player, set, card) {
		return (
			isPlayersTurn(game, player) &&
			game.turn.hasDrawn &&
			!game.turn.hasDiscarded &&
			handTester.isSet(set.concat(card))
		);
	}

	return {
		canDrawDiscard: canDrawDiscard,
		canDrawCard: canDrawCard,
		canGoDown: canGoDown,
		canPlaySet: canPlaySet,
		canPlayOnSet: canPlayOnSet,
	};
}]);
