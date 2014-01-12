angular.module('tunk')
.directive('tPlayerHand', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			player: '=',
			selectedCards: '='
		},
		templateUrl: '/views/directives/playerhand.html',
		link: function($scope, element, attrs) {
			$scope.toggleSelected = function(card) {
				var ind = $scope.selectedCards.indexOf(card);
				if (ind === -1) {
					$scope.selectedCards.push(card);
				} else {
					$scope.selectedCards.splice(ind, 1);
				}
				console.log($scope.selectedCards);
			}

		},
	};
});
