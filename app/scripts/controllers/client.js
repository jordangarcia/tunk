'use strict';

angular.module('tunk')
.controller('ClientCtrl', ['$scope', '$filter', 'handTester', 'gamelog', function($scope, $filter, handTester, gamelog) {
	var sortHand = $filter('sortHand');
	var scoreHand = $filter('handScore');

	function isPlayersTurn() {
		return ($scope.turn.playerId === $scope.player.id);
	}

	function canPlaySet() {
		return (isPlayersTurn() && $scope.turn.hasDrawn && !$scope.turn.hasDiscarded);
	}

	$scope.otherPlayers = _.without($scope.players, $scope.player);

	$scope.player.playedSets    = [];
	$scope.player.potentialSets = [];

	$scope.$watchCollection('player.hand', function(hand) {
		$scope.player.hand          = sortHand($scope.player.hand);
		$scope.player.handScore     = scoreHand(hand);
		$scope.player.potentialSets = handTester.getSets(hand);
	});

	/**
	 * Draws card from deck and puts in hand
	 */
	$scope.drawCard = function() {
		if (!isPlayersTurn()) return
		if ($scope.turn.hasDrawn) return;

		$scope.player.hand.push($scope.deck.draw());
		$scope.turn.hasDrawn = true;
	};

	/**
	 * Picks up a card from the discard pile and puts in hand
	 * @param {String} card
	 */
	$scope.drawDiscard = function(card) {
		if (!isPlayersTurn()) return
		if ($scope.turn.hasDrawn) return;

		if ($scope.canPickupDiscard(card)) {
			$scope.discardPile.splice($scope.discardPile.indexOf(card), 1);
			$scope.player.hand.push(card);
			$scope.turn.hasDrawn = true;
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

		if ($scope.player.hand.length === 0) {
			gamelog.write(player.name + ' TUNKED OUT!');
			gamelog.write(player.name + ' wins 2 points');
			$scope.win($scope.player, 2);
		}
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
		if (ind === -1) return;

		//remove card from hand
		$scope.player.hand.splice(ind, 1);

		// put card in discardPile
		$scope.discardPile.push(card);
		$scope.turn.hasDiscarded = true;

		// check if the player won
		if ($scope.player.hand.length === 0) {
			gamelog.write($scope.player.name + ' won!');
			$scope.win($scope.player, 1);
		} else {
			$scope.advanceTurn();
		}
	};

	$scope.goDown = function() {
		if (!isPlayersTurn()) return;
		if ($scope.turn.hasDrawn) return;

		$scope.$parent.goDown($scope.player);
	};
}]);
