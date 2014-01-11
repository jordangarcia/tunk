angular.module('tunk')
.directive('opponent', function() {
	return {
		restrict: 'A',
		scope: {
			player: '=opponent'
		},
		templateUrl: '/views/directives/opponent.html',
	}; });
