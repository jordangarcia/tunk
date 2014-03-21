'use strict';

angular.module('tunk').controller('GameResultModalCtrl', [
	'$scope',
	'events',
	'gameResultModal',
	'bodyOverlay',
	'singlePlayerService',
function($scope, events, gameResultModal, bodyOverlay, singlePlayerService) {
	bodyOverlay.activate();

	$scope.$on('$destroy', function() {
		bodyOverlay.deactivate();
	});

	$scope.newGame = function(game, playerToGo) {
		singlePlayerService.newGame(game, playerToGo);
		gameResultModal.deactivate();
		$scope.$destroy();
	};
}]);
