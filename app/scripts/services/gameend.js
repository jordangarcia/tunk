angular.module('tunk')
.factory('gameEnd', [function() {
	function tunkOut(game, winner) {
		game.log.write(winner.user.name + ' TUNKED OUT!');
		game.log.write(winner.user.name + ' wins 2 points');
		winner.score += 2;
	}

	function outOfCards(game, winner) {
		game.log.write(winner.user.name + ' has no cards remaining');
		game.log.write(winner.user.name + ' wins 1 point');
		winner.score += 1;
	}

	function goDown(game, player) {
		game.log.write(player.user.name + ' went down with ' + player.handScore());

		var lowestScorers = game.playerList.getLowestScorers();
		var winner;

		if (!_.contains(lowestScorers, player)) {
			// one or more people had a lower hand score than the player 'going down'
			lowestScorers.forEach(function(player) {
				game.log.write(player.user.name + ' has a lower score with ' + player.handScore());
				game.log.write(player.user.name + ' wins 2 points');
				player.score += 2;
			});

			// choose a winner randomly to go first next game
			winner = _.shuffle(lowestScorers)[0];
		} else if (lowestScorers.length === 1) {
			// the player went down and has the lowest score (no-tie)
			game.log.write(player.user.name + ' wins 1 point');
			player.score += 1;

			winner = player;
		} else {
			// player went down and tied with other players
			// the other players are awarded one point
			_.without(lowestScorers, player).forEach(function(player) {
				game.log.write(player.user.name + ' tied with ' + player.handScore());
				game.log.write(player.user.name + ' wins 1 point');
				player.score += 1;
			});

			// choose a winner randomly to go first next game
			winner = _.shuffle(lowestScorers)[0];
		}
	}

	return {
		goDown: goDown,
		tunkOut: tunkOut,
		outOfCards: outOfCards,
	};
}]);
