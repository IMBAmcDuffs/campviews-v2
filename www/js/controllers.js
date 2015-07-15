var cvCont = angular.module('campviews.controllers', []);

cvCont.controller('LoginCtrl', ['$scope', '$timeout', '$ionicPopup', 'CV_Account', function($scope, $timeout, $ionicPopup, CV_Account) {
	CV_Account.check();
  $scope.login = function(user) {
	  if(user && user.name && user.password){
  		cache.user = { name: user.name, password: user.password};
		if(user){
			CV_Account.login();
		}else{
			// notify user to fix the form
		}
	  }
  }
  
}]);

cvCont.controller('CampsCtrl', ['$scope', '$document', '$location', '$timeout','camps', function($scope, $document, $location, $timeout, camps) {
	 
	$scope.camps = camps; 
	console.log(JSON.stringify(camps));
	console.log('Camps');
	
  $('#loading').hide();
	$scope.selectCamp = function(camp_id) {
		localStorage.setItem('selectedCamp', camp_id);
		
		global.selectedCamp = camp_id;
		global.user_info = localStorage.getItem('user_info');
		
		$location.path('/dashboard');
		
	}; 
}]);
 
cvCont.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, campData, checkinForms, logForms) {
  // This is the main controller for the whole app. This will pass globals and is part of the menu scope
  if(campData){
	global.camp = campData.camp;
	global.campers = campData.campers;
	global.forms = campData.forms;
	
	var $current = localStorage.getItem('user_info');
	global.userName = $current;	
	
	$scope.global = global;	
  
	console.log('AppCtrl');
  }
   
  if(checkinForms){
	  if(checkinForms.forms){
		if(global.camp)
		global.camp.checkin = checkinForms.forms; 
	  }
	
  }
  
  
  if(logForms.status == 'success'){	
  if(!global.camp) global.camp = {}
  	if(!global.camp.logForms) global.camp.logForms = {};
	global.camp.logForms = logForms.forms;
	$scope.logFroms = logForms.forms;
  }
  $('#loading').hide();
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
  $('#loading').hide();
	
	$scope.camper = global.camper;
 	
}]);

cvCont.controller('checkoutForms', ['$scope', '$document', '$stateParams', '$location', 'CV_Camper', 'CV_Forms', function($scope, $document, $stateParams, $location, CV_Camper, CV_Forms) {
 	$scope.camper_id = 0;
	$scope.global = global;
	if($stateParams.camper_id){
		$scope.camper_id = $stateParams.camper_id;
	}
	
	CV_Camper.getCachedCamper($stateParams.camper_id); 
	
	$scope.camper = global.camper;
}]);

cvCont.controller('checkinForm', ['$scope', '$cordovaCamera', '$document', '$stateParams', '$location', 'CV_Camper', 'CV_Forms', 'checkinData', function($scope, $cordovaCamera, $document, $stateParams, $location, CV_Camper, CV_Forms, checkinData) {
	
	CV_Camper.getCachedCamper($stateParams.camper_id); 
	
	var camper = global.camper;
	
	var form = CV_Forms.getCachedForm($stateParams.form_id); 
	
	$scope.camper = camper; 
	$scope.form = form; 
	$scope.form_id = $stateParams.form_id;
	$scope.camper_id = $stateParams.camper_id;
	$scope.camp_id = global.selectedCamp;
	
	$scope.takePicture = function() {
		console.log('test pic');
        var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
 
        $cordovaCamera.getPicture(options).then(function(imageData) {
            var imgURI = "data:image/jpeg;base64," + imageData;
			
			CV_Camper.uploadImage(imgURI,$stateParams.camper_id);
			
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }
	
	$scope.saveForm = function(form) {
		var results = CV_Forms.saveCheckinForm(form);
	};
	checkinData = checkinData[0].fields;
	
  	$('#loading').hide();
	
	_checkinData = {};
	if(checkinData.length>0){
		$(checkinData).each(function(i,e){
			var value = this.user_value;
			var name = this.field_id;
			_checkinData[name] = value;
		});
			
	}
	$scope.checkinData = _checkinData;
	console.log(JSON.stringify(_checkinData));
}]);


cvCont.controller('formBuilder', ['$sce','$scope', function($sce, $scope) {
	var field_id = $scope.field.meta_id;
	var values = _checkinData;
	console.log(JSON.stringify(_checkinData));
	field_value = '';
	if(values['field_'+field_id]){
		field_value = values['field_'+field_id];
	}
	
	$scope.checkinData = _checkinData;
	var field = formBuilder.makeField($scope.field,field_value);
	
	$scope.fieldHTML = $sce.trustAsHtml(field);
  $('#loading').hide();
	
}]);

cvCont.controller('logBuilder', ['$scope', 'CV_Camper', '$stateParams', function($scope, CV_Camper, $stateParams) {
	
	CV_Camper.getCachedCamper($stateParams.camper_id); 
	
	var camper = global.camper;
	
	$scope.camper_name = global.camper;
	$scope.logForm = global.camp.logForms[0];
	
	$scope.logFields = $scope.logForm.fields;
	
	$scope.timeOfDay = getTimeofDay($scope.logFields);
	
	$scope.timeOfDay = JSON.parse($scope.timeOfDay.meta_value);
	
	function getTimeofDay(fields){
		if(fields.length>0){
			for(i=0;i<fields.length;i++){
				if(fields[i].meta_key == 'formfield_001'){
					return fields[i];	
				}
			}
		}
	}
	
	function buildValueBlock(fields) {
		if(fields.length>0){
			var _fields = {};
			for(i=0;i<fields.length;i++){
				if(fields[i].meta_key !== 'formfield_001'){
					_fields[i] = fields[i];	
					//_fields[i] = JSON.parse(_fields[i].meta_value);
				}
			}
			
			return _fields;
		}
	}
	
	function getTheDate(i){
		var _start = global.camp.start_date;
		var _end = global.camp.end_date;
		var _length = global.camp._length;
		
		var currentDate = new Date(_start);
		
		currentDate.setDate(currentDate.getDate()+i);
		
		_o = currentDate.getFullYear()+'-'+currentDate.getMonth()+'-'+currentDate.getDate();
		
		return _o;
	}
	
	var _length = global.camp._length;
	
	var output = {};
	
	if(_length>0){
		var valueBlock = buildValueBlock($scope.logFields);		
		// we need to insert the proper data into the proper date so that everything matches up.
		for(i=1; i<=_length+1; i++){
			if(!output[i]) output[i] = {};
			
			output[i].day = 'day'+i;
			output[i].date = getTheDate((i));
			output[i].value = valueBlock;
		}
	}
	console.log(output);
	$scope.dayOutput = output;
	  $('#loading').hide();

}]);

cvCont.controller('logRepeat', ['$scope','$location', function($scope, $location) {
	
	//build out the days of the event and output an array to the template
	
}]);

cvCont.controller('UserCtrl', ['$scope','$location', function($scope, $location) {
	// set some globals
	$scope.username = localStorage.getItem('user_info');
  $('#loading').hide();
	
	$scope.logoutUser = function() {
		var $current = localStorage.getItem('user_login');
		if($current){
			localStorage.removeItem('user_login');
			localStorage.removeItem('user_info');
			$location.path('/login');
		}
	}
	
	
	
}]);