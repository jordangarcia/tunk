'use strict';

/**
 * controller for a multiplayer room through firebase
 */
angular.module('tunk').controller('RoomCtrl', [
	'$scope',
	'room',
	'gameService',
	'$routeParams',
	'events',
function($scope, room, gameService, $routeParams, events) {
	$scope.room = room;

	/**
	 * Syncs references to $scope.player and $scope.players after firebase loading
	 */
	function syncPlayer() {
		$scope.players = $scope.room.game.players;
		$scope.room.game.players.forEach(function(player, ind) {
			if (player.user.name === $routeParams['user']) {
				$scope.player = player;
			}
		});
	}

	// initial syncing of $scope.player and $scope.players
	syncPlayer();

	// Save the entire game state
	events.on('gameUpdated', function() {
		$scope.room.$save('game').then(function() {
			// doing $angularfire.$save will replace the object ref with the parsed
			// firebase data and turn any empty arrays into undefined
			gameService.restoreArrays($scope.room.game);
		});
	});

	// sync player referenced anytime the firebase data is changed
	$scope.room.$on('change', function() {
		syncPlayer();
	});
}]);
