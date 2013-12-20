'use strict';

angular.module('tunk')
.controller('PlayerCtrl', ['$scope', '$filter', function($scope, $filter) {
	var sortHand = $filter('sortHand');

	$scope.player.hand = sortHand($scope.player.hand);

	function isPlayersTurn() {
		return ($scope.turn.playerId === $scope.player.id);
	}

	$scope.drawCard = function() {
		if (!isPlayersTurn()) return
		if ($scope.turn.hasDrawn) return;

		$scope.player.hand.push($scope.deck.draw());
		$scope.turn.hasDrawn = true;
		$scope.player.hand = sortHand($scope.player.hand);
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
		$scope.discardPile.unshift(card);
		$scope.turn.hasDiscarded = true;

		$scope.advanceTurn();
	};
}]);
