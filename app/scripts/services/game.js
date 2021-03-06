'use strict';

/**
 * Methods dealing with modifying the game state.  Such as creating a new game
 * advancing the turn or other misc methods *could* go on some Game object
 *
 * Note: none of these methods should be called directly by a player or controller
 */
angular.module('tunk').factory('gameService', [
	'$filter',
	'HAND_SIZE',
	'gameFactory',
	'deckFactory',
function($filter, HAND_SIZE, gameFactory, deckFactory) {
	var handScore = $filter('handScore');

	/**
	 * Resets the game state for a new game
	 *
	 * @param {Array.<Object>} players
	 * @param {Object} playerToGo
	 */
	function createGame(players, playerToGo) {
		var game = gameFactory.create();
		game.players = players;

		resetGame(game, playerToGo);

		return game
	}

	/**
	 * Resets the game state for a new game
	 *
	 * @param {Object} game
	 * @param {Object} playerToGo
	 */
	function resetGame(game, playerToGo) {
		game.players.forEach(function(player) {
			resetPlayer(player);
		});
		game.turn = {
			currentPlayer: playerToGo,
			hasDrawn: false,
			hasDiscarded: false
		};
		game.discardPile = [];
		// shuffle a new deck
		game.deck = _.shuffle(deckFactory.create());
		deal(game, HAND_SIZE);
	}

	/**
	 * Gets all other players in game besides current player
	 *
	 * @param {Object} game
	 * @param {Object} player
	 * @return {Array}
	 */
	function getOpponents(game, player) {
		return game.players.filter(function(p) {
			return p.id !== player.id;
		});
	}

	/**
	 * Restore arrays that firebase removes =(
	 *
	 * @param {Object} game
	 */
	function restoreArrays(game) {
		game.discardPile = game.discardPile || [];
		game.players.forEach(function(player) {
			player.playedSets = player.playedSets || [];
		});
	}

	/**
	 * @param {Object} game
	 * @param {Object} user
	 *
	 * @return {Object} player
	 */
	function getPlayerByUser(game, user) {
		return _.findWhere(game.players, {
			id: user.id
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

	/**
	 * Returns object (for reference) of the current player
	 *
	 * @param {Object} game
	 * @return {Object} player
	 */
	function getCurrentPlayer(game) {
		return _.findWhere(game.players, { id: game.turn.currentPlayer.id });
	}

	return {
		createGame: createGame,
		resetGame: resetGame,
		getOpponents: getOpponents,
		getCurrentPlayer: getCurrentPlayer,
		restoreArrays: restoreArrays,
		advanceTurn: advanceTurn,
		getLowestScorers: getLowestScorers,
		getPlayerByUser: getPlayerByUser
	};
}]);
