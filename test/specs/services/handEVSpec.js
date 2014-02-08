'use strict';

describe('service/handEV', function() {
	var handEV;

	beforeEach(function() {
		module('tunk');

		inject(function($injector) {
			handEV = $injector.get('handEV');
		});
	});

	describe("#handWithoutSets", function() {
		it("should return the hand with the lowest value after playing any possible sets", function() {
			var input =  ['3c', '4c', '4d', '4s', '5c', '5d', '5s'];
			var expected = ['3c'];
			var result = handEV.handWithoutSets(input);
			expect(expected).toEqual(result);
		});
	});
});
