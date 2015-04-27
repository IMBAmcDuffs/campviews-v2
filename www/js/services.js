var cvServ = angular.module('campviews.services', []);

cvServ.service('CV_Camp', ['$http', '$q', '$location', function($http,$q,$location){
	
}]);

cvServ.factory('CV_Camps', ['$http', '$q', function($http, $q) {
	var path = global.apiPath+'cv_camp/';
	
	function CV_Camps() {
		var self = this;
		
		if(!self.camps)
		self.camps = null;
		
		if(!self.campData)
		self.campData = null;
		
		if(!self.campers)
		self.campers = null;
		
		self.getCamps = function() {
		var deferred = $q.defer();
		path = path+'get_all/?access_token='+global.accessToken;
		
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
		path = path+'get_single_camp_data/?access_token='+global.accessToken+'&camp_id='+camp_id;
		
			if(self.campData !== null){ 
				deferred.resolve(self.camps);
			} else {
				$http.get(path).
					success(function(data, status, headers, config) {
						self.campData = data;
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

cvServ.factory('CV_Account', ['$http','$location', function($http, $location) {
	var path = global.apiPath+'cv_account/signon/';
	
	var process_login = function() {
			var $data = {
				user_login: cache.user.name,
				user_password: cache.user.password
			};
			
			var req = {
				method: 'POST',
				url: path,
				data: $data,
				params: {
					access_token: global.accessToken
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded' 	
				}
			}
			
			$http(req).
			then(function(result) {
				console.log(result.data.status);
				if(result.data.status == 'success'){
					// save the user data and route the app to the camp selection
					localStorage.setItem('user_login', result.data.key);
					console.log(localStorage.getItem('user_login'));
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
	
	return {
		login : process_login,
		check : check_user
	}
	
}]);

