'use strict';

function getNextPlayerId(players, currentId) {
	var ind = players.indexOf(_.findWhere(players, { id: currentId }));
	return (ind + 1) % players.length;
}

angular.module('tunk')
.controller('GameCtrl', ['$scope', 'deck', 'HAND_SIZE', function($scope, Deck, HAND_SIZE) {
	function updateCurrentPlayer(id) {
		$scope.player = _.findWhere($scope.players, {id: id});
	}

	$scope.deck = new Deck();

	$scope.discardPile = [];

	$scope.newGame = function(playerToGo) {
		$scope.resetPlayers();
		$scope.turn = {
			playerId: playerToGo || 0,
			hasDrawn: false,
			hasDiscarded: false,
		};
		updateCurrentPlayer($scope.turn.playerId);

		$scope.deck.reset().shuffle();
		$scope.deal(HAND_SIZE);
	};

	$scope.advanceTurn = function() {
		if (!$scope.turn.hasDrawn || !$scope.turn.hasDiscarded) return;

		var nextPlayerId = getNextPlayerId($scope.players, $scope.turn.playerId);
		$scope.turn.hasDrawn     = false;
		$scope.turn.hasDiscarded = false;
		$scope.turn.playerId     = nextPlayerId;
		updateCurrentPlayer(nextPlayerId);
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

	$scope.newGame();
}]);
