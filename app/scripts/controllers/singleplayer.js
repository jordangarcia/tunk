'use strict';

/**
 * Controller that initializes a single player room and game
 */
angular.module('tunk')
.controller('SinglePlayerCtrl', ['$scope', 'singlePlayerService', 'roomService',
function($scope, singlePlayerService, roomService) {
	// create the player
	var player = singlePlayerService.createPlayer('Player');
	// create AI players
	var aiPlayers = singlePlayerService.createAiPlayers(2);
	// concat into single players array
	var players = [player].concat(aiPlayers);
	// create the room
	var room = roomService.createRoom('room');
	roomService.startGame(room, players);

	singlePlayerService.bindAiHooks();

	// bind to scope
	$scope.player = player;
	$scope.players = players;
	$scope.room = room;
}]);
