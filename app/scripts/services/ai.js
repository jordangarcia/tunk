'use strict';

/**
 * Server for setting up the SinglePlayer game mode
 */
angular.module('tunk')
.factory('ai', ['$filter', 'playerActions', 'gameService', '$q', 'PICKUP_DISCARD_LIMIT', 'deckFactory', 'handEV',
function($filter, playerActions, gameService, $q, PICKUP_DISCARD_LIMIT, deckFactory, handEV) {
	var handScore = $filter('handScore');
	var deck = deckFactory.create();

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
	 * @param {Object} game
	 * @param {Object} player
	 */
	function makeDrawDecision(game, player) {
		var options = [];
		var eligibleDiscards = getElibleDiscards(game.discardPile);
		// all hand combinations if the player picked up a discard option
		getElibleDiscards(game.discardPile).forEach(function(card) {
			options.push({
				action: 'drawDiscard',
				args: [game, player, card],
				ev: handEV(player.hand.concat(card))
			});
		});

		// a whole deck without the discard pile and cards in players hand
		var deck = _.without.apply(null, [deck].concat(hand).concat(game.discardPile));
		var deckLen = deck.length;
		// calculates the average ev of drawing a random card
		var drawRandomEV = deck.reduce(function(prev, card) {
			// add prev + handScore
			return prev + ((handEV(player.hand.concat(card))) / deckLen);
		}, 0);

		// add the draw random card option
		options.push({
			action: 'drawCard',
			args: [game, player],
			ev: drawRandomEV
		});

		// sort the options and make the best decision
		var bestOption = _.sortBy(options, function(a, b) {
			return a.ev - b.ev;
		})[0];

		playerActions[bestOption.action].apply(null, bestOption.args);
	}

	/**
	 * Plays a turn for an AI player
	 *
	 * @param {Object} game
	 */
	function playTurn(game) {
		var currentPlayer = gameService.getCurrentPlayer(game);

		var drawCard = makeDrawDecision.bind(null, game, currentPlayer);
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
