angular.module('tunk')
.directive('gamelog', [function() {
	return {
		restrict: 'A',
		scope: {
			gamelog: '='
		},
		templateUrl: '/views/directives/gamelog.html'
	};
}]);
