describe("service/playerActions", function() {
	var playerActions;
	var gameEndMock = jasmine.createSpyObj('gameEnd', ['tunkOut', 'outOfCards']);

	beforeEach(function() {
		module('tunk');
		module(function($provide) {
			$provide.value('gameEnd', gameEndMock);
		});

		inject(function($injector) {
			playerActions = $injector.get('playerActions');
		});
	});

	beforeEach(function() {
		this.gameMock = {
			turn: {
				hasDrawn: false,
				hasDiscarded: true,
			},
			deck: jasmine.createSpyObj('deck', ['draw']),
			discardPile: jasmine.createSpyObj('discardPile', ['pickup', 'push']),
		};
	});

	describe("#drawCard", function() {
		it("should draw a card from the deck and add to player hand", function() {
			var player = {
				hand: ['2h', '4c', '6h']
			};
			var card = 'Ac';
			console.log(this.gameMock)
			this.gameMock.deck.draw.andReturn(card);

			playerActions.drawCard(this.gameMock, player);

			expect(this.gameMock.deck.draw).toHaveBeenCalled();
			expect(player.hand).toEqual(['2h', '4c', '6h', card]);
		});

		it("should mark game.turn.hasDrawn = true", function() {
			var player = {
				hand: ['2h', '4c', '6h']
			};
			var card = 'Ac';
			this.gameMock.deck.draw.andReturn(card);

			playerActions.drawCard(this.gameMock, player);

			expect(this.gameMock.turn.hasDrawn).toBe(true);
		});
	});

	describe("#drawDiscard", function() {
		it("take a card from the discardPile and add it to players hand", function() {
			var player = {
				hand: ['2h', '4c', '6h']
			};
			var card = 'Ac';

			this.gameMock.discardPile.pickup.andReturn(card);
			playerActions.drawDiscard(this.gameMock, player);

			expect(this.gameMock.discardPile.pickup).toHaveBeenCalled();
			expect(player.hand).toEqual(['2h', '4c', '6h', card]);
		});
		it("should mark game.turn.hasDrawn = true", function() {
			var player = {
				hand: ['2h', '4c', '6h']
			};
			var card = 'Ac';

			this.gameMock.discardPile.pickup.andReturn(card);
			playerActions.drawDiscard(this.gameMock, player);

			expect(this.gameMock.turn.hasDrawn).toBe(true);
		});
	});

	describe("#playSet", function() {
		describe("when the player still has cards after playing a set", function() {
			it("should remove the set from the hand and add to played sets", function() {
				var set = ['2c', '2h', '2d'];
				var player = {
					hand: ['2c', '2h', '2d', '5h', '6h'],
					playedSets: [['3h', '3d', '3c']],
				};

				playerActions.playSet(this.gameMock, player, set);

				expect(player.hand).toEqual(['5h', '6h']);
				expect(player.playedSets).toEqual([['3h', '3d', '3c'], ['2c', '2h', '2d']]);
			});
		});

		describe("when the player has no cards remaining", function() {
			it("should try to tunkOut", function() {
				var set = ['2c', '2h', '2d'];
				var player = {
					hand: ['2c', '2h', '2d'],
					playedSets: [],
				};

				playerActions.playSet(this.gameMock, player, set);

				expect(player.hand).toEqual([]);
				expect(player.playedSets).toEqual([['2c', '2h', '2d']]);
				expect(gameEndMock.tunkOut).toHaveBeenCalled();
			});
		});
	});

	describe("#playOnSet", function() {
		describe("when the player has cards remaining", function() {
			it("should remove the card from hand and add to set", function() {
				var player = {
					hand: ['2c', '3c'],
					playedSets: [['2d', '2s', '2h']]
				};

				var card = '2c';

				playerActions.playOnSet(this.gameMock, player, player.playedSets[0], card)

				expect(player.hand).toEqual(['3c']);
				expect(player.playedSets).toEqual([['2d', '2s', '2h', '2c']]);

				expect(gameEndMock.outOfCards).not.toHaveBeenCalled();
			});
		});
		describe("when the player has no cards remaining", function() {
			it("should call gameEnd.outOfCards", function() {
				var player = {
					hand: ['2c'],
					playedSets: [['2d', '2s', '2h']]
				};

				var card = '2c';

				playerActions.playOnSet(this.gameMock, player, player.playedSets[0], card)

				expect(player.hand).toEqual([]);
				expect(player.playedSets).toEqual([['2d', '2s', '2h', '2c']]);

				expect(gameEndMock.outOfCards).toHaveBeenCalled();
			});
		});
	});

	describe("#discard", function() {
		it("should remove the card from the players hand and push to discardPile", function() {
			var card = '2c';
			var player = {
				hand: [card, '3c']
			};

			playerActions.discard(this.gameMock, player, card);

			expect(player.hand).toEqual(['3c']);
			expect(this.gameMock.discardPile.push).toHaveBeenCalledWith(card);
		});

		it("should set game.turn.hasDiscarded = true", function() {
			var card = '2c';
			var player = {
				hand: [card, '3c']
			};

			playerActions.discard(this.gameMock, player, card);

			expect(this.gameMock.turn.hasDiscarded).toBe(true);
		});

		describe("when the player has no cards remaining", function() {
			it("should call gameEnd.outOfCards", function() {
				var card = '2c';
				var player = {
					hand: [card]
				};

				playerActions.discard(this.gameMock, player, card);

				expect(gameEndMock.outOfCards).toHaveBeenCalledWith(this.gameMock, player);
			});
		});
	});

	describe("#freeze", function() {
		it("should freeze the opponent and play the card on their set", function() {
			var card = '2c';
			var player = {
				hand: [card, '3d']
			};
			var opponent = {
				isFrozen: false,
				playedSets: [['2d', '2h', '2s']]
			};

			playerActions.freeze(this.gameMock, player, opponent, opponent.playedSets[0], card);

			expect(opponent.isFrozen).toBe(true);
			expect(opponent.playedSets).toEqual([['2d', '2h', '2s', '2c']]);
			expect(player.hand).toEqual(['3d']);
		});

		describe("when the player has no cards remaining", function() {
			it("should call gameEnd.outOfCards", function() {
				var card = '2c';
				var player = {
					hand: [card]
				};
				var opponent = {
					isFrozen: false,
					playedSets: [['2d', '2h', '2s']]
				};

				playerActions.freeze(this.gameMock, player, opponent, opponent.playedSets[0], card);

				expect(gameEndMock.outOfCards).toHaveBeenCalledWith(this.gameMock, player);
			});
		});
	});
});
