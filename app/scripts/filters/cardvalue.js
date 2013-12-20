angular.module('tonk')
.filter('cardValue', function() {
	return function(input) {
		return input.charAt(0);
	}
});
