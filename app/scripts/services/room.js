'use strict';

/**
 * Room Service
 *
 * Responsible for functions that manage the Room
 */
angular.module('tunk')
.factory('roomService', [
	'hostService',
	'roomFactory',
	'gameFactory',
	'DEFAULT_WIN_AMOUNT',
	'GAME_TYPE_TOURNAMENT',
	'GAME_TYPE_CASH',
	'gameService',
	'$q',
	'playerFactory',
	'userFactory',
	'tournamentGame',
function(hostService, roomFactory, gameFactory, DEFAULT_WIN_AMOUNT, GAME_TYPE_TOURNAMENT, GAME_TYPE_CASH, gameService, $q, playerFactory, userFactory, tournamentGame) {
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
	 * Loads a game via the hostService
	 * Wraps the room loading in a promise
	 *
	 * @param {String} roomName
	 * @return {Promise}
	 */
	function loadRoom(roomName) {
		var deferred = $q.defer();
		var room = hostService.addRoom(roomName);

		room.$on('loaded', function(data) {
			if (!data) {
				console.log('creating room');
				var newRoom = createRoom(roomName);
				startGame(newRoom, [
					playerFactory.create(userFactory.create('jordan')),
					playerFactory.create(userFactory.create('logan')),
				]);
				gameService.restoreArrays(room.game);

				newRoom.game.players[0].hand = ['2h', '2c', '2d'];
				room.$set(newRoom).then(function() {
					deferred.resolve(room);
				});
			} else {
				console.log('loading room');
				gameService.restoreArrays(room.game);
				tournamentGame.bindEvents();
				deferred.resolve(room);
			}
		});

		return deferred.promise;
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
		loadRoom: loadRoom,
		startGame: startGame
	};
}]);
