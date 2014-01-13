'use strict';

angular.module('tunk')
.factory('playerListFactory', function() {
	var self;
	var PlayerList = function() {
		self = this;
		this.players = [];
	};

	/**
	 * Adds a player to the playerList
	 * @param {Object} player
	 */
	PlayerList.prototype.addPlayer = function(player) {
		self.players.push(player);
	};

	/**
	 * Removes a player from the playerList
	 * @param {Object} player
	 */
	PlayerList.prototype.removePlayer = function(player) {
		var playerIndex = self.players.indexOf(player);
		if (playerIndex !== -1) self.players.splice(playerIndex, 1);
	};

	/**
	 * Resets every players state
	 */
	PlayerList.prototype.resetPlayers = function() {
		self.players.forEach(function(player) {
			player.playedSets = [];
			player.hand       = [];
			player.isFrozen   = false;
		});
	};

	/**
	 * Finds a player by id
	 * @param {Integer} id
	 */
	PlayerList.prototype.find = function(id) {
		var playerIndex = self.players.indexOf(_.findWhere(self.players, { id: id }));

		if (playerIndex === -1) {
			throw new Error("Player not found.");
		}

		return self.players[playerIndex];
	};

	/**
	 * Finds the next player id in turn order
	 * @param {Integer} id
	 */
	PlayerList.prototype.getNextPlayer = function(id) {
		var playerIndex = self.players.indexOf(_.findWhere(self.players, { id: id }));

		if (playerIndex === -1) {
			throw new Error("Player not found.");
		}

		return self.players[(playerIndex + 1) % self.players.length].id;
	}

	return {
		create: function() {
			return new PlayerList();
		}
	};
});
