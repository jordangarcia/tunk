angular.module('tunk')
.filter('cardValue', function() {
	return function(input) {
		return input.charAt(0);
	}
});
