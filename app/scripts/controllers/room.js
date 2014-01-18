'use strict';

/**
 * lists all rooms
 * players can join rooms
 * players can change their name
 */
angular.module('tunk')
.controller('RoomsCtrl',
['$scope', 'hostService', 'userService', '$location',
function($scope, hostService, userService, $location) {
	if (!userService.isUserLoggedIn()) {
		$location.url('/login');
	}

	$scope.userService = userService;

	$scope.createRoom = function() {

	};
}]);
