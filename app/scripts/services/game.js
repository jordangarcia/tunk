'use strict';

angular.module('tunk')
.factory('gameService', ['$filter', 'HAND_SIZE', function($filter, HAND_SIZE) {
	var handScore = $filter('handScore');

	/**
	 * Resets the game state for a new game
	 *
	 * @param {Object} game
	 * @param {Object} playerToGo
	 */
	function newGame(game, playerToGo) {
		game.players.forEach(function(player) {
			resetPlayer(player);
		});
		game.turn = {
			currentPlayer: playerToGo,
			hasDrawn: false,
			hasDiscarded: false
		};
		game.discardPile = [];
		game.deck = _.shuffle(game.deck);
		deal(game, HAND_SIZE);
	}

	/**
	 * Initializes game state from loaded firebase game
	 *
	 * @param {Object} game
	 */
	function loadGame(game) {
		game.discardPile = game.discardPile || [];
		game.players.forEach(function(player) {
			player.playedSets = player.playedSets || [];
		});
	}

	/**
	 * Updates the game state to represent the turn advanced
	 *
	 * @param {Object} game
	 */
	function advanceTurn(game) {
		// unfreeze player who just finished turn
		game.turn.currentPlayer.isFrozen = false;

		var toFind = _.findWhere(game.players, { id: game.turn.currentPlayer.id });
		var ind = game.players.indexOf(toFind);
		var nextPlayer = game.players[(ind + 1) % game.players.length];

		game.turn = {
			currentPlayer: nextPlayer,
			hasDrawn: false,
			hasDiscarded: false
		};
	}

	/**
	 * Gets an array of the players with the lowest score
	 *
	 * @param {Object} game
	 * @return {Array}
	 */
	function getLowestScorers(game) {
		var sorted = _.sortBy(game.players, function(player) {
			return handScore(player.hand);
		});

		var lowest = handScore(sorted[0].hand);
		return sorted.filter(function(player) {
			return handScore(player.hand) === lowest;
		});
	};

	/**
	 * Deals cards to every player in a game
	 * @private
	 *
	 * @param {Object} game
	 * @param {Integer} numCards
	 */
	function deal(game, numCards) {
		_.times(numCards, function() {
			game.players.forEach(function(player) {
				// shift one card off the game deck and push into players hand
				player.hand.push(game.deck.shift());
			});
		});
	}

	/**
	 * Resets a players state for a new turn
	 * @private
	 *
	 * @param {Object} player
	 */
	function resetPlayer(player) {
		player.hand = [];
		player.playedSets = [];
		player.isFrozen = false;
	}

	return {
		newGame: newGame,
		loadGame: loadGame,
		advanceTurn: advanceTurn,
		getLowestScorers: getLowestScorers
	};
}]);
