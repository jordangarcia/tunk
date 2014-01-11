angular.module('tunk')
.directive('discardPile', ['PICKUP_DISCARD_LIMIT', function(limit) {
	return {
		restrict: 'A',
		scope: {
			discardPile: '=',
			onCardClick: '=',
		},
		templateUrl: '/views/directives/discardPile.html',
	};
}]);
