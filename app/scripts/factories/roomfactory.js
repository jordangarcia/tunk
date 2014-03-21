angular.module('tunk')
.factory('roomFactory', [function() {
	var rid = 0;
	// TODO inject this
	var DEFAULT_STAKE = 1;

	var Room = function() {
		this.id = ++rid;

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
		this.status = 'nonstarted';
		/**
		 * Minimum payout for non-tournament games
		 */
		this.stake = DEFAULT_STAKE;
		/**
		 * Amount of games needed to win in a tournament game
		 */
		this.winAmount;
	};

	return {
		NOT_STARTED: 'notstarted',
		STARTED: 'started',
		FINISHED: 'finished',
		create: function() {
			return new Room();
		}
	};
}]);
