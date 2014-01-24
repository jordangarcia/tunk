'use strict';

/**
 * controller for a single room
 */
angular.module('tunk')
.controller('RoomCtrl',
['$scope', '$routeParams', 'hostService', 'roomService', 'playerFactory', 'userFactory', '$q',
function($scope, $routeParams, hostService, roomService, playerFactory, userFactory, $q) {
	var deferred = $q.defer();
	$scope.loaded = deferred.promise;

	$scope.loaded.then(function() {
		$scope.player = _.find($scope.room.game.players, function(player) {
			return player.user.name === username;
		});
	});

	var username = $routeParams['user'];
	var roomName = $routeParams['room'];

	// Bootstrap for dev
	$scope.players = [
		playerFactory.create(userFactory.create('jordan')),
		playerFactory.create(userFactory.create('logan')),
		playerFactory.create(userFactory.create('scott')),
	];

	$scope.room = hostService.addRoom(roomName);
	$scope.room.$on('loaded', function(data) {
		if (!data) {
			$scope.room.$set(roomService.createRoom(roomName)).then(function() {
				debugger;
				roomService.startGame($scope.room, $scope.players);

				$scope.room.$save();
				deferred.resolve();
			});
		} else {
			deferred.resolve();
		}
	});

}]);
