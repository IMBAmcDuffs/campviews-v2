
var global = {
	userData: {}
}

var cache = {
	apiReturn: {},
	postData: {}
}

var appdb = {
    initialize: function() {
        global.db = window.openDatabase("ndadb", "1.0", "CampAppData", 5000000);
        global.db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS campers (camper_id,name,dob,sex,school,shirt_size,pic)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS checks (camper_id, station_id, camp_id, label, value, PRIMARY KEY (camper_id, station_id, camp_id, label))');
            tx.executeSql('CREATE TABLE IF NOT EXISTS cmlogs (id unique, camper_id, camp_id, date, tod, glucose, insulin1, insulin2, insulin3, carbs, pumpchange, medications, note, initials)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS camper_data (camper_id unique, label, value, form_id, form_name)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS api_cache (api,data,multi)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS handshake (id unique,user_id,key)');
        },function() { appdb.errorCB('db init errors') }, function() { appdb.successCB('db init complete') });
    },
    successCB: function(msg) {
        console.log(msg);
    },
    errorCB: function(error) {
        console.log(error);
    }
};


var cv = angular.module('campviews', ['ionic', 'campviews.controllers', 'campviews.services']);

cv.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/login');

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  });
  
});

cv.run(function($ionicPlatform) {
  appdb.initialize();
  
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


