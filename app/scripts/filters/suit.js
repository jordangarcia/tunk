angular.module('tonk')
.filter('suit', function() {
	var suits = {
		's': 'spades',
		'c': 'clubs',
		'h': 'hearts',
		'd': 'diamonds',
	};

	return function(input) {
		return suits[input.charAt(1)];
	}
});
