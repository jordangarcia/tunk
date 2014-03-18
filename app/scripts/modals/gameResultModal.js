'use strict';
angular.module('tunk')
.factory('gameResultModal', ['btfModal', function(btfModal) {
	return btfModal({
		controller: 'ClientCtrl',
		templateUrl: '/views/gameResultModal.html'
	});
}]);
