var cvCont = angular.module('campviews.controllers', []);

cvCont.controller('LoginCtrl', ['$scope', 'CV_Account', function($scope, CV_Account) {
	console.log('testeres');
	console.log(localStorage.getItem('user_login'));
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

cvCont.controller('CampsCtrl', ['$scope', '$document', 'CV_Camps', 'camps', function($scope, $document, CV_Camps, camps) {
	console.log(JSON.stringify(camps));
	 
	$scope.camps = camps;
	$scope.selectCamp = function(camp_id) {
		localStorage.setItem('selectedCamp', camp_id);
		
		global.selectedCamp = camp_id;
		
	};
}]);


/* main controller unit */
cvCont.controller('MainCtrl', ['$scope', '$document', 'CV_Camps', 'campData', function($scope, $document, CV_Camps, campData) {
	console.log(JSON.stringify(campData));
	
}]);