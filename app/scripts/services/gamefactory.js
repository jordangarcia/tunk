'use strict';

angular.module('tunk')
.factory('gameFactory', ['deckFactory', 'discardPileFactory', 'playerListFactory', 'gamelog', 'HAND_SIZE', 'MATCH_WIN_SCORE',
function(deckFactory, discardPileFactory, playerListFactory, gamelog, HAND_SIZE, MATCH_WIN_SCORE) {
	var Game = function() {
		this.matchWinScore = MATCH_WIN_SCORE;
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
		this.log.write('Starting a new game');

		this.turn = {
			playerId: playerToGo,
			hasDrawn: false,
			hasDiscarded: false,
		};

		this.playerList.resetPlayers();
		this.discardPile.reset();
		this.deck.shuffle();
		this.deal(HAND_SIZE);
	};

	/**
	 * Advances the state of the game to the next player
	 */
	Game.prototype.advanceTurn = function() {
		// unfreeze player who just finished turn
		this.playerList.find(self.turn.playerId).frozen = false;
		this.turn = {
			playerId: this.playerList.getNextPlayer(self.turn.playerId),
			hasDrawn: false,
			hasDiscarded: false,
		};
	};

	/**
	 * Gives each player some number of cards
	 */
	Game.prototype.deal = function(numCards) {
		_.times(HAND_SIZE, function() {
			this.playerList.players.forEach(function(player) {
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
