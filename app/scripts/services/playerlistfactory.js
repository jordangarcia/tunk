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
		var ind = this.players.indexOf(player);
		if (ind === -1) {
			throw new Error("Could not remove player: player not found");
		}

		this.players.splice(ind, 1);
	};

	/**
	 * Shortcut method to this.players.forEach
	 *
	 * @param {Function} fn
	 * @param {Object} context
	 */
	PlayerList.prototype.forEach = function(fn, context) {
		this.players.forEach(fn, context);
	};

	/**
	 * Finds the next player id in turn order
	 *
	 * @param {Player} player
	 * @return {Player}
	 */
	PlayerList.prototype.getNextPlayer = function(player) {
		var ind = this.players.indexOf(player);
		if (ind === -1) {
			throw new Error("Player not found.");
		}

		return this.players[(ind + 1) % this.players.length];
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
