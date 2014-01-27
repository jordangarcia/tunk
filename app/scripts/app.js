'use strict';

angular.module('tunk', ['ngRoute', 'firebase'])
.constant('HAND_SIZE', 5)
.constant('PICKUP_DISCARD_LIMIT', 2)
.constant('DEFAULT_WIN_AMOUNT', 7)
.constant('FIREBASE_URL', 'https://tunk.firebaseio.com/')
.config(['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/login', {
			templateUrl: '/views/login.html',
			controller: 'LoginCtrl'
		})
		.when('/rooms', {
			templateUrl: '/views/rooms.html',
			controller: 'RoomListCtrl'
		})
		.when('/game/:room/:user', {
			templateUrl: '/views/game.html',
			controller: 'RoomCtrl',
			resolve: {
				room: function($route, roomService) {
					return roomService.loadRoom($route.current.params['room']);
				}
			}
		})
		.otherwise({
			redirectTo: '/login'
		})
		;
}])

.run([function() {

}])
;
