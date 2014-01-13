'use strict';

var DEFAULT_MESSAGE_TIMEOUT = 3000;

function getNextPlayerId(players, currentId) {
	var ind = players.indexOf(_.findWhere(players, { id: currentId }));
	return (ind + 1) % players.length;
}

angular.module('tunk')
.controller('GameCtrl', ['$scope', 'game', function($scope, gameFactory) {
	$scope.game = gameFactory.create();

	/**
	 * Someone won the game, record points and start new game
	 *
	 * @param {Array|Object|Integer} player or playerId
	 * @param {Integer} points
	 */
	$scope.win = function(player, points) {
		$scope.addPoints(player, points);

		// check if someone won the actual game
		$scope.newGame(player.id);
	};

	/**
	 * @param {Object} player
	 * @param {Intger} points
	 */
	$scope.addPoints = function(player, points) {
		if (_.isNumber(player)) {
			player = _.findWhere($scope.players, {id :player});
		}
		var ind = $scope.players.indexOf(player);
		if (ind === -1) return;

		$scope.players[ind].score += points;
	}

	$scope.goDown = function(player) {
		if (sorted[0].id === player.id) {
			// current player won
			gamelog.write(player.name + ' wins');

			$scope.win(player, 1);
		} else if (sorted[0].handScore < sorted[1].handScore) {
			// was a unanimous winner, give them two points
			gamelog.write(sorted[0].name + ' has a lower hand score');
			gamelog.write(sorted[0].name + ' wins 2 points');

			$scope.win(sorted[0], 2);
		} else {
			// there are multiple winners
			var winners = _.groupBy(sorted, function(player) {
				return player.handScore;
			})[sorted[0].handScore];

			// shuffle to randomly see who goes first
			winners.map(function(player) {
				gamelog.write(player.name + ' tied for the win');
				gamelog.write(player.name + ' wins 2 points');

				$scope.addPoints(_.findWhere($scope.players, {id: player.id}), 2);
			});

			$scope.newGame(_.shuffle(winners)[0].id);
		}
	};

	/**
	 * Advances the state of the game to the next player
	 */
	$scope.advanceTurn = function() {
		if (!$scope.turn.hasDrawn || !$scope.turn.hasDiscarded) return;

		// $scope.game.advanceTurn();
	};

	$scope.newGame();
}]);
