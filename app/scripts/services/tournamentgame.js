'use strict';

/**
 * holds specific logic dealing with tournament games
 */

angular.module('tunk')
.factory('tournamentGame', ['gameHandlers', 'gameService', 'events',
function(gameHandlers, gameService, events){
	/**
	 * Binds the game logic event handlers for tournament games
	 */
	function bindEvents() {
		events.on('discard', gameHandlers.discard);

		events.on('playSet', gameHandlers.playSet);

		events.on('playOnSet', gameHandlers.playOnSet);

		events.on('goDown', gameHandlers.goDown);

		events.on('gameEnd', function(data) {
			var game = data.game;
			var playerToGo = data.playerToGo;

			// todo check if the match ended
			gameService.newGame(game, playerToGo);
		});

		events.on('outOfCards', function(data) {
			var game = data.game;
			var player = data.player;

			player.score += 1;

			events.trigger('gameEnd', {
				game: game,
				playerToGo: player
			});
		});

		events.on('tunkOut', function(data) {
			var game = data.game;
			var player = data.player;

			player.score += 2;

			events.trigger('gameEnd', {
				game: game,
				playerToGo: player
			});
		});

		events.on('goDownResult', function(data) {
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
		});
	}

	return {
		bindEvents: bindEvents
	};
}]);
