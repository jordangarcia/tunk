'use strict';

/**
 * lists all rooms
 * players can join rooms
 * players can change their name
 */
angular.module('tunk')
.controller('RoomListCtrl',
['$scope', 'hostService', 'userService', 'roomService', '$location',
function($scope, hostService, userService, roomService, $location) {
	// BOOTSTRAP FOR DEV
	userService.handleLogin('Jordan');

	roomService.createRoom('room1');

	// redirect to login if needed
	if (!userService.isUserLoggedIn()) {
		$location.url('/login');
	}

	// pass the hosted rooms in to scope
	$scope.rooms = hostService.rooms;

	$scope.userService = userService;

	/**
	 * Creates a room and persists it
	 *
	 * @param {String} name
	 */
	$scope.createRoom = function(name) {
		roomService.createRoom(name);
		// reset the name for input field
		$scope.name = '';
	};

	/**
	 * @param {Integer} id roomId
	 */
	$scope.joinRoom = function(id) {
		$location.url('/game/'+id);
	};
}]);
