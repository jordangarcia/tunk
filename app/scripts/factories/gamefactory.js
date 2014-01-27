'use strict';

angular.module('tunk')
.factory('gameFactory', ['deckFactory',
function(deckFactory) {
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
