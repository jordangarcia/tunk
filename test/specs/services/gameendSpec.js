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

	describe("#tunkOut", function() {
		it("should give the winner two points", function() {
			var player = {
				score: 2,
			};

			gameEnd.tunkOut(this.gameMock, player);

			expect(player.score).toEqual(4);
		});

		it("should call checkMatchEnded", function() {
			var player = {
				score: 2,
			};

			gameEnd.tunkOut(this.gameMock, player);

			expect(gameEnd.checkMatchEnded).toHaveBeenCalled();
		});
	});
});
