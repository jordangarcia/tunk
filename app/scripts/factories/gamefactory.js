'use strict';

angular.module('tunk')
.factory('gameFactory', ['deckFactory', 'gamelog',
function(deckFactory, gamelog) {
	var Game = function() {
		this.players     = [];
		this.deck        = deckFactory.create();
		this.discardPile = [];
		this.turn        = {};
	};

	return {
		create: function() {
			return new Game();
		}
	};
}]);
