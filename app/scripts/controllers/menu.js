'use strict';

angular.module('tunk').controller('MenuCtrl', [
	'$scope',
	'$location',
	'singlePlayerService',
function($scope, $location, singlePlayerService) {
	var room = singlePlayerService.loadRoom();

	// if a room exists can continue game
	$scope.canContinue = !!room;

	$scope.continueGame = function() {
		$location.path('/singleplayer');
	};

	$scope.newGame = function() {
		if (room) {
			singlePlayerService.deleteSavedRoom();
		}

		$location.path('/singleplayer');
	};
}]);
