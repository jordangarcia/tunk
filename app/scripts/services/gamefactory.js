'use strict';

angular.module('tunk')
.factory('gameFactory', ['deckFactory', 'discardPileFactory', 'playerListFactory', 'gamelog',
function(deckFactory, discardPileFactory, playerListFactory, gamelog) {
	var Game = function() {
		this.players     = playerListFactory.create();
		this.deck        = deckFactory.create();
		this.discardPile = discardPileFactory.create();
		this.log         = gamelog;
		this.turn        = {}
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
	 * Advances the state of the game to the next player
	 */
	Game.prototype.advanceTurn = function(nextPlayer) {
		this.turn = {
			currentPlayer: nextPlayer,
			hasDrawn: false,
			hasDiscarded: false
		};
	};

	return {
		create: function() {
			return new Game();
		}
	};
}]);
