'use strict';

angular.module('tunk', ['ngRoute', 'firebase'])
.constant('HAND_SIZE', 5)
.constant('PICKUP_DISCARD_LIMIT', 2)
.constant('DEFAULT_WIN_AMOUNT', 7)
.constant('FIREBASE_URL', 'https://tunk.firebaseio.com/')
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
		.when('/game/:room/:user', {
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
