'use strict';

/**
 * controller for a single room
 */
angular.module('tunk').controller('RoomCtrl',
['$scope', 'room',
/**
 * @param {$scope} $scope
 * @param {AngularFire} room the AngularFire reference to the room
 */
function($scope, room) {
	$scope.room = room;
}]);
