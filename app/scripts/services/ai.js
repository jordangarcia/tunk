'use strict';

/**
 * Server for setting up the SinglePlayer game mode
 */
angular.module('tunk')
.factory('ai', ['playerActions', 'gameService', '$q',
function(playerActions, gameService, $q) {
	function think(time) {
		var deferred = $q.defer();

		setTimeout(function() {
			deferred.resolve();
		}, time);

		return deferred.promise;
	}

	/**
	 * Plays a turn for an AI player
	 */
	function playTurn(game) {
		var currentPlayer = gameService.getCurrentPlayer(game);
		var drawCard = playerActions.drawCard.bind(null, game, currentPlayer);
		var discard = playerActions.discard.bind(null, game, currentPlayer, currentPlayer.hand[0]);
		think(1000).then(drawCard)
			.then(function() {
				think(1000).then(discard);
			});
	}

	return {
		playTurn: playTurn
	};
}]);
