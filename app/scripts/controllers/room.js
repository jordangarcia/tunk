'use strict';

/**
 * lists all rooms
 * players can join rooms
 * players can change their name
 */
angular.module('tunk')
.controller('RoomsCtrl',
['$scope', 'hostService', 'userService', 'roomService', '$location',
function($scope, hostService, userService, roomService, $location) {
	if (!userService.isUserLoggedIn()) {
		$location.url('/login');
	}

	$scope.rooms = hostService.rooms;
	$scope.userService = userService;

	$scope.createRoom = function(name) {
		roomService.createRoom(name);
		$scope.name = '';
	};
}]);
