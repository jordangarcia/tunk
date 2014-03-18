'use strict';

angular.module('tunk').factory('overlayFactory', [
function() {
	return function overlayFactory (config) {
		if (!config.html) {
			throw new Error('Expected overlay to have `html` config');
		}

		var html  = config.html;
		var container = angular.element(config.container || document.body);
		var element = null;

		function activate() {
			if (!element) {
				attach(html, container);
			}
		}

		function attach () {
			element = angular.element(html);
			container.prepend(element);
		}

		function deactivate () {
			if (element) {
				element.remove();
				element = null;
			}
		}

		function active () {
			return !!element;
		}

		return {
			activate: activate,
			deactivate: deactivate,
			active: active
		};
	};
}]);
