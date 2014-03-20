'use strict';

angular.module('tunk').factory('singlePlayerConfig', [
	'GAME_TYPE_TOURNAMENT',
function(GAME_TYPE_TOURNAMENT) {
	var DEFAULTS = {
		aiPlayers: 2,
		gameType: GAME_TYPE_TOURNAMENT,
		stake: 1,
		winAmount: 7
	};

	return DEFAULTS;
}]);
