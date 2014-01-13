angular.module('tunk')
.factory('actionValidator', ['PICKUP_DISCARD_LIMIT', function() {

	/**
	 * Check if the card can be picked up by the configured PICKUP_DISCARD_LIMIT
	 *
	 * @param {Array} pile
	 * @param {String} card
	 * @return {Boolean}
	 */
	function canPickupDiscard(pile, card) {
		var ind = pile.indexOf(card);
		var len = pile.length;
		
		// if PICKUP_DISCARD_LIMIT is 2 then only pickup the last two cards in discardPile
		return (ind !== -1 && (len - 1 - ind < PICKUP_DISCARD_LIMIT));
	}

	return {
		canPickupDiscard: canPickupDiscard,
	};
}]);
