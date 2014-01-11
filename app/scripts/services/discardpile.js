'use strict';

angular.module('tunk')
.factory('discardPile', ['PICKUP_DISCARD_LIMIT',
function(PICKUP_DISCARD_LIMIT){
	var self;

	var DiscardPile = function() {
		self = this;
		this.cards = [];
	};

	/**
	 * Check if the card can be picked up by the configured
	 * PICKUP_DISCARD_LIMIT
	 *
	 * @param {String} card
	 * @return {Boolean}
	 */
	DiscardPile.prototype.canPickup = function(card) {
		var ind = self.cards.indexOf(card);
		var len = self.cards.length;
		
		// if PICKUP_DISCARD_LIMIT is 2 then only pickup the last two cards in discardPile
		return (ind !== -1 && (len - 1 - ind < PICKUP_DISCARD_LIMIT));
	};

	/**
	 * Checks that a card can be picked up and removes/returns
	 *
	 * @param {String} card
	 * @return {String|undefined} the card or undefined if cant pick up
	 */
	DiscardPile.prototype.pickup = function(card) {
		if (!self.canPickup(card)) {
			return;
		}
		return self.cards.splice(self.cards.indexOf(card), 1)[0];
	};

	/**
	 * Pushes a card on the pile
	 *
	 * @param {String} card
	 */
	DiscardPile.prototype.push = function(card) {
		self.cards.push(card);
	};

	/**
	 * Resets cards in pile
	 */
	DiscardPile.prototype.reset = function() {
		self.cards = [];
	};

	return {
		create: function() {
			return new DiscardPile();
		}
	};
}]);
