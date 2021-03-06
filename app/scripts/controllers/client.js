'use strict';

/**
 * Controller responsible for binding player actions and the game state
 * to the UI
 */
angular.module('tunk').controller('ClientCtrl', [
	'$scope',
	'actionValidator',
	'playerActions',
	'events',
	'gameResultModal',
function($scope, actionValidator, playerActions, events, gameResultModal) {
	$scope.selectedCards = [];

	$scope.resetSelectedCards = function() {
		$scope.selectedCards = [];
	};

	events.on('turnAdvanced', $scope.resetSelectedCards);
	events.on('playSet', $scope.resetSelectedCards);
	events.on('playOnSet', $scope.resetSelectedCards);

	// unbind resetSelected cards when controller $scope is destroyed
	$scope.$on('$destroy', function onScopeDestroy() {
		events.off('turnAdvanced', $scope.resetSelectedCards);
		events.off('playSet', $scope.resetSelectedCards);
		events.off('playOnSet', $scope.resetSelectedCards);
	});

	events.on('gameEnd', function(data) {
		gameResultModal.activate({
			gameIsOver: false,
			game: data.game,
			winner: data.playerToGo
		});
	});

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
			$scope.room.game,
			$scope.player,
			opponent,
			opponent.playedSets[0],
			$scope.selectedCards[0]
		);
		events.trigger('gameUpdated');
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
			opponent.playedSets &&
			opponent.playedSets[0] &&
			actionValidator.canPlayOnSet(
				$scope.room.game,
				$scope.player,
				opponent.playedSets[0],
				$scope.selectedCards[0]
		)
		);
	};

	/**
	 * Logical check to see if a player can discard his selected card
	 *
	 * @param {Game} game
	 * @param {Player} player
	 */
	$scope.canDiscard = function(game, player) {
		return (
			$scope.selectedCards.length === 1 &&
			actionValidator.canDiscard(game, player)
		)
	};

	$scope.canGoDown = actionValidator.canGoDown;
	$scope.canDrawCard = actionValidator.canDrawCard;
	$scope.canPlaySet = actionValidator.canPlaySet;

	/**
	 * @param {String} card
	 */
	$scope.drawDiscard = function(game, player, card) {
		if (actionValidator.canDrawDiscard(game, player, card)) {
			playerActions.drawDiscard(game, player, card);
			events.trigger('gameUpdated');
		}
	};

	$scope.drawCard = function(game, player) {
		if (actionValidator.canDrawCard(game, player)) {
			playerActions.drawCard(game, player);
			events.trigger('gameUpdated');
		}
	};

	$scope.goDown = function(game, player) {
		if (actionValidator.canGoDown(game, player)) {
			playerActions.goDown(game, player);
			events.trigger('gameUpdated');
		}
	};

	$scope.discard = function(game, player, card) {
		if (actionValidator.canDiscard(game, player, card)) {
			playerActions.discard(game, player, card);
			events.trigger('gameUpdated');
		}
	};

	$scope.playSet = function(game, player, set) {
		if (actionValidator.canPlaySet(game, player, set)) {
			playerActions.playSet(game, player, set);
			events.trigger('gameUpdated');
		}
	};
}]);
