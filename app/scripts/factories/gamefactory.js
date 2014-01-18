'use strict';

angular.module('tunk')
.factory('gameFactory', ['deckFactory', 'discardPileFactory', 'playerFactory', 'gamelog',
function(deckFactory, discardPileFactory, playerFactory, gamelog) {
	var Game = function() {
		this.players     = [];
		this.deck        = deckFactory.create();
		this.discardPile = discardPileFactory.create();
		this.log         = gamelog;
		this.turn        = {};
	};

	/**
	 * @param {Player} player to go first
	 */
	Game.prototype.reset = function(player) {
		this.players.forEach(function(player) {
			player.resetGameState();
		});
		this.advanceTurn(player);
		this.discardPile.reset();
		this.deck.shuffle();
	};

	/**
	 * Gets the next player in the turn order
	 *
	 * @return {Player}
	 */
	Game.prototype.getNextPlayer = function() {
		var ind = this.players.indexOf(this.turn.currentPlayer);
		if (ind === -1) {
			throw new Error("Player not found.");
		}

		return this.players[(ind + 1) % this.players.length];
	};

	/**
	 * Advances the state of the game to the next player
	 */
	Game.prototype.advanceTurn = function(nextPlayer) {
		this.turn = {
			currentPlayer: nextPlayer,
			hasDrawn: false,
			hasDiscarded: false
		};
	};

	/**
	 * Gets an array of players that have the lowest hand score (tie)
	 *
	 * @return {Array}
	 */
	Game.prototype.getLowestScorers = function() {
		var sorted = _.sortBy(this.players, function(player) {
			return player.handScore();
		});

		var lowest = sorted[0].handScore();
		return sorted.filter(function(player) {
			return player.handScore() === lowest;
		});
	};

	return {
		create: function() {
			return new Game();
		}
	};
}]);
