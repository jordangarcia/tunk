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

	var invalidRuns = [
		['Ah', '2h']
	];

	function test(method, input, expected) {
		it(input + " -> " + expected, function() {
			var result = handTester[method](input);
			expect(expected).toEqual(result);
		});
	}

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
		invalidRuns.forEach(function(set) {
			it(set + " should return false", function() {
				expect(handTester.isSet(set)).toBe(false);
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
			test('groupSeqs', testCase.input, testCase.expected);
		});
	});

	describe("#groupBooks", function() {
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
			test('groupBooks', testCase.input, testCase.expected);
		});
	});

	describe("#getRuns", function() {
		var tests = [
			{
				input: ['2h', '3h', '4h', '5c', 'Kd'],
				expected: [
					['2h', '3h', '4h']
				]
			},
			{
				input: ['3c', '4c', '4d', '4s', '5c', '5d', '5s'],
				expected: [
					['3c', '4c', '5c']
				]
			},
			{
				input: ['Qh', 'Kh', '6h', '5c', 'Ah'],
				expected: [
					['Qh', 'Kh', 'Ah']
				]
			},
			{
				input: ['5c', '6h', '7c', '8c'],
				expected: []
			},
			{
				input: ['Ah', '2h'],
				expected: []
			},
			,
			{
				input: ['5c', '6c', '7c', '8c', 'Tc', 'Jc', 'Qc'],
				expected: [['5c', '6c', '7c', '8c'], ['Tc', 'Jc', 'Qc']]
			},
		];
		
		tests.forEach(function(testCase) {
			test('getRuns', testCase.input, testCase.expected);
		});
	});
});
