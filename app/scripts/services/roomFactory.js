angular.module('tunk')
.factory('roomFactory', ['DEFAULT_WIN_AMOUNT', function() {
	// TODO inject this
	var DEFAULT_STAKE = 1;

	var Room = function() {
		this.id;

		this.name = '';
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
		this.winAmount = DEFAULT_WIN_AMOUNT;
	};

	return {
		create: function() {
			return new Room();
		}
	};
}]);
