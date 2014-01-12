angular.module('tunk')
.factory('gameEnd', ['gamelog', function(gamelog) {
	function checkMatchEnded(game, winner) {
		if (matchEnded(game)) {

		} else {
			game.newGame(winner);
		}
	}

	function tunkOut(game, winner) {
		game.log.write(winner.name + ' TUNKED OUT!');
		game.log.write(winner.name + ' wins 2 points');
		winner.score += 2;

		checkMatchEnded(game, winner);
	}

	function outOfCards(game, winner) {
		game.log.write(winner.name + ' has no cards remaining');
		game.log.write(winner.name + ' wins 1 points');
		winner.score += 1;

		checkMatchEnded(game, winner);
	}

	function goDown(game, player) {
	}

	return {
		goDown: goDown,
		tunkOut: tunkOut,
		outOfCards: outOfCards,
	};
}]);
