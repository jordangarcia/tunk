angular.module('tunk')
.factory('events', function() {
	var events = {};

	exports = {};

	exports.on = function(name, fn) {
		if (!events[name]) {
			events[name] = [];
		}
		events[name].push(fn);
	};

	exports.off = function(name, fn) {
		var ind;
		if (events[name]) {
			if (fn) {
				ind = events[name].indexOf(fn);
				while (ind !== -1) {
					events[name].splice(ind, 1);
					ind = events[name].indexOf(fn);
				}
			} else {
				events[name] = [];
			}
		}
	};

	exports.once = function(name, fn) {
		exports.on(name, function() {
			fn();
			exports.off(name, fn);
		});
	};

	exports.trigger = function(name, data) {
		if (events[name]) {
			events[name].forEach(function(fn) {
				fn.call(null, data);
			});
		}
	};

	return exports;
});
