'use strict';

angular.module('tunk')
.factory('roomService', ['hostService', 'roomFactory', 'gameFactory', 'DEFAULT_WIN_AMOUNT', 'HAND_SIZE', 'events', 'gameHandlers',
function(hostService, roomFactory, gameFactory, DEFAULT_WIN_AMOUNT, HAND_SIZE, events, gameHandlers) {
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
		// TODO clean this up
		room.game = gameFactory.create();
		room.game.players = players;
		// the first player in the array goes first
		newGame(room.game, players[0]);

		// bind events for tournament games
		bindTournamentGameEvents();
		// mark the game as running
		room.status = 'running';
	}

	/**
	 * @param {Game} game
	 * @param {Player} playerToGo
	 */
	function newGame(game, playerToGo) {
		game.log.write('Starting a new game');
		game.reset(playerToGo);
		game.deal(HAND_SIZE);
	}

	/**
	 * Binds the game logic event handlers for tournament games
	 */
	function bindTournamentGameEvents() {
		events.on('discard', gameHandlers.discard);
		events.on('playSet', gameHandlers.playSet);
		events.on('playOnSet', gameHandlers.playOnSet);
		events.on('goDown', gameHandlers.goDown);

		events.on('gameEnd', function(data) {
			var game = data.game;
			var playerToGo = data.playerToGo;

			// todo check if the match ended
			game.reset(playerToGo);
			game.deal(HAND_SIZE);
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
		createRoom: createRoom,
		startGame: startGame
	};
}]);
