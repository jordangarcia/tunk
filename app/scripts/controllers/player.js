'use strict';

var PICKUP_DISCARD_LIMIT = 2;
angular.module('tunk')
.controller('PlayerCtrl', ['$scope', '$filter', 'handTester', function($scope, $filter, handTester) {
	var doHandSort = $filter('sortHand');
	/**
	 * Checks if there are any sets/runs in players hand
	 */
	function updatePotentialSets(hand) {
		$scope.player.potentialSets = handTester.getSets(hand);
	}

	function isPlayersTurn() {
		return ($scope.turn.playerId === $scope.player.id);
	}

	function sortHand() {
		$scope.player.hand = doHandSort($scope.player.hand);
	}

	sortHand();
	$scope.player.playedSets    = [];
	$scope.player.potentialSets = [];

	$scope.$watch('player.hand', updatePotentialSets);

	updatePotentialSets($scope.player.hand);

	$scope.drawCard = function() {
		if (!isPlayersTurn()) return
		if ($scope.turn.hasDrawn) return;

		$scope.player.hand.push($scope.deck.draw());
		$scope.turn.hasDrawn = true;
		sortHand();
	};

	/**
	 * @param {String} card
	 */
	$scope.drawDiscard = function(card) {
		var ind = $scope.discardPile.indexOf(card);
		var len = $scope.discardPile.length;
		if (ind === -1) return;
		// if PICKUP_DISCARD_LIMIT is 2 then only pickup the last two cards in discardPile
		if (len - ind - 1 < PICKUP_DISCARD_LIMIT) {
			// remove card from discardPile
			$scope.discardPile.splice(ind, 1);
			// add to hand
			$scope.player.hand.push(card);
			$scope.turn.hasDrawn = true;
			sortHand();
		}
	}

	/**
	 * Play a set from hand and put it in playedSets
	 */
	$scope.playSet = function(set) {
		if (!handTester.isSet(set)) return;

		// remove the set from player's hand
		$scope.player.hand = _.difference($scope.player.hand, set);

		// add set to playedSets
		$scope.player.playedSets.push(set);
	};

	$scope.discard = function(card) {
		if (!isPlayersTurn()) return
		if (!$scope.turn.hasDrawn) return;
		if ($scope.turn.hasDiscarded) return;

		var ind = $scope.player.hand.indexOf(card);
		if (ind === 1) return;

		//remove card from hand
		$scope.player.hand.splice(ind, 1);

		// put card in discardPile
		$scope.discardPile.push(card);
		$scope.turn.hasDiscarded = true;

		$scope.advanceTurn();
	};
}]);
