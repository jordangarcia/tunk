'use strict';

describe("service/handTester", function() {
	var handTester;

	beforeEach(function() {
		module('tunk');

		inject(function($injector) {
			handTester = $injector.get('handTester');
		});
	});

	var validBooks = [
		['Ac', 'Ah', 'Ad'],
		['2c', '2h', '2d'],
		['3c', '3h', '3d', '3s']
	];
	var validRuns = [
		['2c', '3c', '4c'],
		['Ac', '2c', '3c'],
		['Qc', 'Kc', 'Ac'],
		['2c', '3c', '4c', '5c'],
		['4d', '2d', '3d']
	];

	describe("#isSet", function() {
		validBooks.forEach(function(set) {
			it(set + " should return true", function() {
				expect(handTester.isSet(set)).toBe(true);
			});
		});
		validRuns.forEach(function(set) {
			it(set + " should return true", function() {
				expect(handTester.isSet(set)).toBe(true);
			});
		});
	});

	describe("#groupSeqs", function() {
		function test(input, expected) {
			it(input + " -> " + expected, function() {
				var result = handTester.groupSeqs(input);
				expect(expected).toEqual(result);
			});
		}

		var tests = [
			{
				input: ['2h', '3h', '4c', '5c', 'Kd'],
				expected: [
					['2h', '3h'],
					['4c', '5c'],
					['Kd'],
				]
			},
			{
				input: ['Ah', '2h', '3h'],
				expected: [
					['Ah', '2h', '3h']
				]
			},
			{
				input: ['Ah', '2h', 'Qh', 'Kh'],
				expected: [
					['Ah', '2h'],
					['Qh', 'Kh', 'Ah']
				]
			}
		];
		
		tests.forEach(function(testCase) {
			test(testCase.input, testCase.expected);
		});
	});

	describe("#groupSeqs", function() {
		function test(input, expected) {
			it(input + " -> " + expected, function() {
				var result = handTester.groupSeqs(input);
				expect(expected).toEqual(result);
			});
		}

		var tests = [
			{
				input: ['2h', '3h', '4c', '5c', 'Kd'],
				expected: [
					['2h', '3h'],
					['4c', '5c'],
					['Kd'],
				]
			},
			{
				input: ['Ah', '2h', '3h'],
				expected: [
					['Ah', '2h', '3h']
				]
			},
			{
				input: ['Ah', '2h', 'Qh', 'Kh'],
				expected: [
					['Ah', '2h'],
					['Qh', 'Kh', 'Ah']
				]
			}
		];
		
		tests.forEach(function(testCase) {
			test(testCase.input, testCase.expected);
		});
	});

	describe("#groupBooks", function() {
		function test(input, expected) {
			it(input + " -> " + expected, function() {
				var result = handTester.groupBooks(input);
				expect(expected).toEqual(result);
			});
		}

		var tests = [
			{
				input: ['2h', '2h', '4c', '5c', 'Kd'],
				expected: [
					['2h', '2h'],
					['4c'],
					['5c'],
					['Kd'],
				]
			},
			{
				input: ['2h', '2d', '2c'],
				expected: [
					['2h', '2d', '2c']
				]
			},
			{
				input: ['2h', '2d', '5c', 'Kd', 'Kc', 'Ks'],
				expected: [
					['2h', '2d'],
					['5c'],
					['Kd', 'Kc', 'Ks']
				]
			}
		];
		
		tests.forEach(function(testCase) {
			test(testCase.input, testCase.expected);
		});
	});
});
