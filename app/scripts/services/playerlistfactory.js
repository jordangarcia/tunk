'use strict';

angular.module('tunk')
.factory('playerListFactory', function() {
	var PlayerList = function() {
		this.players = [];
	};

	/**
	 * Adds a player to the playerList
	 * @param {Object} player
	 */
	PlayerList.prototype.addPlayer = function(player) {
		this.players.push(player);
	};

	/**
	 * Removes a player from the playerList
	 * @param {Object} player
	 */
	PlayerList.prototype.removePlayer = function(player) {
		var playerIndex = this.players.indexOf(player);
		if (playerIndex !== -1) this.players.splice(playerIndex, 1);
	};

	/**
	 * Resets every players state
	 */
	PlayerList.prototype.resetPlayers = function() {
		this.players.forEach(function(player) {
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
		var playerIndex = this.players.indexOf(_.findWhere(this.players, { id: id }));

		if (playerIndex === -1) {
			throw new Error("Player not found.");
		}

		return this.players[playerIndex];
	};

	/**
	 * Finds the next player id in turn order
	 * @param {Integer} id
	 */
	PlayerList.prototype.getNextPlayer = function(id) {
		var playerIndex = this.players.indexOf(_.findWhere(this.players, { id: id }));

		if (playerIndex === -1) {
			throw new Error("Player not found.");
		}

		return this.players[(playerIndex + 1) % this.players.length].id;
	};

	/**
	 * Gets an array of players that have the lowest hand score (tie)
	 *
	 * @return {Array}
	 */
	PlayerList.prototype.getLowestScorers = function() {
		var sorted = _.sortBy(this.players, function(player) {
			return player.handScore();
		});

		var lowest = sorted[0].handScore();
		return sorted.filter(function(player) {
			return player.handScore() === lowest;
		});
	};

	return {
		create: function() {
			return new PlayerList();
		}
	};
});
