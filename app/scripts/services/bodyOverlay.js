'use strict';

angular.module('tunk').factory('bodyOverlay', [
	'overlayFactory',
function(overlayFactory) {
	return overlayFactory({
		html: '<div class="page-overlay"></div>'
	});
}]);
