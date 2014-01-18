'use strict';

/**
 * controller for a single room
 */
angular.module('tunk')
.controller('RoomCtrl',
['$scope', '$routeParams', 'hostService', 'roomService', 'playerFactory',
function($scope, $routeParams, hostService, roomService, playerFactory) {
	// Bootstrap for dev
	roomService.createRoom('test');
	$scope.players = [
		playerFactory.create('jordan'),
		playerFactory.create('logan'),
		playerFactory.create('scott'),
	];

	$scope.room = hostService.getRoom($routeParams.roomId);

	//more bootstrap
	roomService.startGame($scope.room, $scope.players);
}]);
