'use strict';

angular.module('tunk')
.controller('ClientCtrl',
['$scope', '$filter', 'handTester', 'gamelog', 'playerActions', 'actionValidator'
function($scope, $filter, handTester, gamelog, playerActions, actionValidator) {
	var sortHand = $filter('sortHand');
	var scoreHand = $filter('handScore');

	function isPlayersTurn() {
		return ($scope.turn.playerId === $scope.player.id);
	}

	function canPlaySet() {
		return (isPlayersTurn() && $scope.turn.hasDrawn && !$scope.turn.hasDiscarded);
	}

	$scope.opponents         = _.without($scope.players, $scope.player);
	$scope.selectedCards     = [];

	$scope.$watchCollection('player.hand', function(hand) {
		$scope.player.hand          = sortHand($scope.player.hand);
		$scope.player.handScore     = scoreHand(hand);
	});

	/**
	 * Exposed function to use in attribute
	 *
	 * @param {Array} cards
	 * @return {Boolean}
	 */
	$scope.isSet = function(cards) {
		return handTester.isSet(cards);
	};

	/**
	 * Check if the current user can freeze an opponent based on their
	 * selectedCards
	 *
	 * @param {Object} opponent
	 * @return {Boolean}
	 */
	$scope.canFreeze = function(opponent) {
		if (
			!isPlayersTurn() ||
			// must draw before freezing
			!$scope.turn.hasDrawn ||
			// dont have a card selected
			$scope.selectedCards.length !== 1 ||
			// opponent hasn't played any sets
			opponent.playedSets.length === 0 ||
			// cannot freeze if already frozen
			opponent.isFrozen
		) {
			return false;
		}

		var card = $scope.selectedCards[0];
		
		return _.some(opponent.playedSets, function(set) {
			return handTester.isSet(set.concat(card));
		});
	};

	/**
	 * @param {Object} opponent
	 */
	$scope.freeze = function(opponent) {
		if (!$scope.canFreeze(opponent)) return;

		var card = $scope.selectedCards[0];
		// reset selected cards
		$scope.selectedCards = [];

		// freeze opponent and add to their set
		opponent.isFrozen = true;
		$scope.player.hand.splice($scope.player.hand.indexOf(card), 1);
		_.find(opponent.playedSets, function(set) {
			return handTester.isSet(set.concat(card));
		}).push(card);
	};

	/**
	 * Draws card from deck and puts in hand
	 */
	$scope.drawCard = function() {
		if (!actionValidator.canDrawCard($scope.game, $scope.player)) return;

		playerActions.drawCard($scope.game, $scope.player);
	};

	/**
	 * Picks up a card from the discard pile and puts in hand
	 * @param {String} card
	 */
	$scope.drawDiscard = function(card) {
		if (!isPlayersTurn()) return
		if ($scope.turn.hasDrawn) return;

		var card = $scope.discardPile.pickup(card);
		if (card) {
			// pickup was successful
			$scope.player.hand.push(card)
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

		// reset selected cards
		$scope.selectedCards = [];

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

		// reset selected cards
		$scope.selectedCards = [];

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
		if (!player.isFrozen) return;
		if ($scope.turn.hasDrawn) return;

		// reset selected cards
		$scope.selectedCards = [];

		$scope.$parent.goDown($scope.player);
	};
}]);
