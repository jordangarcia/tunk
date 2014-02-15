'use strict';

/**
 * Server for setting up the SinglePlayer game mode
 */
angular.module('tunk')
.factory('ai', ['$filter', 'playerActions', 'gameService', '$q', 'PICKUP_DISCARD_LIMIT', 'deckFactory', 'handEV', 'HAND_SIZE', 'actionValidator',
function($filter, playerActions, gameService, $q, PICKUP_DISCARD_LIMIT, deckFactory, handEV, HAND_SIZE, actionValidator) {
	var handScore = $filter('handScore');
	var WHOLE_DECK = deckFactory.create();

	/**
	 * Gets the corresponding validation method given a player action name
	 */
	function getValidationMethod(actionMethod) {
		return 'can' + actionMethod.charAt(0).toUpperCase() + actionMethod.slice(1);
	}

	/**
	 * decision is an object returned from a AI decision it has an action and args property
	 *
	 * @param {Object} game
	 * @param {Object} player
	 * @param {Object} decision
	 */
	function playAction(game, player, decision) {
		console.log("%s: %s %o", player.user.name, decision.action, decision.args);

		var args = [game, player].concat(decision.args || []);
		if (actionValidator[getValidationMethod(decision.action)].apply(null, args)) {
			playerActions[decision.action].apply(null, args);
		} else {
			console.log("AI: tried to %s but failed", decision.action);
		}
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
		return discardPile.slice(- PICKUP_DISCARD_LIMIT);
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
	 * Plays the best set available
	 *
	 * @param {Object} game
	 * @param {Object} player
	 * @param {Object} config
	 */
	function makeGoDownDecision(game, player, config) {
		config = config || {};
		// the average value per card that an AI will go down with given all other players have more
		// or equal number of cards
		var GO_DOWN_AVG = 3;

		var decision;

		var opponents = gameService.getOpponents(game, player);
		// get the lowest number of cards any opponent has in their hand
		var minHandSize = opponents.reduce(function(prev, player) {
			var len = player.hand.length;
			if (prev === -1) {
				return len;
			}

			return (len < prev) ? len : prev;
		}, -1);

		// if the current player has 40% less cards than the closest opponent go down
		if (player.hand.length <= (minHandSize * .6)) {
			decision = {
				action: 'goDown'
			};
		} else if (
			// if the player has less or equal to opponent min hand size
			(player.hand.length <= minHandSize) &&
			// and the average card value is less than the GO_DOWN_AVG
			(handScore(player.hand) / player.hand.length) <= GO_DOWN_AVG
		) {
			decision = {
				action: 'goDown'
			}
		}

		if (decision) {
			playAction(game, player, decision);
		}
	}

	/**
	 * Plays a turn for an AI player
	 *
	 * @param {Object} game
	 */
	function playTurn(game) {
		var currentPlayer = gameService.getCurrentPlayer(game);

		var goDown = makeGoDownDecision.bind(null, game, currentPlayer);
		var drawCard = makeDrawDecision.bind(null, game, currentPlayer);
		var discard = makeDiscardDecision.bind(null, game, currentPlayer);
		var playSet = makePlaySetDecision.bind(null, game, currentPlayer);
		think(500).then(goDown)
		.then(function() {
			think(500).then(drawCard)
			.then(function() {
				think(500).then(playSet)
				.then(function() {
					think(500).then(discard);
				});
			});
		});
	}

	return {
		playTurn: playTurn
	};

}]);
