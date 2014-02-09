'use strict';

/**
 * Server for setting up the SinglePlayer game mode
 */
angular.module('tunk')
.factory('ai', ['$filter', 'playerActions', 'gameService', '$q', 'PICKUP_DISCARD_LIMIT', 'deckFactory', 'handEV',
function($filter, playerActions, gameService, $q, PICKUP_DISCARD_LIMIT, deckFactory, handEV) {
	var handScore = $filter('handScore');
	var WHOLE_DECK = deckFactory.create();

	/**
	 * decision is an object returned from a AI decision it has an action and args property
	 *
	 * @param {Object} game
	 * @param {Object} player
	 * @param {Object} decision
	 */
	function playAction(game, player, decision) {
		console.log("%s: %s %o", player.user.name, decision.action, decision.args);
		playerActions[decision.action].apply(null, [game, player].concat(decision.args));
	}

	/**
	 * @param {Array} withoutCards
	 */
	function deckWithout(withoutCards) {
		return _.without.apply(null, [WHOLE_DECK].concat(withoutCards));
	}

	/**
	 * @param {Array} discardPile
	 */
	function getElibleDiscards(discardPile) {
		var cards = [];
		for (var i = discardPile.length - 1; i >= 0; i--) {
			cards.push(discardPile[i]);
		}
		return cards;
	}

	/**
	 * Sorts objects asc based on their .ev property
	 *
	 * @param {Array} options
	 * @return {Object}
	 */
	function sortByEV(options) {
		// sort the options ASC and make the best decision
		return _.sortBy(options, function(a) {
			return a.ev;
		});
	}

	function think(time) {
		var deferred = $q.defer();

		setTimeout(function() {
			deferred.resolve();
		}, time);

		return deferred.promise;
	}

	/**
	 * Weighs the options of drawing a random card vs drawing an eligible
	 * card in the discard pile and takes the most +EV action
	 *
	 * @param {Array} hand
	 * @param {Array} discardPile
	 *
	 * @return {Object}
	 */
	function getDrawDecision(hand, discardPile, playerSets, opponentSets, config) {
		var options = [];
		var eligibleDiscards = getElibleDiscards(discardPile);
		// Calculate the handEV after drawing a discard card
		getElibleDiscards(discardPile).forEach(function(card) {
			options.push({
				action: 'drawDiscard',
				args: [card],
				ev: handEV(hand.concat(card))
			});
		});

		// a whole deck without the discard pile and cards in players hand
		// get all cards in deck without the players hand and discard pile
		var deck = deckWithout(hand.concat(discardPile));
		// calculates the average ev of drawing a random card
		var totalDrawRandomEV = deck.reduce(function(prev, card) {
			return prev + handEV(hand.concat(card));
		}, 0);

		// TODO add calculating the EV of using card in hand to `playOnSet`

		// add the draw random card option
		options.push({
			action: 'drawCard',
			args: [],
			ev: totalDrawRandomEV / deck.length
		});

		return sortByEV(options)[0];
	}

	/**
	 * Weighs the options of drawing a random card vs drawing an eligible
	 * card in the discard pile and takes the most +EV action
	 *
	 * @param {Object} game
	 * @param {Object} player
	 * @param {Object} config
	 */
	function makeDrawDecision(game, player, config) {
		var decision = getDrawDecision(player.hand, game.discardPile);
		playAction(game, player, decision);
	}

	/**
	 * Weighs the options of discarding a card from the players hand
	 *
	 * @param {Object} game
	 * @param {Object} player
	 * @param {Object} config
	 */
	function makeDiscardDecision(game, player, config) {
		var options = [];
		player.hand.forEach(function(card, ind, hand) {
			// get the draw card EV based with the current hand without card
			var ev = getDrawDecision(_.without(hand, card), game.discardPile).ev;

			options.push({
				action: 'discard',
				args: [card],
				ev: ev
			});
		});

		var decision = sortByEV(options)[0];
		playAction(game, player, decision);
	}

	/**
	 * Plays the best set available
	 *
	 * @param {Object} game
	 * @param {Object} player
	 * @param {Object} config
	 */
	function makePlaySetDecision(game, player, config) {
		// analyze hand and find the most optimal way to play the sets in the hand
		var info = handEV.findOptimalSets(player.hand);

		// there is a set that can be played
		if (info.playedSets.length > 0) {
			info.playedSets.forEach(function(set) {
				playAction(game, player, {
					action: 'playSet',
					args: [set]
				});
			});
		}
	}

	/**
	 * Plays a turn for an AI player
	 *
	 * @param {Object} game
	 */
	function playTurn(game) {
		var currentPlayer = gameService.getCurrentPlayer(game);

		var drawCard = makeDrawDecision.bind(null, game, currentPlayer);
		var discard = makeDiscardDecision.bind(null, game, currentPlayer);
		var playSet = makePlaySetDecision.bind(null, game, currentPlayer);
		think(500).then(drawCard)
		.then(function() {
			think(500).then(playSet)
			.then(function() {
				think(500).then(discard);
			});
		});
	}

	return {
		playTurn: playTurn
	};
}]);
