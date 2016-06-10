var app = angular.module('app');
app.service('UserService', function ($http,   $rootScope, $cookieStore) {

/*********************************************
  Firebase Implementation
**********************************************/
  var svc = this;
  svc.setCredentials = function(user){

    //get user credentials & store it globally [replace  currentUser with user]
    var authdata = "token";
    $rootScope.globals = {
          currentUser: {
              username: user.username,
              email: user.email,
              color: user.color,
              uid: user.uid,
              authdata: authdata
          }
      };
    console.log(user.uid);
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
