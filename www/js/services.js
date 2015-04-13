var cvServ = angular.module('campviews.services', []);

cvServ.service('Handshake', ['$log', function($log) {
	var query = function() {
		console.log(cache.user.name);
	};
	
	var check = function() {
		
	};
	
	return {
		query: query,
		check: check
	}
	
}]);
