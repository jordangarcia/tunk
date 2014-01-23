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
		this.turn = {
			currentPlayer: player,
			hasDrawn: false,
			hasDiscarded: false
		};
		this.discardPile.reset();
		this.deck.shuffle();
	};

	/**
	 * Advances the state of the game to the next player
	 */
	Game.prototype.advanceTurn = function() {
		var ind = this.players.indexOf(this.turn.currentPlayer);
		var nextPlayer = this.players[(ind + 1) % this.players.length];

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

	/**
	 * Deals cards to players in game
	 *
	 * @param {Integer} numCards
	 */
	Game.prototype.deal = function(numCards) {
		_.times(numCards, function() {
			this.players.forEach(function(player) {
				player.hand.push(this.deck.draw());
			}, this);
		}, this);
	};

	return {
		create: function() {
			return new Game();
		}
	};
}]);
