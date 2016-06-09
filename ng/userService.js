var app = angular.module('app');
app.service('UserService', function ($http,   $rootScope, $cookieStore) {

/*********************************************
  Firebase Implementation
**********************************************/
  svc.setCredentials = function(user){

    //get user credentials & store it globally [replace  currentUser with user]
    var authdata = "token";
    $rootScope.globals = {
          currentUser: {
              username: user.displayName,
              email: user.email,
              authdata: authdata
          }
      };
    console.log(user.email);
    //set token for all request
    $cookieStore.put('globals', $rootScope.globals);
    $http.defaults.headers.common['x-auth'] = authdata; // jshint ignore:line

  }

  //clearCredentials
  svc.clearCredentials  = function () {
      $rootScope.globals = {};
      $cookieStore.remove('globals');
      $http.defaults.headers.common.Authorization = null;
  }


});
