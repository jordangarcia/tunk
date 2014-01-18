angular.module('tunk')
.factory('userFactory', [function() {
	var id = 0;

	var User = function(name) {
		this.id = id++;
		this.name = name;
		this.chips = 0;
		this.stats = {};
	};

	return {
		create: function(name) {
			return new User(name);
		}
	}
}]);
