'use strict';

describe('filter/offsetFromEnd', function() {
	var offsetFromEnd;

	beforeEach(function() {
		module('tunk');

		inject(function($injector) {
			offsetFromEnd = $injector.get('$filter')('offsetFromEnd');
		});
	});

	it("should return the offset of a value form the end of an array", function() {
		var arr = ['2h', '3h', 'Ac'];

		expect(offsetFromEnd(arr, 'Ac')).toBe(0);
		expect(offsetFromEnd(arr, '3h')).toBe(1);
		expect(offsetFromEnd(arr, '2h')).toBe(2);
	});
});
