'use strict';

var CARDS = [2, 3, 4, 5, 6, 7, 8, 9, 'T', 'J', 'Q', 'K', 'A'];
var SUITS = ['s', 'c', 'h', 'd'];

function generateCards(cards, suits) {
	var deck = [];

	suits.forEach(function(suit) {
		deck = deck.concat(cards.map(function(card) {
			return card + suit;
		}));
	});

	return deck;
}

angular.module('tonk')
.factory('deck', function() {
	var self;

	var Deck = function() {
		self = this;
		this.cards = [];
		this.reset();
	}

	/**
	 * Resets all cards in order
	 * @return {Deck}
	 */
	Deck.prototype.reset = function() {
		self.cards = generateCards(CARDS, SUITS);
		return self;
	};

	/**
	 * @return {Integer}
	 */
	Deck.prototype.cardsLeft = function() {
		return self.cards.length;
	}

	/**
	 * Shuffles deck by reference
	 */
	Deck.prototype.shuffle = function() {
		self.cards = _.shuffle(self.cards);
	}

	/**
	 * Draws n number of cards from deck
	 * If deck is out of cards draws remaining
	 *
	 * @param {Integer} n
	 * @return {Array}
	 */
	Deck.prototype.draw = function() {
		return self.cards.shift();
	}

	return Deck;
});
