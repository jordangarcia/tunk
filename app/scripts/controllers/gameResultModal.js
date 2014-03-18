'use strict';

angular.module('tunk').controller('GameResultModalCtrl', [
	'$scope',
	'gameResultModal',
	'bodyOverlay',
	'gameService',
function($scope, gameResultModal, bodyOverlay, gameService) {
	bodyOverlay.activate();

	$scope.$on('$destroy', function() {
		bodyOverlay.deactivate();
	});

	$scope.newGame = function(game, playerToGo) {
		gameService.newGame(game, playerToGo);
		gameResultModal.deactivate();
		$scope.$destroy();
	};
}]);
