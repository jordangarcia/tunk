angular.module('tunk')
.directive('tCard', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			card: '@'
		},
		templateUrl: '/views/directives/card.html'
	};
});
