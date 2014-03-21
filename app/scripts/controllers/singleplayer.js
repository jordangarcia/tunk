'use strict';

/**
 * Controller that initializes a single player room and game
 */
angular.module('tunk').controller('SinglePlayerCtrl', [
	'$scope',
	'singlePlayerService',
	'userService',
	'events',
	'gameService',
function($scope, singlePlayerService, userService, events, gameService) {
	var room = singlePlayerService.loadRoom();
	var player;

	room   = room || singlePlayerService.createRoom(userService.user);
	player = gameService.getPlayerByUser(room.game, userService.user);

	singlePlayerService.initRoom(room);

	// bind to scope
	$scope.player = player;
	$scope.room = room;

	var saveRoom = function() {
		singlePlayerService.saveRoom($scope.room);
	};

	events.on('gameUpdated', saveRoom);

	$scope.$on('$destroy', function() {
		singlePlayerService.teardownRoom($scope.room);
		events.off('gameUpdated', saveRoom);
	});
}]);
