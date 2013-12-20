angular.module('tunk')
.filter('handScore', ['$filter', function($filter) {
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
		'J': 10,
		'Q': 10,
		'K': 10,
	};

	return function(hand) {
		return hand.reduce(function(memo, card) {
			return memo + values[getCardValue(card)];
		}, 0);
	}
}]);
