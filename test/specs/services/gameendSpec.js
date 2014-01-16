describe("service/gameEnd", function() {
	var gameEnd;

	beforeEach(function() {
		module('tunk');
		inject(function($injector) {
			gameEnd = $injector.get('gameEnd');
		});

		this.gameMock = {
			log: jasmine.createSpyObj('log', ['write']),
		};

	});

	function createPlayer(name, score, handScore) {
		return {
			user: {
				name: name
			},
			score: score,
			handScore: jasmine.createSpy('handScore').andReturn(handScore)
		};
	}

	describe("#tunkOut", function() {
		it("should give the winner two points", function() {
			var player = createPlayer('player', 2, 0);

			gameEnd.tunkOut(this.gameMock, player);

			expect(player.score).toBe(4);
		});
	});

	describe("#outOfCards", function() {
		it("should give the winner 1 point", function() {
			var player = createPlayer('player', 2, 0);

			gameEnd.outOfCards(this.gameMock, player);

			expect(player.score).toBe(3);
		});
	});

	describe("#goDown", function() {
		beforeEach(function() {
			this.getLowestScorersSpy = jasmine.createSpy('getLowestScorers');
			this.gameMock.playerList = {
				getLowestScorers: this.getLowestScorersSpy
			};
		});

		afterEach(function() {
			this.getLowestScorersSpy = null;
		});

		describe("when one player has a lower score than the player going down", function() {
			it("should give that player 2 points", function() {
				var winner = createPlayer('winner', 2, 3);
				var player = createPlayer('player', 0, 10);

				this.getLowestScorersSpy.andReturn([winner]);

				gameEnd.goDown(this.gameMock, player);

				expect(winner.score).toBe(4);
			});
		});

		describe("when two players have a lower score than the player going down", function() {
			it("should give both players 2 points", function() {
				var winner1 = createPlayer('winner1', 2, 3);
				var winner2 = createPlayer('winner2', 1, 3);
				var player = createPlayer('player', 0, 10);

				this.getLowestScorersSpy.andReturn([winner1, winner2]);

				gameEnd.goDown(this.gameMock, player);

				expect(winner1.score).toBe(4);
				expect(winner2.score).toBe(3);
			});
		});

		describe("when the player going down has the lowest score", function() {
			it("should give the player 1 point", function() {
				var player = createPlayer('player', 0, 3);

				this.getLowestScorersSpy.andReturn([player]);

				gameEnd.goDown(this.gameMock, player);

				expect(player.score).toBe(1);
			});
		});

		describe("when another player ties with player going down", function() {
			beforeEach(function() {
				this.playerGoingDown = createPlayer('player1', 0, 3);
				this.otherPlayer = createPlayer('player2', 0, 2);
				this.getLowestScorersSpy.andReturn([this.playerGoingDown, this.otherPlayer]);
			});

			afterEach(function() {
				this.playerGoingDown = null;
				this.otherPlayer = null;
			});

			it("should give the other player 1 point", function() {
				gameEnd.goDown(this.gameMock, this.playerGoingDown);

				expect(this.otherPlayer.score).toBe(1);
			});

			it("should give the player going down 0 points", function() {
				gameEnd.goDown(this.gameMock, this.playerGoingDown);

				expect(this.playerGoingDown.score).toBe(0);
			});
		});

	});
});
