'use strict';

angular.module('tunk')
.controller('ClientCtrl',
['$scope', 'actionValidator', 'playerActions',
function($scope, actionValidator, playerActions) {
	// get easier access to the game
	$scope.game = $scope.room.game;
	$scope.opponents = _.without($scope.game.players, $scope.player);

	$scope.actionValidator = actionValidator;

	$scope.selectedCards = [];

	/**
	 * @param {String} card
	 */
	$scope.drawDiscard = function(game, player, card) {
		if (actionValidator.canDrawDiscard(game, player, card)) {
			playerActions.drawDiscard(game, player, card);
		}
	};

	/**
	 * Freeze opponent with selectedCard[0]
	 *
	 * @param {Player} opponent
	 */
	$scope.freeze = function(opponent) {
		if (!$scope.canFreeze(opponent)) {
			return;
		}

		playerActions.freeze(
			$scope.game,
			$scope.player,
			opponent,
			opponent.playedSets[0],
			$scope.selectedCards[0]
		);
	}

	/**
	 * Logical check if players selected card can freeze an opponent
	 *
	 * @param {Player} opponent
	 * @return {Boolaen}
	 */
	$scope.canFreeze = function(opponent) {
		return (
			$scope.selectedCards.length === 1 &&
			opponent.playedSets[0] &&
			actionValidator.canPlayOnSet(
				$scope.game,
				$scope.player,
				opponent.playedSets[0],
				$scope.selectedCards[0]
			)
		);
	};

	$scope.canGoDown = actionValidator.canGoDown;
	$scope.canDiscard = actionValidator.canDiscard;
	$scope.canDrawCard = actionValidator.canDrawCard;
	$scope.canPlaySet = actionValidator.canPlaySet;

	$scope.drawCard = function(game, player) {
		if (actionValidator.canDrawCard(game, player)) {
			playerActions.drawCard(game, player);
		}
	};

	$scope.goDown = function(game, player) {
		if (actionValidator.canGoDown(game, player)) {
			playerActions.goDown(game, player);
		}
	};

	$scope.discard = function(game, player, card) {
		if (actionValidator.canDiscard(game, player, card)) {
			playerActions.discard(game, player, card);
		}
	};

	$scope.playSet = function(game, player, set) {
		if (actionValidator.canPlaySet(game, player, set)) {
			playerActions.playSet(game, player, set);
		}
	}

}]);
