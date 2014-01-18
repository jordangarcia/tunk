'use strict';

angular.module('tunk')
.controller('LoginCtrl',
['$scope', 'userService', '$location',
function($scope, userService, $location) {
	$scope.attemptLogin = function(name) {
		userService.handleLogin(name);
		$location.url('/rooms');
	};
}]);
