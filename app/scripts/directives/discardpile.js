angular.module('tunk')
.directive('discardPile', ['PICKUP_DISCARD_LIMIT', function(limit) {
	return {
		scope: {
			discardPile: '=',
			game: '=',
			player: '=',
			onCardClick: '='
		},
		templateUrl: '/views/directives/discardpile.html',
		link: function($scope) {
			$scope.pickupOffset = limit;
		}
	};
}]);
