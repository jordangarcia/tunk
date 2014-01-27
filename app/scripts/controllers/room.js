'use strict';

/**
 * controller for a single room
 */
angular.module('tunk')
.controller('RoomCtrl',
['$scope', 'hostService', 'playerFactory', 'userFactory', '$q', 'events', 'room', 'gameService',
function($scope, hostService, playerFactory, userFactory, $q, events, room, gameService) {
	$scope.room = room;
}]);
