'use strict';

/**
 * Calculates the offset (0-based) of some value from the endof the array
 */
angular.module('tunk')
.filter('offsetFromEnd', function() {
	return function(arr, val) {
		var len = arr.length;
		var ind = arr.indexOf(val);

		if (ind === -1) {
			throw new Error("offsetFromEnd: %s is not in %o", val, arr);
		}

		return (len - ind - 1);
	}
});
