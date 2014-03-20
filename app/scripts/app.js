'use strict';

/**
 * Main application definition
 */
angular.module('tunk', ['ngRoute', 'firebase', 'btford.modal', 'LocalStorageModule'])
.constant('HAND_SIZE', 5)
.constant('PICKUP_DISCARD_LIMIT', 2)
.constant('DEFAULT_WIN_AMOUNT', 7)
.constant('FIREBASE_URL', 'https://tunk.firebaseio.com/')
.constant('GAME_TYPE_TOURNAMENT', 'tournament')
.constant('GAME_TYPE_CASH', 'cash')
.config(['localStorageServiceProvider', function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('tunk');
}])
.config(['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: '/views/menu.html'
		})
		.when('/singleplayer', {
			templateUrl: '/views/game.html',
			controller: 'SinglePlayerCtrl'
		})
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
					// use $route.current instead of $routeParams as it isn't resolved yet
					return roomService.loadRoom($route.current.params['room']);
				}
			}
		})
		.otherwise({
			redirectTo: '/'
		});
}]);
