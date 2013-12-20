angular.module('tonk')
.filter('sortHand', ['$filter', function($filter) {
	var getCardValue = $filter('cardValue');
	var values = {
		'A': 1,
		'2': 2,
		'3': 3,
		'4': 4,
		'5': 5,
		'6': 6,
		'7': 7,
		'8': 8,
		'9': 9,
		'T': 10,
		'J': 11,
		'Q': 12,
		'K': 13,
	};

	return function(hand) {
		return _.sortBy(hand, function(c) {
			return values[getCardValue(c)];
		});
	}
}]);
