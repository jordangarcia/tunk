'use strict';

/**
 * Controller responsible for binding player actions and the game state
 * to the UI
 */
angular.module('tunk').filter('actionValidateMethod', [
function() {
	/**
	 * Gets the corresponding validation method given a player action name
	 */
	return function getValidationMethod(actionMethod) {
		return 'can' + actionMethod.charAt(0).toUpperCase() + actionMethod.slice(1);
	}
}]);
