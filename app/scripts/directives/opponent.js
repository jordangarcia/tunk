angular.module('tunk')
.directive('opponent', function() {
	return {
		restrict: 'A',
		transclude: true,
		scope: {
			player: '=opponent'
		},
		templateUrl: '/views/directives/opponent.html',
	}; });
