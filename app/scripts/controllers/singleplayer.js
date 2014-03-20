'use strict';

/**
 * Controller that initializes a single player room and game
 */
angular.module('tunk').controller('SinglePlayerCtrl', [
	'$scope',
	'singlePlayerService',
	'roomService',
	'singlePlayerConfig',
function($scope, singlePlayerService, roomService, singlePlayerConfig) {
	// create the player
	var player = singlePlayerService.createPlayer('Player');
	var room = singlePlayerService.startGame(player);

	// bind to scope
	$scope.player = player;
	$scope.room = room;

	$scope.$on('$destroy', function() {
		singlePlayerService.stopGame();
	});
}]);
