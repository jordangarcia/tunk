'use strict';

var pid = 0;
function newPlayer(name) {
}

angular.module('tunk')
.controller('MainCtrl', ['$scope', function($scope) {
	var pid = 0;

	$scope.newPlayer = function(name) {
		return {
			id: pid++,
			name: name,
			score: 0,
		};
	}

	$scope.players = [
		$scope.newPlayer('Jordan'),
		$scope.newPlayer('Logan'),
		$scope.newPlayer('Scott'),
		$scope.newPlayer('Parsha')
	];

	$scope.removePlayer = function(id) {
		var player = (_.isString(id))
			? _.find($scope.players, function(player) { return player.name === id })
			: _.find($scope.players, function(player) { return player.id === id });

		$scope.players.splice($scope.players.indexOf(player), 1);
	};

	$scope.win = function(player, id) {
		var ind = $scope.players.indexOf(player);
		if (ind === -1) return;

	}
}]);
