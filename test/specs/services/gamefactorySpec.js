describe("services/gameFactory", function() {
	var gameFactory;

	beforeEach(function() {
		module('tunk');
		inject(function($injector) {
			gameFactory = $injector.get('gameFactory');
		});
	});


	describe("#reset", function() {
		beforeEach(function() {
			this.player = {
				foo: 'bar'
			};
			this.game = gameFactory.create();
			this.game.reset(this.player);
		});
		it("should properly initialize the turn state", function() {
			expect(this.game.turn).toEqual({
				currentPlayer: this.player,
				hasDrawn: false,
				hasDiscarded: false,
			});
		});
	});
});

