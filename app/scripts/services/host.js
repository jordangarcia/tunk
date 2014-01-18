'use strict';

/**
 * Singleton that contains all of the state of all users and rooms which includes
 * all games
 */
angular.module('tunk')
.factory('hostService', [function() {
	var exports = {};

	exports.users = [];
	exports.rooms = [];

	exports.addUser = function(user) {
		exports.users.push(user);
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

	/**
	 * Gets room by id
	 *
	 * @param {Integer} id
	 * @return {Room|undefined}
	 */
	exports.getRoom = function(id) {
		return _.findWhere(exports.rooms, {id: parseInt(id, 10) });
	}

	return exports;
}]);
