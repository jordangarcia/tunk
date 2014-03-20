angular.module('tunk').controller('UserCtrl', [
	'$scope',
	'$location',
	'userService',
function($scope, $location, userService) {
	$scope.formData = {
		username: userService.user.name
	};

	$scope.saveData = function(data) {
		userService.rename(data.username)
		$location.path('/');
	};
}]);
