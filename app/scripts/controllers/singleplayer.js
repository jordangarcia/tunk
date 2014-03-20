'use strict';

/**
 * Controller that initializes a single player room and game
 */
angular.module('tunk').controller('SinglePlayerCtrl', [
	'$scope',
	'singlePlayerService',
	'userService',
	'roomService',
	'events',
	'persistence',
	'singlePlayerConfig',
function($scope, singlePlayerService, userService, roomService, events, persistence, singlePlayerConfig) {
	// create the player
	var player = singlePlayerService.createPlayer(userService.user);
	var room = singlePlayerService.newRoom(player);

	// bind to scope
	$scope.player = player;
	$scope.room = room;

	events.on('gameUpdated', function() {
		persistence.saveRoom('singleplayer', $scope.room);
	});

	$scope.$on('$destroy', function() {
		singlePlayerService.stopGame();
	});
}]);
