describe("services/playerListFactory", function() {
	var playerListFactory;
	var playerFactory;


	beforeEach(function() {
		module('tunk');
		inject(function($injector) {
			playerListFactory = $injector.get('playerListFactory');
			playerFactory = $injector.get('playerFactory');
		});
	});

	describe("service/playerListFactory", function () {
		describe("when creating a player list", function () {
			it("should create a new player list", function () {
				var playerList = playerListFactory.create(),
					jeff = {id: 0, name: "Jeff"},
					jordan = {id: 1, name: "Jordan"},
					parsha = {id: 2, name: "Parsha"};

				expect(playerList.players.length).toEqual(0);

				playerList.addPlayer(jeff);
				playerList.addPlayer(jordan);
				playerList.addPlayer(parsha);
				expect(playerList.players.length).toEqual(3);

				// Find
				expect(playerList.find(jeff.id)).toEqual(jeff);

				// Cycle through player order
				expect(playerList.getNextPlayer(jeff.id)).toBe(jordan.id);
				expect(playerList.getNextPlayer(jordan.id)).toBe(parsha.id);
				expect(playerList.getNextPlayer(parsha.id)).toBe(jeff.id);

				// Remove players
				playerList.removePlayer(jordan);
				expect(playerList.players.length).toEqual(2);

				playerList.removePlayer({id: 3, name: "bob"});
				expect(playerList.players.length).toEqual(2);
			});
		});

		describe("#getLowestScorers", function() {
			describe("when one player has the lowest score", function() {
				it("should return an array containing only that player", function() {
					var playerList = playerListFactory.create();
					var players = [];
					players[0] = playerFactory.create('Jeff');
					players[1] = playerFactory.create('Jordan');
					players[2] = playerFactory.create('Parsha');

					players[0].hand = ['2h', 'Ac'];
					players[1].hand = ['Kh', 'Kd'];
					players[2].hand = ['8h', '3d'];

					players.forEach(playerList.addPlayer, playerList);

					var results = playerList.getLowestScorers();
					expect(results).toEqual([players[0]]);
				});
			});
		});
	});
});
