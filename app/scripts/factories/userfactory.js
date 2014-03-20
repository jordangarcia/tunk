angular.module('tunk').factory('userFactory', [
	'guid',
function(guid) {
	var User = function(name) {
		this.id = guid();
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
