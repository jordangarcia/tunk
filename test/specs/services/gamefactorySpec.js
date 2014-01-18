describe("services/gameFactory", function() {
	var gameFactory;
	var playerFactory;

	beforeEach(function() {
		module('tunk');
		inject(function($injector) {
			gameFactory = $injector.get('gameFactory');
			playerFactory = $injector.get('playerFactory');
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
	describe("#getLowestScorers", function() {
		describe("when one player has the lowest score", function() {
			it("should return an array containing only that player", function() {
				var game = gameFactory.create();
				game.players[0] = playerFactory.create('Jeff');
				game.players[1] = playerFactory.create('Jordan');
				game.players[2] = playerFactory.create('Parsha');

				game.players[0].hand = ['2h', 'Ac'];
				game.players[1].hand = ['Kh', 'Kd'];
				game.players[2].hand = ['8h', '3d'];


				var results = game.getLowestScorers();

				expect(results).toEqual([game.players[0]]);
			});
		});
	});
});

