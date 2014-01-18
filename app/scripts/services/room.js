'use strict';

angular.module('tunk')
.factory('roomService', ['hostService', 'roomFactory', 'DEFAULT_WIN_AMOUNT',
function(hostService, roomFactory, DEFAULT_WIN_AMOUNT) {
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
	};

	return {
		createRoom: createRoom,
	};
}]);
