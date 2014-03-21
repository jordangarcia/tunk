'use strict';

/**
 * Room Service
 *
 * Responsible for functions that manage the Room
 */
angular.module('tunk')
.factory('roomService', [
	'roomFactory',
	'gameFactory',
	'GAME_TYPE_TOURNAMENT',
	'GAME_TYPE_CASH',
	'gameService',
	'playerFactory',
	'userFactory',
	'tournamentGame',
function(roomFactory, gameFactory, GAME_TYPE_TOURNAMENT, GAME_TYPE_CASH, gameService, playerFactory, userFactory, tournamentGame) {
	/**
	 * Creates a room, initializes a game, persists to host
	 *
	 * @param {String} name
	 */
	function createRoom(opts) {
		var room = roomFactory.create();
		_.extend(room, opts);
		return room;
	}

	/**
	 * Creates a game for a room
	 * Takes a room with and initializes the game and players
	 *
	 * @param {Room} room
	 * @param {Array} players
	 */
	function startGame(room, players) {
		// create a game instance on the room
		room.game = gameFactory.create();
		// add players
		room.game.players = players;
		// initialize the game state
		// the first player in the array goes first
		gameService.newGame(room.game, players[0]);

		if (room.gameType === GAME_TYPE_TOURNAMENT) {
			// bind event handlers for tournament games
			tournamentGame.bindEvents();
		} else if (room.gameType === GAME_TYPE_CASH){
			throw "GAME_TYPE_CASH not implemented";
		} else {
			throw "Invalid gameType";
		}
		// mark the game as running
		room.status = 'running';
	}

	/**
	 * Destroys a game and unbinds the events
	 *
	 * @param {Object} room
	 */
	function destroyGame(room) {
		throw "Not implemented";
	}

	return {
		createRoom: createRoom,
		startGame: startGame
	};
}]);
