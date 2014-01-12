'use strict';

angular.module('tunk')
.factory('playerListFactory', function() {
	var self;
	var PlayerList = function() {
		self = this;
		this.players = [];
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

	};

	return {
		create: function() {
			return new PlayerList();
		}
	};
});
