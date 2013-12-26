'use strict';

var PICKUP_DISCARD_LIMIT = 2;

function getNextPlayerId(players, currentId) {
	var ind = players.indexOf(_.findWhere(players, { id: currentId }));
	return (ind + 1) % players.length;
}

angular.module('tunk')
.controller('GameCtrl', ['$scope', 'deck', 'HAND_SIZE', function($scope, Deck, HAND_SIZE) {
	$scope.deck = new Deck();

	$scope.discardPile = [];

	$scope.newGame = function(playerToGo) {
		$scope.resetPlayers();
		$scope.turn = {
			playerId: playerToGo || 0,
			hasDrawn: false,
			hasDiscarded: false,
		};

		$scope.deck.reset().shuffle();
		$scope.deal(HAND_SIZE);
	};

	$scope.advanceTurn = function() {
		if (!$scope.turn.hasDrawn || !$scope.turn.hasDiscarded) return;

		var nextPlayerId = getNextPlayerId($scope.players, $scope.turn.playerId);
		$scope.turn.hasDrawn     = false;
		$scope.turn.hasDiscarded = false;
		$scope.turn.playerId     = nextPlayerId;
	};

	/**
	 * iterates over players and reset their state for new game
	 */
	$scope.resetPlayers = function() {
		$scope.players.forEach(function(player) {
			player.hand = [];
			player.isFrozen = false;
		});
	};

	/**
	 * Gives each player some number of cards
	 */
	$scope.deal = function(numCards) {
		_.times(numCards, function() {
			$scope.players.forEach(function(player) {
				player.hand.push($scope.deck.draw());
			});
		});
	};

	/**
	 * Checks that the card can be removed from the discard pile and removes
	 *
	 * @param {String} card
	 * @return {Boolean} whether the card was successfully picked up
	 */
	$scope.pickupDiscard = function(card) {
		var ind = $scope.discardPile.indexOf(card);
		var len = $scope.discardPile.length;
		
		// if PICKUP_DISCARD_LIMIT is 2 then only pickup the last two cards in discardPile
		if (ind === -1 || (len - 1 - ind >= PICKUP_DISCARD_LIMIT)) {
			return false;
		}

		$scope.discardPile.splice(ind, 1);
		return true;
	};

	$scope.newGame();
}]);
