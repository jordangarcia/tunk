'use strict';

angular.module('tunk')
.controller('PlayerCtrl', ['$scope', function($scope) {
	function isPlayersTurn() {
		return ($scope.turn.playerId === $scope.player.id);
	}

	$scope.drawCard = function() {
		if (!isPlayersTurn()) return
		if ($scope.turn.hasDrawn) return;

		$scope.player.hand.push($scope.deck.draw());
		$scope.turn.hasDrawn = true;
	};

	$scope.discard = function(card) {
		if (!isPlayersTurn()) return
		if (!$scope.turn.hasDrawn) return;
		if ($scope.turn.hasDiscarded) return;

		var ind = $scope.player.hand.indexOf(card);
		if (ind === 1) return;

		$scope.player.hand.splice(ind, 1);

		$scope.discardPile.unshift(card);
		$scope.turn.hasDiscarded = true;
	};
}]);
