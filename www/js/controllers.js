var cvCont = angular.module('campviews.controllers', []);

cvCont.controller('LoginCtrl', function($scope, Handshake) {
	
  $scope.login = function(user) {
	cache.user = { name: user.name, password: user.password};
	
   	Handshake.query();
  }
  
});