var app = angular.module('app');
app.service('UserService', function ($http) {
  var svc = this;

  svc.getUser = function () {
    return $http.get('/api/users');//, { headers: { 'X-Auth': this.token } });
  }

  svc.login = function (username, password) {
    return $http.post('/api/sessions', { username: username, password: password })
    .then(function (val) {
      svc.token = val.data;
      $http.defaults.headers.common['X-Auth'] = val.data; //include header globally, so u don't have to do it on every request
      return svc.getUser();
    });
  }

  svc.register = function (username, password) {
    return $http.post('/api/users', { username: username, password: password });
  }

  //TODO: clear credentials

});
