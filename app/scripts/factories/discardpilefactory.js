'use strict';

angular.module('tunk')
.factory('discardPileFactory', [
function(PICKUP_DISCARD_LIMIT){
	var DiscardPile = function() {
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
		var ind = this.cards.indexOf(card);
		if (ind === -1) {
			throw new Error("card %s is not in discardPile", card);
		}
		return this.cards.splice(ind, 1)[0];
	};

	/**
	 * Pushes a card on the pile
	 *
	 * @param {String} card
	 */
	DiscardPile.prototype.push = function(card) {
		this.cards.push(card);
	};

	/**
	 * Resets cards in pile
	 */
	DiscardPile.prototype.reset = function() {
		this.cards = [];
	};

	/**
	 * Gets the offset of a card from end of pile
	 *
	 * @param {String} card
	 *
	 * @return {Boolean}
	 */
	DiscardPile.prototype.getOffsetFromEnd = function(card) {
		var ind = this.cards.indexOf(card);
		var len = this.cards.length;
		if (ind === -1) {
			throw new Error("Card %s is not in discardPile", card);
		}

		return len - (ind + 1);
	};

	return {
		create: function() {
			return new DiscardPile();
		}
	};
}]);
