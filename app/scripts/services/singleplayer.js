'use strict';

/**
 * Server for setting up the SinglePlayer game mode
 */
angular.module('tunk').factory('singlePlayerService', [
	'playerFactory',
	'userFactory',
	'ai',
	'events',
	'roomService',
	'singlePlayerConfig',
function(playerFactory, userFactory, ai, events, roomService, singlePlayerConfig) {
	/**
	 * Creates a playerlist
	 *
	 * @param {String} username
	 * @return {Array}
	 */
	function createPlayer(user) {
		var player = playerFactory.create(user);
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
	 * If AI turn play game
	 *
	 * @param {Object} data
	 */
	function playTurn(data) {
		if (!isPlayersTurn(data.game)) {
			ai.playTurn(data.game);
		}
	}

	/**
	 * Bind to events for AI to take actions
	 */
	function bindAiHooks() {
		// if a new game starts check AI plays if its their turn
		events.on('newGame', playTurn);
		events.on('turnAdvanced', playTurn);
	}

	/**
	 * Unbind events
	 */
	function unbindAiHooks() {
		events.off('newGame', playTurn);
		events.off('turnAdvanced', playTurn);
	}

	/**
	 * Start a single player room and game
	 *
	 * @param {Object} player
	 */
	function startGame(player) {
		var aiPlayers = createAiPlayers(singlePlayerConfig.aiPlayers);
		var players = [player].concat(aiPlayers);

		// create the room
		var room = roomService.createRoom({
			name: 'room',
			gameType: singlePlayerConfig.gameType,
			winAmount: singlePlayerConfig.winAmount,
			stake: singlePlayerConfig.stake
		});

		roomService.startGame(room, players);

		bindAiHooks();

		return room;
	}

	/**
	 * Responsible for cleaning up a single player game/room
	 */
	function stopGame() {
		unbindAiHooks();
	}

	return {
		createPlayer: createPlayer,
		createAiPlayers: createAiPlayers,
		startGame: startGame,
		stopGame: stopGame
	};
}]);
