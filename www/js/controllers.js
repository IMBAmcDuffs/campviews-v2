var cvCont = angular.module('campviews.controllers', []);

cvCont.controller('LoginCtrl', ['$scope', 'CV_Account', function($scope, CV_Account) {
	CV_Account.check();
  $scope.login = function(user) {
	cache.user = { name: user.name, password: user.password};
	if(user){
		CV_Account.login();
	}else{
		// notify user to fix the form
	}
	
  }
  
}]);

cvCont.controller('CampsCtrl', ['$scope', '$document', '$location', 'CV_Camps', 'camps', function($scope, $document, $location, CV_Camps, camps) {
	console.log(JSON.stringify(camps));
	 
	$scope.camps = camps;
	$scope.selectCamp = function(camp_id) {
		localStorage.setItem('selectedCamp', camp_id);
		
		global.selectedCamp = camp_id;
		
		$location.path('/dashboard');
		
	};
}]);


/* main controller unit */
cvCont.controller('MainCtrl', ['$scope', '$document', 'campData', function($scope, $document, campData) {
	// set some globals
	global.camp = campData.camp;
	global.campers = campData.campers;
	global.forms = campData.forms;
	console.log(JSON.stringify(global.camp));
	console.log(JSON.stringify(global.forms));
	console.log(JSON.stringify(global.campers));
	
}]);