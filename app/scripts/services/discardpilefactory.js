'use strict';

angular.module('tunk')
.factory('discardPileFactory', [
function(PICKUP_DISCARD_LIMIT){
	var self;

	var DiscardPile = function() {
		self = this;
		this.cards = [];
	};

	/**
	 * Checks that a card can be picked up and removes/returns
	 *
	 * @param {String} card
	 * @return {String} the card or undefined if cant pick up
	 *
	 * @throws {Error}
	 */
	DiscardPile.prototype.pickup = function(card) {
		var ind = self.cards.indexOf(card);
		if (ind === -1) {
			throw new Error("card %s is not in discardPile", card);
		}
		return self.cards.splice(ind, 1)[0];
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
