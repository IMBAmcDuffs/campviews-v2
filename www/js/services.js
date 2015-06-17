var cvServ = angular.module('campviews.services', []);

cvServ.service('CV_Camp', ['$http', '$q', '$location', function($http,$q,$location){
	var path = global.apiPath+'cv_camp/';
	
	function CV_Camp() {
		
	}
	
	function init_camp() {
		return new CV_Camp()	
	}
	return {
		camp: init_camp,
	}
	
}]);

cvServ.service('sessionService', ['$cookieStore', function($cookieStore){
	var localStoreAvailable = typeof (Storage) !== "undefined";
    this.store = function (name, details) {
        if (localStoreAvailable) {
            if (angular.isUndefined(details)) {
                details = null;
            } else if (angular.isObject(details) || angular.isArray(details) || angular.isNumber(+details || details)) {
                details = angular.toJson(details);
            };
            sessionStorage.setItem(name, details);
        } else {
            $cookieStore.put(name, details);
        };
    };

    this.persist = function(name, details) {
        if (localStoreAvailable) {
            if (angular.isUndefined(details)) {
                details = null;
            } else if (angular.isObject(details) || angular.isArray(details) || angular.isNumber(+details || details)) {
                details = angular.toJson(details);
            };
            localStorage.setItem(name, details);
        } else {
            $cookieStore.put(name, details);
        }
    };

    this.get = function (name) {
        if (localStoreAvailable) {
            return getItem(name);
        } else {
            return $cookieStore.get(name);
        }
    };

    this.destroy = function (name) {
        if (localStoreAvailable) {
            localStorage.removeItem(name);
            sessionStorage.removeItem(name);
        } else {
            $cookieStore.remove(name);
        };
    };

    var getItem = function (name) {
        var data;
        var localData = localStorage.getItem(name);
        var sessionData = sessionStorage.getItem(name);

        if (sessionData) {
            data = sessionData;
        } else if (localData) {
            data = localData;
        } else {
            return null;
        }

        if (data === '[object Object]') { return null; };
        if (!data.length || data === 'null') { return null; };

        if (data.charAt(0) === "{" || data.charAt(0) === "[" || angular.isNumber(data)) {
            return angular.fromJson(data);
        };

        return data;
    };

    return this;
}]);


cvServ.factory('CV_Camps', ['$http', '$q', function($http, $q) {
	var rawpath = global.apiPath+'cv_camp/';
	
	function CV_Camps() {
		var self = this;
		
		self.camps = null;
		
		self.campData = null;
		
		self.campers = null;
		
		self.getCamps = function() {
		var deferred = $q.defer();
		path = rawpath+'get_all/?access_token='+global.accessToken;
			
			if(self.camps !== null){ 
				deferred.resolve(self.camps);
			} else {
				$http.get(path).
					success(function(data, status, headers, config) {
						self.camps = data;
						deferred.resolve(data);
					}).error(function(data, status, headers, config) {
						deferred.reject('Error happened yo!');
					});		
			} 
			
			return deferred.promise;
		}
				
		self.getCamp = function() {
		var deferred = $q.defer();
		var camp_id = global.selectedCamp;
		path = rawpath+'get_single_camp_data/?access_token='+global.accessToken+'&camp_id='+camp_id;
		
			if(self.campData !== null){ 
				deferred.resolve(self.campData);
			} else {
				$http.get(path).
					success(function(data, status, headers, config) {
						self.campData = data;
						//console.log(JSON.stringify(config));
						deferred.resolve(data);
						
					}).error(function(data, status, headers, config) {
						deferred.reject('Error happened yo!');
					});		
			}
			
			return deferred.promise;
		}
		
	}
	
	return new CV_Camps();
	
}]);

cvServ.factory('CV_Forms', ['$http', '$q', function($http, $q) {
	var rawpath = global.apiPath+'cv_form/';
	
	function CV_Forms() {
		var self = this;
				
		self.checkinForms = null;
		
		self.getCachedForm = function(form_id) {
			
			var forms = global.camp.checkin;
			if(forms.length>0){
				for(i=0; i<forms.length; i++) {
					if(form_id == forms[i].id)
						return self.forms = forms[i];
				}
			}
		}
		
		self.getCheckinForms = function() {
		var deferred = $q.defer();
		path = rawpath+'get_checkin_form/?access_token='+global.accessToken+'&camp_id='+global.selectedCamp;
			
			if(self.checkinForms !== null){ 
				deferred.resolve(self.checkinForms);
			} else {
				$http.get(path).
					success(function(data, status, headers, config) {
						self.checkinForms = data;
						deferred.resolve(data);
					}).error(function(data, status, headers, config) {
						deferred.reject('Error happened yo!');
					});		
			} 
			
			return deferred.promise;
		}
						
	}
	
	return new CV_Forms();
	
}]);

cvServ.factory('CV_Camper', ['$http', '$q', function($http, $q) {
	var rawpath = global.apiPath+'cv_camper/';
	
	function CV_Camper() {
		var self = this;
				
		self.camper = null;
		
		self.camper_id = 0;
		
		self.getCachedCamper = function(camper_id) {
			
		var deferred = $q.defer();
		
			var campers = global.campers;
			if(campers.length>0){
				for(i=0; i<campers.length; i++) {
					if(camper_id == campers[i].id){
						
						return global.camper = self.camper = campers[i];
					}
				}
			}
		}
		
		self.getCamper = function(params) {
		var deferred = $q.defer();
		
		var camper_id = parseInt(params);
		
		global.camper = {};
		path = rawpath+'get/?access_token='+global.accessToken+'&id='+camper_id;
			
			// check if the camper data is already within the global array if not load new
			if(global.campers){
				self.getCachedCamper(camper_id);	
			}
			
			
			if(self.camper !== null){ 
				
				deferred.resolve(global.camper);
			} else {
				$http.get(path).
					success(function(data, status, headers, config) {
						var _data = {};
						
						if(data.status = 'success'){
							_data = {
								'id' : data.camper.id,	
								'first_name' : data.camper.camper_first_name,	
								'last_name' : data.camper.camper_last_name,	
								'thumbnail' : data.camper.thumbnail,	
								'dob' : data.camper.camper_dob,	
								'gender' : data.camper.camper_gender,	
							}
						}
						
						self.camper = _data;
						global.camper = _data;
						deferred.resolve(_data);
					}).error(function(data, status, headers, config) {
						deferred.reject('Error happened yo!');
					});		
			} 
			
			return deferred.promise;
		}
						
	}
	
	return new CV_Camper();
	
}]);

cvServ.factory('CV_Account', ['$http','$location', function($http, $location) {
	var path = global.apiPath+'cv_account/signon/';
	
	var process_login = function() {
			var $data = {
				user_login: cache.user.name,
				user_password: cache.user.password,
				access_token: global.accessToken
			};
			 
			var req = {
				method: 'GET', 
				url: path,
				params: $data,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded' 	
				} 
			}
			
			$http(req).
			then(function(result) {
				console.log(result);
				console.log('factory - account');
				if(result.data.status == 'success'){
					// save the user data and route the app to the camp selection
					localStorage.setItem('user_login', result.data.key);
					localStorage.setItem('user_info', $data.user_login);
					console.log(localStorage.getItem('user_login'));
					console.log('factory - loggedin');
					check_user();
				}else{
					// build error handlers	
				console.log(result.data.message); 
				}
			});		
	};
	
	var check_user = function() {
		var $key = localStorage.getItem('user_login');
		if($key){
			// add more logic to check the actual key but fo rnow just push forward
			$location.path('/camps');
		}else{
			$location.path('/login');
		}
		
	};
	
	var logout_user = function() {
		var $current = localStorage.getItem('user_login');
		if($current){
			localStorage.removeItem('user_login');
			localStorage.removeItem('user_info');
		}
	}
	
	return {
		login : process_login,
		logout : logout_user,
		check : check_user
	}
	
}]);

