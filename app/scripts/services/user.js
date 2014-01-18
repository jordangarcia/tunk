'use strict';

/**
 * UserService
 *
 * Manages the state of the current user and stores the current users user entity
 * Expose methods to do things such as rename the user
 */
angular.module('tunk')
.factory('userService', ['userFactory', 'hostService',
function(userFactory, hostService) {
	var exports = {};

	/**
	 * Checks if the user is logged in
	 *
	 * @return {Boolean}
	 */
	exports.isUserLoggedIn = function() {
		return !!exports.user;
	};

	/**
	 * Looks up a user by name or creates a user then saves reference
	 *
	 * @param {String} name
	 */
	exports.handleLogin = function(name) {
		// get or create user
		var user = hostService.getUserByName(name);
		if (!user) {
			user = userFactory.create(name);
		}

		// set the user on the hostService
		hostService.addUser(user);

		// set the current user reference
		exports.user = user;
	};

	/**
	 * Returns the user
	 *
	 * @param {String} name
	 */
	exports.renameUser = function(name) {
		if (name) {
			console.log('renaming user to %s', name);
			exports.user.name = name;
		}
	};

	return exports;
}]);
