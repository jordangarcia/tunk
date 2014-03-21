'use strict';

/**
 * Controller that initializes a single player room and game
 */
angular.module('tunk').controller('SinglePlayerCtrl', [
	'$scope',
	'singlePlayerService',
	'userService',
	'events',
	'singlePlayerConfig',
	'gameService',
function($scope, singlePlayerService, userService, events, singlePlayerConfig, gameService) {
	var room = singlePlayerService.loadRoom();
	var player;

	if (!room) {
		// no saved game create new room
		player = singlePlayerService.createPlayer(userService.user);
		room = singlePlayerService.newRoom(player);
	} else {
		player = gameService.getPlayerByUser(room.game, userService.user);
	}

	singlePlayerService.initRoom(room);

	// bind to scope
	$scope.player = player;
	$scope.room = room;

	var saveRoom = function() {
		singlePlayerService.saveRoom($scope.room);
	};

	events.on('gameUpdated', saveRoom);

	$scope.$on('$destroy', function() {
		singlePlayerService.stopGame();
		events.off('gameUpdated', saveRoom);
	});
}]);
