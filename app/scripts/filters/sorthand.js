'use strict';

angular.module('tunk')
.filter('sortHand', ['$filter', function($filter) {
	var getOrder = $filter('cardOrder');

	return function(hand) {
		return _.sortBy(hand, function(c) {
			return getOrder(c);
		});
	}
}]);
