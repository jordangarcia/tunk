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

	function unbindGameEvents(room) {
		if (room.gameType === GAME_TYPE_TOURNAMENT) {
			// bind event handlers for tournament games
			tournamentGame.unbindEvents();
		} else if (room.gameType === GAME_TYPE_CASH){
			throw "GAME_TYPE_CASH not implemented";
		} else {
			throw "Invalid gameType";
		}
	}

	function bindGameEvents(room) {
		if (room.gameType === GAME_TYPE_TOURNAMENT) {
			// bind event handlers for tournament games
			tournamentGame.bindEvents();
		} else if (room.gameType === GAME_TYPE_CASH){
			throw "GAME_TYPE_CASH not implemented";
		} else {
			throw "Invalid gameType";
		}
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
		bindGameEvents: bindGameEvents,
		unbindGameEvents: unbindGameEvents,
		initRoom: initRoom,
	};
}]);
