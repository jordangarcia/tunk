angular.module('tonk')
.filter('suitEntity', ['$sce', function($sce) {
	var suits = {
		'spades':    '&spades;',
		'clubs':     '&clubs;',
		'hearts':    '&hearts;',
		'diamonds':  '&diams;',
	};

	return function(input) {
		return $sce.trustAsHtml(suits[input]);
	}
}]);
