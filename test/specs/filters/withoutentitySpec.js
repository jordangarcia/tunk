'use strict';

describe("filter/withoutentity", function() {
	var withoutEntity;

	beforeEach(function() {
		module('tunk');
		inject(function($injector) {
			withoutEntity = $injector.get('$filter')('withoutEntity');
		});
	});

	it("Should return the array without the entity", function() {
		var arr = [
			{id: 1},
			{id: 2},
			{id: 3}
		];

		var expected = [
			arr[0],
			arr[2]
		];

		var result = withoutEntity(arr, {id: 2});

		expect(result).toEqual(expected);
	});

	describe("When the entity isn't contained in the array", function() {
		it("should return the array unchanged", function() {
			var arr = [
				{id: 1},
				{id: 2},
				{id: 3}
			];

			var result = withoutEntity(arr, {id: 4});

			expect(result).toEqual(arr);
		});
	});
});
