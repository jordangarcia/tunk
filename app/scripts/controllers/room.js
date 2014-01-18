'use strict';

/**
 * controller for a single room
 */
angular.module('tunk')
.controller('RoomCtrl',
['$scope', '$routeParams', 'hostService', 'roomService', 'playerFactory', 'userFactory',
function($scope, $routeParams, hostService, roomService, playerFactory, userFactory) {
	// Bootstrap for dev
	roomService.createRoom('test');
	$scope.players = [
		playerFactory.create(userFactory.create('jordan')),
		playerFactory.create(userFactory.create('logan')),
		playerFactory.create(userFactory.create('scott')),
	];

	$scope.room = hostService.getRoom($routeParams.roomId);

	//more bootstrap
	roomService.startGame($scope.room, $scope.players);
}]);
