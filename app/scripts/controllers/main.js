'use strict';

var pid = 0;
function newPlayer(name) {
}

angular.module('tonk')
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
		$scope.newPlayer('Scott')
	];

	$scope.removePlayer = function(id) {
		var player = (_.isString(id))
			? _.find($scope.players, function(player) { return player.name === id })
			: _.find($scope.players, function(player) { return player.id === id });

		$scope.players.splice($scope.players.indexOf(player), 1);
	}
}]);
