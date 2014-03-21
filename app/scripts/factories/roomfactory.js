angular.module('tunk').factory('roomFactory', [
	'guid',
function(guid) {
	var NOT_STARTED = 'notstarted';
	var STARTED = 'started';
	var FINISHED = 'finished';

	var Room = function() {
		this.id = guid();

		this.name;

		/**
		 * @var {String}
		 */
		this.gameType;
		/**
		 * Array of Clients
		 */
		this.clients = [];
		/**
		 * @var {Game}
		 */
		this.game;
		/**
		 * The room's status (notstarted|running|completed)
		 */
		this.status = NOT_STARTED;
		/**
		 * Minimum payout for non-tournament games
		 */
		this.stake;
		/**
		 * Amount of games needed to win in a tournament game
		 */
		this.winAmount;
	};

	return {
		NOT_STARTED: NOT_STARTED,
		STARTED: STARTED,
		FINISHED: FINISHED,
		create: function() {
			return new Room();
		}
	};
}]);
