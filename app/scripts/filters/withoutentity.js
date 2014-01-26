'use strict';

/**
 * Takes an array of entities (objects with id property) and returns the array without that entity
 */
angular.module('tunk')
.filter('withoutEntity', function() {
	/**
	 * @param {Array} arr
	 * @param {Object} entity
	 */
	return function(arr, entity) {
		if (entity.id === undefined) {
			throw new Error("entity must have id property");
		}
		return arr.filter(function(item) {
			return !(item.id === entity.id);
		});
	}
});
