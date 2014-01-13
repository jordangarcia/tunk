angular.module('tunk')
.factory('gameEnd', ['gamelog', function(gamelog) {
	function checkMatchEnded(game, playerToGo) {
		//var matchEnded = false;
		//var winner;

		//if (matchEnded) {
			//game.endMatch(winner)

		//} else {
			//game.newGame(playerToGo);
		//}
	}

	function tunkOut(game, winner) {
		game.log.write(winner.name + ' TUNKED OUT!');
		game.log.write(winner.name + ' wins 2 points');
		winner.score += 2;

		checkMatchEnded(game, winner);
	}

	function outOfCards(game, winner) {
		game.log.write(winner.name + ' has no cards remaining');
		game.log.write(winner.name + ' wins 1 point');
		winner.score += 1;

		checkMatchEnded(game, winner);
	}

	function goDown(game, player) {
		gamelog.write(player.name + ' went down with ' + player.handScore);

		var lowestScorers = game.playerList.getLowestScorers();
		var winner;

		if (!_.contains(lowestScorers, player)) {
			// one or more people had a lower hand score than the player 'going down'
			lowestScorers.forEach(function(player) {
				game.log.write(player.name + ' has a lower score with ' + player.handScore());
				game.log.write(player.name + ' wins 2 points');
				player.score += 2;
			});

			// choose a winner randomly to go first next game
			winner = _.shuffle(lowestScorers)[0];
		} else if (lowestScorers.length === 1) {
			// the player went down and has the lowest score (no-tie)
			game.log.write(player.name + ' wins 1 point');
			player.score += 1;

			winner = player;
		} else {
			// player went down and tied with other players
			// the other players are awarded one point
			_.without(lowestScorers, player).forEach(function(player) {
				game.log.write(player.name + ' tied with ' + player.handScore());
				game.log.write(player.name + ' wins 1 point');
				player.score += 1;
			});

			// choose a winner randomly to go first next game
			winner = _.shuffle(lowestScorers)[0];
		}

		checkMatchEnded(game, winner);
	}

	return {
		checkMatchEnded: checkMatchEnded,
		goDown: goDown,
		tunkOut: tunkOut,
		outOfCards: outOfCards,
	};
}]);
