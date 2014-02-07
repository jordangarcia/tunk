'use strict';

/**
 * Server for setting up the SinglePlayer game mode
 */
angular.module('tunk')
.factory('singlePlayerService', ['playerFactory', 'userFactory', 'ai', 'events',
function(playerFactory, userFactory, ai, events) {
	/**
	 * Creates a playerlist
	 *
	 * @param {String} username
	 * @return {Array}
	 */
	function createPlayer(username) {
		var player = playerFactory.create(userFactory.create(username));
		player.isHuman = true;
		return player;
	}

	/**
	 * Creates an array of AI players
	 *
	 * @param {Integer} num of ai players
	 * @return {Array}
	 */
	function createAiPlayers(num) {
		var aiPlayers = [];

		for (var i = 1; i <= num; i++) {
			var ai = playerFactory.create(userFactory.create('Computer ' + i));
			ai.isHuman = false;
			aiPlayers.push(ai);
		}

		return aiPlayers;
	}

	/**
	 * Check the game state and return whether the current player is human
	 *
	 * @param {Object} game
	 * @return {Boolean}
	 */
	function isPlayersTurn(game) {
		return game.turn.currentPlayer.isHuman;
	}

	/**
	 * Bind to events for AI to take actions
	 */
	function bindAiHooks() {
		// when the turn advnace
		events.on('turnAdvanced', function(data) {
			if (!isPlayersTurn(data.game)) {
				ai.playTurn(data.game);
			}
		});
	}

	return {
		createPlayer: createPlayer,
		createAiPlayers: createAiPlayers,
		bindAiHooks: bindAiHooks
	};
}]);