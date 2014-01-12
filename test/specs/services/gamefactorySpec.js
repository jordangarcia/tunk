describe("services/gameFactory", function() {
	var gameFactory;

	beforeEach(function() {
		module('tunk');
		inject(function($injector) {
			gameFactory = $injector.get('gameFactory');
		});
	});


	describe("#newGame", function() {
		it("should properly initialize the turn state", function() {
			var game = gameFactory.create();
			game.newGame(1);

			expect(game.turn).toEqual({
				playerId: 1,
				hasDrawn: false,
				hasDiscarded: false,
			});
		});
	});
});

