angular.module('tunk')
.directive('discardPile', ['PICKUP_DISCARD_LIMIT', function(limit) {
	return {
		restrict: 'E',
		scope: {
			cards: '=',
			onCardClick: '=',
		},
		templateUrl: '/views/directives/discardPile.html',
	};
}]);
