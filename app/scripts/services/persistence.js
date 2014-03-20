angular.module('tunk').factory('persistence', [
	'localStorageService',
function(localStorage) {
	// local storage keys
	var LS_ROOM = 'room';

	function getRoomName(id) {
		return [LS_ROOM, id].join('_');
	}

	function saveRoom(id, room) {
		localStorage.set(getRoomName(id), room);
	}

	function loadRoom(id) {
		localStorage.get(getRoomName(id));
	}

	return {
		saveRoom: saveRoom,
		loadRoom: loadRoom
	};
}])
