'use strict';

/**
 * UserService
 *
 * Manages the state of the current user and stores the current users user entity
 * Expose methods to do things such as rename the user
 */
angular.module('tunk').factory('userService', [
	'userFactory',
	'localStorageService',
function(userFactory, localStorage) {
	// local storage keys
	var LS_USER = 'user';

	function saveUser(user) {
		localStorage.add(LS_USER, user);
	}

	/**
	 * UserService object
	 */
	function UserService() {
		this.user = localStorage.get(LS_USER);
		if (!this.user) {
			this.user = userFactory.create('Player');
			saveUser(this.user);
		}

		console.log('UserService instantiated ', this.user);
	}

	UserService.prototype.rename = function(newName) {
		this.user.name = newName;
		saveUser(this.user);
	};

	return new UserService();
}]);
