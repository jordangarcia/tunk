angular.module('tunk')
.directive('gamelog', [function() {
	return {
		restrict: 'A',
		scope: {
			gamelog: '='
		},
		templateUrl: '/views/gamelog.html'
	};
}]);
