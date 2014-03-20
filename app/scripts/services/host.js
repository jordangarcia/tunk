'use strict';

/**
 * Singleton that contains all of the state of all users and rooms which includes
 * all games
 */
angular.module('tunk').factory('hostService', [
	'$firebase',
	'FIREBASE_URL',
function($firebase, FIREBASE_URL) {
	var exports = {};

	exports.addUser = function(user) {
		users.$add(user);
	};

	exports.addRoom = function(name) {
		return $firebase(new Firebase(FIREBASE_URL + 'rooms/' + name));
	};

	/**
	 * Gets user by name
	 *
	 * @param {String} name
	 * @return {User|undefined}
	 */
	exports.getUserByName = function(name) {
		return _.findWhere(exports.users, {name: name});
	};

	return exports;
}]);
