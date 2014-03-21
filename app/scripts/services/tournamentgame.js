'use strict';

/**
 * holds specific logic dealing with tournament games
 *
 * This is split into its own module so that different types of games
 * with different payouts can be bound without changing core game logic
 */
angular.module('tunk')
.factory('tournamentGame', ['gameHandlers', 'gameService', 'events',
function(gameHandlers, gameService, events){
	function handleOutOfCards(data){
		var game = data.game;
		var player = data.player;

		player.score += 1;

		events.trigger('gameEnd', {
			game: game,
			playerToGo: player
		});
	}

	function handleTunkOut(data) {
		var game = data.game;
		var player = data.player;

		player.score += 2;

		events.trigger('gameEnd', {
			game: game,
			playerToGo: player
		});
	}

	function handleGoDownResult(data) {
		var result = data.result;
		var game = data.game;
		var winners = data.winners;
		var player = data.player;

		var playerToGo;

		switch (result) {
			case 'win':
				player.score += 1;
				break;

			case 'tie':
				winners = _.without(winners, player);
				winners.forEach(function(winner) {
					winner.score += 1;
				});
				break;

			case 'lose':
				winners.forEach(function(winner) {
					winner.score += 2;
				});
				break;
		}

		events.trigger('gameEnd', {
			game: game,
			playerToGo: _.shuffle(winners)[0]
		});
	}

	/**
	 * Binds the game logic event handlers for tournament games
	 */
	function bindEvents() {
		events.on('discard', gameHandlers.discard);

		events.on('playSet', gameHandlers.playSet);

		events.on('playOnSet', gameHandlers.playOnSet);

		events.on('goDown', gameHandlers.goDown);

		events.on('outOfCards', handleOutOfCards);

		events.on('tunkOut', handleTunkOut);

		events.on('goDownResult', handleGoDownResult);
	}

	/**
	 * Unbinds the game logic event handlers for tournament games
	 */
	function unbindEvents() {
		events.off('discard', gameHandlers.discard);

		events.off('playSet', gameHandlers.playSet);

		events.off('playOnSet', gameHandlers.playOnSet);

		events.off('goDown', gameHandlers.goDown);

		events.off('outOfCards', handleOutOfCards);

		events.off('tunkOut', handleTunkOut);

		events.off('goDownResult', handleGoDownResult);
	}

	return {
		bindEvents: bindEvents,
		unbindEvents: unbindEvents,
	};
}]);
