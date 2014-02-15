'use strict';

describe("factories/executionQueue", function() {
	var executionQueueFactory;

	beforeEach(function() {
		module('tunk');

		inject(function($injector) {
			executionQueueFactory = $injector.get('executionQueueFactory');
		});
	});

	it('should run the queued functions in order', function() {
		var queue = executionQueueFactory.create();
		var spy1 = jasmine.createSpy('spy1');
		var spy2 = jasmine.createSpy('spy2');
		var spy3 = jasmine.createSpy('spy3');

		queue.push(spy1);
		queue.push(spy2);
		queue.push(spy3);

		queue.run();

		waits(10);

		runs(function() {
			expect(spy1).toHaveBeenCalled();
			expect(spy2).toHaveBeenCalled();
			expect(spy3).toHaveBeenCalled();
		});
	});

	it('should not execute anything if reset is called before run', function() {
		var queue = executionQueueFactory.create();
		var spy1 = jasmine.createSpy('spy1');
		var spy2 = jasmine.createSpy('spy2');
		var spy3 = jasmine.createSpy('spy3');

		queue.push(spy1);
		queue.push(spy2);
		queue.push(spy3);

		queue.reset();
		queue.run();

		waits(10);

		runs(function() {
			expect(spy1).not.toHaveBeenCalled();
			expect(spy2).not.toHaveBeenCalled();
			expect(spy3).not.toHaveBeenCalled();
		});
	});

	it('it should not execute functions after a reset', function() {
		var queue = executionQueueFactory.create();
		var spy1 = jasmine.createSpy('spy1');
		var spy3 = jasmine.createSpy('spy3');

		queue.push(spy1);
		queue.push(function() {
			queue.reset();
		});
		queue.push(spy3);

		queue.run();

		waits(10);

		runs(function() {
			expect(spy1).toHaveBeenCalled();
			expect(spy3).not.toHaveBeenCalled();
		});
	});
});
