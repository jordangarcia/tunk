'use strict';

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

	function canPlaySet() {
		return (isPlayersTurn() && $scope.turn.hasDrawn && !$scope.turn.hasDiscarded);
	}

	function sortHand() {
		$scope.player.hand = doHandSort($scope.player.hand);
	}

	sortHand();
	$scope.player.playedSets    = [];
	$scope.player.potentialSets = [];

	$scope.$watch('player.hand', updatePotentialSets);

	updatePotentialSets($scope.player.hand);

	/**
	 * Draws card from deck and puts in hand
	 */
	$scope.drawCard = function() {
		if (!isPlayersTurn()) return
		if ($scope.turn.hasDrawn) return;

		$scope.player.hand.push($scope.deck.draw());
		$scope.turn.hasDrawn = true;
		sortHand();
	};

	/**
	 * Picks up a card from the discard pile and puts in hand
	 * @param {String} card
	 */
	$scope.drawDiscard = function(card) {
		if (!isPlayersTurn()) return
		if ($scope.turn.hasDrawn) return;

		if ($scope.pickupDiscard(card)) {
			$scope.player.hand.push(card);
			$scope.turn.hasDrawn = true;
			sortHand();
		}
	}

	/**
	 * Play a set from hand and put it in playedSets
	 *
	 * @param {Array} set
	 */
	$scope.playSet = function(set) {
		if (!isPlayersTurn()) return;
		if (!handTester.isSet(set)) return;
		if (!canPlaySet()) return;

		// remove the set from player's hand
		$scope.player.hand = _.difference($scope.player.hand, set);

		// add set to playedSets
		$scope.player.playedSets.push(set);
	};

	/**
	 * Removes a card from hand and puts in discardPile
	 *
	 * @param {String} card
	 */
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
