'use strict';

/**
 * Filter used for card sorting ordering
 */
angular.module('tunk')
.filter('cardOrder', ['$filter', function($filter) {
	var getValue = $filter('cardValue');
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

	return function(card) {
		return values[getValue(card)];
	}
}]);
