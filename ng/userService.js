var app = angular.module('app');
app.service('UserService', function ($http,   $rootScope, $cookieStore) {
  var svc = this;

  svc.getUser = function () {
    return $http.get('/api/users');//, { headers: { 'X-Auth': this.token } });
  }

  svc.login = function (username, password) {
    return $http.post('/api/sessions', { username: username, password: password })
    .then(function (val) {
      svc.token = val.data;
      //include header globally, so u don't have to do it on every request
      svc.setCredentials(svc.token);
      return svc.getUser();
    });
  }

  svc.register = function (username, email, password) {
    return $http.post('/api/users', { username: username, email: email, password: password });
  }

  //set credentials
  svc.setCredentials = function(token){

    //get user credentials & store it globally
    var authdata = token;
    $http.get('/api/users', { headers: { 'x-auth': token } })
    .success(function(user){
      $rootScope.globals = {
          currentUser: {
              username: user.username,
              email: user.email,
              authdata: authdata
          }
      };

      //set token for all request
      $cookieStore.put('globals', $rootScope.globals);
      $http.defaults.headers.common['x-auth'] = authdata; // jshint ignore:line
    });
  }

  //clearCredentials
  svc.clearCredentials  = function () {
      $rootScope.globals = {};
      $cookieStore.remove('globals');
      $http.defaults.headers.common.Authorization = null;
  }


});
