angular.module('tunk')
.factory('gameEnd', [function() {

	return {
		goDown: goDown,
		tunkOut: tunkOut,
		outOfCards: outOfCards,
	};
}]);
