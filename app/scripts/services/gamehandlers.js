'use strict';

/**
 * service/gameHandlers
 *
 * library of game handler that happen for every game type of tunk
 */
angular.module('tunk')
.factory('gameHandlers', ['gameService', 'events', '$filter', 'gamelog',
function(gameService, events, $filter, gamelog) {
	var handScore = $filter('handScore');

	/**
	 * Handles the discard event
	 *
	 * @param {Object} data
	 */
	function handleDiscard(data) {
		var game = data.game;
		var player = data.player;

		if (player.hand.length === 0) {
			events.trigger('outOfCards', {
				game: game,
				player: player
			});
		} else {
			gameService.advanceTurn(game);

			events.trigger('turnAdvanced');
		}
	}

	/**
	 * Handles when a player puts down a set
	 *
	 * @param {Object} data
	 */
	function handlePlaySet(data) {
		var game = data.game;
		var player = data.player;

		if (player.hand.length === 0) {
			gamelog.write(player.user.name + ' TUNKED OUT!');

			events.trigger('tunkOut', {
				game: game,
				player: player
			});
		}
	}

	/**
	 * Handles when a player plays a card on their or opponents set
	 *
	 * @param {Object} data
	 */
	function handlePlayOnSet(data) {
		var game = data.game;
		var player = data.player;

		if (player.hand.length === 0) {
			gamelog.write(player.user.name + ' has no cards remaining');

			events.trigger('outOfCards', {
				game: game,
				player: player
			});
		}
	}

	/**
	 * Handles when a player goes down
	 *
	 * @param {Object} data
	 */
	function handleGoDown(data) {
		var game = data.game;
		var player = data.player;

		gamelog.write(player.user.name + ' went down with ' + handScore(player.hand));

		var lowestScorers = gameService.getLowestScorers(game);

		if (!_.contains(lowestScorers, player)) {
			// one or more people had a lower hand score than the player 'going down'
			events.trigger('goDownResult', {
				game: game,
				player: player,
				result: 'lose',
				winners: lowestScorers
			});
		} else if (lowestScorers.length === 1) {
			// the player went down and has the lowest score (no-tie)
			events.trigger('goDownResult', {
				game: game,
				player: player,
				result: 'win',
				winners: lowestScorers
			});
		} else {
			// player went down and tied with other players
			events.trigger('goDownResult', {
				game: game,
				player: player,
				result: 'tie',
				winners: lowestScorers // TODO should return _.without player?
			});
		}
	}

	return {
		discard: handleDiscard,
		playSet: handlePlaySet,
		playOnSet: handlePlayOnSet,
		goDown: handleGoDown
	};
}]);
