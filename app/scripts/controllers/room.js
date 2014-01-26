'use strict';

/**
 * controller for a single room
 */
angular.module('tunk')
.controller('RoomCtrl',
['$scope', '$routeParams', 'hostService', 'roomService', 'playerFactory', 'userFactory', '$q', 'events',
function($scope, $routeParams, hostService, roomService, playerFactory, userFactory, $q, events) {
	var deferred = $q.defer();
	$scope.loaded = deferred.promise;

	$scope.loaded.then(function(data) {
		$scope.room.game.players.forEach(function(player, ind) {
			if (player.user.name === username) {
				$scope.player = player;
			}
		});
	});

	var username = $routeParams['user'];
	var roomName = $routeParams['room'];

	// Bootstrap for dev
	$scope.players = [
		playerFactory.create(userFactory.create('jordan')),
		playerFactory.create(userFactory.create('logan'))
	];

	$scope.room = hostService.addRoom(roomName);
	$scope.room.$on('loaded', function(data) {
		$scope.room
		if (!data) {
			$scope.room.$set(roomService.createRoom(roomName)).then(function() {
				roomService.startGame($scope.room, $scope.players);

				$scope.room.$save();
				deferred.resolve(data);
			});
		} else {
			roomService.loadGame($scope.room);
			deferred.resolve(data);
		}
	});

	events.on('gameUpdated', function() {
		$scope.room.$save();
	});
}]);
