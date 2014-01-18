'use strict';

angular.module('tunk')
.factory('roomService', ['hostService', 'roomFactory', 'gameFactory', 'gameActions', 'DEFAULT_WIN_AMOUNT',
function(hostService, roomFactory, gameFactory, gameActions, DEFAULT_WIN_AMOUNT) {
	/**
	 * Creates a room, initializes a game, persists to host
	 *
	 * @param {String} name
	 */
	function createRoom(name) {
		var room = roomFactory.create(name);
		room.name = name;
		room.winAmount = DEFAULT_WIN_AMOUNT;

		hostService.rooms.push(room);
	}

	/**
	 * Creates a game for a room
	 *
	 * @param {Room} room
	 * @param {Array} players
	 */
	function startGame(room, players) {
		room.game = gameFactory.create();
		room.game.players = players;
		// the first player in the array goes first
		gameActions.newGame(room.game, players[0]);
		// mark the game as running
		room.status = 'running';
	}

	return {
		createRoom: createRoom,
		startGame: startGame
	};
}]);
