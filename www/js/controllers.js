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
 
cvCont.controller('AppCtrl', function($scope, $ionicHistory, $ionicModal, $location, $timeout, $location, campData) {
  // This is the main controller for the whole app. This will pass globals and is part of the menu scope
  if(campData){
	global.camp = campData.camp;
	
	var $current = localStorage.getItem('user_info');
	global.userName = $current;	
	
	$scope.global = global;	
  
	console.log('AppCtrl');
  }
  
  $scope.setNavColor = function($color){
	var _b = false;	
	$scope.page = page = $location.$$path.replace('/','');
	var params = page.split('/');
	if(params.length<  2 ){
		global.viewColor = $color;
	}
	
	if($color == 'back') {
	  $ionicHistory.goBack();
	}
	
  };
   
  
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
cvCont.controller('MainCtrl', ['$scope', '$ionicFilterBar', '$timeout', '$document', '$location', 'campData', 'otherData', function($scope, $ionicFilterBar, $timeout, $document, $location, campData, otherData) {
 "use strict";
  if(campData.campers){
	global.campers = campData.campers;  
  }else{
		$location.path('/dashboard');
  }
  
  function loadItems() {
	$scope.global = global;
	$scope.items = global.campers;
	var page = '';
	$scope.page = page = $location.$$path.replace('/','');
	
	$scope.URI = page;
	
	switch(page){
		case 'campers':
			$scope.page_title = 'Campers - Select Camper';
		break;
		case 'logsheets':
			$scope.page_title = 'Log Sheets - Select Camper';
		  if(otherData.status === 'success'){	
		  if(!global.camp) global.camp = {}
			if(!global.camp.logForms) global.camp.logForms = {};
			global.camp.logForms = otherData.forms;
			$scope.logFroms = otherData.forms;
		  }
		break;
		case 'checkin':
			$scope.page_title = 'Check In Forms - Select Camper';
			var $items = $scope.items;
			// lets apply our filters
			var amount = $items.length;
			for(var i=0;i<amount;i++){
				var forms = $items[i].checkins.length - 1;
				var checkedIn = $items[i].checked_in;
				if(checkedIn === forms){ 
					delete $items[i];
				}
			}
			
		  if(otherData){
			  if(otherData.forms){
				if(global.camp)
					global.camp.checkin = otherData.forms; 
			  }
			
		  }
			$scope.items = $items;
		break;	
	}
  }
  loadItems();
		
    var filterBarInstance;

    $scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.items,
        update: function (filteredItems) {
          $scope.items = filteredItems;
        },
      });
	  

    };

    $scope.refreshItems = function () {
      if (filterBarInstance) {
        filterBarInstance();
        filterBarInstance = null;
      }

      $timeout(function () {
        loadItems();
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };
	
	
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

cvCont.controller('checkinForm', ['$scope', '$cordovaCamera', '$state', '$document', '$stateParams', '$location', 'CV_Camper', 'CV_Forms', 'checkinData', function($scope, $cordovaCamera, $state, $document, $stateParams, $location, CV_Camper, CV_Forms, checkinData) {
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
    };
	
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
	$scope.camper_id = $stateParams.camper_id;
	$scope.logForm = global.camp.logForms[0];
	
	$scope.logFields = $scope.logForm.fields;
	$scope.logValues = $scope.logForm.values;
	
	$scope.timeOfDay = getTimeofDay($scope.logFields);
	
	if($scope.timeOfDay) {
		$scope.timeOfDay = JSON.parse($scope.timeOfDay.meta_value);
	}
	
	function getTimeofDay(fields){
		if(fields.length>0){
			for(i=0;i<fields.length;i++){
				if(fields[i].meta_key === 'formfield_001'){
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
			if(!output[i]) { output[i] = {}; }
			
			output[i].day = 'day'+i;
			output[i].date = getTheDate((i));
			output[i].value = valueBlock;
		}
	}
	
	$scope.cur_i = 0;
	
	$scope.dayOutput = output;
	  $('#loading').hide();
	  
	$scope.setIntervalScope = function($index){
		$scope.cur_i = $index;	
		
	};
	
	$scope.getIndex = function($data,$index){
		$scope.cur_i = $index;	
		return $data;	
	};

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