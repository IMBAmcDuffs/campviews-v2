var cvCont = angular.module('campviews.controllers', []);

cvCont.controller('LoginCtrl', ['$scope', '$timeout', 'CV_Account', function($scope, $timeout, CV_Account) {
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

cvCont.controller('CampsCtrl', ['$scope', '$document', '$location', '$timeout','camps', function($scope, $document, $location, $timeout, camps) {
	 
	$scope.camps = camps; 
	console.log(JSON.stringify(camps));
	console.log('Camps');
	
	$scope.selectCamp = function(camp_id) {
		localStorage.setItem('selectedCamp', camp_id);
		
		global.selectedCamp = camp_id;
		global.user_info = localStorage.getItem('user_info');
		
		$location.path('/dashboard');
		
	}; 
}]);

cvCont.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, campData, checkinForms) {
  // This is the main controller for the whole app. This will pass globals and is part of the menu scope
  if(campData){
	global.camp = campData.camp;
	global.campers = campData.campers;
	global.forms = campData.forms;
	
	var $current = localStorage.getItem('user_info');
	global.userName = $current;	
	
	$scope.global = global;	
  
	//console.log(JSON.stringify(global.campers));
	console.log('AppCtrl');
  }
  
  if(checkinForms){
	  if(checkinForms.forms){
		global.camp.checkin = checkinForms.forms; 
	  }
  }
  
  
  $scope.logout = function() {
	var $current = localStorage.getItem('user_login');
	if($current){
		localStorage.removeItem('user_login');
		localStorage.removeItem('user_info');
		$location.path('/login');
		delete global.selectedCamp;
		delete global.camp;
		delete global.campers;
		delete global.forms;
		delete global.campName;
		delete global.userName;
	}
  };
		
});

/* main controller unit */
cvCont.controller('MainCtrl', ['$scope', '$document', '$location', function($scope, $document, $location) {
 	
	$scope.global = global;
	
	$scope.aftertitle = '';
	
}]);
 
cvCont.controller('checkinForms', ['$scope', '$document', '$stateParams', '$location', 'CV_Camper', 'CV_Forms', function($scope, $document, $stateParams, $location, CV_Camper, CV_Forms) {
 	$scope.camper_id = 0;
	$scope.global = global;
	if($stateParams.camper_id){
		$scope.camper_id = $stateParams.camper_id;
	}
	
	CV_Camper.getCachedCamper($stateParams.camper_id); 
	
	$scope.camper = global.camper;
	
}]);

cvCont.controller('checkinForm', ['$scope', '$document', '$stateParams', '$location', 'CV_Camper', 'CV_Forms', function($scope, $document, $stateParams, $location, CV_Camper, CV_Forms) {
	
	CV_Camper.getCachedCamper($stateParams.camper_id); 
	
	var camper = global.camper;
	
	var form = CV_Forms.getCachedForm($stateParams.form_id); 
	
	$scope.camper = form; 
	$scope.form = form; 
	
	$scope.fieldTemplate = function($field) { 
		return formBuilder.makeField($field);
	}
}]);


cvCont.controller('UserCtrl', ['$scope','$location', function($scope, $location) {
	// set some globals
	$scope.username = localStorage.getItem('user_info');
	
	$scope.logoutUser = function() {
		var $current = localStorage.getItem('user_login');
		if($current){
			localStorage.removeItem('user_login');
			localStorage.removeItem('user_info');
			$location.path('/login');
		}
	}
	
	
	
}]);