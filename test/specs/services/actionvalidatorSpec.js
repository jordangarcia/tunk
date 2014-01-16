describe("#service/actionValidator", function() {
	var actionValidator;
	var gameMock;
	var playerMock;
	var handTesterMock;
	var PICKUP_DISCARD_LIMIT = 2;

	beforeEach(function() {
		handTesterMock = jasmine.createSpyObj('handTester', ['isSet']);
		gameMock = {
			turn: {
				currentPlayer: null,
				hasDrawn: false,
				hasDiscarded: false,
			},
			discardPile: {
				getOffsetFromEnd: jasmine.createSpy('getOffsetFromEnd')
			}
		};

		playerMock = {
			isFrozen: false,
			hand: [],
			playedSets: [],
		};

		module('tunk');
		module(function($provide) {
			$provide.value('handTester', handTesterMock);
			$provide.value('PICKUP_DISCARD_LIMIT', PICKUP_DISCARD_LIMIT);
		});
		inject(function($injector) {
			actionValidator = $injector.get('actionValidator');
		});
	});

	describe("#canPickupDiscard", function() {
		it("should return false when its not the players turn", function() {
			var result = actionValidator.canPickupDiscard(gameMock, playerMock)
			expect(result).toBe(false);
		});

		it("should return false when the offset isn't less than the PICKUP_DISCARD_LIMIT", function() {
			gameMock.turn.currentPlayer = playerMock;
			gameMock.discardPile.getOffsetFromEnd.andReturn(PICKUP_DISCARD_LIMIT);

			var result = actionValidator.canPickupDiscard(gameMock, playerMock);

			expect(result).toBe(false);
		});

		it("should return true when it's the players turn and the card is withint he offset limit", function() {
			gameMock.turn.currentPlayer = playerMock;
			gameMock.discardPile.getOffsetFromEnd.andReturn(PICKUP_DISCARD_LIMIT-1);

			var result = actionValidator.canPickupDiscard(gameMock, playerMock);

			expect(result).toBe(true);
		});
	});

	describe("#canDrawCard", function() {
		it("should return false when it's not the players turn", function() {
			var result  = actionValidator.canDrawCard(gameMock, playerMock)
			expect(result).toBe(false);
		});

		it("should return false when it's the players turn and they have already drawn", function() {
			gameMock.turn.currentPlayer = playerMock;
			gameMock.turn.hasDrawn = true;

			var result  = actionValidator.canDrawCard(gameMock, playerMock);
			expect(result).toBe(false);
		});

		it("should return true when it's the players turn and they have not drawn", function() {
			gameMock.turn.currentPlayer = playerMock;
			gameMock.turn.hasDrawn = false;

			var result  = actionValidator.canDrawCard(gameMock, playerMock);
			expect(result).toBe(true);
		});
	});

	describe("#canGoDown", function() {
		it("should return false when its not the players turn", function() {
			var result = actionValidator.canGoDown(gameMock, playerMock)
			expect(result).toBe(false);
		});

		it("should return false when the player has already drawn", function() {
			gameMock.turn.currentPlayer = playerMock;
			gameMock.turn.hasDrawn = true;

			var result = actionValidator.canGoDown(gameMock, playerMock)
			expect(result).toBe(false);
		});

		it("should return false when the player is frozen", function() {
			playerMock.isFrozen = true;
			gameMock.turn.currentPlayer = playerMock;
			gameMock.turn.hasDrawn = false;

			var result = actionValidator.canGoDown(gameMock, playerMock)
			expect(result).toBe(false);
		});

		it("should return true when its the players turn and they have not drawn and they player is not frozen", function() {
			playerMock.isFrozen = false;
			gameMock.turn.currentPlayer = playerMock;
			gameMock.turn.hasDrawn = false;

			var result = actionValidator.canGoDown(gameMock, playerMock)
			expect(result).toBe(true);
		});
	});

	describe("#canPlaySet", function() {
		it("should return false when its not the players turn", function() {
			handTesterMock.isSet.andReturn(true);
			gameMock.turn.hasDrawn = true;
			gameMock.turn.hasDiscarded = false;
			var set = ['2h', '2c', '2d'];

			var result = actionValidator.canPlaySet(gameMock, playerMock, set)
			expect(result).toBe(false);
		});

		it("should return false when the player hasn't drawn", function() {
			handTesterMock.isSet.andReturn(true);
			gameMock.turn.currentPlayer = playerMock;
			gameMock.turn.hasDrawn = false;
			gameMock.turn.hasDiscarded = false;
			var set = ['2h', '2c', '2d'];

			var result = actionValidator.canPlaySet(gameMock, playerMock, set)
			expect(result).toBe(false);
		});

		it("should return false when the player has already discarded", function() {
			handTesterMock.isSet.andReturn(true);
			gameMock.turn.currentPlayer = playerMock;
			gameMock.turn.hasDrawn = true;
			gameMock.turn.hasDiscarded = true;
			var set = ['2h', '2c', '2d'];

			var result = actionValidator.canPlaySet(gameMock, playerMock, set)
			expect(result).toBe(false);
		});

		it("should return false when the set isn't valid", function() {
			handTesterMock.isSet.andReturn(false);
			gameMock.turn.currentPlayer = playerMock;
			gameMock.turn.hasDrawn = true;
			gameMock.turn.hasDiscarded = false;
			var set = ['2h', '2c', '2d'];

			var result = actionValidator.canPlaySet(gameMock, playerMock, set)
			expect(result).toBe(false);
		});

		it("should return true when the player has already drawn, hasnt discarded, its their turn and has a valid set", function() {
			handTesterMock.isSet.andReturn(true);
			gameMock.turn.currentPlayer = playerMock;
			gameMock.turn.hasDrawn = true;
			gameMock.turn.hasDiscarded = false;
			var set = ['2h', '2c', '2d'];

			var result = actionValidator.canPlaySet(gameMock, playerMock, set)
			expect(result).toBe(true);
		});
	});

	describe("#canPlayOnSet", function() {
		it("should return false when its not the players turn", function() {
			handTesterMock.isSet.andReturn(true);
			gameMock.turn.hasDrawn = true;
			gameMock.turn.hasDiscarded = false;
			var set = ['2h', '2c', '2d'];
			var card = '2s';

			var result = actionValidator.canPlayOnSet(gameMock, playerMock, set, card)
			expect(result).toBe(false);
		});

		it("should return false when the player hasn't drawn", function() {
			handTesterMock.isSet.andReturn(true);
			gameMock.turn.currentPlayer = playerMock;
			gameMock.turn.hasDrawn = false;
			gameMock.turn.hasDiscarded = false;
			var set = ['2h', '2c', '2d'];
			var card = '2s';

			var result = actionValidator.canPlayOnSet(gameMock, playerMock, set, card)
			expect(result).toBe(false);
		});

		it("should return false when the player has already discarded", function() {
			handTesterMock.isSet.andReturn(true);
			gameMock.turn.currentPlayer = playerMock;
			gameMock.turn.hasDrawn = true;
			gameMock.turn.hasDiscarded = true;
			var set = ['2h', '2c', '2d'];
			var card = '2s';

			var result = actionValidator.canPlayOnSet(gameMock, playerMock, set, card)
			expect(result).toBe(false);
		});

		it("should return false when the set isn't valid", function() {
			handTesterMock.isSet.andReturn(false);
			gameMock.turn.currentPlayer = playerMock;
			gameMock.turn.hasDrawn = true;
			gameMock.turn.hasDiscarded = false;
			var set = ['2h', '2c', '2d'];

			var result = actionValidator.canPlayOnSet(gameMock, playerMock, set)
			expect(result).toBe(false);
		});

		it("should return true when the player has already drawn, hasnt discarded, its their turn and has a valid set", function() {
			handTesterMock.isSet.andReturn(true);
			gameMock.turn.currentPlayer = playerMock;
			gameMock.turn.hasDrawn = true;
			gameMock.turn.hasDiscarded = false;
			var set = ['2h', '2c', '2d'];
			var card = '2s';

			var result = actionValidator.canPlayOnSet(gameMock, playerMock, set, card)
			expect(result).toBe(true);
			expect(handTesterMock.isSet).toHaveBeenCalledWith(set.concat(card));
		});
	});
});


