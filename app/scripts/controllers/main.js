'use strict';

var pid = 0;
function newPlayer(name) {
}

angular.module('tunk')
.controller('MainCtrl', ['$scope', 'playerFactory',
function($scope, playerFactory) {
	$scope.players = [
		playerFactory.create('Jordan'),
		playerFactory.create('Jeff'),
		playerFactory.create('Parsha'),
	];
}]);
