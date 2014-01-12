'use strict';

angular.module('tunk')
.factory('game', ['deck', 'discardPile', 'playerList', 'gamelog', 'HAND_SIZE',
function(deckFactory, discardPileFactory, playerListFactory, gamelog, HAND_SIZE) {
	var self;

	var Game = function() {
		self = this;

		this.playerList  = playerListFactory.create();
		this.deck        = deckFactory.create();
		this.discardPile = discardPileFactory.create();
		this.log         = gamelog;
		this.turn        = {}
	};

	/**
	 * @param {Integer} playerToGo
	 */
	Game.prototype.newGame = function(playerToGo) {
		self.log.write('Starting a new game');

		self.playerList.resetPlayers();
		self.turn = {
			playerId: playerToGo || 0,
			hasDrawn: false,
			hasDiscarded: false,
		};

		self.deck.reset().shuffle();
		self.discardPile.reset();
		self.deal(HAND_SIZE);
	};

	/**
	 * Advances the state of the game to the next player
	 */
	Game.prototype.advanceTurn = function{
		// unfreeze player who just finished turn
		self.playerList.find(self.turn.playerId).frozen = false;
		self.turn = {
			playerId: self.playerList.getNextPlayer(self.turn.playerId),
			hasDrawn: false,
			hasDiscarded: false,
		};
	};

	/**
	 * Gives each player some number of cards
	 */
	Gmae.prototype.deal = function(numCards) {
		_.times(HAND_SIZE, function() {
			self.playerList.players.forEach(function(player) {
				player.hand.push(self.deck.draw());
			});
		});
	};

	return {
		create: function() {
			return new Game();
		}
	};
}]);
