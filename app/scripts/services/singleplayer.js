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
	'gameService',
	'persistence',
	'roomFactory',
	'singlePlayerConfig',
function(playerFactory, userFactory, ai, events, roomService, gameService, persistence, roomFactory, singlePlayerConfig) {
	var SINGLEPLAYER_ROOM_ID = 'singleplayer';

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
	 * Starts a new game and makes ai play if its their turn
	 *
	 * @param {Object} game
	 * @param {Object} playerToGo
	 */
	function newGame(game, playerToGo) {
		gameService.resetGame(game, playerToGo);

		aiPlayTurn({
			game: game
		});
	}

	/**
	 * Event handler for AI to play turn
	 *
	 * @param {Object} data
	 */
	function aiPlayTurn(data) {
		if (!data.game.turn.currentPlayer.isHuman) {
			ai.playTurn(data.game);
		}
	}

	/**
	 * Bind to events for AI to take actions
	 */
	function bindAiHooks() {
		// if a new game starts check AI plays if its their turn
		events.on('turnAdvanced', aiPlayTurn);
	}

	/**
	 * Unbind events
	 */
	function unbindAiHooks() {
		events.off('turnAdvanced', aiPlayTurn);
	}

	/**
	 * Creates and returns a room object with player and game
	 *
	 * @param {Object} user
	 * @return {Object} room
	 */
	function createRoom(user) {
		var player    = playerFactory.create(user);
		var aiPlayers = createAiPlayers(singlePlayerConfig.numAiPlayers);
		var players   = [player].concat(aiPlayers);
		var game      = gameService.createGame(players, player);

		// create the room
		var room = roomService.createRoom({
			name:       'singleplayer',
			status:     roomFactory.NOT_STARTED,
			game:       game,
			gameType:   singlePlayerConfig.gameType,
			winAmount:  singlePlayerConfig.winAmount,
			stake:      singlePlayerConfig.stake
		});

		return room;
	}

	/**
	 * @param {Object} room
	 */
	function initRoom(room) {
		roomService.bindGameEvents(room);
		bindAiHooks();
		aiPlayTurn({
			game: room.game
		});
	}

	/**
	 * Responsible for cleaning up a single player game/room
	 *
	 * @param {Object} room
	 */
	function teardownRoom(room) {
		roomService.unbindGameEvents(room);
		unbindAiHooks();
	}

	/**
	 * @param {Object} room
	 */
	function saveRoom(room) {
		persistence.saveRoom(SINGLEPLAYER_ROOM_ID, room);
	}

	/**
	 * @return {Object} room
	 */
	function loadRoom() {
		return persistence.loadRoom(SINGLEPLAYER_ROOM_ID);
	}

	/**
	 * @return {Object} room
	 */
	function deleteSavedRoom() {
		return persistence.deleteRoom(SINGLEPLAYER_ROOM_ID);
	}

	function stopGame() {
		unbindAiHooks();
	}

	return {
		createPlayer: createPlayer,
		createRoom: createRoom,
		newGame: newGame,
		initRoom: initRoom,
		teardownRoom: teardownRoom,
		loadRoom: loadRoom,
		saveRoom: saveRoom,
		deleteSavedRoom: deleteSavedRoom,
	};
}]);
