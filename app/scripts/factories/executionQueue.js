'use strict';

/**
 * Execution Queue
 */
angular.module('tunk')
.factory('executionQueueFactory', [
function() {
	function ExecutionQueue() {
		this.pointer = null;
		this.tasks = [];
	}

	ExecutionQueue.prototype.push = function(fn) {
		this.tasks.push(fn);
	};

	ExecutionQueue.prototype.reset = function() {
		this.tasks = [];
		this.pointer = null;
	};

	ExecutionQueue.prototype._next = function() {
		if (this.pointer === null) {
			this.pointer = 0;
		} else {
			this.pointer++;
		}

		if (this.pointer >= this.tasks.length) {
			this.pointer = null;
			return null;
		} else {
			return this.tasks[this.pointer];
		}
	};

	ExecutionQueue.prototype.run = function(delay) {
		delay = delay || 0;

		var next = this._next();

		if (next) {
			setTimeout(function() {
				next();

				this.run();
			}.bind(this), delay);
		}
	};

	return {
		create: function() {
			return new ExecutionQueue();
		}
	}

}]);
