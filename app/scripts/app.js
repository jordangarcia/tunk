'use strict';

angular.module('tunk', ['ngRoute'])
.constant('HAND_SIZE', 5)
.constant('PICKUP_DISCARD_LIMIT', 2)
.constant('DEFAULT_WIN_AMOUNT', 7)
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl'
		})
		.when('/rooms', {
			templateUrl: 'views/rooms.html',
			controller: 'RoomListCtrl'
		})
		.when('/game/:roomId', {
			templateUrl: 'views/game.html',
			controller: 'RoomCtrl'
		})
		.otherwise({
			redirectTo: '/login'
		})
		;
}])

.run([function() {

}]);
;
