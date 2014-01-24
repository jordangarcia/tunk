'use strict';

describe("services/gameService", function() {
	var gameService;
	var gameMock;
	var player1;
	var player2;
	var player3;

	function createPlayer(id) {
		return {
			id: id,
			user: {
				id: id,
				name: 'player' + id
			},
			hand: [],
			playedSets: [],
			score: 0,
			isFrozen: false
		}
	}

	beforeEach(function() {
		module('tunk');
		inject(function($injector) {
			gameService = $injector.get('gameService');
		});

		player1 = createPlayer(1);
		player2 = createPlayer(2);
		player3 = createPlayer(3);

		gameMock = {
			players: [player1, player2, player3],
			turn: {
				currentPlayer: player1,
				hasDrawn: false,
				hasDiscarded: false
			}
		};
	});

	describe("#getLowestScorers", function() {
		describe("when one player has the lowest score", function() {
			beforeEach(function() {
				player1.hand = ['Ac', '2h'];
				player2.hand = ['Kh', 'Qs'];
				player3.hand = ['Ks', 'Qh'];
			});
			it("should return an array containing only that player", function() {
				var result = gameService.getLowestScorers(gameMock);

				expect(result).toEqual([player1]);
			});
		});
		describe("when two players have the lowest score", function() {
			beforeEach(function() {
				player1.hand = ['Ac', '2h'];
				player2.hand = ['Ah', '2s'];
				player3.hand = ['Ks', 'Qh'];
			});
			it("should return an array containing the two players", function() {
				var result = gameService.getLowestScorers(gameMock);

				expect(result).toEqual([player1, player2]);
			});
		});
	});

	describe("#advanceTurn", function() {
		it("should unfreeze the current player", function() {
			player1.isFrozen = true;

			gameService.advanceTurn(gameMock);

			expect(player1.isFrozen).toBe(false);
		});
		it("should properly advance the turn state", function() {
			gameMock.turn.hasDrawn = true;
			gameMock.turn.hasDiscarded = true;

			gameService.advanceTurn(gameMock);

			expect(gameMock.turn.currentPlayer).toBe(player2);
			expect(gameMock.turn.hasDrawn).toBe(false);
			expect(gameMock.turn.hasDiscarded).toBe(false);
		});
	});
});

