describe("services/playerListFactory", function() {
	var gameFactory;

	beforeEach(function() {
		module('tunk');
		inject(function($injector) {
			playerListFactory = $injector.get('playerListFactory');
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
	});
});

