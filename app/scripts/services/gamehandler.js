'use strict';

angular.module('tunk')
.factory('gameHandler', ['events', function(events) {

	function bindDefaultGameEvents() {
		events.on('discard', handleDiscard);
		events.on('playSet', handlePlaySet);
		events.on('playOnSet', handlePlayOnSet);
		events.on('goDown', handleGoDown);
	}

	function unbindDefaultGameEvents() {
		events.off('discard');
		events.off('playSet');
		events.off('playOnSet');
		events.off('goDown');
	}

	/**
	 * Handles the discard event
	 *
	 * @param {Object} data
	 */
	function handleDiscard(data) {
		var game = data.game;
		var player = data.player;

		debugger;

		if (player.hand.length === 0) {
			events.trigger('outOfCards', {
				game: game,
				player: player
			});
		} else {
			game.advanceTurn(game.getNextPlayer());
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
			game.log.write(player.user.name + ' TUNKED OUT!');

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
			game.log.write(player.user.name + ' has no cards remaining');

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

		game.log.write(player.user.name + ' went down with ' + player.handScore());

		var lowestScorers = game.getLowestScorers();

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
				plyaer: player,
				result: 'tie',
				winners: lowestScorers
			});
		}
	}

	return {
		bindDefaultGameEvents: bindDefaultGameEvents,
		unbind: unbindDefaultGameEvents
	};
}]);
