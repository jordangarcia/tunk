'use strict';

var CARDS = [2, 3, 4, 5, 6, 7, 8, 9, 'T', 'J', 'Q', 'K', 'A'];
var SUITS = ['s', 'c', 'h', 'd'];
var CARD_ORDER = {
	'A': 1,
	'2': 2,
	'3': 3,
	'4': 4,
	'5': 5,
	'6': 6,
	'7': 7,
	'8': 8,
	'9': 9,
	'T': 10,
	'J': 11,
	'Q': 12,
	'K': 13,
};

function generateCards(cards, suits) {
	var deck = [];

	suits.forEach(function(suit) {
		deck = deck.concat(cards.map(function(card) {
			return card + suit;
		}));
	});

	return deck;
}

angular.module('tunk')
.factory('deckFactory', function() {
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
	};

	/**
	 * Shuffles deck by reference
	 */
	Deck.prototype.shuffle = function() {
		self.cards = _.shuffle(self.cards);
	};

	/**
	 * If deck is out of cards draws remaining
	 *
	 * @return {Array}
	 */
	Deck.prototype.draw = function() {
		return self.cards.shift();
	};

	return {
		create: function() {
			return new Deck();
		}
	};
});
