angular.module('tunk')
.factory('gameActions', ['HAND_SIZE',
function(HAND_SIZE) {
	var exports = {};

	/**
	 * @param {Game} game
	 */
	exports.newGame = function(game, handSize) {
		game.log.write('Starting a new game');

		game.reset();

		exports.deal(HAND_SIZE);
	};

	/**
	 * Advances the state of the game to the next player
	 *
	 * @param {Game} game
	 */
	exports.advanceTurn = function(game) {
		// unfreeze player who just finished turn
		game.turn.currentPlayer.isFrozen = false;
		// advance turn to next player
		game.advanceTurn(game.players.getNextPlayer(game.turn.currentPlayer));
	};

	/**
	 * Gives each player some number of cards
	 */
	exports.deal = function(numCards) {
		_.times(numCards, function() {
			game.players.forEach(function(player) {
				player.hand.push(game.deck.draw());
			});
		});
	};

	return exports;
}]);
