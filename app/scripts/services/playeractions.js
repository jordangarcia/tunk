'use strict';

/**
 * service/playerActions
 *
 * This module provides functions representing an action a player could take in a game of Tunk
 */
angular.module('tunk')
.factory('playerActions', ['$filter', 'events',
function($filter, events) {

	/**
	 * Draws a card from the game deck and gives to player
	 * No validation
	 *
	 * @param {Object} game
	 * @param {Object} player
	 */
	function drawCard(game, player) {
		// shift off the top card of the deck and put into players hand
		player.hand.push(game.deck.shift());
		game.turn.hasDrawn = true;
	}

	/**
	 * Draws a card from the discard pile and gives to player
	 * No validation
	 *
	 * @param {Object} game
	 * @param {Object} player
	 * @param {String} card
	 */
	function drawDiscard(game, player, card) {
		var ind = game.discardPile.indexOf(card);
		if (ind === -1) {
			throw new Error("Cannot draw discard %s, not in discardPile", card);
		}

		game.discardPile.splice(ind, 1);
		player.hand.push(card);
		game.turn.hasDrawn = true;
	}

	/**
	 * Removes set of cards from players hand and adds to player
	 * No validation
	 *
	 * @param {Object} game
	 * @param {Object} player
	 * @param {Array} card
	 */
	function playSet(game, player, set) {
		// remove the set from player's hand
		player.hand = _.difference(player.hand, set);
		// add set to playedSets
		player.playedSets.push(set);
		// check win
		events.trigger('playSet', {
			game: game,
			player: player,
			set: set
		});
	}

	/**
	 * Removes card from hand and plays on set
	 *
	 * @param {Object} game
	 * @param {Object} player
	 * @param {Array} set
	 * @param {String} card
	 */
	function playOnSet(game, player, set, card) {
		player.hand.splice(player.hand.indexOf(card), 1);
		set.push(card);
		events.trigger('playOnSet', {
			game: game,
			player: player,
			set: set,
			card: card
		});
	}

	/**
	 * Removes card from hand and puts in discard
	 * Checks outOfCards win
	 *
	 * @param {Object} game
	 * @param {Object} game
	 * @param {String} card
	 */
	function discard(game, player, card) {
		player.hand.splice(player.hand.indexOf(card), 1);
		game.discardPile.push(card);
		game.turn.hasDiscarded = true;

		events.trigger('discard', {
			game: game,
			player: player,
			card: card
		});
	}

	/**
	 * Removes card from hand and plays on set
	 *
	 * @param {Object} game
	 * @param {Object} player
	 * @param {Object} opponent
	 * @param {Array} set
	 * @param {String} card
	 */
	function freeze(game, player, opponent, set, card) {
		opponent.isFrozen = true;
		playOnSet(game, player, set, card);
	}

	/**
	 * @param {Object} game
	 * @param {Object} player
	 */
	function goDown(game, player) {
		events.trigger('goDown', {
			game: game,
			player: player
		});
	}

	return {
		drawCard:     drawCard,
		drawDiscard:  drawDiscard,
		discard:      discard,
		playSet:      playSet,
		freeze:       freeze,
		playOnSet:    playOnSet,
		goDown:       goDown
	};
}]);
