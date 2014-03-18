'use strict';
angular.module('tunk')
.factory('gameResultModal', ['btfModal', function(btfModal) {
	return btfModal({
		controller: 'GameResultModalCtrl',
		templateUrl: '/views/gameResultModal.html'
	});
}]);
