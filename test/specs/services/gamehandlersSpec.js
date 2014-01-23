describe("service/gameHandlers", function() {
	var gameHandlers;
	var eventsMock;

	function createPlayer(name, score, handScore) {
		return {
			user: {
				name: name
			},
			score: score,
			handScore: jasmine.createSpy('handScore').andReturn(handScore)
		};
	}

	beforeEach(function() {
		eventsMock = jasmine.createSpyObj('events', ['on', 'off', 'trigger']);

		module('tunk');
		module(function($provide) {
			$provide.value('events', eventsMock);
		});
		inject(function($injector) {
			gameHandlers = $injector.get('gameHandlers');
		});

		this.gameMock = {
			log: jasmine.createSpyObj('log', ['write']),
			advanceTurn: jasmine.createSpy('advanceTurn')
		};
		this.playerMock = {
			user: {
				name: 'player'
			},
			hand: ['2c', '3c']
		};
	});

	describe("#discard", function() {
		describe("when the player is out of cards", function() {
			beforeEach(function() {
				this.playerMock.hand = [];
			});

			it("should trigger an `outOfCards` event", function() {
				gameHandlers.discard({
					game: this.gameMock,
					player: this.playerMock,
				});

				expect(eventsMock.trigger).toHaveBeenCalledWith('outOfCards', {
					game: this.gameMock,
					player: this.playerMock
				});
			});

			it("should not advance the turn", function() {
				gameHandlers.discard({
					game: this.gameMock,
					player: this.playerMock,
				});

				expect(this.gameMock.advanceTurn).not.toHaveBeenCalled();
				expect(eventsMock.trigger).not.toHaveBeenCalledWith('turnAdvanced');
			});
		});

		describe("when the player is not out of cards", function() {
			beforeEach(function() {
				this.currentPlayer = {
					isFrozen: true
				};
				this.gameMock.turn = {
					currentPlayer: this.currentPlayer
				};
			});
			afterEach(function() {
				this.currentPlayer = null;
			});

			it("should advance the turn", function() {
				gameHandlers.discard({
					game: this.gameMock,
					player: this.playerMock,
				});

				expect(this.currentPlayer.isFrozen).toBe(false);
				expect(this.gameMock.advanceTurn).toHaveBeenCalled();
				expect(eventsMock.trigger).toHaveBeenCalledWith('turnAdvanced');
			});
		});
	});

	describe("#playSet", function() {
		it("should trigger `tunkOut` event if the players hand is empty", function() {
			this.playerMock.hand = [];
			gameHandlers.playSet({
				game: this.gameMock,
				player: this.playerMock
			});

			expect(eventsMock.trigger).toHaveBeenCalledWith('tunkOut', {
				game: this.gameMock,
				player: this.playerMock
			});
		});
	});

	describe("#playOnSet", function() {
		it("should trigger `outOfCards` event if the players hand is empty", function() {
			this.playerMock.hand = [];
			gameHandlers.playOnSet({
				game: this.gameMock,
				player: this.playerMock
			});

			expect(eventsMock.trigger).toHaveBeenCalledWith('outOfCards', {
				game: this.gameMock,
				player: this.playerMock
			});
		});
	});

	describe("#goDown", function() {

		beforeEach(function() {
			this.gameMock.getLowestScorers = jasmine.createSpy('getLowestScorers');
		});

		afterEach(function() {
			this.getLowestScorersSpy = null;
		});

		describe("when one player has a lower score than the player going down", function() {
			it("it should trigger goDownResult with the result as lose", function() {
				var winner = createPlayer('winner', 2, 3);
				var player = createPlayer('player', 0, 10);

				this.gameMock.getLowestScorers.andReturn([winner]);

				gameHandlers.goDown({
					game: this.gameMock,
					player: player
				});

				expect(eventsMock.trigger).toHaveBeenCalledWith('goDownResult', {
					game: this.gameMock,
					player: player,
					result: 'lose',
					winners: [winner]
				});
			});
		});

		describe("when two players have a lower score than the player going down", function() {
			it("should trigger `goDownResult` with the result as `lose` and the both players as the `winners`", function() {
				var winner1 = createPlayer('winner1', 2, 3);
				var winner2 = createPlayer('winner2', 1, 3);
				var player = createPlayer('player', 0, 10);

				this.gameMock.getLowestScorers.andReturn([winner1, winner2]);

				gameHandlers.goDown({
					game: this.gameMock,
					player: player
				});

				expect(eventsMock.trigger).toHaveBeenCalledWith('goDownResult', {
					game: this.gameMock,
					player: player,
					result: 'lose',
					winners: [winner1, winner2]
				});
			});
		});

		describe("when the player going down has the lowest score", function() {
			it("should give the player 1 point", function() {
				var player = createPlayer('player', 0, 3);

				this.gameMock.getLowestScorers.andReturn([player]);

				gameHandlers.goDown({
					game: this.gameMock,
					player: player
				});

				expect(eventsMock.trigger).toHaveBeenCalledWith('goDownResult', {
					game: this.gameMock,
					player: player,
					result: 'win',
					winners: [player]
				});
			});
		});

		describe("when another player ties with player going down", function() {
			it("should trigger `goDownResult` with the result as tie", function() {
				var player = createPlayer('player1', 0, 3);
				var otherPlayer = createPlayer('player2', 0, 2);
				this.gameMock.getLowestScorers.andReturn([player, otherPlayer]);

				gameHandlers.goDown({
					game: this.gameMock,
					player: player
				});

				expect(eventsMock.trigger).toHaveBeenCalledWith('goDownResult', {
					game: this.gameMock,
					player: player,
					result: 'tie',
					winners: [player, otherPlayer]
				});
			});
		});
	});
});
