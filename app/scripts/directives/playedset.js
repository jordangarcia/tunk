angular.module('tunk')
.directive('playedSet', function() {
	return {
		restrict: 'A',
		scope: {
			set: '=playedSet',
		},
		templateUrl: '/views/directives/playedset.html',
	};
});
